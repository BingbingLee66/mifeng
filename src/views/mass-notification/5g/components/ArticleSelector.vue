<template>
  <el-dialog title="选择文章" :visible="visible" width="75%" v-bind="$attrs" v-on="$listeners">
    <el-form inline>
      <el-form-item label="标题">
        <el-input v-model="query.title" placeholder="请输入文章标题" clearable />
      </el-form-item>
      <el-form-item label="文章状态">
        <el-select v-model="query.status">
          <el-option label="已发布" :value="1" />
          <el-option label="已冻结(商会)" :value="0" />
          <el-option label="已冻结(平台)" :value="3" />
          <el-option label="审核不通过" :value="5" />
          <el-option label="定时发布" :value="4" />
          <el-option label="所有" :value="-1" />
        </el-select>
      </el-form-item>
      <el-form-item label="来源商会">
        <el-select
          v-model="query.ckey"
          placeholder="搜索/选择"
          filterable
          clearable
          no-match-text="暂无数据"
        >
          <el-option v-for="item in chamberOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-select v-model="query.publishTimeType">
          <el-option label="所有" :value="0" />
          <el-option label="24小时内" :value="1" />
          <el-option label="3天内" :value="2" />
          <el-option label="7天内" :value="3" />
          <el-option label="一个月内" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>

    <KdTable
      ref="kdTable"
      v-loading="loading"
      :columns="columns"
      :rows="tableData"
      :row-key="row => row.id "
      reserve-selection
      @select="onTableSelect"
    />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible',false)">取消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getChamberOptions } from '@/api/finance/finance'
import { getManagerList } from '@/api/content/article'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
  },
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      query: {
        title: '',
        status: 1,
        publishTimeType: 0,
        pageSize: 10,
        pageNum: 1,
        ckey: ''
      },
      chamberOptions: [],
      loading: false,
      columns: [
        { type: 'selection', reserveSelection: true },
        { label: '文章ID', prop: 'id' },
        { label: '文章标题', prop: 'title' },
        { label: '来源商会', prop: 'chamberName' },
        { label: '发布时间', render: ({ row }) => +row.status !== 1 ? '--' : row.publishTs },
      ],
      tableData: [],
      total: 0,
      selectedData: []
    }
  },
  watch: {
    visible: {
      handler() {
        if (this.visible) this.fetchData()
      },
      immediate: true
    }
  },
  created() {
    this.getChamberOptions()
  },
  methods: {
    async getChamberOptions() {
      const { data } = await getChamberOptions()
      this.chamberOptions = data.data
      this.chamberOptions.unshift({ label: '全部', value: '' }, { label: '凯迪云商会', value: 'kaidiyun' })
    },
    onQueryChange(e) {
      this.query = { ...this.query, ...e }
      this.fetchData()
    },
    async fetchData() {
      this.loading = true
      try {
        const { pageNum, ...query } = this.query
        const { data: { data = {} } } = await getManagerList({
          ...query,
          page: pageNum,
          contentColumn: '',
          order: '',
          contentModuleId: '1'
        })
        this.tableData = data.list || []
        this.total = data.totalRows || 0
        this.$refs.kdTable.$refs.table.clearSelection()
        this.selectedData = []
      } finally {
        this.loading = false
      }
    },
    onTableSelect(selection) {
      if (selection.length > 1) {
        const del_row = selection.shift()
        this.$refs.kdTable.$refs.table.toggleRowSelection(del_row, false)
      }
      this.selectedData = selection
    },
    onSubmit() {
      if (!this.selectedData.length) return this.$message.warning('请选择文章')
      this.$emit('add', this.selectedData[0])
    }
  },
}
</script>

<style lang="scss" scoped>
/deep/ .tableheader .el-checkbox {
  display: none;
}
</style>
