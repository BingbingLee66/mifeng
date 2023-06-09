<template>
  <a-modal :visible="visible" title="上传附件" width="600px" :before-close="close">
    <a-form ref="formRef" :model="formState" layout="vertical">
      <a-form-item
        v-for="(item, index) in formList"
        :key="item.signKeyId"
        :label="item.title"
        :rules="[{ required: item.checked }]"
      >
        <div class="tips">(支持图片类型：bmp、jpg、png、jpeg)</div>
        <div class="tips">(支持文件类型：PDF、Word、Excel、PPT)</div>
        <a-upload
          :file-list="formState[`list${index}`]"
          :before-upload="beforeUpload"
          :customRequest="content => uploadFile(content, `list${index}`)"
          @remove="content => onRemove(content, `list${index}`)"
        >
          <div class="import-upload">
            <plus-outlined class="a-icon-plus" />
          </div>
        </a-upload>
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="flex-x-center-center">
        <a-button type="default" class="mr-20" @click="close">取消</a-button>
        <a-button type="primary" :loading="loading" @click="onSubmit">{{ loading ? '导入中' : '确定' }}</a-button>
      </div>
    </template>
  </a-modal>
</template>
<script setup>
import { defineProps, defineEmits, ref, reactive, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { uploadFileRandomName } from '@business/common/src/content/api/article'
import { getActivityForm, submitApplyInfo } from '@business/common/src/activity/api/activity-verify'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  activityId: {
    type: String,
    default: ''
  },
  applyId: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:visible', 'fetchData'])

const formRef = ref()
const loading = ref(false)
const formState = reactive({})
const formList = ref([])

watch(
  () => props.visible,
  newVal => {
    if (newVal) {
      initForm()
    }
  }
)

const onSubmit = () => {
  if (!validateForm()) return

  Modal.confirm({
    title: '确认上传？',
    content: `每个报名用户仅支持上传一次，请确认是否继续`,
    okText: '上传',
    cancelText: '取消',
    onOk: async () => {
      const { state, msg } = await submitApplyInfo({
        applyId: props.applyId,
        attachmentInfo: formList.value.map((v, i) => {
          return {
            signKeyId: v.signKeyId,
            attachmentValue: JSON.stringify(
              formState[`list${i}`].map(v => ({
                url: v.fileUrl,
                filename: v.name,
                type: v.type
              }))
            )
          }
        })
      })

      message[state === 1 ? 'success' : 'error'](msg)
      if (!state) return

      close()
      emit('fetchData')
    }
  })
}

const validateForm = () => {
  const hasRequireItem = formList.value.some(v => v.checked)

  // 没有必填项也要至少上传一个附件
  if (!hasRequireItem && JSON.stringify(formState) === '{}') {
    message.error('请至少上传一个附件')
    return false
  }

  return formList.value.every((v, i) => {
    if (v.checked) {
      const res = Boolean(formState[`list${i}`])
      if (!res) message.error(`${v.title}不能为空`)
      return res
    }
    return true
  })
}

const initForm = async () => {
  const { data } = await getActivityForm(props.activityId, {})
  formList.value = data
}

const beforeUpload = file => {
  if (
    ![
      'image/bmp',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ].includes(file.type)
  ) {
    message.error('格式不符合要求')
    return false
  }

  if (file.size > 1024 * 1024 * 30) {
    message.error('请控制在30M以内')
    return false
  }
}

// 上传文件
const uploadFile = (content, field) => {
  const formData = new FormData()
  formData.append('file', content.file)

  uploadFileRandomName(formData, 'activityApply').then(response => {
    if (!formState[field]) formState[field] = []
    formState[field].push({
      ...content.file,
      name: content.file.name,
      fileUrl: response.data,
      type: content.file.type.indexOf('image') > -1 ? 'image' : 'file'
    })
  })
}

const onRemove = (content, field) => {
  const findIndex = formState[field].findIndex(v => v.fileUrl === content.fileUrl)
  formState[field].splice(findIndex, 1)

  if (!formState[field].length) delete formState[field]
}

const close = () => {
  emit('update:visible', false)
  formRef.value.resetFields()
}
</script>
<style lang="scss" scoped>
.tips {
  color: #ccc;
  line-height: 24px;
}

.import-upload {
  padding: 50px;
  border: 1px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    border-color: map-get($color, base);
  }

  .el-icon-plus {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .import-upload-text {
    color: #999;
  }
}
</style>
