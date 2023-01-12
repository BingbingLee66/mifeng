<template>
  <div class="">
    <el-form inline>
      <el-form-item label="商协会">
        <el-select v-model="query.ckey" filterable>
          <el-option v-for="item in chamberList" :key="item.id" :label="item.name" :value="item.ckey" />
        </el-select>
      </el-form-item>
      <el-form-item label="问卷标题">
        <el-input v-model="query.questionnaireTitle" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="问卷状态">
        <el-select v-model="query.status">
          <el-option label="全部" value="" />
          <el-option v-for="(label,state) in QUESTIONNAIRE_STATE" :key="state" :label="label" :value="state" />
        </el-select>
      </el-form-item>
      <el-form-item><el-button type="primary" @click="fetchData">查询</el-button> </el-form-item>
    </el-form>
    <KdTable v-loading="loading" :columns="columns" :rows="tableData" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />

    <QuestionnaireLook :visible="dialog.visible && dialog.type==='look'" :questionnaire-id="dialog.data.id" @update:visible="dialog.visible=$event" />

    <!-- 分享弹窗 -->
    <QuestionnaireShare :visible="dialog.visible && dialog.type==='share'" :questionnaire-id="dialog.data.id" @update:visible="dialog.visible=$event" />

    <!-- 冻结弹窗 -->
    <el-dialog :visible="dialog.visible && dialog.type==='freeze'" title="冻结" width="500px" @update:visible="dialog.visible=$event">
      <p>
        是否确定冻结该问卷？
      </p>
      <el-input v-model="dialog.value" type="textarea" placeholder="请填写冻结原因，50字以内" maxlength="50" show-word-limit rows="3" resize="none" />
      <div slot="footer">
        <el-button type="wran" @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="onFreeze">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { chamberSearchList } from '@/api/chamber/manager'
import { getQuestionnaireList, freezeQuestionnaire } from '@/api/quest-survey'
import { QUESTIONNAIRE_STATE } from '../constant'

export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
    QuestionnaireShare: () => import('./QuestionnaireShare.vue'),
    QuestionnaireLook: () => import('./QuestionnaireLook.vue')
  },
  props: {},
  data() {
    return {
      QUESTIONNAIRE_STATE,
      query: {
        ckey: '',
        questionnaireTitle: '', // 问卷标题
        status: '', // 问卷状态
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      columns: [
        { label: 'ID', prop: 'id' },
        { label: '商协会', prop: 'chamberName' },
        { label: '问卷标题', prop: 'title' },
        { label: '状态', render: ({ row }) => QUESTIONNAIRE_STATE[row.state] },
        { label: '答卷', render: ({ row }) => row.answersCount > 0 ? <el-button type="text" onClick={() => this.$router.push({ path: '/quest-survey/answer/list', query: { id: row.id } })}>{row.answersCount}</el-button> : 0 },
        { label: '创建时间', prop: 'createdTs' },
        { label: '操作', render: ({ row }) => this.generateActions(row) },
      ],
      loading: false,
      tableData: [],
      chamberList: [],
      dialog: {
        visible: false,
        data: {},
        type: 'share',
        value: ''
      },
    }
  },
  created() {
    this.getChamberList()
    this.fetchData()
  },
  methods: {
    onQueryChange(e) {
      this.query = { ...this.query, ...e }
      this.fetchData()
    },
    generateActions(row) {
      return (<div>
        <el-button type="text" onClick={() => this.openDialog({ data: row, type: 'look' })}>查看</el-button>
        <el-button type="text" onClick={() => this.openDialog({ data: row, type: 'share' }) }>分享</el-button>
        {
          +row.state !== 2 ? <el-button type="text" onClick={() => this.openDialog({ type: 'freeze', data: row, value: '' })}>冻结</el-button> : ''
        }
      </div>)
    },
    openDialog(dialog) {
      this.dialog = {
        ...this.dialog,
        visible: true,
        ...dialog
      }
    },
    async getChamberList() {
      const { data } = await chamberSearchList()
      this.chamberList = data || []
    },
    async fetchData() {
      this.loading = false
      try {
        const { data, state } = await getQuestionnaireList({
          ...this.query,
          queryType: 2
        })
        if (state !== 1) return
        this.tableData = data.list
        this.total = data.totalRows
      } finally {
        this.loading = false
      }
    },

    async onFreeze() {
      const value = this.dialog.value.trim()
      if (!value) return this.$message.warning('请输入冻结理由')
      const { state, msg } = await freezeQuestionnaire({
        id: this.dialog.data.id,
        freezing: value
      })
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        this.dialog.visible = false
        this.fetchData()
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
