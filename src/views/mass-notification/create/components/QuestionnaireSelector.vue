<template>
  <el-dialog :visible="visible" title="选择问卷" width="1000px" v-bind="$attrs" v-on="$listeners">
    <el-form inline>
      <el-form-item label="问卷标题">
        <el-input v-model="query.questionnaireTitle" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item><el-button type="primary" @click="fetchData">查询</el-button> </el-form-item>
    </el-form>
    <KdTable
      ref="kdTable"
      v-loading="loading"
      :columns="columns"
      :rows="tableData"
      :row-key="row => row.id"
      @select="onTableSelect"
    />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />
    <div slot="footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { QUESTIONNAIRE_STATE } from '@/views/quest-survey/manager/constant'
import { getQuestionnaireList } from '@/api/quest-survey'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
  },
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      query: {
        questionnaireTitle: '',
        pageSize: 10,
        pageNum: 1
      },
      loading: false,
      columns: [
        { type: 'selection' },
        { label: 'ID', prop: 'id' },
        { label: '问卷标题', prop: 'title' },
        { label: '状态', render: ({ row }) => QUESTIONNAIRE_STATE[row.state] },
        { label: '答卷', prop: 'answersCount' },
        { label: '创建时间', prop: 'createdTs' },
      ],
      tableData: [],
      total: 0,
      selectedData: null
    }
  },
  watch: {
    async visible(visible) {
      if (visible) {
        await this.$nextTick()
        this.$refs.kdTable.$refs.table.clearSelection()
        this.value && this.$refs.kdTable.$refs.table.toggleRowSelection(this.value, true)
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    onQueryChange(e) {
      this.query = { ...this.query, ...e }
      this.fetchData()
    },
    async fetchData() {
      this.loading = true
      try {
        const { state, data } = await getQuestionnaireList({
          ...this.query,
          ckey: '',
          queryType: 1 // 平台问卷
        })
        if (state !== 1) return
        this.tableData = data.list
        this.total = data.totalRows
      } finally {
        this.selectedData = null
        this.loading = false
      }
    },
    onTableSelect(selection) {
      if (selection.length > 1) {
        const del_row = selection.shift()
        this.$refs.kdTable.$refs.table.toggleRowSelection(del_row, false)
      }
      this.selectedData = selection[0] || null
    },
    onSubmit() {
      if (!this.selectedData) return this.$message.warning('请选择问卷')
      this.$emit('change', this.selectedData)
      this.$emit('update:visible', false)
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
  line-height: 18px;
}
/deep/ .tableheader .el-checkbox {
  display: none;
}
</style>
