<template>
  <a-modal :visible="visible" title="添加话题" destroyOnClose @ok="handleOk" @cancel="handleCancel">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 5 }"
      :wrapperCol="{ span: 18 }"
      autocomplete="off"
      ref="FORM"
    >
      <a-form-item v-for="item in list" :key="item.id" :label="item.label" :name="item.name" :rules="item.rules">
        <a-input
          v-if="item.type === 'input'"
          v-model:value="formState[item.name]"
          :placeholder="`请输入${item.label}`"
          v-bind="item.formItemProps"
        />
        <a-select
          v-else-if="item.type === 'select'"
          v-model:value="formState[item.name]"
          :placeholder="`请选择${item.label}`"
          v-bind="item.formItemProps"
        ></a-select>
        <a-range-picker
          v-else-if="item.type === 'dateTimeRange'"
          v-model:value="formState[item.name]"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          v-bind="item.formItemProps"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  formState: {
    type: Object,
    default: () => {}
  },
  list: {
    type: Array,
    default: () => []
  },
  visible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:formState', 'update:visible', 'sure', 'change'])
const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})
const formState = computed({
  get: () => props.formState,
  set: val => emit('update:formState', val)
})

const FORM = ref(null)

const handleOk = () => {
  FORM.value
    .validate()
    .then(res => {
      emit('sure', res)
    })
    .catch(error => {
      console.log(error)
    })
}
const handleCancel = () => {
  visible.value = false
}
</script>
