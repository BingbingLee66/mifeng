<template>
  <div>
    <AModal
      :visible="publishVisible"
      :confirm-loading="confirmLoading"
      title="发布栏目"
      okText="发布"
      @ok="handleOk"
      @cancel="cancelModel"
    >
      <AForm
        ref="formRef"
        :model="formObj"
        :rules="rules"
        label-position="right"
        label-width="100px"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
        autocomplete="off"
      >
        <AFormItem label="发布文章数：" name="title" has-feedback>
          <a-button type="link" danger>{{ formObj.count }}</a-button>
        </AFormItem>
        <AFormItem label="对应栏目：" name="contentColumnId" has-feedback>
          <a-select placeholder="请选择对应栏目" v-model:value="formObj.contentColumnId" :options="options" />
        </AFormItem>
        <AFormItem label="发布时间：">
          <a-radio-group v-model:value="formObj.status">
            <a-radio :value="CRAWLER_PUBLISH_STATUS.IMMEDIATE">立即发布</a-radio>
            <a-radio :value="CRAWLER_PUBLISH_STATUS.TIMING">定时发布</a-radio>
          </a-radio-group>
        </AFormItem>
        <a-row>
          <a-col :offset="8" :span="12">
            <div v-if="formObj.status === CRAWLER_PUBLISH_STATUS.TIMING" name="publishTs">
              <a-date-picker
                v-model:value="formObj.publishTs"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择日期时间"
              />
            </div>
          </a-col>
        </a-row>
      </AForm>
    </AModal>
  </div>
</template>

<script setup>
import { publish } from '@business/common/src/content/api/crawler'
import { ref, reactive, watch, getCurrentInstance } from 'vue'
import { CRAWLER_PUBLISH_STATUS } from '@/constant/content'

const props = defineProps({
  publishVisible: {
    type: Boolean,
    default: false
  },
  pubObj: {
    type: Object,
    default: () => {}
  },
  options: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:publishVisible', 'freshData'])
const confirmLoading = ref(false)
const PublishVisible = ref(props.publishVisible)
const { proxy } = getCurrentInstance()
const formRef = ref(null)
const formObj = reactive({})
const rules = {
  contentColumnId: [{ required: true, message: '对应栏目不能为空', trigger: 'blur' }]
}
watch(
  () => props.publishVisible,
  Val => {
    if (Val) {
      Object.assign(formObj, props.pubObj)
    }
  },
  { immediate: true, deep: true }
)
const cancelModel = () => {
  formRef.value.resetFields()
  PublishVisible.value = false
  emit('update:publishVisible', PublishVisible.value)
}
const handleOk = async () => {
  try {
    await formRef.value.validateFields()
    let ids = []
    if (formObj.hasOwnProperty('id')) {
      ids.push(formObj.id)
    } else {
      ids = formObj.selectionDatas.map(item => item.id)
    }
    const params = {
      articleIds: ids,
      contentColumnId: formObj.contentColumnId,
      status: formObj.status,
      publishTs: formObj.publishTs
    }
    confirmLoading.value = true
    await publish(params)
    proxy.$message.success('发布成功')
    formRef.value.resetFields()
    PublishVisible.value = false
    emit('update:publishVisible', PublishVisible.value)
    emit('freshData')
  } catch (errorInfo) {
    return false
  } finally {
    confirmLoading.value = false
  }
}
</script>

<style></style>
