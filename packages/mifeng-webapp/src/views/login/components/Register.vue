<template>
  <!--注册-->
  <div class="wrap">
    <div class="top">
      <span class="register">注册</span>
      <div class="login" @click="emits('toggle', true)">登录></div>
    </div>
    <a-form
      ref="registerForm"
      :model="formObj"
      name="normal_login"
      layout="vertical"
      class="register-form"
      @finish="onFinish"
      :validateTrigger="['change', 'blur']"
    >
      <a-form-item
        label="商/协会名称"
        class="form-item"
        name="chamberName"
        :rules="[
          { required: true, message: '商/协会名称不能为空' },
          { min: 1, max: 50, message: '商/协会名称1-50个字' }
        ]"
      >
        <a-input
          v-focus
          autocomplete="off"
          class="login-input"
          placeholder="商/协会名称"
          v-model:value="formObj.chamberName"
        />
      </a-form-item>
      <a-form-item
        class="form-item"
        label="商/协会logo："
        name="chamberLogo"
        :rules="[{ required: true, trigger: 'change', message: '请上传商/协会logo' }]"
      >
        <div class="avatar">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="/"
            :before-upload="beforeUpload"
            :maxCount="1"
            :multiple="false"
            :customRequest="uploadCustomRequest"
          >
            <img class="logo" v-if="formObj.chamberLogo" :src="formObj.chamberLogo" alt="avatar" />
            <div v-else>
              <loading-outlined v-if="imgLoading"></loading-outlined>
              <plus-outlined v-else style="font-size: 20px"></plus-outlined>
            </div>
          </a-upload>
          <div class="logo-tips">
            <p>建议尺寸:88*88px</p>
            <p>格式:png/jpeg/jpg</p>
          </div>
        </div>
      </a-form-item>
      <a-form-item class="form-item" label="地区" name="area" :rules="[{ required: true, message: '地区不能为空' }]">
        <a-cascader
          class="cascader"
          size="large"
          v-model:value="formObj.area"
          :field-names="{ label: 'name', value: 'code' }"
          expand-trigger="hover"
          :options="options"
          :show-search="{ filter }"
          placeholder="选择所在地区"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item
        class="form-item"
        label="邀请码"
        name="inviteCode"
        :rules="[
          { required: true, message: '邀请码不能为空' },
          { pattern: /^[A-Za-z0-9]{8}$/, message: '邀请码格式有误' }
        ]"
      >
        <a-input autocomplete="off" class="login-input" placeholder="邀请码" v-model:value="formObj.inviteCode" />
      </a-form-item>
      <a-row :gutter="10">
        <a-col :span="12">
          <a-form-item
            label="联系人姓名"
            name="contactName"
            :rules="[{ required: true, message: '联系人姓名不能为空' }]"
          >
            <a-input
              autocomplete="off"
              class="login-input"
              placeholder="请填写真实人名字"
              v-model:value="formObj.contactName"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="联系人手机号"
            name="contactPhone"
            :rules="[
              { required: true, message: '联系人手机号不能为空' },
              {
                pattern: /^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/,
                message: '号码格式不正确'
              }
            ]"
          >
            <a-input
              autocomplete="off"
              class="login-input"
              placeholder="手机号即为登录账号"
              v-model:value="formObj.contactPhone"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="12">
          <a-form-item
            label="密码"
            name="password"
            :rules="[
              { required: true, message: '账号密码不能为空' },
              { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '6-16位英文字母和数字的组合' }
            ]"
          >
            <a-input-password
              autocomplete="off"
              class="login-input"
              placeholder="密码"
              v-model:value="formObj.password"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="确认密码"
            name="confirmPassword"
            :rules="[{ required: true, message: '确认密码不能为空' }, { validator: checkPwd }]"
          >
            <a-input-password
              autocomplete="off"
              class="login-input"
              placeholder="确认密码"
              v-model:value="formObj.confirmPassword"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item class="form-item operate-btn">
        <a-button :loading="loading" size="large" type="primary" block html-type="submit"> 登 录 </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { getAreaTree, uploadLogo } from '@/api/user'
import { message } from 'ant-design-vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const store = useStore()
const route = useRoute()
const router = useRouter()
const emits = defineEmits(['toggle'])
// 注册表单
const formObj = reactive({
  chamberName: '',
  chamberLogo: '',
  area: [],
  inviteCode: '',
  contactPhone: '',
  contactName: '',
  password: '',
  confirmPassword: ''
})
// 区域选项
const options = ref([])
// 注册表单 dom
const registerForm = ref(null)
// 图片loading
const imgLoading = ref(false)
// 按钮loading
const loading = ref(false)

onMounted(() => {
  getAreaListHandle()
})

// 获取区域
const getAreaListHandle = async () => {
  const { data } = await getAreaTree()
  options.value = data
}

// 搜索区域
const filter = (inputValue, path) => {
  return path.some(options => options.name.indexOf(inputValue) > -1)
}

// logo上传前校验
const beforeUpload = file => {
  const isPic = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
  if (!isPic) message.error(`${file.name} 不是JPG 或 PNG 格式!`)
  const is2m = file.size <= 1024 * 1024 * 2
  if (isPic && !is2m) message.error('上传头像图片大小不能超过 2MB!')
  return isPic && is2m
}

// 自定义logo上传
const uploadCustomRequest = async ({ file }) => {
  imgLoading.value = true
  const formData = new FormData()
  formData.append('file', file)
  try {
    const {
      data: { filePath }
    } = await uploadLogo(formData)
    imgLoading.value = false
    formObj.chamberLogo = filePath
    registerForm.value.validateFields('chamberLogo')
  } catch {
    imgLoading.value = false
  }
}

// 二次密确认校验
const checkPwd = (_rule, value) =>
  formObj.password !== value && value.trim() ? Promise.reject(new Error('两次输入密码不一致!')) : Promise.resolve()

// 注册表单提交
const onFinish = async data => {
  loading.value = true
  const [province, city] = data.area
  data.province = province
  data.city = city
  try {
    await store.dispatch('user/register', data)
    const { redirect } = route.query
    router.push({ path: redirect ? decodeURIComponent(redirect) : '/' })
    loading.value = false
  } catch {
    loading.value = false
  }
}

// 在模板中启用 v-focus
const vFocus = {
  mounted: el => {
    nextTick(() => {
      el.focus()
    })
  }
}
</script>

<style scoped lang="scss">
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  .register {
    height: 28px;
    font-size: 20px;
    font-weight: 600;
    color: #222222;
    line-height: 28px;
  }
  .login {
    color: #eb8700;
    font-size: 14px;
    cursor: pointer;
  }
}
.login-input {
  height: 40px;
}
.avatar {
  margin: -30px 0 0 120px;
  position: relative;
  :deep(.avatar-uploader) {
    .ant-upload-select-picture-card {
      width: 78px;
      height: 78px;
      background-color: #fff;
      border-radius: 50%;
    }
  }
  .logo {
    width: 78px;
    height: 78px;
    border-radius: 50%;
    object-fit: cover;
  }
  .logo-tips {
    position: absolute;
    right: 50px;
    top: 10px;
    font-size: 12px;
    color: #929292;
  }
}
:deep(.form-item) {
  .ant-btn-primary {
    color: #fff;
    border-color: #ffb800;
    background: #ffb800;
    &:hover {
      color: #fff;
      background: #f4c820;
    }
  }
  .ant-form-item {
    margin-bottom: 20px !important;
  }
}
:deep(.register-form) {
  .ant-form-item {
    margin-bottom: 20px;
  }
  .ant-form-item-with-help {
    margin-bottom: 0;
  }
  .ant-form-item-explain {
    min-height: 20px !important;
    font-size: 12px;
    overflow: hidden;
  }
  .ant-form-item-required {
    font-size: 14px;
    color: #606266;
    font-weight: 700;
  }
}

@media screen and (max-height: 626px) {
  :deep(.register-form) {
    .ant-form-item-explain {
      min-height: 16px !important;
      font-size: 12px;
      overflow: hidden;
    }
    .ant-form-item-required {
      font-size: 12px;
    }
    .ant-form-item {
      margin-bottom: 0px;
    }
    .ant-form-item-label {
      padding: 4px 0 0;
    }
  }
  :deep(.ant-input) {
    font-size: 13px;
  }
  .wrap {
    .top {
      margin-bottom: 10px;
    }
    .login-input {
      height: 34px;
    }
    .ant-select.ant-cascader {
      :deep(.ant-select-selector) {
        height: 34px;
      }
    }
    .ant-select-lg {
      font-size: 13px;
    }
    .operate-btn {
      margin-top: 10px;
    }
    .ant-upload-picture-card-wrapper {
      margin-top: 8px;
    }
    .avatar {
      :deep(.avatar-uploader) {
        .ant-upload-select-picture-card {
          width: 68px;
          height: 68px;
        }
      }
      .logo {
        width: 68px;
        height: 68px;
      }
      .logo-tips {
        right: 5px;
      }
    }
  }
}
</style>
<style>
/*滚动条样式*/
.ant-cascader-menu:hover::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background: #fff;
}
.ant-cascader-menu::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background: transparent;
}
.ant-cascader-menu:hover::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #d6d8dd;
}
.ant-cascader-menu {
  width: 170px;
}
</style>
