<template>
  <div>
    <a-modal :visible="visible" title="批量报名" width="400px" @cancel="close">
      <div>1. 请先下载《<a-button type="link" @click="onDownLoadApply">批量报名表模版</a-button>》</div>
      <div class="mb-20">2. 填写好报名信息后上传</div>

      <a-upload
        class="import-upload"
        :file-list="fileList"
        :beforeUpload="beforeUploadFile"
        :customRequest="uploadFile"
        @remove="() => (fileList = [])"
        :maxCount="1"
      >
        <div class="import-upload-content">
          <plus-outlined class="a-icon-plus" />
          <div class="import-upload-text">支持格式：xls、xlsx</div>
          <div class="import-upload-text">大小限制：10M</div>
        </div>
      </a-upload>

      <template #footer>
        <div class="flex-x-center-center" style="padding: 4px">
          <a-button type="default" @click="close">取消</a-button>
          <a-button type="primary" :loading="loading" @click="onImportApply">{{
            loading ? '导入中' : '确定'
          }}</a-button>
        </div>
      </template>
    </a-modal>

    <a-modal v-model:visible="resultVisible" title="上传结果" width="400px" @cancel="resultClose">
      <div>共{{ successNum + failNum }}条报名信息，成功报名{{ successNum }}条，失败{{ failNum }}条；</div>
      <a-button type="link" @click="onDownloadFail">下载失败名单</a-button>

      <template #footer>
        <div class="flex-x-center-center">
          <a-button type="primary" @click="resultClose">我知道了</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import { Upload, message } from 'ant-design-vue'
import { getApplyExcel, importApplyExcel } from '@business/common/src/activity/api/activity-verify'
import { downloadFile } from '@/utils'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  activityId: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['fetchData', 'update:visible'])

const fileList = ref([])
const successNum = ref(0)
const failNum = ref(0)
const failCauseFile = ref('')
const loading = ref(false)
const resultVisible = ref(false)

watch(
  () => props.visible,
  newVal => {
    if (!newVal && fileList.value.length) fileList.value = []
  }
)

const onDownLoadApply = async () => {
  try {
    const blob = await getApplyExcel(props.activityId, {})
    downloadFile({
      title: '批量报名表模版.xlsx',
      url: window.URL.createObjectURL(blob)
    })
  } catch (e) {
    console.error(e)
  }
}

const onImportApply = async () => {
  if (!fileList.value.length) return message({ message: '请上传报名表', type: 'warning' })
  const formData = new FormData()
  formData.append('activityId', String(props.activityId))
  formData.append('file', fileList.value[0])
  const { state, msg, data } = await importApplyExcel(props.activityId, formData)

  if (!state) return message[state === 1 ? 'success' : 'error'](msg)

  close()
  emit('fetchData')

  if (data.failNum) {
    successNum.value = data.successNum
    failNum.value = data.failNum
    failCauseFile.value = data.failCauseFile
    resultVisible.value = true
  } else {
    message[state === 1 ? 'success' : 'error'](msg)
  }
}

const onDownloadFail = () => {
  downloadFile({
    title: '批量报名表模版.xlsx',
    url: failCauseFile.value
  })
}

const beforeUploadFile = file => {
  if (
    !['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(
      file.type
    )
  ) {
    message.error('请上传xls、xlsx格式的文件')
    return Upload.LIST_IGNORE
  }

  if (file.size > 1024 * 1024 * 10) {
    message.error('文件过大，请控制在10M以内')
    return Upload.LIST_IGNORE
  }
}

const uploadFile = e => {
  fileList.value = [e.file]
}

const close = () => {
  emit('update:visible', false)
}

const resultClose = () => {
  resultVisible.value = false
}
</script>
<style lang="scss" scoped>
.import-upload-content {
  display: flex;
  border: 1px dashed #ccc;
  padding: 20px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;

  .a-icon-plus {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .import-upload-text {
    color: #999;
  }
}
</style>
