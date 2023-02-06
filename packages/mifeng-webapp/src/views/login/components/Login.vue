<template>
  <!-- 登录 -->
  <div class="login-bar">
    <div class="login-bar-icon">
      <img :src="solink" alt="" />
      <span class="line">|</span>
      <img :src="bee" alt="" />
      <span>秘锋</span>
    </div>
    <div class="login-title">云商会旗下商协会数字管理系统</div>
  </div>
  <div class="form-title">账号密码登录</div>
  <a-form
    :model="formState"
    name="normal_login"
    class="login-form"
    @finish="onFinish"
    :validateTrigger="['change', 'blur']"
  >
    <a-form-item
      name="username"
      :rules="[
        { required: true, message: '请输入账户' },
        { pattern: /^[0-9A-Za-z]{5,32}$/, message: '请输入5到32位的数字和字母' }
      ]"
    >
      <a-input v-focus autocomplete="off" class="login-input" placeholder="账户" v-model:value="formState.username">
        <template #prefix>
          <user-outlined class="input-icon" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item
      name="password"
      :rules="[
        { required: true, message: '请输入密码' },
        { min: 5, message: '密码至少5位' }
      ]"
    >
      <a-input-password autocomplete="off" class="login-input" placeholder="密码" v-model:value="formState.password">
        <template #prefix>
          <lock-outlined class="input-icon" />
        </template>
      </a-input-password>
    </a-form-item>
    <a-form-item>
      <a-button :disabled="disabled" :loading="loading" size="large" type="primary" block html-type="submit">
        登 录
      </a-button>
    </a-form-item>
  </a-form>
  <div class="tips-text">还没有账号，<span class="link" @click="emits('toggle', false)">立即注册</span></div>
</template>

<script setup>
import { useImgUrl } from '@/hooks/useImgUrl'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
const emits = defineEmits(['toggle'])
const router = useRouter()
const route = useRoute()
const store = useStore()

// solink 图
const solink = useImgUrl('solink.png')
// bee 图
const bee = useImgUrl('bee.png')
// 用户信息
const formState = reactive({
  username: '',
  password: ''
})
// 按钮loading
const loading = ref(false)
const disabled = computed(() => !formState.username || !formState.password)
// 登录提交
const onFinish = async e => {
  loading.value = true
  try {
    await store.dispatch('user/login', e)
    const { redirect } = route.query
    router.push({ path: redirect ? decodeURIComponent(redirect) : '/' })
  } catch {
    loading.value = false
  }
}

// 在模板中启用 v-focus
const vFocus = {
  mounted: el => {
    const [, input] = el.children
    input.focus()
  }
}
</script>

<style scoped lang="scss">
.login-bar {
  width: 200px;
  margin: 31px auto 0;
  .login-bar-icon {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: #231815;
    font-size: 34px;
    height: 40px;
    img {
      width: 40px;
      height: 40px;
    }
    .line {
      margin-top: -7px;
      font-size: 30px;
      font-weight: 600;
    }
  }

  .login-title {
    margin-top: 10px;
    height: 18px;
    font-size: 13px;
    color: #231815;
    line-height: 18px;
    text-align: center;
  }
}
.form-title {
  font-size: 16px;
  font-weight: 400;
  color: #eb8700;
  margin: 20px 0;
  width: 100px;
  padding-bottom: 5px;
  border-bottom: 2px #fdc614 solid;
}
/*:deep(.login-form) {
    .ant-btn-primary {
      color: #fff;
      background: #ffb800 !important;
      &:hover {
        color: #231815;
      }
    }
  }*/
.login-input {
  height: 40px;
}

.input-icon {
  color: map-get($color, base);
  font-size: 18px;
}
.tips-text {
  height: 20px;
  font-size: 14px;
  color: #666666;
  line-height: 20px;
  text-align: right;
  .link {
    color: #eb8700;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
