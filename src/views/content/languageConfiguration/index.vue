<template>
  <div class="app-container">
    <el-tabs v-model="tabsIndex" @tab-click="handleTabsChange">
      <el-tab-pane label="打招呼" name="1" />
      <el-tab-pane label="快捷回复" name="2" />
      <el-tab-pane label="常用语" name="3" />
      <el-tab-pane label="场景列表" name="4" />
    </el-tabs>
    <el-button style="margin-bottom: 20px;" type="primary" @click="getAdd('')">{{ btnTitle[tabsIndex] }}</el-button>

    <ysh-table
      :table-config="tableConfig"
      :table-column="tableColumn"
      :table-data="tableData"
      :page-data="pageData"
      @handleSwitchChange="handleSwitchChange"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
      @handleSelectionChange="handleSelectionChange"
      @handleSligleChange="handleSligleChange"
    >
      <template v-slot:switch="row">
        <el-switch v-model="row.data.oneClickGreet" @change="e => handleSwitchChange(e, row.data)" />
      </template>
      <template v-slot:operate="row">
        <span class="text-blue cur ml-10" @click="handleEvent('edit', row.data)">编辑</span>
        <span v-if="tabsIndex != '4' && row.data.status == 1" class="text-blue cur ml-10" @click="handleEvent('freeze', row.data)">冻结</span>
        <span v-if="tabsIndex != '4' && row.data.status == 0" class="text-yellow cur ml-10" @click="handleEvent('start', row.data)">启用</span>
        <span v-if="tabsIndex != '4' " class="text-yellow cur ml-10" @click="handleEvent('delete', row.data)">删除</span>
        <span v-if="tabsIndex == '4' && row.data.status !== 1" class="text-yellow cur ml-10" @click="handleEvent('delete', row.data)">删除</span>
      </template>
    </ysh-table>

    <!-- 弹框 -->
    <addPop ref="addPops" :tabs-index="tabsIndex" :title="btnTitle[tabsIndex]" @confirm="fetchData" />
  </div>
</template>

<script>
import addPop from './component/add-pop'
import TableMixins from '@/mixins/yshTable'
import { tableColumn1, tableColumn2, tableColumn3, tableColumn4 } from './data'
import { shortcutConfigList, shortcutSceneList, sceneDeleteById, configDeleteById, freezeOrEnableById, oneClickGreet } from '@/api/content/languageConfiguration'

export default {
  components: { addPop },
  // 查询，重置，分页，多选等操作（混入方式实现）
  mixins: [TableMixins],
  data() {
    return {
      tabsIndex: '1', // 头部栏索引
      btnTitle: [ '', '新增打招呼语言', '新增快捷回复', '新增常用语', '新增场景'],
      /** 表格配置 */
      tableConfig: {
        loading: true,
        selection: false,
        // maxHeight: window.innerHeight - 400 + 'px'
      },
      tableData: [], // 表格数据
      tableColumn: tableColumn1, // 表格头部栏
    }
  },

  async created() {
    this.fetchData(1)
  },
  methods: {
    // 切换头部栏
    handleTabsChange() {
      if (this.tabsIndex === '1') {
        this.tableColumn = tableColumn1
      } else if (this.tabsIndex === '2') {
        this.tableColumn = tableColumn2
      } else if (this.tabsIndex === '3') {
        this.tableColumn = tableColumn3
      } else if (this.tabsIndex === '4') {
        this.tableColumn = tableColumn4
      }
      this.pageData.total = 0
      this.fetchData(1)
    },
    // 点击新增弹框
    getAdd(id) {
      this.$refs.addPops.show(id)
    },
    /** 获tab列表 */
    async fetchData(page) {
      // tabsIndex  1.打招呼 2.快捷回复 3.常用语  4.场景列表
      this.tableConfig.loading = true
      this.tableData = []
      if (page) this.pageData.currentpage = page
      const { currentpage, limit } = this.pageData
      let res = {}
      if (this.tabsIndex !== '4') {
        res = await shortcutConfigList({
          page: currentpage,
          pageSize: limit,
          type: this.tabsIndex
        })
      } else {
        res = await shortcutSceneList({
          page: currentpage,
          pageSize: limit,
        })
      }

      this.tableConfig.loading = false
      res.data.list.forEach(v => {
        v.oneClickGreet = !!v.oneClickGreet
      })
      if (res.state !== 1) return
      this.tableData = res.data.list
      this.pageData.total = res.data.totalRows
    },

    /** 默认选中 */
    async handleSwitchChange(event, data) {
      const res = await oneClickGreet({
        id: data.id,
        type: this.tabsIndex,
        oneClickGreet: event ? 1 : 0 // 0关闭 1开启
      })
      if (res.state !== 1) this.$message.error(res.msg)
      this.tableData.forEach(v => {
        if (v.id !== data.id) v.oneClickGreet = false
      })
      this.$forceUpdate()
    },
    /** 编辑|冻结|启用|删除 */
    handleEvent(event, data) {
      switch (event) {
        case 'edit':
          this.getAdd(data.id)
          break
        case 'freeze':
          this.getFreezeOrEnableById(data.id, 0)
          break
        case 'start':
          this.getFreezeOrEnableById(data.id, 1)
          break
        case 'delete':
          this.$confirm(
            '是否选择删除',
            '删除操作',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
            }
          )
            .then(async () => {
              this.handleDelete(data)
            })
            .catch(() => {})

          break
      }
    },

    // 冻结-启用
    async getFreezeOrEnableById(id, status) {
      const res = await freezeOrEnableById({
        id,
        status // 状态 0冻结 1启用
      })
      if (res.state === 1) {
        this.$message.success('操作成功')
        this.fetchData()
      } else {
        this.$message.error(res.msg)
      }
    },

    // 删除
    async handleDelete(data) {
      // tabsIndex  1.打招呼 2.快捷回复 3.常用语  4.场景列表
      let Request = null
      if (this.tabsIndex === '4') Request = sceneDeleteById
      else Request = configDeleteById

      const res = await Request({
        id: data.id
      })
      if (res.state === 1) {
        this.$message.success('操作成功')
        this.fetchData()
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
