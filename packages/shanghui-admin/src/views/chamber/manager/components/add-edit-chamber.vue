<template>
  <a-modal title="添加/编辑商会" :visible="props.claimVisible" width="600px" @cancel="close" :footer="null">
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
      <a-form-item label="商/协会名称：" name="name">
        <a-input v-model:value="formState.name" :maxlength="35" />
      </a-form-item>
      <a-form-item label="商/协会logo：" name="systemLogo">
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
          :customRequest="uploadSystemLogo"
        >
          <img v-if="formState.systemLogo" class="systemLogo-img" :src="formState.systemLogo" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="uploadLoading"></loading-outlined>
            <plus-outlined v-else style="font-size: 20px"></plus-outlined>
          </div>
        </a-upload>
        <p style="margin: 0; padding: 0">建议尺寸:88*88px; 格式:png/jpeg/jpg</p>
      </a-form-item>
      <a-form-item label="联系人姓名：" name="president">
        <a-input v-model:value="formState.president" />
      </a-form-item>
      <a-form-item label="联系人手机号：" name="phone">
        <a-input v-model:value="formState.phone" />
      </a-form-item>
      <a-form-item label="地区" name="citys">
        <a-cascader v-model:value="formState.citys" :options="props.areaOptions" placeholder="请选择地区" />
      </a-form-item>
      <a-form-item label="办公地址" name="address">
        <a-input v-model:value="formState.address" />
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
      <a-form-item label="推荐人" name="referrer">
        <a-input v-model:value="formState.referrer" />
      </a-form-item>
      <a-form-item has-feedback label="密码" name="password">
        <a-input v-model:value="formState.password" type="password" autocomplete="off" />
      </a-form-item>
      <a-form-item has-feedback label="确认密码" name="confirmPassword">
        <a-input v-model:value="formState.confirmPassword" type="password" autocomplete="off" />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" htmlType="submit">确定</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { phoneValidator, passwordValidator } from '@/utils/utils'
import { save, upload, getDetail } from '@/api/chamber/manager'
import { message } from 'ant-design-vue'

// import { statusSource } from '@/constant/chamber'
const validatePass = async (_rule, value) => {
  if (value === '') {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('密码不能为空')
  } else if (value.length > 20 || value.length < 6) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('密码长度6-20位')
  } else {
    if (formState.checkPass !== '') {
      formRef.value.validateFields('checkPass')
    }
    return Promise.resolve()
  }
}
const validatePass2 = async (_rule, value) => {
  if (value === '') {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('密码不能为空')
  } else if (value !== formState.password) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('两次密码不一致')
  } else {
    return Promise.resolve()
  }
}
const props = defineProps({
  claimVisible: {
    type: Boolean,
    default: false
  },
  areaOptions: {
    type: Array,
    default: () => []
  },
  chamberId: {
    type: Number,
    default: NaN
  },
  ckey: {
    type: String,
    default: ''
  }
})
watch(
  () => props.chamberId,
  async newValue => {
    if (isNaN(newValue)) return resetForm()
    const hide = message.loading('加载中', 0)
    const { data } = await getDetail({ chamberId: newValue })
    await hide()
    Object.assign(formState, data.dtl)
    formState.citys = [formState.provinceCode, formState.cityCode]
  }
)
const formRef = ref()
const formState = reactive({
  name: '',
  systemLogo: '',
  president: '',
  phone: '',
  citys: '',
  address: '',
  password: '',
  license: '',
  referrer: '',
  confirmPassword: '',
  level: 0
})
const rules = reactive({
  name: [{ required: true, message: '商/协会名称不能为空', trigger: 'blur' }],
  systemLogo: [{ required: true, message: '商/协会logo必须上传', trigger: 'blur' }],
  president: [{ required: true, message: '联系人姓名不能为空', trigger: 'blur' }],
  phone: [
    { required: true, message: '联系人电话不能为空', trigger: 'blur' },
    {
      validator: phoneValidator,
      trigger: 'change'
    }
  ],
  address: [{ required: true, message: '办公地址不能为空', trigger: 'blur' }],
  city: [
    {
      required: true,
      message: '地区不能为空',
      trigger: 'change'
    }
  ],
  license: [{ required: true, message: '社会团体法人登记证必须上传', trigger: 'blur' }],
  password: [
    {
      required: true,
      validator: validatePass,
      trigger: 'change'
    },
    {
      validator: passwordValidator,
      trigger: 'change'
    }
  ],
  confirmPassword: [
    {
      required: true,
      validator: validatePass2,
      trigger: 'change'
    }
  ]
})
const resetForm = () => {
  formRef.value.resetFields()
}
const emit = defineEmits(['closeAddEdit'])
const close = flag => {
  resetForm()
  emit('closeAddEdit', flag)
}
const onFinish = async () => {
  const params = {}
  Object.assign(params, formState)
  const hide = message.loading('加载中', 0)
  // eslint-disable-next-line prefer-destructuring
  params.city = formState.citys[1]
  // eslint-disable-next-line prefer-destructuring
  params.province = formState.citys[0]
  if (props.ckey) params.ckey = props.ckey
  try {
    await save(params)
    await hide()
    await close(true)
  } catch (error) {
    await hide()
  }
}
const uploadLoading = ref(false)
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
const fileList = ref([])
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
const uploadSystemLogo = data => {
  uploadFile(data, 'systemLogo')
}
</script>

<style scoped>
.systemLogo-img {
  width: 100%;
  height: 100px;
}
.license-img {
  width: 100%;
  height: 100px;
}
.avatar-uploader {
  border-radius: 50%;
}
</style>
