<template>
  <div class="app-container">
    <el-tabs v-model="type" @tab-click="handleClick">
      <el-tab-pane label="快速入驻线索" name="快速入驻线索" />
      <el-tab-pane label="转介绍线索" name="转介绍线索" />
    </el-tabs>
    <el-form inline>
      <el-form-item label="社会组织名称">
        <el-input v-model.trim="query.name" placeholder="请输入内容" clearable />
      </el-form-item>
      <el-form-item label="线索来源">
        <el-select v-if="type ==='快速入驻线索'" v-model="query.source" placeholder="请选择">
          <el-option label="全部" :value="-1" />
          <el-option label="小程序名录" value="1" />
          <el-option label="APP名录" value="2" />
        </el-select>
        <el-select v-else v-model="query.putSource" placeholder="请选择">
          <el-option label="全部" value="" />
          <el-option v-for="item in options" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="query.timeRanges"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableData">查询</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <ExportTable :data="selectedData" :title="type" err-msg="请选择导出的线索">导出线索</ExportTable>
    </el-row>

    <KdTable :rows="tableData" :columns="tableList" @selection-change="onSelectionChange" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />
  </div>
</template>

<script>
import { getClueList, getPutSource } from '@/api/chamber/manager'
import { formatDateTime } from '@/utils/date'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
    ExportTable: () => import('@/components/statistic/ExportTable')
  },
  props: {},
  data() {
    return {
      query: {
        name: '',
        source: -1,
        putSource: '',
        timeRanges: [],
        pageSize: 10,
        pageNum: 1
      },

      total: 0,
      type: '快速入驻线索',
      tableData: [],
      selectedData: [],
      options: []
    }
  },
  computed: {
    tableList() {
      const columnsArr = [
        { type: 'selection', width: 55 },
        { label: '线索ID', prop: 'id' },
        { label: '社会组织名称', prop: 'name' },
        { label: '创建时间', render: ({ row }) => formatDateTime(new Date(+row.createdTs), 'yyyy年MM月dd日 hh:mm:ss') },
        { label: '联系人姓名', prop: 'contactName' },
        { label: '联系人电话', prop: 'contactPhone' },
      ]
      if (this.type === '快速入驻线索') {
        columnsArr.splice(4, 0, { label: '线索来源', render: ({ row }) => row.source === 1 ? '小程序名录' : 'APP名录' })
      } else {
        columnsArr.splice(4, 0, { label: '线索来源', prop: 'putSource' })
      }
      return columnsArr
    }
  },
  watch: {
    query: {
      handler() {
        this.query.page = 1
      },
      deep: true
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    onQueryChange(e) {
      this.query = { ...this.query, ...e }
      this.getTableData()
    },
    async getTableData() {
      this.query.type = this.type === '快速入驻线索' ? 1 : 2
      const { pageNum: page, timeRanges, ...query } = this.query

      const params = {
        page,
        ...query,
        startTime: timeRanges && timeRanges[0] ? timeRanges[0].getTime() : '',
        endTime: timeRanges && timeRanges[1] ? timeRanges[1].getTime() + 86399999 : '',
      }
      const { data: { list, totalRows } } = await getClueList(params)
      this.tableData = list || []
      this.total = totalRows || 0
      this.selectedData = []
    },
    onSelectionChange(e) {
      this.selectedData = e.map(v => ({
        线索ID: v.id,
        社会组织名称: v.name,
        创建时间: formatDateTime(new Date(+v.createdTs), 'yyyy年MM月dd日 hh:mm:ss'),
        线索来源: v.source === 1 ? '小程序名录' : 'APP名录',
        联系人姓名: v.contactName,
        联系人电话: v.contactPhone,
      }))
    },
    async handleClick(tab) {
      this.type = tab.name
      this.query = {
        name: '',
        source: -1,
        putSource: '',
        timeRanges: [],
        pageSize: 10,
        pageNum: 1
      }
      if (this.type === '转介绍线索') {
        const { data } = await getPutSource()
        this.options = data
      }
      this.getTableData()
    }
  },
}
</script>

<style lang="scss" scoped>
//
</style>
