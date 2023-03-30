<template>
  <a-modal v-model:visible="visible" :title="modalTitle" @cancel="close" width="800px">
    <a-form :model="formState" :labelCol="{ span: 4 }" :rules="rules" ref="formRef">
      <a-form-item name="title" :label="labelTitle">
        <a-input v-model:value.trim="formState.title" placeholder="不多于6个字符" :maxlength="6" showCount allowClear />
      </a-form-item>
      <a-form-item name="contentType" label="内容类型">
        <a-select
          ref="select"
          v-model:value="formState.contentType"
          placeholder="请选择内容类型"
          @click="handleTypeChange"
        >
          <a-select-option value="3" v-if="isContent">平台供需</a-select-option>
          <a-select-option value="5">招商资讯</a-select-option>
          <a-select-option value="4">平台资讯</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="contentIds" label="推荐内容">
        <a-button type="primary" @click="handleSelect">选择</a-button>
      </a-form-item>
      <a-form-item v-if="formState.contentIds.length > 0">
        <PlusTable
          :scroll="{ x: 'max-content' }"
          :columns="columns"
          :data-source="tableData"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <template #bodyCell="{ record, column, index }">
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
    </a-form>
    <template #footer>
      <a-button @click="close">取消</a-button>
      <a-button type="primary" @click="submit">保存</a-button>
    </template>
  </a-modal>
  <SelectRecommend ref="selectRef" :content-type="formState.contentType" @confirm="handleConfirm" />
</template>
<script>
import { reactive, defineComponent, ref, computed } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { removeItem, changeOrder } from '@business/common/src/utils/utils'
import SelectRecommend from './select-recommend.vue'
import { getRecommendContent, updateRecommendContent } from '@/api/home-update/recommend'
import { tableColumn2, tableColumn3 } from './tableCol'
export default defineComponent({
  components: { SelectRecommend },
  emits: ['refresh'],
  setup(props, { emit }) {
    const formState = reactive({
      contentIds: [],
      contentType: '',
      title: ''
    })
    const rules = {
      title: [{ required: true, message: '请输入推荐位名称', trigger: 'blur' }],
      contentType: [{ required: true, message: '请选择内容分类型', trigger: 'change' }],
      contentIds: [{ required: true, message: '请选择推荐内容', trigger: 'change' }]
    }
    const columns = computed(() => {
      return formState.contentType === '3' ? tableColumn2 : tableColumn3
    })
    const visible = ref(false)
    const tableData = ref([])
    /** 获取推荐位展示内容 */
    const getContent = async () => {
      const { data: content } = await getRecommendContent({ recommendPosId: position.value })
      if (content && content.length > 0) {
        formState.contentIds = content.map(i => i.contentId)
        formState.title = content[0].title
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
          title: formState.title // 推荐位名称
        }
      })
      await updateRecommendContent(params)
      visible.value = false
      emit('refresh')
    }
    const position = ref('')
    const recommendContentId = ref(null)
    const labelTitle = ref('')
    const modalTitle = ref('')
    const isContent = ref(false)
    const edit = data => {
      visible.value = true
      position.value = data.position
      if (position.value === 2) {
        modalTitle.value = '编辑内容推荐'
        labelTitle.value = '推荐位名称'
        isContent.value = true
      } else {
        modalTitle.value = '编辑内容推荐卡片'
        labelTitle.value = '卡片名称'
        isContent.value = false
      }
      recommendContentId.value = data.id
      formState.contentType = data.contentType + ''
      formState.title = data.title
      fetchTableData()
    }
    const close = () => {
      const obj = {
        contentType: '',
        contentIds: [],
        title: ''
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
      columns,
      tableData,
      modalTitle,
      labelTitle,
      isContent
    }
  }
})
</script>
