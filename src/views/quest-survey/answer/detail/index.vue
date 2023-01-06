<template>
  <div>
    <!-- 答卷基本信息 -->
    <div class="answer-msg">
      <div>
        <div>
          <span>序号：1</span>
          <span>提交时间：1</span>
        </div>
        <div v-if="ckey">
          <span>姓名：1</span>
          <span>会内职位：1</span>
          <span>联系方式：1</span>
        </div>
        <div v-else>
          <span>用户名：1</span>
          <span>手机号：1</span>
        </div>
      </div>
    </div>
    <el-card class="box-card">
      <div class="title">{{ answerDetailObj.name }}</div>
      <div v-if="remark" class="desc">
        <div>说明</div>
        <div style="margin-top: 10px">{{ answerDetailObj.remark }}</div>
      </div>
      <!-- item标题 -->
      <div v-for="(item, index) in answersList" :key="item.problemId" class="answer-item">
        <div class="flex-x-0-center"><span v-if="item.required" class="dot">*</span>{{ index + 1 }}. {{ item.title }}
          <div class="type">
            <span v-if="item.componentKey === COMPONENT_KEY.UPLOAD_FILE" class="components-type">
              <span>{{ FILE_TYPE_MAP.get(item.componentType) }}</span>
            </span>
            <span v-else class="components-type">{{ COMPONENT_KEY_MAP.get(item.componentKey) }}</span>
          </div></div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { formatDateTime } from '@/utils/date'
import { COMPONENT_KEY, COMPONENT_KEY_MAP, FILE_TYPE_MAP } from '../../create/constant/index'
import { answersUserDetail, answersUserDetailByMiF } from '@/api/quest-survey/answer'
export default {
  components: {

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
        { label: '序号', type: 'index' },
        { label: '用户名', prop: 'username' },
        { label: '会内职位', prop: 'job' },
        { label: '姓名/联系人', prop: 'name' },
        { label: '手机号/联系方式', prop: 'phone' },
        { label: '提交时间', prop: 'submitTime', render: ({ row }) => formatDateTime(+row.submitTime, 'yyyy-MM-dd hh:mm:ss') },
        { label: '操作', render: ({ row }) => <el-link type="primary" onClick={() => this.answerDetail(row)}>查看答卷</el-link> },
      ],
      pageNum: 1,
      pageSize: 10,
      tableData: [],
      userId: 149,
      questionnaireId: 26,
      answerDetailObj: {},
      COMPONENT_KEY,
      COMPONENT_KEY_MAP,
      FILE_TYPE_MAP
    }
  },
  created() {
    this.answerList()
    this.questionnaireId = this.$route.query.id || null
  },
  methods: {
    // 用户答卷列表
    async answerList() {
      const { ckey, questionnaireId, userId } = this
      let API = answersUserDetail
      if (ckey) { API = answersUserDetailByMiF }
      const { data } = await API({ businessType: 1, questionnaireId, userId })
      this.answerDetailObj = data
      this.tableData = data.answers
    },

  }
}
</script>
<style lang="scss" scoped>
.answer-msg{
  padding: 20px 0px 20px 20px;
  font-size: 14px;
  color: #333333;
  span{
    margin-right: 30px;
  }
}
.title {
  font-weight: 700;
  font-style: normal;
  font-size: 28px;
  text-align: center;
}
.desc {
  color: #555555;
  font-size: 13px;
  margin: 20px 0px 10px 0px;
}
.dot {
  color: #d9001b;
  margin-right: 5px;
}
.optionName{
  margin-top: 30px;
  text-align: center;
}
</style>
