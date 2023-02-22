<template>
  <div>
    <!-- 答卷基本信息 -->
    <div class="answer-msg">
      <div>
        <div style="margin-bottom:10px">
          <span>序号：{{ answerDetailObj.questionnaireRecordId }}</span>
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
      <div class="title">{{ answerDetailObj.title }}</div>
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
        <div v-if="[COMPONENT_KEY.PROVINCE_CITY_AREA,COMPONENT_KEY.SINGLE_TEXT,COMPONENT_KEY.MULTIPLE_TEXT].includes(item.key)" class="item-question">
          <template v-if="item.val && item.val[0]">
            <!-- 省市区，拿provinceName，cityName，areaName -->
            <div v-if="item.key===COMPONENT_KEY.PROVINCE_CITY_AREA">
              {{ item.val[0].provinceName }}-{{ item.val[0].cityName }}-{{ item.val[0].areaName }}
            </div>
            <!-- Component_Single_Text,Component_Multiple_Text拿value -->
            <div v-else>{{ item.val[0].value }}</div>
          </template>

        </div>
        <!-- 遍历数组 -->
        <!-- v-if="[COMPONENT_KEY.SINGLE_SELECT,COMPONENT_KEY.MULTIPLE_SELECT,COMPONENT_KEY.PULLDOWN_SELECT].includes(item.key)" -->
        <div v-else>
          <div v-for="(item2,index2) in item.val" :key="index2" class="item-question">
            <div v-if="item.key===COMPONENT_KEY.UPLOAD_VIDEO" class="video-item">
              <!-- 拿对象vid，sourceAddr，cover -->
              <i class="el-icon-set-up video" /> <span>{{ item2.vid }}</span> <el-link type="primary" @click="downLoadImg(2,item2)">下载</el-link>
            </div>
            <!-- Component_Upload_Image,Component_Upload_File拿value -->
            <template v-else-if="[COMPONENT_KEY.UPLOAD_IMAGE,COMPONENT_KEY.UPLOAD_FILE].includes(item.key)">
              <div v-if="item.key===COMPONENT_KEY.UPLOAD_IMAGE" class="upload-img-item">
                <el-image :ref="`preview${index2}`" :preview-src-list=" [item2.value]" :src="item2.value" class="upload-img" />
                <el-link type="primary" @click="onPreview(`preview${index2}`)">查看原图</el-link>
                <el-link type="primary" @click="downLoadImg(1,item2)">下载</el-link>
              </div>
              <div v-else>{{ item.value }}</div>

            </template>
            <!-- Component_Single_Select，Component_Multiple_Select，Component_Pulldown_Select 拿label -->
            <div v-else>{{ item2.label }}</div>
          </div>
        </div>

      </div>
      <div class="flex-x-center-center">
        <el-button v-if="answerDetailObj.prevId" @click="nextAnswer(answerDetailObj.prevId)">上一份答卷</el-button>
        <el-button v-if="answerDetailObj.nextId" type="primary" @click="nextAnswer(answerDetailObj.nextId)">下一份答卷</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { formatDateTime } from '@/utils/date'
import { COMPONENT_KEY, COMPONENT_KEY_MAP, FILE_TYPE_MAP } from '../../create/constant/index'
import { answersUserDetail, answersUserDetailByMiF } from '@/api/quest-survey/answer'
import { downloadByBlob } from '@/views/activity/util'
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
      answerDetailObj: {},
      COMPONENT_KEY,
      COMPONENT_KEY_MAP,
      FILE_TYPE_MAP,
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey || ''
    },
    questionnaireId() {
      return this.$route.query.id || null
    },
    userId() {
      return this.$route.query.userId || null
    }
  },
  created() {
    this.answerList()
  },
  methods: {
    // 用户答卷列表
    async answerList() {
      const { ckey } = this
      const { questionnaireId, userId } = this
      let API = answersUserDetail
      if (ckey) { API = answersUserDetailByMiF }
      const { data } = await API({ businessType: 1, questionnaireId, userId })
      this.answerDetailObj = data
      this.answerDetailObj.submitTs = dayjs(+data.submitTs).format('YYYY年MM月DD日 HH:mm')
      this.answersList = data.answers
    },
    // 点击上下份答卷
    nextAnswer(id) {
      if (!id) { return }
      const { questionnaireId } = this
      this.$router.push({
        path: '/quest-survey/answer/detail',
        query: {
          id: questionnaireId,
          userId: id
        }
      })
    },
    // 下载图片  1图片 2视频
    downLoadImg(type = 1, item) {
      if (type === 1) { downloadByBlob(item.value, '图片') } else if (type === 2) {
        let link = item.sourceAddr
        const fileName = item.vid
        const x = new XMLHttpRequest()
        // 将http换成https
        link = link.replace(/http/, 'https')
        console.log('link', link)
        x.open('GET', link, true)
        x.responseType = 'blob'
        x.onload = () => {
          const url = window.URL.createObjectURL(x.response)
          const a = document.createElement('a')
          a.href = url
          a.download = fileName
          a.click()
        }
        x.send()
      }
    },
    onPreview(key) {
      this.$refs[key][0].clickHandler()
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
  margin: 28px 0px;
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
.video-item{
  display: inline-block;
  padding: 8px 15px;
  background-color: #f7f7f7;
  .video{
  color: #4b73f1;
}

}
.upload-img{
  width: 100px;
  height: 100px;
}
</style>
