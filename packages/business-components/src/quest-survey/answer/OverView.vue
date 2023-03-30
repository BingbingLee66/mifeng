<template>
  <div class="answer">
    <!-- 说明 -->
    <div v-if="answersData.remark" class="mb-5 py-5 px-3 bg-gray-50">
      <div class="text-black text-lg font-bold mb-3">说明</div>
      <div>{{ answersData.remark }}</div>
    </div>
    <div v-for="(item, index) in answersData.answers" :key="item.problemId" class="answer__item">
      <div class="flex-x-0-center mb-2">
        <div class="answer__name" :class="{ require: item.required }">{{ index + 1 }}. {{ item.title }}</div>
        <div class="answer__type">
          <span v-if="item.componentKey === COMPONENT_KEY.UPLOAD_FILE">
            【{{ FILE_TYPE_MAP.get(item.componentKey) }}】
          </span>
          <span v-else>【{{ COMPONENT_KEY_MAP.get(item.componentKey) }}】</span>
        </div>
      </div>
      <!-- 表格 -->
      <div class="mb-6">
        <div
          v-if="
            [COMPONENT_KEY.SINGLE_SELECT, COMPONENT_KEY.MULTIPLE_SELECT, COMPONENT_KEY.PULLDOWN_SELECT].includes(
              item.componentKey
            )
          "
          style="width: 850px"
        >
          <a-table
            :dataSource="item.optionStatistics"
            :columns="columns"
            :pagination="false"
            :scroll="{ x: 'max-content' }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'proportion'">
                <a-progress strokeColor="var(--theme-color)" :percent="record.proportion" status="active" />
              </template>
              <template v-if="column.dataIndex === 'operation'">
                <a-button
                  v-if="record.otherItems"
                  type="link"
                  style="color: var(--theme-color)"
                  @click="showOtherDetail(record)"
                >
                  查看
                </a-button>
              </template>
            </template>
          </a-table>
          <div class="text-right mt-2">本题填写人数：{{ item.applicantsCount || 0 }}</div>
        </div>
        <a-button v-else type="link" @click="handleAnswerDetail(index, item)" style="color: var(--theme-color)">
          {{
            [COMPONENT_KEY.UPLOAD_VIDEO, COMPONENT_KEY.UPLOAD_IMAGE].includes(item.componentKey)
              ? '下载附件'
              : '查看详情'
          }}
        </a-button>
      </div>
    </div>

    <a-modal
      v-model:visible="answersDetail.visible"
      @cancel="closeAnswersDetail"
      :title="answersDetail.title"
      width="800px"
    >
      <div>
        <a-table
          :dataSource="answersDetail.list"
          :columns="detailColumns"
          :pagination="pagination"
          @change="handleTableChange"
          :scroll="{ x: 'max-content' }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'operation'">
              <a-button
                type="primary"
                @click="
                  $router.push({
                    path: '/quest-survey/answer/detail',
                    query: { questionnaireId: record.questionnaireId, userId: record.externalUserId }
                  })
                "
                >查看答卷</a-button
              >
            </template>
          </template>
        </a-table>
      </div>
      <template #footer>
        <a-button type="primary" @click="closeAnswersDetail">关闭</a-button>
      </template>
    </a-modal>

    <a-modal v-model:visible="otherDetail.visible" @cancel="closeOtherDetail" :title="otherDetail.title" width="520px">
      <div>答题人补充的其他选项：</div>
      <div v-for="(other, index) in otherDetail.list" :key="other" class="mt-3 mb-3">{{ index + 1 }}. {{ other }}</div>
      <template #footer>
        <a-button type="primary" @click="closeOtherDetail">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { getAnswersList, answersOtherDetail, getOtherAnswers, download } from '@/api/quest-survey/answer'
import { COMPONENT_KEY, COMPONENT_KEY_MAP, FILE_TYPE_MAP } from '@business/common/src/quest-survey/create/index'
import { ref, reactive, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAntTable } from '@business/logics/src/useAntTable/index.js'

// 答案信息
const columns = [
  { title: '选项', dataIndex: 'optionName', width: 200 },
  { title: '小计', dataIndex: 'subtotal', width: 200 },
  { title: '比例', dataIndex: 'proportion', width: 250 },
  { title: '操作', dataIndex: 'operation' }
]
const answersData = ref({})
const route = useRoute()
const emits = defineEmits(['getTitle'])
watchEffect(
  async () => {
    const { id: questionnaireId = '' } = route.query || {}
    const { data } = await getAnswersList({ businessType: 1, questionnaireId })
    answersData.value = data || {}
    emits('getTitle', data.title)
  },
  { flush: 'post' }
)

// 答案详情
const detailColumns = [
  { title: '提交答卷时间', dataIndex: 'createdTs' },
  { title: '答案文本', dataIndex: 'val' },
  { title: '操作', dataIndex: 'operation' }
]
const answersDetail = reactive({ title: '', list: [], visible: false })
const questionId = ref('')
const { pagination, handleTableChange, fetchTableData } = useAntTable({
  fetchFn: async pageOption => {
    const {
      data: { list, totalRows }
    } = await answersOtherDetail({
      questionId: questionId.value,
      pageSize: pageOption.pageSize,
      pageNum: pageOption.current
    })
    answersDetail.list = list
    return {
      total: totalRows
    }
  }
})
const handleAnswerDetail = async (index, record) => {
  if ([COMPONENT_KEY.SINGLE_TEXT, COMPONENT_KEY.PROVINCE_CITY_AREA].includes(record.componentKey)) {
    // 查看详情
    const { problemId, title } = record
    questionId.value = problemId
    fetchTableData()
    answersDetail.title = title
    answersDetail.visible = true
  } else {
    // 下载附件
    try {
      const result = await download(record.problemId)
      const link = document.createElement('a')
      const blob = new Blob([result], { type: 'application/vnd.ms-excel' })
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.download = record.title
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.log(error)
    }
  }
}
const closeAnswersDetail = () => {
  answersDetail.visible = false
}

// 其他选项详情
const otherDetail = reactive({
  visible: false,
  title: '',
  list: []
})
const showOtherDetail = async record => {
  const { problemId: questionId, title } = record
  const { data } = await getOtherAnswers({ questionId })
  otherDetail.title = title
  otherDetail.visible = true
  otherDetail.list = data
}
const closeOtherDetail = () => {
  otherDetail.visible = false
}
</script>

<style lang="scss" scoped>
.answer {
  color: #000000;
  &__item {
    font-weight: 650;
    font-size: 16px;
    margin: 0 0px 32rpx;
  }
  &__name {
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #222222;
  }
  &__type {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.25);
  }
  .require::before {
    content: '*';
    color: #e00000;
    margin-right: 6px;
  }
}
</style>
