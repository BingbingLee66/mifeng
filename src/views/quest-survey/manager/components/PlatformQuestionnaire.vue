<template>
  <div class="">
    <el-form inline>
      <el-form-item label="问卷标题">
        <el-input v-model="query.questionnaireTitle" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="问卷状态">
        <el-select v-model="query.state">
          <el-option label="全部" value="" />
          <el-option label="未发布" value="0" />
          <el-option label="已发布" value="1" />
          <el-option label="已停止" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item><el-button type="primary" @click="fetchData">查询</el-button> </el-form-item>
    </el-form>
    <el-button class="mb-10" type="primary" @click="openDialog({value:'',type:'create'})">创建问卷</el-button>
    <KdTable v-loading="loading" :columns="columns" :rows="tableData" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />

    <!-- 新建弹窗 -->
    <el-dialog :visible="dialog.visible && dialog.type === 'create'" title="创建问卷" width="500px" @update:visible="dialog.visible=$event">
      <el-input v-model="dialog.data" placeholder="请输入标题" :maxlength="30" show-word-limit />
      <el-button slot="footer" type="primary" @click="onCreate">确 定</el-button>
    </el-dialog>

    <!-- 分享弹窗 -->
    <QuestionnaireShare :visible="dialog.visible && dialog.type==='share'" @update:visible="dialog.visible=$event" />
    <!-- 编辑弹窗 -->
    <el-dialog :visible="dialog.visible && dialog.type==='edit'" title="编辑" width="600px" @update:visible="dialog.visible=$event">
      <p>
        此问卷正在运行，只能修改问卷的细节，例如更改错别字、添加选项、提前结束/延长问卷时间；
      </p>
      <p>
        不能对问卷做以下操作：删除题目或选项、移动题目或选项、转换题型；
      </p>
      <div slot="footer">
        <el-button type="wran" @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="onEdit">确定编辑</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog :visible="dialog.visible && dialog.type==='delete'" title="删除" width="500px" @update:visible="dialog.visible=$event">
      <p>
        问卷与答卷将一并删除，请谨慎操作！
      </p>
      <div slot="footer">
        <el-button type="wran" @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="onDelete">确定删除</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getQuestionnaireList, updateQuestionnaireState, deleteQuestionnaire, checkQuestionnaireTitle } from '@/api/quest-survey'
import { formatDateTime } from '@/utils/date'

export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
    QuestionnaireShare: () => import('./QuestionnaireShare.vue')
  },
  props: {},
  data() {
    return {
      dialog: {
        visible: false,
        data: {},
        type: 'create',
        value: ''
      },
      query: {
        questionnaireTitle: '', // 问卷标题
        state: '', // 问卷状态
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      columns: [
        { label: 'ID', prop: 'id' },
        { label: '问卷标题', prop: 'title' },
        { label: '状态', render: ({ row }) => <div> { ['未发布', '已发布', '已冻结', '已停止'][row.state] } </div> },
        { label: '答卷', prop: 'answersCount' },
        { label: '创建时间', render: ({ row }) => formatDateTime(+row.createdTs, 'yyyy-MM-dd hh:mm:ss') },
        { label: '操作', render: ({ row }) => this.generateActions(row) }
      ],
      loading: false,
      tableData: []
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
    generateActions(row) {
      return (<div>
        {
          row.state === 0 ? <el-button type="text" onClick={() => this.updateState({ id: row.id, state: 1 })}>发布</el-button> : ''
        }
        {
          row.state === 1 ? <el-button type="text" onClick={() => this.updateState({ id: row.id, state: 3 })}>停止</el-button> : ''
        }
        {
          row.state === 3 ? <el-button type="text" onClick={() => this.updateState({ id: row.id, state: 1 })}>恢复运行</el-button> : ''
        }
        {
          // <el-button type="text">短信通知</el-button>
        }
        <el-button type="text" onClick={() => this.openDialog({ data: row, type: 'share' }) }>分享</el-button>
        {
          // 未发布、已发布、已停止状态时可编辑
          [0, 1, 3].includes(+row.state) ? <el-button type="text" onClick={() => this.openDialog({ data: row, type: 'edit' })} >编辑</el-button> : ''
        }
        <el-button type="text" onClick={() => this.openDialog({ data: row, type: 'delete' })}>删除</el-button>
      </div>)
    },
    openDialog(dialog) {
      this.dialog = {
        ...this.dialog,
        visible: true,
        ...dialog
      }
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
        this.loading = false
      }
    },
    async updateState(row) {
      const { state, msg } = await updateQuestionnaireState({
        operateType: 1,
        questionnaireId: row.id,
        state: row.state
      })
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) this.fetchData()
    },
    async onCreate() {
      const value = this.dialog.value.trim()
      if (!value) return this.$message.warning('请输入标题')
      const { state, msg } = await checkQuestionnaireTitle({
        questionnaireTitle: value
      })
      if (state !== 1) {
        this.$message.error(msg)
      } else {
        this.$router.push({ path: '/quest-survey/create', query: { title: value } })
      }
    },
    onEdit() {
      this.$router.push({ path: '/quest-survey/create', query: { id: this.dialog.data.id } })
    },
    async onDelete() {
      const { data } = this.dialog
      const { state, msg } = await deleteQuestionnaire({ id: data.id })
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
//
</style>
