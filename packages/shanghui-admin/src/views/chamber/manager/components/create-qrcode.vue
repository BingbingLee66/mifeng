<template>
  <a-modal title="生成二维码" :visible="props.qrVisible" width="300px" @cancel="closes" :footer="null">
    <div class="code-content">
      <a-form ref="formCode" :model="codeObj" label-width="150px">
        <a-form-item
          label="邀请码个数："
          name="codeNum"
          :rules="[{ required: true, message: '请输入邀请码个数', trigger: 'blur' }]"
        >
          <a-input v-model:value="codeObj.codeNum" /> </a-form-item
      ></a-form>
      <div class="red">单次生成邀请码的数量需小于等于999</div>
    </div>
    <div style="display: flex; justify-content: center; margin-top: 40px">
      <a-button @click="closes" class="mr-2">取 消</a-button>
      <a-button type="primary" @click="registerCode">生成并下载</a-button>
    </div>
  </a-modal>
</template>

<script setup>
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
const props = defineProps({
  qrVisible: {
    type: Boolean,
    default: false
  }
})
const codeObj = reactive({
  codeNum: null
})
const emit = defineEmits(['closeQrCodeModal', 'submitQrcode'])
const closes = () => {
  emit('closeQrCodeModal')
}
const registerCode = () => {
  if (!/^[0-9]\d*$/.test(codeObj.codeNum)) {
    message.warning('请输入正确的格式')
    return
  }
  if (codeObj.codeNum > 999 || codeObj.codeNum < 1) {
    message.warning('单次生成邀请码的数量需大于0小于等于999')
    return
  }
  emit('submitQrcode', codeObj)
}
</script>

<style scoped></style>
