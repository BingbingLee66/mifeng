<template>
  <div class="containers">
    <tab ref="tab" :tab-list="tabList" @handleClick="handleClick" />
    <!-- 表单 -->
    <formComponent :statistics="statistics" :active-name="activeName" @templateOperation="templateOperation" @query="clickQuery" />
    <!-- 列表表格 -->
    <kdTable :table-data="tableData" :column-config="columnConfig" />
    <kdDialog />
    <!-- 分页 -->
    <KdPagination :page-size="query.pageSize" :current-page="query.page" :total="total" @change="change" />
    <!-- 所有弹框组件 除模板配置 -->
    <receiveDialog
      ref="receiveRef"
      :table-data="dialog.tableData"
      :total="dialog.total"
      :column-config="dialog.columnConfig"
      :current-page="dialog.page"
      :page-size="dialog.pageSize"
      :need-pagination="dialog.needPagination"
      @change="receiveChange"
      @tableSelect="selectionChange"
    >
      <!-- 搜索框 -->
      <div slot="form">
        <div v-if="currentType === 1">
          <tab ref="dialogTab" :active-name="activeDialogChannelTab" :tab-list="sendDetailChannelType" @handleClick="handleClickChannel" />
          <tab ref="dialogSecondTab" type="card" :tab-list="sendStatus" @handleClick="handleSecondClickChannel" />
        </div>
        <div v-if="currentType === 5" class="reset-send">
          确认给以下 <span>{{ dialog.selectList.length }}</span> 位未读用户重新发送通知吗？
        </div>
        <el-form v-if="currentType !== 5" :inline="true">
          <el-form-item label="搜索">
            <!-- <el-input class="search-input" v-model="query.chamberName" :placeholder="placeholder"></el-input> -->
            <el-input v-model="dialog.query.keyword" class="search-input" :placeholder="placeholder" />
          </el-form-item>
          <el-button @click="receiverListFunc(currentRow.id)">查询</el-button>
        </el-form>
      </div>
      <!-- 按钮栏 -->
      <div slot="receive">
        <el-button v-if="commitType === 1" type="primary" @click="save">我知道了</el-button>
        <div v-if="commitType === 2">
          <el-button type="primary" @click="save">确定</el-button>
          <el-button @click="hide">取消</el-button>
        </div>
      </div>
    </receiveDialog>
    <!--  批量配置模板 -->
    <configUration :show-configuration.sync="showConfiguration" @onClick="sendListFunc" />
    <!-- 批量分配短信 -->
    <allocation :show-allocation.sync="showAllocation" @onClick="sendListFunc" />
    <!-- 管理模板 -->
    <Management ref="showManagement" />
    <!-- 分配短信 -->
    <Allot ref="Allot" @onClick="sendListFunc" />
    <!-- 分配记录 -->
    <Record ref="Record" />
  </div>
</template>

<script>
import kdDialog from '@/components/common/kdDialog'
import tab from './components/tab.vue'
import { sendList, exportSendItem, sendDetailList, sendGetDetail, deleteSendItem, unreadRetry, receiverInfoList, templateList, unreadList, templateDistributionSmsStat } from '@/api/mass-notification/index'
import kdTable from '@/views/mass-notification/components/common/kdTable'
import KdPagination from '@/components/common/KdPagination'
import { receiveType, sendStatusList, channelTypeList, memberPageListConfig, sendDetailChannelType } from '../util/label'
import configUration from './components/configUration'
import allocation from './components/allocation'
import Management from './components/management'
import Allot from './components/Allot'
import Record from './components/Record'

import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Create',
  // eslint-disable-next-line vue/no-unused-components
  components: { kdDialog, tab, kdTable, KdPagination, Allot, Record, configUration, allocation, Management, receiveDialog: () => import('../components/common/receiveDialog.vue'), formComponent: () => import('./components/formComponent') },

  data() {
    return {
      // notification :通知列表  mass:群发管理 template:模板管理
      activeName: '',
      tableData: [],
      // 表格配置
      columnConfig: [],
      // 列表的表单相关
      total: 0,
      query: {
        page: 1,
        pageSize: 10,
        // noticeTypeId: -1,
      },
      // 弹框相关
      dialog: {
        query: {
          page: 1,
          pageSize: 10,
          keyword: '',

        },
        needPagination: true,
        selectList: [],
        tableData: [],
        columnConfig: [],
        total: 0,

      },
      // 当前操作的列
      currentRow: null,
      // 弹框类型 1：查看  2：选择操作
      commitType: 1,
      // 当前操作type 1:详情 2：编辑 3：删除 4：导出发送记录 5：未读重法 6：接收人
      currentType: 1,
      // 详情弹框tab
      sendDetailChannelType: [],
      sendStatus: [],
      // 当前活跃的channelTab
      activeDialogChannelTab: '',
      groupSendStatMap: {},
      // 当前活跃的二级channelTab
      activeSecondChannelTab: '',

      placeholder: '手机号/姓名/企业名称',
      showDialog: false,
      showConfiguration: false, // 批量配置模板
      showAllocation: false, // 批量分配短信
      statistics: {} // 分配短信统计
    }
  },
  created() {
    const { ckey } = this.$store.getters
    this.ckey = ckey
    this.restTypeData()

    this.sendListFunc()
  },
  mounted() {
    this.activeName = this.tabList[0].name
    this.$refs['tab'].setCurrentTab(this.tabList[0].name)
    this.tableConfigUtil()
  },
  methods: {
    /** 请求 */
    // 拉取群发通知列表 and群发管理列表(总后台)
    async sendListFunc(val) {
      // console.log('val', val)
      const { ckey } = this
      let API = sendList
      let query = { ...this.query }
      ckey && (query.ckey = ckey)
      if (this.activeName === 'template') {
        API = templateList
        this.butionSmsStat() // 模板分配短信统计
      } else {
        if (val) { query = Object.assign(query, val) }
      }
      // console.log('query', query)
      const { data } = await API(query)
      this.tableData = data.list
      this.total = data.totalRows
    },
    // 拉取接收人
    async receiverListFunc(id, type = 1) {
      // type为1：拉取接收人列表 type为2：拉取未读列表  3:查询发送情况
      let API = receiverInfoList
      if (type === 2) { API = unreadList }
      const { data } = await API({ ...this.dialog.query, gsId: id })
      this.dialog.tableData = data.list.map(v => { return { ...v.extend, id: v.id } })
      this.dialog.total = data.totalRows
    },
    // 未读重发发
    async unreadRetryFunc() {
      let { dialog: { selectList: riIds } } = this
      const { currentRow: { id: gsId } } = this
      riIds = riIds.map(v => v.id)
      const res = await unreadRetry({ riIds, gsId })
      if (res.state === 1) {
        this.$message.success('重发成功')
      } else {
        this.$message.error(res.msg)
      }
    },
    // 删除通知
    async deleteSendItemFunc(id) {
      const res = await deleteSendItem(id)
      if (res.state === 1) {
        this.$message.success('删除成功')
        const { tableData } = this
        const index = tableData.findIndex(i => i.id === id)
        if (index > -1) { this.tableData.splice(index, 1) }
      } else {
        this.$message.error(res.msg)
      }
    },
    // 获取通知接收情况
    async sendGetDetailFunc(id) {
      this.handleTabChannelUtil()
      const { data } = await sendGetDetail(id)
      this.sendDetailChannelType = []
      this.groupSendStatMap = data.groupSendStatMap
      for (const item in data.groupSendStatMap) {
        const result = sendDetailChannelType.find(v => parseInt(v.name) === parseInt(item))
        result && this.sendDetailChannelType.push(result)
      }
    },
    // 查询发送情况，列表
    async sendDetailListFunc() {
      const { activeSecondChannelTab: status, activeDialogChannelTab: channelTypeId, currentRow: { id: gsId }, dialog: { query } } = this
      // const { data } = sendDetailList({ channelTypeId, gsId, keyword })
      const { data } = await sendDetailList({ channelTypeId, gsId, ...query, status })
      // console.log('data', data)
      this.dialog.tableData = data.list.map(v => { return { ...v.receiverInfoVO.extend, readStatus: v.readStatus } })
      this.dialog.total = data.totalRows
    },
    /** 行为操作 */
    // 点击接收人
    receiverClick(row) {
      this.operationClick(6, row)
    },
    // 群发通知点击操作栏
    async operationClick(type = 1, row) {
      // console.log('row', type)
      this.currentRow = row
      this.currentType = type
      // 详情
      if (type === 1) {
        this.open()
        // 打开详情弹框
        // this.sendStatus = cloneDeep(sendStatusList)
        // console.log('sendStatusList', sendStatusList)
        await this.sendGetDetailFunc(row.id)
        // 初始化活跃tab
        this.activeDialogChannelTab = this.sendDetailChannelType[0].name
        // 给子组件设置活跃的tab
        this.$refs['dialogTab'].setCurrentTab(this.activeDialogChannelTab)
        this.handleTabChannelUtil(this.activeDialogChannelTab)
        // // 初始化二级活跃tab
        this.activeSecondChannelTab = this.sendStatus[0].name
        // 给子组件的二级tab设置活跃的tab
        this.$refs['dialogSecondTab'].setCurrentTab(this.activeSecondChannelTab)
        this.sendDetailListFunc()
        // 设置当前活跃的tab的 已读 未读 成功 失败数
        // succNum
        //   failNum
        //   readNum
        //   unreadNum
        // this.sendDetailFunc(row.id)

        this.detailConfigUtil()
        // 设置初始活跃name值
      } else if (type === 2) {
        // 编辑
        this.$router.push(`/mass-notification/create?id=${row.id}`)
      } else if (type === 3) {
        // 删除
        this.$confirm('请谨慎操作,删除后将无法恢复, 确认删除该消息数据？?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteSendItemFunc(row.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (type === 4) {
        // 导出发送记录
        this.onExportExcel(row.id)
      } else if (type === 5) {
        // 未读重发
        if (!row.resendAuth) { this.$message.warning('不能未读重发'); return }
        this.commitType = 2
        this.open()
        // 未读重发布不需要分页
        this.dialog.query.pageSize = 20000
        this.dialog.needPagination = false
        this.dialog.columnConfig = cloneDeep(memberPageListConfig)

        await this.receiverListFunc(row.id, 2)
        // console.log('ref', this.$refs['receiveRef'].$refs['tableRef'].toggleSelection(this.dialog.tableData))
      } else if (type === 6) {
        // 接收人
        // 接收人弹框是否能够被查看
        if (!row.statAuth) { this.$message.warning('接收人不能被查看'); return }
        this.showDialog = true
        this.open()
        this.dialog.columnConfig = cloneDeep(memberPageListConfig)
        this.dialog.columnConfig.splice(0, 1)
        this.dialog.columnConfig.push({
          prop: 'id', label: 'ID',
        })
        this.receiverListFunc(row.id)
      }
    },
    // 1.批量配置模板 2.批量分配短信 3.管理模板 4.分配短信
    // eslint-disable-next-line no-unused-vars
    templateOperation(type, row) {
      if (type === 1) this.showConfiguration = true
      else if (type === 2) this.showAllocation = true
      else if (type === 3) this.$refs.showManagement.show(row)
      else if (type === 4) this.$refs.Allot.show(row)
      else if (type === 5 && row.smsDistributionNum > 0) this.$refs.Record.show(row)
    },
    // 弹框确认
    save() {
      // 未读重发 需请求保存
      if (this.currentType === 5) {
        const { dialog: { selectList } } = this
        if (selectList.length < 1) { this.$message.warning('至少选择一个哦~'); return }
        this.unreadRetryFunc()
      }
      this.hide()
    },
    // 关闭弹框
    hide() {
      // 置空弹框分页内容 表单内容
      this.sendDetailChannelType = []
      this.sendStatus = []
      this.dialog.query = { page: 1, pageSize: 10, keyword: '', selectLis: [] }
      this.$refs['receiveRef'].$children[0].hide()
    },
    // 打开弹框
    open() {
      this.$refs['receiveRef'].$children[0].show()
    },
    onSubmit() {},
    // 删除已选活动
    handleSelect() {},
    /** 父子组件交互 */
    // 子组件点击查询
    clickQuery(val) {
      // console.log('val', val)
      this.query = {
        ...val,
        page: 1,
        pageSize: 10
      }
      // console.log('this.query', this.query)
      // this.query.page = 1
      // this.query.pageSize = 10
      this.sendListFunc(val)
    },
    // 弹框内已选表格数组发生变化

    selectionChange(val) {
      this.dialog.selectList = val
    },
    change(val) {
      if (val.pageNum) this.query.page = val.pageNum
      if (val.pageSize) this.query.pageSize = val.pageSize
      this.sendListFunc()
    },
    // 弹框内分页的改变
    receiveChange(val) {
      this.dialog.query.page = val?.pageNum
      this.dialog.query.pageSize = val?.pageSize
      const { currentType, currentRow } = this
      if (currentType === 6 || currentType === 5) {
        this.receiverListFunc(currentRow.id, currentType === 6 ? 1 : 2)
      } else if (currentType === 1) {
        // 详情列表数据
        this.sendDetailListFunc()
      }
    },
    // 弹框内tab的改变
    handleClickChannel(val) {
      // console.log('弹框内tab的改变', val)
      this.activeDialogChannelTab = val
      this.handleTabChannelUtil(val)

      // 切换一级tab时，二级tab应变为第一个
      this.activeSecondChannelTab = this.sendStatus[0].name
      // 同步设置组件内最新的二级tab
      this.$refs['dialogSecondTab'].setCurrentTab(this.activeSecondChannelTab)
      this.sendDetailListFunc()
    },
    //  弹框内二级tab的改变
    handleSecondClickChannel(val) {
      this.dialog.query.page = 1
      this.dialog.query.pageSize = 10
      this.activeSecondChannelTab = val
      this.sendDetailListFunc()
    },
    // tab改变时
    handleClick(name) {
      this.query.page = 1
      this.query.pageSize = 10
      this.activeName = name
      this.tableConfigUtil()
      this.sendListFunc()
      // console.log('handleClick', name)
    },
    /** 工具 */
    onExportExcel(val) {
      // console.log('val', val)
      // this.exportLoaing = true
      exportSendItem(val + '').then(result => {
        console.log(result)
        const link = document.createElement('a') // 创建a标签
        const blob = new Blob([result], { type: 'application/vnd.ms-excel' }) // 设置文件流
        link.style.display = 'none'
        // 设置连接
        link.href = URL.createObjectURL(blob) // 将文件流转化为blob地址
        link.download = '发送记录'
        document.body.appendChild(link)
        // 模拟点击事件
        link.click() // 设置点击事件
      })
        .catch(err => {
          console.log(err)
        })
    },
    restTypeData() {
      if (this.ckey) {
        this.tabList = [{ name: 'notification', label: '通知列表' }]
      } else {
        this.tabList = [{ name: 'mass', label: '群发管理' }, { name: 'template', label: '模板管理' }]
      }
    },
    tableConfigUtil() {
    // 群发通知表格配置
      let columnConfig = [
        { prop: 'id', label: 'ID', width: 180 },
        {
          prop: 'noticeTypeId',
          label: '所属类型',
          formatter: row => {
            let msg = '自定义通知'
            if (row.noticeTypeId === 1) { msg = '缴费通知' } else if (row.noticeTypeId === 2) { msg = '活动通知' } else if (row.noticeTypeId === 3) { msg = '招商活动' } else if (row.noticeTypeId === 4) { msg = '邀请入会' }
            return msg
          }
        },
        {
          prop: 'noticeTypeId',
          label: '同步渠道',
          formatter: row => {
            if (!row.groupSendStatVOS || row.groupSendStatVOS.length < 1) return ''
            const msg = []
            row.groupSendStatVOS.forEach(i => {
              msg.push(this.getTypeById('channel', i.channelTypeId))
              // === 1 ? '短信' : i.channelTypeId === 2 ? '订阅消息' : i.channelTypeId === 3 ? 'app通知' : '应用内通知'
            })
            return msg.join('、')
          }
        },
        {
          prop: 'receiveTypeId',
          label: '接收人类型',
          formatter: row => {
            return this.getTypeById('receive', row.receiveTypeId)
          }
        },
        {
          prop: 'receiverNum',
          label: '接收人',
          render: (h, scope) => {
            return (<el-link type="primary" onClick = {() => this.receiverClick(scope.row)}>{scope.row.receiverNum}</el-link>)
          }
        },
        {
          prop: 'receiverNum',
          label: '已读/未读人数',
          width: 180,
          render: (h, scope) => {
            return (
              scope.row.groupSendStatVOS && scope.row.groupSendStatVOS.map(item => { return <div><span>{this.getTypeById('channel', item.channelTypeId)}：</span><el-link onClick = {() => this.operationClick(1, scope.row)} type="primary" >{item.readNum}/{item.unreadNum}</el-link> </div> })

            )
          }
        },
        {
          prop: 'readRate',
          label: '已读率',
          formatter: row => {
            return row.readRate * 100 + '%'
          }
        },
        {
          prop: 'sendTs',
          label: '发送时间',
          width: 160,
          render: (h, scope) => {
            const time = dayjs(parseInt(scope.row.sendTs)).format('YYYY-MM-DD HH:mm:ss')
            return (<div><div>{scope.row.sendType === 2 ? '定时发送' : ''}</div>  <div>{time}</div></div>)
          }
        },
        {
          prop: 'createInfo',
          label: '创建信息',
          width: 160,
          render: (h, scope) => {
            const time = scope.row.createInfo?.operatorTime && dayjs(parseInt(scope.row.createInfo.operatorTime)).format('YYYY-MM-DD HH:mm:ss')
            return (<div> <div type="primary">{scope.row.createInfo?.operatorName || ''}</div>  <div>{time}</div></div>)
          }
        },
        {
          prop: 'updateInfo',
          label: '更新信息',
          width: 160,
          render: (h, scope) => {
            const time = scope.row.updateInfo?.operatorTime && dayjs(parseInt(scope.row.updateInfo.operatorTime)).format('YYYY-MM-DD HH:mm:ss')
            return (<div><div>{scope.row.updateInfo?.operatorName || ''}</div>  <div>{time}</div></div>)
          }
        },
        {
          prop: 'operation',
          label: '操作',
          render: (h, scope) => {
            return (<div class="operation"><el-link v-show={scope.row.editAuth === 1} type="primary" onClick={ () => this.operationClick(2, scope.row)}> 编辑</el-link> <el-link type="primary" v-show={scope.row.statAuth === 1} onClick={() => this.operationClick(1, scope.row)}>详情</el-link> <el-link v-show={scope.row.delAuth === 1} type="primary" onClick={() => this.operationClick(3, scope.row)}>删除</el-link> <el-link v-show={scope.row.statAuth === 1} type="primary" onClick={() => this.operationClick(4, scope.row)}>导出发送记录</el-link><el-link v-show={scope.row.resendAuth === 1} type="primary" onClick={() => this.operationClick(5, scope.row)}>未读重发</el-link></div>)
            // return (<div class="operation"><el-link type="primary" onClick={ () => this.updateItem(scope.row)}> 编辑</el-link> <el-link type="primary" onClick={() => this.detailItem(scope.row)}>详情</el-link> <el-link type="primary" onClick={() => this.deleteItem(scope.row)}>删除</el-link> </div>)
          }
        },
      ]
      // 群发管理
      // console.log('this.activeName', this.activeName)
      if (this.activeName === 'mass') {
        columnConfig.unshift({
          prop: 'chamberName',
          label: '商协会名称',
          width: 180
        })
      }
      // 模板管理列表
      if (this.activeName === 'template') {
        columnConfig = [
          {
            prop: 'chamberName',
            label: '商协会名称',
          },
          {
            prop: 'smsTempNum',
            label: '短信模板',
          },
          {
            prop: 'subscriptionTempNum',
            label: '订阅消息模板',
          },
          {
            prop: 'appNoticeTempNum',
            label: 'APP通知模板',
          },
          {
            prop: 'smsDistributionSum',
            label: '短信总数',
          },
          {
            prop: 'smsRemainSum',
            label: '短信剩余量',
          },
          {
            prop: 'smsSuccSum',
            label: '短信发送成功',
          },
          {
            prop: 'smsFailSum',
            label: '短信发送失败',
          },
          {
            prop: 'smsDistributionNum',
            label: '分配记录',
            render: (h, scope) => {
              return (<div onClick={ () => this.templateOperation(5, scope.row)} style="color:#339dff">{scope.row.smsDistributionNum} </div>)
            }
          },
          {
            prop: 'operation',
            label: '操作',
            render: (h, scope) => {
              return (<div class="operation"><el-link type="primary" onClick={ () => this.templateOperation(3, scope.row)}> 管理模板</el-link> <el-link type="primary" onClick={() => this.templateOperation(4, scope.row)}>分配短信</el-link>  </div>)
            }
          },
        ]
      }
      this.columnConfig = columnConfig
    },
    detailConfigUtil() {
      this.dialog.columnConfig = [
        { prop: 'id', label: 'ID', width: 180 },
        {
          prop: 'uname',
          label: '姓名',
        },
        {
          prop: 'phone',
          label: '手机号',
        },
        {
          prop: 'chamberNames',
          label: '所属商协会',
        },
        {
          prop: 'status',
          label: '状态',
          formatter: row => {
            return row.readStatus === 1 ? '已读' : '未读'
          }
        },
      ]
    },
    // 根据id查找对应的文本
    getTypeById(type, id) {
      // 接收人类型
      if (type === 'receive') {
        const index = receiveType.findIndex(v => v.type === id)
        if (index === -1) { return '' }
        return receiveType[index].n
      }
      // 渠道类型
      if (type === 'channel') {
        const index = channelTypeList.findIndex(v => v.id === id)
        if (index === -1) { return '' }
        return channelTypeList[index].n
      }
    },
    // 根据弹框内部tab切换处理不同的数据
    handleTabChannelUtil(val) {
      const { groupSendStatMap, activeDialogChannelTab } = this
      // 只有短信才有已读未读 成功失败，其他只有已读和未读
      if (val === '1') {
        this.sendStatus = cloneDeep(sendStatusList)
      } else {
        this.sendStatus = cloneDeep(sendStatusList).filter(v => (v.name === '3' || v.name === '4'))
      }
      if (Object.keys(groupSendStatMap).length < 1) { return }
      const currentTab = groupSendStatMap[activeDialogChannelTab]
      this.sendStatus.forEach(item => {
        item.num = currentTab[item.field]
        item.label = item.label + '(' + currentTab[item.field] + ')'
      })
    },
    // 模板分配短信统计
    async butionSmsStat() {
      const res = await templateDistributionSmsStat()
      this.statistics = res.data
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.containers {
  padding: 20px;
}
.reset-send {
  margin-bottom: 10px;
  span {
    color: #f5222d;
  }
}
.operation {
  display: flex;
  flex-direction: column;
}
</style>
