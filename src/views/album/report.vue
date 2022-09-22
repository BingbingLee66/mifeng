<template>
  <div class="wrap">
    <div class="">
      <h2>相册举报列表</h2>

      <div class="flex-x-start-center">
        <el-input v-model="query.queryParameter" class="input-item" placeholder="相册名称、主体名称" prefix-icon="el-icon-search" @input="onQueryChange(true)" />
        <span class="ml-20">状态：</span>
        <el-select v-model="query.status" class="input-item" @change="onQueryChange(true)">
          <el-option label="全部" value="" />
          <el-option label="正常" value="1" />
          <el-option label="已冻结" value="0" />
        </el-select>
      </div>
    </div>
    <KdTable v-loading="loading" style="margin-top:20px;" :columns="columns" :rows="tableData" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />

    <DetailDialog :album-info="albumInfo" :visible.sync="detailDialogVisible" @success="onQueryChange(true)" />

  </div>
</template>

<script>

import { getReportList } from '@/api/report'

export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
    DetailDialog: () => import('@/views/album/components/DetailDialog')
  },
  props: {},
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        queryParameter: '',
        status: ''
      },
      total: 0,
      tableData: [],
      loading: false,
      detailDialogVisible: false,
      albumInfo: {}
    }
  },

  computed: {
    ckey() {
      return this.$store.getters.ckey
    },

    columns() {
      return [
        {
          label: '举报相册', width: 200,
          render: ({ row }) => <div><div style='color:#66b1ff'>{row.albumId}</div>{row.albumName}</div>
        },
        {
          label: '相册主体',
          render: ({ row }) => <div><div style='color:#66b1ff'>{row.mainBodyId}</div>{row.mainBodyName}</div>
        },
        { label: '举报次数', prop: 'reportCount' },
        { label: '状态', render: ({ row }) => row.albumStatus ? <span style='color:#67c23a'>正常</span> : <span style='color:#f56c6c'>已冻结</span> },
        { label: '处理时间', prop: 'freezeTime' },
        {
          label: '操作',
          fixed: 'right',
          width: '120',
          render: ({ row }) => <div>
            <el-button type='text' onClick={() => this.showDetailDialog(row)}>详情</el-button>
          </div>
        },
      ]
    },
  },
  created() {
    this.onQueryChange()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    onQueryChange(isReset) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.queryTableData(isReset), 300)
    },
    async queryTableData(isReset) {
      this.loading = true
      try {
        const params = {
          ...this.query,
          total: true
        }

        if (isReset) {
          params.pageNum = 1
        }

        const { data: { list, totalRows }} = await getReportList(params)
        this.tableData = list
        this.total = totalRows
      } finally {
        this.loading = false
      }
    },

    showDetailDialog(row) {
      this.albumInfo = row

      this.detailDialogVisible = true
    }

  }
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 20px;

  .input-item {
    width: 300px;

    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
