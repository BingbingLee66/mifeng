<template>
  <a-modal v-bind="$attrs" :visible="visible" destroyOnClose @ok="handleOk" @cancel="handleCancel">
    <a-form ref="formRef" :model="formState">
      <a-form-item :label="label" name="value" :rules="rules">
        <a-input v-model:value="formState.value" v-bind="inputProps" />
        <slot name="desc" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { reactive, watch, ref, defineComponent } from 'vue'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default(props) {
        return [{ required: true, message: `请输入${props.label}`, trigger: 'blur' }]
      }
    },
    defaultValue: {
      type: [String, Number],
      default: ''
    },
    inputProps: {
      type: Object,
      default() {
        return {
          placeholder: ''
        }
      }
    }
  },
  inheritAttrs: false,
  emits: ['update:visible', 'ok'],
  setup(props, context) {
    const formRef = ref(null)
    const formState = reactive({ value: '' })

    watch(
      () => props.visible,
      visible => {
        if (visible) formState.value = props.defaultValue
      },
      { immediate: true }
    )

    return {
      formState,
      formRef,
      async handleOk() {
        await formRef.value.validate(['value'])
        context.emit('ok', formState.value)
      },
      handleCancel() {
        context.emit('update:visible', false)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
//
</style>
