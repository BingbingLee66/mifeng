<template>
  <div>
    <el-card>
      <div class="title">{{ title }}</div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="答卷总览" name="answerList" />
        <el-tab-pane label="查看答卷" name="answerDetail" />
      </el-tabs>
      <div v-if="remark" class="desc">
        <div>说明</div>
        <div style="margin-top: 10px">{{ remark }}</div>
      </div>
      <div v-if="activeName==='answerList'" class="answer">
        <!-- item标题 -->
        <div v-for="(item, index) in answersList" :key="item.problemId" class="answer-item">
          <div class="flex-x-0-center"><span v-if="item.required" class="dot">*</span>{{ index + 1 }}. {{ item.title }}
            <div class="type">
              <span v-if="item.componentKey === COMPONENT_KEY.UPLOAD_FILE" class="components-type">
                <span>{{ FILE_TYPE_MAP.get(item.componentType) }}</span>
              </span>
              <span v-else class="components-type">{{ COMPONENT_KEY_MAP.get(item.componentKey) }}</span>
            </div></div>
          <!-- 表格 -->
          <div class="answer-table">
            <KdTable v-if="[COMPONENT_KEY.SINGLE_SELECT,COMPONENT_KEY.MULTIPLE_SELECT,COMPONENT_KEY.PULLDOWN_SELECT].includes(item.componentKey)" :columns="columns" :rows="item.optionStatistics" />
            <el-link v-else type="primary" @click="answerDetail(index,item)">{{ [COMPONENT_KEY.UPLOAD_VIDEO,COMPONENT_KEY.UPLOAD_IMAGE].includes(item.componentKey)?'下载附件':'查看详情' }}</el-link>
          </div>
        </div>
      </div>
      <AnswerDetail v-if="activeName==='answerDetail'" :ckey="ckey" :questionnaire-id="questionnaireId" />

    </el-card>
    <OtherDetail ref="otherDetail" :show-other="showOther" :current-item="currentItem" :detail-visible.sync="detailVisible" :current-index="currentIndex" />
  </div>
</template>
<script>
import { getAnswersList, getAnswersListByMiF, downloadByMiF, download } from '@/api/quest-survey/answer'
import { COMPONENT_KEY, COMPONENT_KEY_MAP, FILE_TYPE_MAP } from '../../create/constant/index'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    OtherDetail: () => import('./components/Other_Detail.vue'),
    AnswerDetail: () => import('./components/Answer_Detail.vue')
  },
  data() {
    return {
      activeName: 'answerList',
      answersList: [],
      remark: '',
      title: '',
      // 当前操作的答卷
      currentItem: {},
      // 当前操作的答卷index
      currentIndex: 0,
      // 详情弹框是否显示其他
      showOther: false,
      COMPONENT_KEY,
      COMPONENT_KEY_MAP,
      FILE_TYPE_MAP,
      detailVisible: false,
      questionnaireId: null,
      columns: [
        { label: '选项', prop: 'optionName', width: 200 },
        { label: '小计', prop: 'subtotal', width: 100 },
        { label: '比例', width: 200, render: ({ row }) => <el-progress percentage={row.proportion}></el-progress> },
        { label: '操作', prop: 'operation', render: ({ row }) => { if (row.otherItems) { return <el-link type="primary" onClick={() => this.answerDetailOther(row)}>查看</el-link> } } },
      ],
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey || ''
    }
  },
  created() {
    this.questionnaireId = this.$route.query.id || null
    this.getAnswersList()
  },
  methods: {
    handleClick() {},
    answerDetail(index, item) {
      if ([COMPONENT_KEY.SINGLE_TEXT, COMPONENT_KEY.PROVINCE_CITY_AREA].includes(item.componentKey)) {
        this.currentItem = item
        this.currentIndex = index
        this.detailVisible = true
        this.$refs['otherDetail'].getDetail(item.problemId)
      } else {
        this.downloadAnswer(item)
      }
    },
    answerDetailOther(row) {
      const { answersList } = this
      const index = answersList.findIndex(i => i.problemId === row.problemId)
      this.currentItem = answersList[index]
      this.showOther = true
      this.currentIndex = index
      this.detailVisible = true
    },
    /** 请求类函数 */
    // 拉取答卷总览列表
    async getAnswersList() {
      let API = getAnswersList
      if (this.ckey) { API = getAnswersListByMiF }
      const { questionnaireId } = this
      const params = { businessType: 1, questionnaireId }
      const { data } = await API(params)
      this.answersList = data?.answers || []
      this.title = data.title
      this.remark = data?.remark || ''
    },
    async downloadAnswer(item) {
      try {
        let API = download
        if (this.ckey) { API = downloadByMiF }
        const result = await API(item.problemId)
        const link = document.createElement('a') // 创建a标签
        const blob = new Blob([result], { type: 'application/vnd.ms-excel' }) // 设置文件流
        link.style.display = 'none'
        // 设置连接
        link.href = URL.createObjectURL(blob) // 将文件流转化为blob地址
        link.download = item.title
        document.body.appendChild(link)
        // 模拟点击事件
        link.click() // 设置点击事件
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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
}

.answer {
  color: #000000;
  .answer-item {
    font-weight: 650;
    font-size: 16px;
    margin: 35px 0px;
  }
  .type {
    border: 1px solid #5b5454;
    border-radius: 20px;
    padding: 3px 6px;
    font-size: 13px;
    font-weight: 400;
  }
  .answer-table{
    width:50%;margin-top: 10px;
  }
}
</style>
