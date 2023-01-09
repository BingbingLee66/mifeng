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

    <el-dialog :visible.sync="dialog.visible" title="预览" width="404px" center>
      <SimulatePhone>
        <div class="card">{{ currentRow.templateName }}</div>
        <div v-for="(item,index) of currentRow.extend.params" :key="index" class="card">

          <template v-if="item.type === 'image'">
            <img style="max-width:100%" :src="item.value">
          </template>
          <template v-else-if="item.type === 'video'">
            <video style="max-width:100%" :src="item.value" controls />
          </template>
          <template v-else-if="item.type === 'audio'">
            <AudioPlayBar :src="item.value" />
          </template>
          <template v-else-if="item.type === 'activity' || item.type === 'article'">
            <el-link type="primary" @click="$copyText(item.value.url).then(() => $message.success('复制成功'))"> {{ item.value.url }}</el-link>
          </template>

          <template v-else>
            {{ item.value }}
          </template>
        </div>
      </SimulatePhone>
      <el-button slot="footer" type="primary" @click="dialog.visible = false">关闭</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { get5GTemplateList, deleteTemplate } from '@/api/mass-notification'
import { auditStatus } from '../util/label'
import { formatDateTime } from '@/utils/date'
import { formatSize } from '@/utils'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
    SimulatePhone: () => import('./components/SimulatePhone'),
    AudioPlayBar: () => import('./components/AudioPlayBar')
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
        { label: '大小', render: ({ row }) => formatSize(row.extend.size, 1) },
        { label: '提审时间', render: ({ row }) => formatDateTime(new Date(+row.createdTs), 'yyyy-MM-dd hh:mm:ss') },
        { label: '审核状态', render: ({ row }) => auditStatus[row.auditStatus] },
        { label: '操作', render: ({ row }) => this.generateActions(row) }
      ],
      tableData: [],
      dialog: {
        visible: false,
        data: null
      }
    }
  },
  computed: {
    currentRow() {
      return this.dialog.data || { extend: { params: [] } }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    generateActions(row) {
      return (<div>
        <el-button type="text" onClick={() => this.openDialog({ data: row })}>预览</el-button>
        <el-button type="text" onClick={() => this.onDelete(row)}>删除</el-button>
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
    openDialog(e) {
      this.dialog = {
        visible: true,
        ...e
      }
    },
    async onDelete(row) {
      await this.$confirm('', '确定删除？', {
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      })
      const { state, msg } = await deleteTemplate(row.id)
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) this.fetchData()
    }
  },
}
</script>

<style lang="scss" scoped>
.card {
  padding: 3px;
  background-color: #eee;
  border-radius: 5px;
  margin-bottom: 8px;
}
</style>
