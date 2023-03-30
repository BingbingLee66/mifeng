<template>
  <a-modal title="驳回" :visible="rejectVisible" width="400px" @cancel="onClose" @ok="onConfirm">
    <div>商/协会名称 {{ adoptDetail.name }}</div>
    <br />
    <a-textarea v-model:value="value" placeholder="请填写驳回原因，1-30字" :rows="4" />
  </a-modal>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { ref } from 'vue'

defineProps({
  rejectVisible: {
    default: false,
    type: Boolean
  },
  adoptDetail: {
    default: () => {},
    type: Object
  }
})
const value = ref('')

const emit = defineEmits(['closeRejectModal', 'submitReject'])
const onClose = () => {
  emit('closeRejectModal')
}
const onConfirm = () => {
  if (value.value.length < 1 || value.value.length > 30) return message.error('请输入1-30的字符')
  emit('submitReject', value)
}
</script>

<style scoped>
.name {
  margin-bottom: 20px;
}
</style>
