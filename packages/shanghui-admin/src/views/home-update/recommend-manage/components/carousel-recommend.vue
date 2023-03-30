<template>
  <a-modal v-model:visible="visible" title="编辑轮播推荐" @cancel="close" width="800px">
    <a-form :model="formState" :labelCol="{ span: 4 }" :rules="rules" ref="formRef">
      <a-form-item name="contentType" label="活动类型">
        <a-select
          ref="select"
          v-model:value="formState.contentType"
          placeholder="请选择活动类型"
          @click="handleTypeChange"
        >
          <a-select-option value="1">平台活动</a-select-option>
          <a-select-option value="2">招商活动</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="contentIds" label="活动内容">
        <a-button type="primary" @click="handleSelect">选择</a-button>
      </a-form-item>
      <a-form-item v-if="formState.contentIds.length > 0">
        <PlusTable
          :scroll="{ x: 'max-content' }"
          :columns="tableColumn"
          :data-source="tableData"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <template #bodyCell="{ record, column, index }">
            <template v-if="column.dataIndex === 'contentImg'">
              <img class="img-preview" :src="record.contentImg" />
            </template>
            <template v-if="column.dataIndex === 'order'">
              <arrow-up-outlined v-if="index !== 0" style="cursor: pointer" @click="handleOrder('up', record)" />
              <arrow-down-outlined
                v-if="index !== tableData.length - 1"
                class="ml10"
                style="cursor: pointer"
                @click="handleOrder('down', record)"
              />
            </template>
            <template v-if="column.dataIndex === 'operate'">
              <a-button type="text" @click="handleRemove(record)" danger>移除</a-button>
            </template>
          </template>
        </PlusTable>
      </a-form-item>
      <a-form-item name="shuffling" label="切换开关">
        <a-switch v-model:checked="formState.shuffling" />
      </a-form-item>
      <a-form-item name="shufflingSpeed" label="切换频率" v-if="formState.shuffling">
        <a-input v-model:value="formState.shufflingSpeed" suffix="毫秒" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="close">取消</a-button>
      <a-button type="primary" @click="submit">保存</a-button>
    </template>
  </a-modal>
  <SelectRecommend ref="selectRef" :content-type="formState.contentType" @confirm="handleConfirm" />
</template>
<script>
import { reactive, defineComponent, ref } from 'vue'
import { validateInt } from '@/utils/validate'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { removeItem, changeOrder } from '@business/common/src/utils/utils'
import { message } from 'ant-design-vue'
import SelectRecommend from './select-recommend.vue'
import { getRecommendContent, updateRecommendContent } from '@/api/home-update/recommend'
import { tableColumn } from './tableCol'
export default defineComponent({
  components: { SelectRecommend },
  emits: ['refresh'],
  setup(props, { emit }) {
    const formState = reactive({
      shufflingSpeed: '',
      contentIds: [],
      shuffling: false,
      contentType: ''
    })
    const rules = {
      contentType: [{ required: true, message: '请选择活动类型', trigger: 'blur' }],
      contentIds: [{ required: true, message: '请选择活动内容', trigger: 'blur' }],
      shuffling: [{ required: true }],
      shufflingSpeed: [
        { required: true, message: '请输入切换频率' },
        { validator: validateInt, trigger: 'blur' }
      ]
    }
    const visible = ref(false)
    const tableData = ref([])
    /** 获取推荐位展示内容 */
    const getContent = async () => {
      const { data: content } = await getRecommendContent({ recommendPosId: position.value })
      if (content && content.length > 0) {
        formState.contentIds = content.map(i => i.contentId)
        formState.shuffling = content[0].shuffling === 1
        formState.shufflingSpeed = content[0].shufflingSpeed
        tableData.value = content
        tableData.value.forEach(i => {
          i.id = i.contentId
          i.label = i.contentId + ' ' + i.contentTitle
        })
      }
      return {
        total: content.length
      }
    }
    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
      fetchFn: getContent
    })
    const handleRemove = data => {
      removeItem(tableData.value, data.contentId)
      removeItem(formState.contentIds, data.contentId)
    }
    const formRef = ref()
    const submit = async () => {
      await formRef.value.validate()
      const params = tableData.value.map(item => {
        return {
          recommendId: position.value, // 推荐位id
          id: recommendContentId.value, // 推荐位内容id
          type: formState.contentType, // 推荐位内容类型
          contentId: item.contentId, // 活动内容id
          contentImg: item.contentImg, // 活动内容图片
          contentTitle: item.contentTitle, // 活动内容标题
          shuffling: formState.shuffling ? 1 : 0, // 是否开启轮播 1开启，0关闭
          shufflingSpeed: formState.shufflingSpeed // 轮播频率，
        }
      })
      await updateRecommendContent(params)
      visible.value = false
      emit('refresh')
    }
    const position = ref(null)
    const recommendContentId = ref(null)
    const edit = data => {
      visible.value = true
      position.value = data.position
      recommendContentId.value = data.id
      formState.contentType = data.contentType + ''
      fetchTableData(1, position.value)
    }
    const close = () => {
      const obj = {
        contentType: '',
        shuffling: false,
        shufflingSpeed: '',
        contentIds: []
      }
      Object.assign(formState, obj)
      formRef.value.clearValidate()
      visible.value = false
    }
    /** 选择推荐内容类型 */
    const handleTypeChange = () => {
      formState.contentIds = []
      tableData.value = []
    }
    const selectRef = ref()
    const handleSelect = () => {
      selectRef.value.select(position.value)
    }

    const handleConfirm = data => {
      if (data) {
        if (data.length > 6) {
          return message.warn('最多选择6个轮播图')
        }
        formState.contentIds = data.map(i => i.contentId)
        tableData.value = data
        selectRef.value.close()
      }
      formRef.value.validateFields('contentIds')
    }

    /** 调整上下顺序 */
    const handleOrder = (event, data) => {
      changeOrder(tableData.value, data.contentId, event)
    }
    return {
      formState,
      formRef,
      rules,
      visible,
      submit,
      handleRemove,
      pagination,
      handleTableChange,
      fetchTableData,
      loading,
      edit,
      close,
      handleTypeChange,
      handleOrder,
      handleConfirm,
      handleSelect,
      selectRef,
      tableColumn,
      tableData
    }
  }
})
</script>
<style lang="scss" scoped>
.img-preview {
  width: 100px;
  height: 60px;
}
</style>
