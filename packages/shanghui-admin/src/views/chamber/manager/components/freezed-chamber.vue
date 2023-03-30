<template>
  <a-modal title="冻结账号" :visible="props.freezedVisible" width="600px" @cancel="closes" @ok="handleOk">
    <div>是否确定冻结该商会的账号?</div>
    <div style="margin: 10px 0px">冻结后，该商会无法登录商会后台，但是不会影响商会在前台的显示</div>
    <a-textarea
      v-model:value="reason"
      placeholder="请填写冻结的原因，50字以内"
      :auto-size="{ minRows: 2, maxRows: 5 }"
      :maxlength="50"
      :showCount="true"
    />
  </a-modal>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { ref } from 'vue'
const props = defineProps({
  freezedVisible: {
    type: Boolean,
    default: false
  }
})
const reason = ref('')
const emit = defineEmits(['closeFreeze', 'submitReason'])
const handleOk = () => {
  if (reason.value === '') return message.error('请填写冻结原因')
  emit('submitReason', reason.value)
}
const closes = () => {
  emit('closeFreeze')
}
</script>

<style scoped></style>
