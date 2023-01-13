<template>
  <div>
    <el-form ref="form" :inline="true" :model="form" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <!-- <el-form-item v-if="ckey" label="会内职位" prop="job">
        <el-select v-model="form.job" placeholder="请选择">
          <el-option
            v-for="post in memberPostOptions"
            :key="post.value"
            :label="post.label"
            :value="post.label"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item prop="name" label="会员/联系人" label-width="180">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item prop="phone" label="手机号/联系方式" label-width="180">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="answerList">查询</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>

    <KdTable :columns="columns" :rows="tableData" />
    <KdPagination
      :page-size="pageSize"
      :current-page="pageNum"
      :total="total"
      @change="onQueryChange"
    />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { userAnswerListByMiF, userAnswerList } from '@/api/quest-survey/answer'
import { getMemberOptions } from '@/api/member/post'
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
      type: String,
      default: ''
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
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      memberPostOptions: []
    }
  },
  computed: {
    columns() {
      const arr = [
        { label: '序号', prop: 'questionnaireRecordId', width: 190 },
        { label: '用户名', prop: 'username' },
        // { label: '会内职位', prop: 'job' },
        { label: '姓名/联系人', prop: 'name' },
        { label: '手机号/联系方式', prop: 'phone' },
        { label: '提交时间', prop: 'submitTime', render: ({ row }) => dayjs(parseInt(row.submitTime)).format('YYYY年MM月DD日 HH:mm') },
        { label: '操作', render: ({ row }) => <el-link type="primary" onClick={() => this.answerDetail(row)}>查看答卷</el-link> },
      ]
      // if (!this.ckey) { arr.splice(2, 1) }
      return arr
    }
  },
  created() {
    this.answerList()
    this.getMember()
  },
  methods: {
    onSubmit() {},
    // 用户答卷列表
    async answerList() {
      const { ckey, pageNum, pageSize, questionnaireId, form } = this
      let API = userAnswerList
      if (ckey) { API = userAnswerListByMiF }
      const { data: { list, totalRows } } = await API({ pageNum, pageSize, questionnaireId, ...form })
      this.tableData = list
      this.total = totalRows
    },
    // 拉取会内职位
    async  getMember() {
      const { data } = await getMemberOptions({ ckey: this.ckey })
      this.memberPostOptions = data.data
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 打开对应的答卷
    answerDetail({ questionnaireId, userId }) {
      this.$router.push({
        path: '/quest-survey/answer/detail',
        query: { id: questionnaireId, userId }
      })
    },
    onQueryChange(val) { const { pageSize, pageNum } = val; this.pageNum = pageNum; this.pageSize = pageSize; this.answerList() },
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
