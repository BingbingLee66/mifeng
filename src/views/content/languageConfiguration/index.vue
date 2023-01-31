<template>
  <div class="app-container">
    <el-tabs v-model="tabsIndex" @tab-click="handleTabsChange">
      <el-tab-pane label="打招呼" name="0" />
      <el-tab-pane label="快捷回复" name="1" />
      <el-tab-pane label="常用语" name="2" />
      <el-tab-pane label="场景列表" name="3" />
    </el-tabs>
    <el-button style="margin-bottom: 20px;" type="primary" @click="add">{{ btnTitle[tabsIndex] }}</el-button>

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
      <template v-slot:operate="row">
        <span class="text-blue cur ml-10" @click="handleEvent('edit', row.data)">编辑</span>
        <span v-if="tabsIndex != '3'" class="text-blue cur ml-10" @click="handleEvent('freeze', row.data)">冻结</span>
        <span v-if="tabsIndex != '3'" class="text-yellow cur ml-10" @click="handleEvent('start', row.data)"> 启用</span>
        <span class="text-yellow cur ml-10" @click="handleEvent('delete', row.data)">删除</span>
      </template>
    </ysh-table>

    <!-- 弹框 -->
    <addPop ref="addPops" :tabs-index="tabsIndex" :title="btnTitle[tabsIndex]" @confirm="onConfirm" />
  </div>
</template>

<script>
import addPop from './component/add-pop'
import TableMixins from '@/mixins/yshTable'
import { tableColumn1, tableColumn2, tableColumn3, tableColumn4 } from './data'

export default {
  components: { addPop },
  // 查询，重置，分页，多选等操作（混入方式实现）
  mixins: [TableMixins],
  data() {
    return {
      tabsIndex: '0', // 头部栏索引
      btnTitle: ['新增打招呼语言', '新增快捷回复', '新增常用语', '新增场景'],
      /** 表格配置 */
      tableConfig: {
        loading: true,
        selection: false,
        maxHeight: window.innerHeight - 200 + 'px'
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
      if (this.tabsIndex === '0') {
        this.tableColumn = tableColumn1
      } else if (this.tabsIndex === '1') {
        this.tableColumn = tableColumn2
      } else if (this.tabsIndex === '2') {
        this.tableColumn = tableColumn3
      } else if (this.tabsIndex === '3') {
        this.tableColumn = tableColumn4
      }
      this.pageData.total = 0
      this.fetchData(1)
    },
    // 点击新增弹框
    add() {
      this.$refs.addPops.show()
    },
    /** 获tab列表 */
    async fetchData(page) {
      this.tableConfig.loading = true
      this.tableData = []
      if (page) this.pageData.currentpage = page
      // const { currentpage, limit } = this.pageData
      // const res = await Home.getContentList({
      //   contentType: this.contentType,
      //   pageNum: currentpage,
      //   pageSize: limit
      // })
      this.tableConfig.loading = false
      // if (res.state !== 1) return
      // this.tableData = res.data
      // this.pageData.total = res.totalRows
    },

    /** 默认选中 */
    async handleSwitchChange(event, data) {
      console.log('event', event, data)
    },
    /** 编辑|冻结|启用|删除 */
    handleEvent(event, data) {
      console.log('data', data)
      switch (event) {
        case 'edit':
          break
        case 'freeze':
          break
        case 'start':
          break
        case 'delete':
          break
      }
    },

    // 弹框点击确定
    onConfirm() {
      this.fetchData()
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
