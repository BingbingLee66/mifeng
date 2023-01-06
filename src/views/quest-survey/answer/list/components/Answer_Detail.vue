<template>
  <div>
    <el-form ref="form" :inline="true" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="会内职位">
        <el-select v-model="form.job" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="会员/联系人" label-width="180">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="手机号/联系方式" label-width="180">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <KdTable :columns="columns" :rows="tableData" />
    <KdPagination
      :page-size="pageSize"
      :current-page="pageNum"
      :total="tableData.length"
      @change="onQueryChange"
    />
  </div>
</template>
<script>
import { userAnswerListByMiF, userAnswerList } from '@/api/quest-survey/answer'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination')
  },
  props: {
    ckey: {
      type: String,
      default: ''
    },
    questionnaireId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      form: {
        username: '',
        job: '',
        name: '',
        phone: ''
      },
      columns: [
        { label: '序号', prop: 'createdTs' },
        { label: '用户名', prop: 'username' },
        { label: '会内职位', prop: 'job' },
        { label: '姓名/联系人', prop: 'name' },
        { label: '手机号/联系方式', prop: 'phone' },
        { label: '提交时间', prop: 'submitTime' },
        { label: '操作', render: ({ row }) => <el-link type="primary" onClick={() => this.answerDetail(row)}>查看答卷</el-link> },
      ],
      pageNum: 1,
      pageSize: 10,
      tableData: []
    }
  },
  created() {
    this.answerList()
  },
  methods: {
    // 用户答卷列表
    async answerList(questionId) {
      const { ckey, pageNum, pageSize, questionnaireId } = this
      let API = userAnswerList
      if (ckey) { API = userAnswerListByMiF }
      const { data: { list } } = await API({ questionId, pageNum, pageSize, questionnaireId })
      this.tableData = list
    },
    // 打开对应的答卷
    answerDetail() {},
    onQueryChange(val) { const { pageSize, pageNum } = val; this.pageNum = pageNum; this.pageSize = pageSize; console.log('val', val) },
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
