<template>
  <a-modal title="延长使用" :visible="props.extendedVisible" width="350px" @cancel="closes" @ok="submit">
    <div>
      <info-circle-outlined /> &nbsp; 该商协会由于 【{{
        extendedObj.freezeReason
      }}】被冻结，延长试用后将解冻账号，请谨慎操作
    </div>
    <div class="mt-2">
      <a-row>
        <a-col :span="4">
          <div class="center">延长</div>
        </a-col>
        <a-col :span="8">
          <a-input v-model:value="days" />
        </a-col>
        <a-col :span="2">
          <div class="center">天</div>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { ref } from 'vue'
const props = defineProps({
  extendedVisible: {
    type: Boolean,
    default: false
  },
  extendedObj: {
    type: Object,
    default: () => {}
  }
})
const days = ref()
const emit = defineEmits(['closeExtendedModal', 'submitExtended'])
const closes = () => {
  emit('closeExtendedModal')
}
const submit = () => {
  if (typeof Number(days.value) !== 'number') return message.error('请输入数字')
  emit('submitExtended', days.value)
}
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
