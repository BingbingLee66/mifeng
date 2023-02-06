<template>
  <AModal
    v-model:visible="props.setLevelVisible"
    title="权重"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="cancelModel"
  >
    <AForm
      :model="levelForm"
      :rules="levelRules"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 12 }"
      autocomplete="off"
      ref="levelFormRef"
    >
      <AFormItem label="权重" name="level" has-feedback>
        <AInput autocomplete="off" allowClear v-model:value="levelForm.level" />
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script>
import { defineComponent, ref, onMounted, reactive, watch } from 'vue'
import { updateColumnLevel } from '@/api/content/columnsetup'
export default defineComponent({
  props: {
    setLevelVisible: {
      type: Boolean,
      default: false
    },
    levelObj: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['update:setLevelVisible', 'freshData'],
  setup(props, { emit }) {
    const confirmLoading = ref(false)
    const SetLevelVisible = ref(props.setLevelVisible)
    const checkLevel = (rule, value) => {
      if (!/^([0-9]\d*)$/.test(value) && value !== '' && value !== null) {
        return Promise.reject(new Error('权重范围：0-999'))
      } else if (value > 999) {
        return Promise.reject(new Error('权重范围：0-999'))
      } else {
        return Promise.resolve()
      }
    }
    // 权重rule
    const levelRules = {
      level: [
        { required: true, message: '权重不能为空', trigger: ['blur', 'change'] },
        {
          validator: checkLevel,
          trigger: ['blur', 'change']
        }
      ]
    }
    const levelForm = reactive({
      level: null
    })
    watch(
      () => props.levelObj,
      Val => {
        levelForm.level = Val.level
        levelForm.id = Val.id
      },
      { immediate: true, deep: true }
    )
    const levelFormRef = ref(null)
    // 保存权重数据
    const cancelModel = () => {
      levelFormRef.value.resetFields()
      SetLevelVisible.value = false
      emit('update:setLevelVisible', false)
    }
    const handleOk = async () => {
      try {
        await levelFormRef.value.validateFields()
        confirmLoading.value = true
        await updateColumnLevel(levelForm)
        confirmLoading.value = false
        SetLevelVisible.value = false
        levelFormRef.value.resetFields()
        emit('update:setLevelVisible', SetLevelVisible.value)
        emit('freshData')
      } catch (errorInfo) {
        return false
      }
    }
    // 在页面加载后请求数据
    onMounted(() => {})

    return {
      levelFormRef,
      levelForm,
      cancelModel,
      props,
      confirmLoading,
      levelRules,
      handleOk,
      SetLevelVisible
    }
  }
})
</script>

<style></style>
