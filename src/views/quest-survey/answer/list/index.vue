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
      <div class="answer">
        <!-- item标题 -->
        <div v-for="(item, index) in answersList" :key="item.problemId" class="answer-item">
          <div class="flex-x-0-center"><span class="dot">*</span>{{ index + 1 }}. {{ item.title }}
            <div class="type">
              <span v-if="item.componentKey === COMPONENT_KEY.UPLOAD_FILE" class="components-type">
                <span>{{ FILE_TYPE_MAP.get(item.componentType) }}</span>
              </span>
              <span v-else class="components-type">{{ COMPONENT_KEY_MAP.get(item.componentKey) }}</span>
            </div></div>

          <!-- 表格 -->
          <div class="answer-table">
            <KdTable :columns="columns" :rows="item.optionStatistics" />
          </div>
        </div>
      </div>
    </el-card>
    <OtherDetail :question-id="questionId" :detail-visible.sync="detailVisible" :show-title="showTitle" />
  </div>
</template>
<script>
import { getAnswersList, getAnswersListByMiF } from '@/api/quest-survey/answer'
import { COMPONENT_KEY, COMPONENT_KEY_MAP, FILE_TYPE_MAP } from '../../create/constant/index'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    OtherDetail: () => import('./components/Other_Detail.vue')
  },
  data() {
    return {
      activeName: 'answerList',
      answersList: [],
      remark: '',
      title: '',
      // 当前操作的答卷id
      questionId: null,
      COMPONENT_KEY,
      COMPONENT_KEY_MAP,
      FILE_TYPE_MAP,
      detailVisible: true,
      columns: [
        { label: '选项', prop: 'optionName', width: 200 },
        { label: '小计', prop: 'subtotal', width: 100 },
        { label: '比例', width: 200, render: ({ row }) => <el-progress percentage={row.proportion * 100}></el-progress> },
        { label: '操作', prop: 'operation', render: ({ row }) => { if (row.a) { return '' } } },
      ],
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey || ''
    }
  },
  created() {
    this.getAnswersList()
  },
  methods: {
    handleClick() {},
    /** 请求类函数 */
    // 拉取答卷总览列表
    async getAnswersList() {
      let API = getAnswersList
      if (this.ckey) {
        API = getAnswersListByMiF
      }
      const params = { businessType: 1, questionnaireId: 25 }
      const { data } = await API(params)
      this.answersList = data?.answers || []
      this.title = data.title
      this.remark = data?.remark || ''
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
