<template>
  <div class="wrap">
    <div class="flex-x-start-center">
      <h3 class="mr20">激活与活跃</h3>
      <DataDefinition class="mr20" :define-list="defineList" />
      <div class="desc">数据更新至前1日</div>
    </div>
    <el-tabs v-if="!ckey" :value="activeName" @tab-click="onTabClick">
      <el-tab-pane label="平台" name="Platform" />
      <el-tab-pane label="商协会" name="Chamber">
        <ChamberSelector label="商协会" @change="onChamberChange" />
      </el-tab-pane>
      <el-tab-pane label="地区" name="Area">
        <el-form inline>
          <el-form-item label="地区：">
            <el-cascader
              v-model="query.area"
              placeholder="全部"
              clearable
              separator="-"
              :options="areaOptions"
              :props="{ expandTrigger: 'hover', value: 'code', label: 'name'}"
              @change="onDimensionChange('Area')"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="功能模块" name="FunctionModule">
        <el-form inline>
          <el-form-item label="功能模块：">
            <el-select v-model="query.functionModuleId" filterable clearable no-match-text="暂无数据" @change="onDimensionChange('FunctionModule')">
              <el-option v-for="item of functionOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="页面" name="Page">
        <el-form inline>
          <el-form-item label="页面：">
            <el-select v-model="query.pageUrl" filterable clearable no-match-text="暂无数据" @change="onDimensionChange('Page')">
              <el-option v-for="item of pageOptions" :key="item.url" :label="item.name" :value="item.url" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <DataBoard :list="boardDataList" />

    <div class="flex-x-between">
      <!-- 时间 -->
      <TimeSizer ref="timeSizer" :query="query" @change="onQueryChange({pageNum:1})" />
      <!-- 导表 -->
      <div class="block"><ExportTable :data="genetateWorkbook" title="激活与活跃" /></div>
    </div>

    <KdTable v-loading="loading" :columns="tableColumns" :rows="tableData" @selection-change="onSelectionChange" />

    <KdPagination style="padding-bottom:20px;" :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />
  </div>
</template>

<script>

import { getPlatformActiveData, getChamberActivateData, getAreaActivateData, getFunctionModuleList, getFunctionModuleActivateData, getPageActivateData, sendActivateStat, getActivateStatResult } from '@/api/statistics/activate'
import { getAreaTree } from '@/api/area'

export default {
  components: {
    DataDefinition: () => import('@/components/statistic/DataDefinition'),
    DataBoard: () => import('@/components/statistic/DataBoard'),
    ChamberSelector: () => import('@/components/statistic/ChamberSelector'),
    TimeSizer: () => import('@/components/statistic/TimeSizer'),
    ExportTable: () => import('@/components/statistic/ExportTable'),
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
  },
  props: {},
  data() {
    return {
      // 数据定义列表
      defineList: [
        {
          title: '注册用户',
          text: '实际注册用户数；'
        },
        {
          title: '后台导入会员',
          text: '商协会 批量导入/单个添加 的会员数量；'
        },
        {
          title: '激活',
          text: '秘书处在商协会后台 批量导入/单个添加的会员，在前台完成了注册，算激活；'
        },
        {
          title: '会员激活率',
          text: '记 在商会后台 批量导入/单个添加的会员 为A，其中 在前台完成了注册的为B， 则 激活率＝B/A*100%；'
        },
        {
          title: '活跃',
          text: '用户完成注册后，在次日有访问过小程序，算活跃；'
        },
        {
          title: '活跃率',
          text: '记 全平台的注册用户数为C，其中 从次日开始有回访行为的用户数为D，则 活跃率＝D/C*100%；'
        },
      ],

      // tab切换值
      activeName: 'Platform',

      // 地区选项
      areaOptions: [],
      // 功能模块选项
      functionOptions: [],
      // 页面选项
      pageOptions: [
        { name: '全部', url: '' },
        { name: '全局搜索', url: 'subpackage_supply_demand/pages/supply-search/index' },
        { name: '商会主页', url: 'pages/chamber/homepage/index' },
        { name: '组织架构', url: 'pages/contacts/homepage/index' },
        { name: '首页tab页', url: 'pages/home/index' },
        { name: '通讯录tab页', url: 'pages/contacts/index' },
        { name: '供需tab页', url: 'pages/supply/index' },
        { name: '活动tab页', url: 'pages/hot_activity/index' },
        { name: '我的tab页', url: 'pages/profile/index' },
      ],
      // 激活活跃看板数据源
      activateData: {},

      // 报表查询参数
      query: {
        pageSize: 10,
        pageNum: 1,
        ckey: '',
        days: 7,
        type: 1,
        date: [],
        area: [],
        functionModuleId: '',
        pageUrl: ''
      },
      // 报表总数
      total: 0,
      // 报表数据
      tableData: [],

      loading: false,

      // 选中的数据-用于导出
      selectionDatas: []
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey
    },
    // 看板列表
    boardDataList() {
      const { activeName } = this
      const {
        visitorsNum,
        registerMembersNum, registerNotMembersNum, registerUsersNum,
        registerMembersTotal,
        membersActiveNum, membersActiveTotal, membersNotActiveNum, adminAddMembersNum,
        memberActivationRate,
        activeMembersNum, notActiveMembersNum, activeUsersNum,
        activeMembersRate, notActiveMembersRate, activeRate,
      } = this.activateData
      switch (activeName) {
        case 'Platform':
        case 'FunctionModule':
        case 'Page':
          return [
            { name: '访问人数', value: visitorsNum || 0 },
            { name: `会员 ${registerMembersNum || 0} 非会员 ${registerNotMembersNum || 0}`, value: `注册用户 ${registerUsersNum || 0}` },
            { name: `已激活 ${membersActiveNum || 0}${activeName === 'Platform' ? '' : `（${membersActiveTotal}）`} 未激活 ${membersNotActiveNum || 0}`, value: `后台导入会员 ${adminAddMembersNum || 0}` },
            { name: '会员激活率', value: `${memberActivationRate || '0%'}` },
            { name: `会员 ${activeMembersNum || 0} 非会员 ${notActiveMembersNum || 0}`, value: `活跃用户 ${activeUsersNum || 0}` },
            { name: `会员 ${activeMembersRate || '0%'} 非会员 ${notActiveMembersRate || '0%'}`, value: `活跃率 ${activeRate || '0%'}` },
          ]
        default: // Chamber || Area
          return [
            { name: '访问人数', value: visitorsNum || 0 },
            { name: '累计注册会员', value: registerMembersTotal || 0 },
            { name: `已激活 ${membersActiveNum || 0} 未激活 ${membersNotActiveNum || 0}`, value: `后台导入会员 ${adminAddMembersNum || 0}` },
            { name: '会员激活率', value: `${memberActivationRate || '0%'}` },
            { name: '活跃会员', value: activeMembersNum || 0 },
            { name: '会员活跃率', value: activeMembersRate || '0%' }
          ]
      }
    },

    // 表格列表
    tableColumns() {
      const { activeName } = this
      switch (activeName) {
        case 'Platform':
        case 'FunctionModule':
        case 'Page':
          return [
            { type: 'selection', width: 55 },
            { label: '时间', prop: 'date', minWidth: 120, },
            { label: '访问人数', render: ({ row }) => row.visitorsNum || 0 },
            {
              label: '累计注册用户', minWidth: 120,
              render: ({ row }) => (<div>
                <div>【用户】{row.registerUsersTotal}</div>
                <div>【会员】{row.registerMembersTotal}</div>
                <div>【非会员】{row.registerNotMembersTotal}</div>
              </div>)
            },
            {
              label: '新注册用户', minWidth: 120,
              render: ({ row }) => (<div>
                <div>【新增】{row.registerUsersNum}</div>
                <div>【会员】{row.registerMembersNum}</div>
                <div>【非会员】{row.registerNotMembersNum}</div>
              </div>)
            },
            {
              label: '后台导入会员', minWidth: 120,
              render: ({ row }) => (<div>
                <div>【新增】{row.adminAddMembersNum}</div>
                <div>
              【已激活】{row.membersActiveNum}
                { activeName === 'Platform' ? '' : <span>（共{row.membersActiveTotal}）</span> }
                </div>
                <div>【未激活】{row.membersNotActiveNum}</div>
              </div>)
            },
            { label: '会员激活率', prop: 'memberActivationRate' },
            {
              label: '活跃用户', minWidth: 120,
              render: ({ row }) => (<div>
                <div>【新增】{row.activeUsersNum}</div>
                <div>【会员】{row.activeMembersNum}</div>
                <div>【非会员】{row.notActiveMembersNum}</div>
              </div>)
            },
            {
              label: '活跃率', minWidth: 120,
              render: ({ row }) => (<div>
                <div>【新增】{row.activeRate}</div>
                <div>【会员】{row.activeMembersRate}</div>
                <div>【非会员】{row.notActiveMembersRate}</div>
              </div>)
            }
          ]
        default: // Chamber || Area
          return [
            { type: 'selection', width: 55 },
            { label: '时间', prop: 'date', minWidth: 120, },
            { label: '访问人数', render: ({ row }) => row.visitorsNum || 0 },
            { label: '累计注册会员', prop: 'registerMembersTotal' },
            {
              label: '后台导入会员', minWidth: 120,
              render: ({ row }) => (<div>
                <div>【新增】{row.adminAddMembersNum}</div>
                <div> 【已激活】{row.membersActiveNum} </div>
                <div>【未激活】{row.membersNotActiveNum}</div>
              </div>)
            },
            { label: '会员激活率', prop: 'memberActivationRate' },
            { label: '活跃会员', prop: 'activeMembersNum' },
            { label: '会员活跃率', prop: 'activeMembersRate' }
          ]
      }
    }
  },

  created() {
    if (this.ckey) { // 商会后台 切换为商协会tab 查询参数固定为当前商会后台的ckey
      this.activeName = 'Chamber'
      this.query.ckey = this.ckey
    }
    this[`get${this.activeName}Activate`]()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // tab-切换
    onTabClick({ name }) {
      if (this.activeName === name) return
      this.activeName = name
      this.$refs.timeSizer.reset()
      this.query.ckey = ''
      this.query.area = []
      this.query.functionModuleId = ''
      this.query.pageUrl = ''
      this[`get${name}Options`] && this[`get${name}Options`]()
      this.onDimensionChange(name)
      this.selectionDatas = []
    },

    // 获取平台看板数据
    async getPlatformActivate() {
      const { data } = await getPlatformActiveData()
      this.activateData = data
    },
    // 获取商协会看板数据
    async getChamberActivate() {
      const { ckey } = this.query
      const { data } = await getChamberActivateData(ckey ? { ckey } : undefined)
      this.activateData = data
    },
    // 获取地区选项
    async getAreaOptions() {
      if (this.areaOptions.length) return
      const { data } = await getAreaTree({ level: 2 })
      if (data) {
        data.forEach(p => {
          p.children.forEach(c => (c.children = undefined))
        })
        this.areaOptions = data
      }
    },
    // 获取地区看板数据
    async getAreaActivate() {
      const { area } = this.query
      const { data } = await getAreaActivateData(area.length ? { areaCode: area[1] } : undefined)
      this.activateData = data
    },
    // 获取功能模块选项
    async getFunctionModuleOptions() {
      if (this.functionOptions.length) return
      const { data } = await getFunctionModuleList()
      if (data) {
        data.unshift({ name: '全部', id: '' })
        this.functionOptions = data
      }
    },
    // 获取功能模块看板数据
    async getFunctionModuleActivate() {
      const { functionModuleId } = this.query
      const { data } = await getFunctionModuleActivateData(functionModuleId ? { functionModuleId } : undefined)
      this.activateData = data
    },
    // 获取页面看板数据
    async getPageActivate() {
      const { functionModuleId } = this.query
      const { data } = await getPageActivateData(functionModuleId ? { functionModuleId } : undefined)
      this.activateData = data
    },
    // 商协会切换
    onChamberChange(e) {
      this.query.ckey = e
      this.onDimensionChange('Chamber')
    },
    // 数据维度选项变更
    async onDimensionChange(dimensionType) {
      this[`get${dimensionType}Activate`]()
      this.query.pageNum = 1
      this.getTableData()
    },
    // 查询条件变更
    onQueryChange(e = {}) {
      this.query = { ...this.query, ...e }
      this.getTableData()
    },
    // 查询报表的参数格式化
    normalizeParams() {
      const { date = [], pageNum, pageSize, type, ckey } = this.query
      if (!this.tabMap) this.tabMap = { Platform: 1, Chamber: 2, Area: 3, FunctionModule: 4, Page: 5 }
      const params = {
        startTime: date[0],
        endTime: date[1],
        page: pageNum,
        pageSize,
        type,
        tabType: this.tabMap[this.activeName]
      }
      if (ckey) params.ckey = ckey
      if (this.ckey) params.ckey = this.ckey
      return params
    },
    // 报表轮询
    async getActivateResultByPolling(key, resolve) {
      if (this.timer) clearTimeout(this.timer)
      this.timer = null

      try {
        const { data } = await getActivateStatResult({ key })
        if (!data) {
          this.timer = setTimeout(() => {
            this.timer = null
            this.getActivateResultByPolling(key, resolve)
          }, 500)
        } else {
          resolve(data)
        }
      } catch (error) {
        this.timer = setTimeout(() => {
          this.timer = null
          this.getActivateResultByPolling(key, resolve)
        }, 500)
      }
    },
    // 获取报表数据
    async getTableData() {
      this.loading = true
      try {
        const { data: key } = await sendActivateStat(this.normalizeParams())
        if (!key) throw new Error()
        const { list = [], totalRows } = await new Promise(resolve => {
          this.getActivateResultByPolling(key, resolve)
        })
        this.tableData = list
        this.total = totalRows
      } catch (error) {
        // console.log(error)
      }
      this.loading = false
    },
    genetateWorkbook(XLSX) {
      const { selectionDatas, activeName } = this
      if (!selectionDatas.length) {
        this.$message({ message: '请选择导出记录', type: 'warning' })
        return null
      }
      let worksheet, workbook
      switch (activeName) {
        case 'Platform':
        case 'FunctionModule':
        case 'Page':
          worksheet = XLSX.utils.aoa_to_sheet([
            ['时间', '访问人数', '累计用户', null, null, '新注册用户', null, null, '后台导入会员', null, null, '活跃用户', null, null, '活跃率', null, null],
            [null, null, '用户', '会员', '非会员', '新增', '会员', '非会员', '新增', '已激活', '未激活', '新增', '会员', '非会员', '新增', '会员', '非会员'],
            ...selectionDatas.map(v => ([
              // 时间,访问人数
              v.date, v.visitorsNum,
              // 累计用户:用户,会员,非会员
              v.registerUsersTotal, v.registerMembersTotal, v.registerNotMembersTotal,
              // 新注册用户:新增,会员,非会员
              v.registerUsersNum, v.registerMembersNum, v.registerNotMembersNum,
              // 后台导入会员：新增,已激活,未激活
              v.adminAddMembersNum, v.membersActiveNum, v.membersNotActiveNum,
              // 活跃用户：新增，会员，非会员
              v.activeUsersNum, v.activeMembersNum, v.notActiveMembersNum,
              // 活跃率：新增，会员，非会员
              v.activeRate, v.activeMembersRate, v.notActiveMembersRate
            ]))
          ])
          worksheet['!merges'] = [
            { s: { c: 0, r: 0 }, e: { c: 0, r: 1 }},
            { s: { c: 1, r: 0 }, e: { c: 1, r: 1 }},
            { s: { c: 2, r: 0 }, e: { c: 4, r: 0 }},
            { s: { c: 5, r: 0 }, e: { c: 7, r: 0 }},
            { s: { c: 8, r: 0 }, e: { c: 10, r: 0 }},
            { s: { c: 11, r: 0 }, e: { c: 13, r: 0 }},
            { s: { c: 14, r: 0 }, e: { c: 16, r: 0 }},
          ]
          workbook = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1')
          return workbook

        default: // Chamber || Area
          worksheet = XLSX.utils.aoa_to_sheet([
            ['时间', '访问人数', '累计注册会员', '后台导入会员', null, null, '会员激活率', '活跃会员', '会员活跃率'],
            [null, null, '新增', '已激活', '未激活', null, null, null],
            ...selectionDatas.map(v => ([
              // 时间,访问人数,累计注册会员
              v.date, v.visitorsNum, v.registerMembersTotal,
              // 后台导入会员：新增,已激活,未激活
              v.adminAddMembersNum, v.membersActiveNum, v.membersNotActiveNum,
              // 会员激活率,活跃会员,会员活跃率
              v.memberActivationRate, v.activeMembersNum, v.activeMembersRate
            ]))
          ])
          worksheet['!merges'] = [
            { s: { c: 0, r: 0 }, e: { c: 0, r: 1 }},
            { s: { c: 1, r: 0 }, e: { c: 1, r: 1 }},
            { s: { c: 2, r: 0 }, e: { c: 2, r: 1 }},
            { s: { c: 3, r: 0 }, e: { c: 5, r: 0 }},
            { s: { c: 6, r: 0 }, e: { c: 6, r: 1 }},
            { s: { c: 7, r: 0 }, e: { c: 7, r: 1 }},
            { s: { c: 8, r: 0 }, e: { c: 8, r: 1 }},
          ]
          workbook = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1')
          return workbook
      }
    },
    // 报表数据选择
    onSelectionChange(e) {
      this.selectionDatas = e
    },

  },
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 0 20px;
}
.mr20 {
  margin-right: 20px;
}
.desc {
  color: #999;
}
</style>
