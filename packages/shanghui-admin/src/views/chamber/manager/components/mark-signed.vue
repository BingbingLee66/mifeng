<template>
  <a-modal title="标记已签约" :visible="props.markSignedVisible" width="500px" @cancel="closes" :footer="null">
    <div>
      <info-circle-outlined /> &nbsp; 该商协会由于 【{{
        markObj.freezeReason
      }}】被冻结，延长试用后将解冻账号，请谨慎操作
    </div>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
    >
      <a-form-item label="商协会：">
        {{ props.markObj.chamberName || '--' }}
      </a-form-item>
      <a-form-item label="社会团体法人登记证" name="license">
        <a-upload
          v-model:file-list="fileList"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          action="/"
          :before-upload="beforeUpload"
          :maxCount="1"
          :multiple="false"
          :customRequest="uploadLicense"
        >
          <img v-if="formState.license" class="license-img" :src="formState.license" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="uploadLoading"></loading-outlined>
            <plus-outlined v-else style="font-size: 20px"></plus-outlined>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="办公地址" name="address">
        <a-input v-model:value="formState.address" />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" htmlType="submit" class="mr-2">确定</a-button>
        <a-button type="primary" @click="closes">取消</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { ref, reactive } from 'vue'
import { upload } from '@/api/chamber/manager'
const props = defineProps({
  markSignedVisible: {
    type: Boolean,
    default: false
  },
  markObj: {
    type: Object,
    default: () => {}
  }
})
const formRef = ref()
const resetFields = () => {
  formRef.value.resetFields()
}
const emit = defineEmits(['closeMarkSignModal', 'submitMarkSigned'])
const closes = () => {
  emit('closeMarkSignModal')
  resetFields()
}
const fileList = ref([])
const formState = reactive({
  license: '',
  address: ''
})
const beforeUpload = file => {
  if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
    message.error('上传图片只能是 JPG 或 PNG 格式!')
    return false
  }
  if (file.size > 1024 * 1024 * 50) {
    message.error('上传图片大小不能超过 50MB!')
    return false
  }
}
const uploadLoading = ref(false)
const uploadFile = async (content, type) => {
  uploadLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', content.file)
    const { data } = await upload(formData)
    formState[type] = data.filePath
    uploadLoading.value = false
  } catch {
    uploadLoading.value = false
  }
}
const uploadLicense = data => {
  uploadFile(data, 'license')
}
const rules = reactive({
  address: [{ required: true, message: '办公地址不能为空', trigger: 'blur' }],
  license: [{ required: true, message: '社会团体法人登记证必须上传', trigger: 'blur' }]
})
const onFinish = value => {
  emit('submitMarkSigned', value)
  resetFields()
}
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.license-img {
  width: 180px;
  height: 100px;
}
</style>
