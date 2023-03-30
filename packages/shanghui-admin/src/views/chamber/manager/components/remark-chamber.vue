<template>
  <a-modal title="备注负责人" :visible="props.remarkVisible" width="600px" @cancel="close" @ok="handleOk">
    <a-form :model="formState" ref="formRef" name="basic">
      <a-form-item class="ml-2" label="商协会">
        <div>{{ props.chamberName }}</div>
      </a-form-item>
      <a-form-item
        label="商务负责人"
        name="business"
        :rules="[{ required: true, message: '请选择商务负责人', trigger: 'blur' }]"
      >
        <a-select
          v-model:value="formState.business"
          :placeholder="'请选择商务负责人'"
          :options="props.businessArr"
        ></a-select>
      </a-form-item>
      <a-form-item
        label="运营负责人"
        name="operating"
        :rules="[{ required: true, message: '请选择商务负责人', trigger: 'blur' }]"
      >
        <a-select
          v-model:value="formState.operating"
          :placeholder="'请选择运营负责人'"
          :options="props.operatingArr"
        ></a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { reactive, ref } from 'vue'
const formRef = ref()
const props = defineProps({
  remarkVisible: {
    type: Boolean,
    default: true
  },
  businessArr: {
    type: Array,
    default: () => []
  },
  operatingArr: {
    type: Array,
    default: () => []
  },
  chamberName: {
    type: String,
    default: ''
  }
})
const resetFields = () => formRef.value.resetFields()
const emit = defineEmits(['closeremark', 'submitRemark'])
const handleOk = () => {
  if (formState.business && formState.operating) {
    emit('submitRemark', formState)
    resetFields()
  } else {
    message.error('请选择对应负责人')
  }
}
const formState = reactive({
  business: null,
  operating: null
})
const close = () => {
  emit('closeremark')
  resetFields()
}
</script>

<style scoped></style>
