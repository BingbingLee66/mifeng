<template>
  <div class="login-wrap">
    <a-card hoverable :class="['form-wrapper', { register: !registerFlag }]">
      <component @toggle="toggle" :is="componentName"></component>
    </a-card>
  </div>
</template>

<script setup>
import { useImgUrl } from '@/hooks/useImgUrl'
import Login from './components/Login'
import Register from './components/Register'
import { markRaw, ref } from 'vue'

// 背景图
const bgImg = `url(${useImgUrl('bg.png')}) no-repeat center / cover`
// 切换
const registerFlag = ref(true)
const componentName = ref(markRaw(Login))
const toggle = bol => {
  registerFlag.value = bol
  componentName.value = bol ? markRaw(Login) : markRaw(Register)
}
</script>

<style lang="scss" scoped>
.login-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: v-bind(bgImg);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .form-wrapper {
    min-height: 480px;
    margin-right: 100px;
    width: 433px;
    background: #fff;
    border-radius: 6px;
    padding: 0 8px;
  }
  :deep(.form-wrapper) {
    .ant-card-body {
      padding: 18px 24px;
    }
  }
  .register {
    animation: 0.5s ease-in fadeInRight;
  }
}
@media screen and (max-height: 626px) {
  .login-wrap {
    .register {
      width: 380px;
    }
  }
}
@keyframes fadeInRight {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
</style>
