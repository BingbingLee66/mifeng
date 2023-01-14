<template>
  <div>
    <el-dialog :visible.sync="detailVisible" width="600px" :before-close="close">
      <div slot="title"><span class="dot">*</span>{{ currentIndex+1 }}.{{ currentItem.title }}</div>
      <div v-if="!showOther">
        <KdTable :columns="columns" :rows="tableData" />
        <KdPagination
          :page-size="pageSize"
          :current-page="pageNum"
          :total="tableData.length"
          @change="onQueryChange"
        />
      </div>
      <div v-else class="flex-y">
        <span>答题人补充的其他选项 ：</span>
        <div class="optionName">
          {{ otherAnswerList.join('、') }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer flex-x-center">
        <el-button type="primary" @click="close">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { answersOtherDetailByMiF, answersOtherDetail, getOtherAnswers } from '@/api/quest-survey/answer'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination')
  },
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    ckey: {
      type: String,
      default: ''
    },
    currentItem: {
      type: Object,
      default() { return { title: '' } }
    },
    currentIndex: {
      type: Number,
      default: 1
    },
    showOther: {
      type: Boolean
    }
  },
  data() {
    return { columns: [
      { label: '提交答卷时间', prop: 'createdTs' },
      { label: '答案文本', prop: 'val', width: 240 },
      { label: '操作', render: ({ row }) => <el-link type="primary" onClick={() => this.answerDetail(row)}>查看答卷</el-link> },
    ],
    pageNum: 1,
    pageSize: 10,
    tableData: [],
    otherAnswerMap: {}
    }
  },
  computed: {
    problemId() {
      return this.currentItem.problemId
    },
    otherAnswerList() {
      return this.otherAnswerMap[this.problemId] || []
    }
  },
  watch: {
    currentItem: {
      handler() {
        this.fetchOtherAnswers()
      },
      immediate: true
    }
  },
  methods: {
    // 其他答卷数据
    async getDetail(questionId) {
      const { ckey, pageNum, pageSize } = this
      let API = answersOtherDetail
      if (ckey) { API = answersOtherDetailByMiF }
      const { data: { list } } = await API({ questionId, pageNum, pageSize })
      this.tableData = list
    },
    // 打开对应的答卷
    answerDetail(row) {
      this.$router.push({
        path: '/quest-survey/answer/detail',
        query: { id: this.$route.query.id, userId: row.externalUserId }
      })
    },
    onQueryChange(val) { const { pageSize, pageNum } = val; this.pageNum = pageNum; this.pageSize = pageSize; this.getDetail(this.problemId) },
    close() {
      this.$emit('update:detailVisible', false)
    },
    async fetchOtherAnswers() {
      const { problemId, otherAnswerMap } = this
      if (!problemId || (otherAnswerMap[problemId] && !otherAnswerMap[problemId].length)) return
      const { data } = await getOtherAnswers({ questionId: this.currentItem.problemId })
      this.$set(otherAnswerMap, problemId, data || [])
    }
  }
}
</script>
<style lang="scss" scoped>
.dot {
  color: #d9001b;
  margin-right: 5px;
}
.optionName{
  margin-top: 30px;
  text-align: center;
}
</style>
