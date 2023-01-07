<template>
  <div>
    <!-- 答卷基本信息 -->
    <div class="answer-msg">
      <div>
        <div style="margin-bottom:10px">
          <span>序号：{{ 1 }}</span>
          <span>提交时间：{{ answerDetailObj.submitTs }}</span>
        </div>
        <div v-if="ckey">
          <span>姓名：{{ answerDetailObj.name }}</span>
          <span>会内职位：{{ answerDetailObj.post }}</span>
          <span>联系方式：{{ answerDetailObj.contactPhone }}</span>
        </div>
        <div v-else>
          <span>用户名：{{ answerDetailObj.name }}</span>
          <span>手机号：{{ answerDetailObj.contactPhone }}</span>
        </div>
      </div>
    </div>
    <el-card class="box-card">
      <div class="title">{{ answerDetailObj.name }}</div>
      <div v-if="answerDetailObj.remark" class="desc">
        <div>说明</div>
        <div style="margin-top: 10px">{{ answerDetailObj.remark }}</div>
      </div>
      <!-- item标题 -->
      <div v-for="(item, index) in answersList" :key="item.problemId" class="answer-item">
        <div class="flex-x-0-center"><span v-if="item.required===1" class="dot">*</span>{{ index + 1 }}. {{ item.title }}
          <div class="type">
            <span v-if="item.key === COMPONENT_KEY.UPLOAD_FILE" class="components-type">
              <span>{{ FILE_TYPE_MAP.get(item.key) }}</span>
            </span>
            <span v-else class="components-type">{{ COMPONENT_KEY_MAP.get(item.key) }}</span>
          </div></div>
        <!-- 只取数组第一个 -->
        <div v-if="[COMPONENT_KEY.PROVINCE_CITY_AREA,COMPONENT_KEY.SINGLE_TEXT,COMPONENT_KEY.MULTIPLE_TEXT].includes(item.key)">
          <!-- 省市区，拿provinceName，cityName，areaName -->
          <div v-if="item.key===COMPONENT_KEY.PROVINCE_CITY_AREA">
            {{ item.val[0].provinceName }}-{{ item.val[0].cityName }}-{{ item.val[0].areaName }}
          </div>
          <!-- Component_Single_Text,Component_Multiple_Text拿value -->
          <div v-else>{{ item.val[0].value }}</div>
        </div>
        <!-- 遍历数组 -->
        <!-- v-if="[COMPONENT_KEY.SINGLE_SELECT,COMPONENT_KEY.MULTIPLE_SELECT,COMPONENT_KEY.PULLDOWN_SELECT].includes(item.key)" -->
        <div v-else>
          <div v-for="(item2,index2) in item.val" :key="index2" class="item-question">
            <div v-if="item.key===COMPONENT_KEY.UPLOAD_VIDEO">
              拿对象vid，sourceAddr，cover
            </div>
            <!-- Component_Upload_Image,Component_Upload_File拿value -->
            <div v-else-if="[COMPONENT_KEY.UPLOAD_IMAGE,COMPONENT_KEY.UPLOAD_FILE].includes(item.key)">{{ item2.value }}</div>
            <!-- Component_Single_Select，Component_Multiple_Select，Component_Pulldown_Select 拿label -->
            <div v-else>{{ item2.label }}</div>
          </div>
        </div>

      </div>
      <div class="flex-x-center-center">
        <el-button @click="nextAnswer()">上一份答卷</el-button>
        <el-button type="primary" @click="nextAnswer()">下一份答卷</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { formatDateTime } from '@/utils/date'
import { COMPONENT_KEY, COMPONENT_KEY_MAP, FILE_TYPE_MAP } from '../../create/constant/index'
import { answersUserDetail, answersUserDetailByMiF } from '@/api/quest-survey/answer'
export default {
  components: { },

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
      answersList: [],
      userId: 149,
      questionnaireId: 34,
      answerDetailObj: {},
      COMPONENT_KEY,
      COMPONENT_KEY_MAP,
      FILE_TYPE_MAP,
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey || ''
    }
  },
  created() {
    this.answerList()
  },
  methods: {
    // 用户答卷列表
    async answerList() {
      const { ckey } = this
      const { questionnaireId, userId } = this.$route.query
      let API = answersUserDetail
      if (ckey) { API = answersUserDetailByMiF }
      const { data } = await API({ businessType: 1, questionnaireId, userId })
      this.answerDetailObj = data
      this.answerDetailObj.submitTs = dayjs(+data.submitTs).format('YYYY年MM月DD日 HH:mm')
      this.answersList = data.answers
    },
    nextAnswer(userId) {
      this.$router.push({
        path: '/quest-survey/answer/detail',
        query: {
          ...this.$route.query,
          userId
        }
      })
    }
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
.answer-item{
  .item-question{
    margin: 10px 0px;
  }
}

.title {
  font-weight: 700;
  font-style: normal;
  font-size: 28px;
  text-align: center;
}
.type {
    border: 1px solid #5b5454;
    border-radius: 20px;
    padding: 3px 6px;
    font-size: 13px;
    font-weight: 400;
    margin-left: 10px;
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
