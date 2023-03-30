<template>
  <a-modal v-model:visible="visible" title="切换频率" @cancel="cancelModel">
    <a-form :model="formState" :labelCol="{ span: 4 }" :rules="rules" ref="formRef">
      <a-form-item name="status" label="切换开关">
        <a-switch v-model:checked="formState.status" />
      </a-form-item>
      <a-form-item name="time" label="切换频率" v-if="formState.status">
        <a-input v-model:value="formState.time" suffix="毫秒" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="cancelModel">取消</a-button>
      <a-button type="primary" @click="submit">发布</a-button>
    </template>
  </a-modal>
</template>
<script>
import { reactive, defineComponent, ref } from 'vue'
import { changeBannerRate } from '@/api/content/banner'
import { validateRate } from '@/utils/validate'
export default defineComponent({
  emits: ['refresh'],
  setup(props, { emit }) {
    const formState = reactive({
      status: false,
      time: 3000
    })
    const rules = {
      status: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
      time: [
        { required: true, message: '请输入切换频率' },
        { validator: validateRate, trigger: 'blur' }
      ]
    }
    const visible = ref(false)
    const open = data => {
      formState.status = !!data
      formState.time = data || 3000
      visible.value = true
    }
    const cancelModel = () => {
      visible.value = false
      formRef.value.resetFields()
    }
    const formRef = ref()
    const submit = async () => {
      await formRef.value.validate()
      await changeBannerRate({
        status: formState.status ? '1' : '0',
        time: formState.time
      })
      visible.value = false
      emit('refresh')
    }

    return {
      formState,
      formRef,
      rules,
      visible,
      open,
      cancelModel,
      submit
    }
  }
})
</script>
