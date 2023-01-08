<template>
  <div class="app-container">
    <el-form inline>
      <el-form-item label="标题">
        <el-input v-model="query.templateName" placeholder="搜索" clearable />
      </el-form-item>
      <el-form-item label="模板状态">
        <el-select v-model="query.auditStatus">
          <el-option label="全部" value="" />
          <el-option v-for="item in ['1','2']" :key="item" :label="auditStatus[item]" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-button class="mb-10" type="primary" @click="$router.push('/mass-notification/5g/create')">新建模板</el-button>

    <KdTable v-loading="loading" :columns="columns" :rows="tableData" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />
  </div>
</template>

<script>
import { get5GTemplateList } from '@/api/mass-notification'
import { auditStatus } from '../util/label'
import { formatDateTime } from '@/utils/date'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
  },
  props: {},
  data() {
    return {
      auditStatus,
      query: {
        templateName: '',
        auditStatus: '',
        pageSize: 10,
        pageNum: 1,
      },
      total: 0,
      loading: false,
      columns: [
        { label: '模板ID', prop: 'id' },
        { label: '标题', prop: 'templateName' },
        { label: '大小', render: ({ row }) => `${(row.extend.size / (1024 * 1024)).toFixed(1)}M` },
        { label: '提审时间', render: ({ row }) => formatDateTime(new Date(+row.createdTs), 'yyyy-MM-dd hh:mm:ss') },
        { label: '审核状态', render: ({ row }) => auditStatus[row.auditStatus] },
        { label: '操作', render: ({ row }) => this.generateActions(row) }
      ],
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    generateActions() {
      return (<div>
        <el-button type="text">预览</el-button>
        <el-button type="text">删除</el-button>
      </div>)
    },
    onQueryChange(e) {
      this.query = { ...this.query, ...e }
    },
    async fetchData() {
      this.loading = true
      try {
        const { pageNum, ...query } = this.query
        const { data } = await get5GTemplateList({
          ...query,
          page: pageNum
        })
        this.tableData = data.list || []
        this.total = data.totalRows || 0
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
//
</style>
