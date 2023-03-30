<template>
  <a-modal title="通过" :visible="adoptVisible" width="500px" @cancel="onClose" @ok="onConfirm">
    <div class="container">
      <div class="name">温馨提示：设置密码后，自动审核通过</div>
      <div class="name">商/协会名称： {{ adoptDetail.name }}</div>
      <div class="name">后台账号： {{ adoptDetail.phone }}</div>
      <a-form ref="formRef" name="custom-validation" :model="formState" :rules="rules" v-bind="layout">
        <a-form-item has-feedback label="设置密码" name="pass">
          <a-input v-model:value="formState.pass" type="password" autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="确认密码" name="checkPass">
          <a-input v-model:value="formState.checkPass" type="password" autocomplete="off" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup>
import { reactive, ref } from 'vue'

defineProps({
  adoptVisible: {
    default: false,
    type: Boolean
  },
  adoptDetail: {
    default: () => {},
    type: Object
  }
})
const formRef = ref()
const formState = reactive({
  pass: '',
  checkPass: ''
})

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
  } else if (value !== formState.pass) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('两次密码不一致')
  } else {
    return Promise.resolve()
  }
}
const rules = {
  pass: [
    {
      required: true,
      validator: validatePass,
      trigger: 'change'
    }
  ],
  checkPass: [
    {
      required: true,
      validator: validatePass2,
      trigger: 'change'
    }
  ]
}
const layout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 14
  }
}
const emit = defineEmits(['closeAdoptModal', 'submitAdopt'])
const onClose = () => {
  emit('closeAdoptModal')
}
const onConfirm = () => {
  emit('submitAdopt', formState)
}
</script>

<style scoped>
.name {
  margin-bottom: 20px;
}
</style>
