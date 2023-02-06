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
      <AFormItem label="权重" name="sort" has-feedback>
        <AInput autocomplete="off" allowClear v-model:value="levelForm.sort" />
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script>
import { defineComponent, ref, reactive, watch } from 'vue'
import { weightIpCardSort } from '@/api/activity/activity-verify-new'
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
    const checkLevel = (rule, value) => {
      if (!/^([0-9]\d*)$/.test(value) && value !== '' && value !== null) {
        return Promise.reject(new Error('权重范围：0-999'))
      } else if (value > 99999) {
        return Promise.reject(new Error('权重范围：0-999'))
      } else {
        return Promise.resolve()
      }
    }
    // 权重rule
    const levelRules = {
      sort: [
        { required: true, message: '权重不能为空', trigger: ['blur', 'change'] },
        {
          validator: checkLevel,
          trigger: ['blur', 'change']
        }
      ]
    }
    const levelForm = reactive({
      sort: null
    })
    watch(
      () => props.levelObj,
      Val => {
        if (Val) {
          levelForm.sort = Val.sort
          levelForm.activitySignValueId = Val.activitySignValueId
        }
      },
      { immediate: true, deep: true }
    )
    const levelFormRef = ref(null)
    // 保存权重数据
    const cancelModel = () => {
      levelFormRef.value.resetFields()
      emit('update:setLevelVisible', false)
    }
    const handleOk = async () => {
      try {
        await levelFormRef.value.validateFields()
        confirmLoading.value = true
        await weightIpCardSort(levelForm)
        confirmLoading.value = false
        levelFormRef.value.resetFields()
        emit('update:setLevelVisible', false)
        emit('freshData')
      } catch (errorInfo) {
        return false
      }
    }
    return {
      levelFormRef,
      levelForm,
      cancelModel,
      props,
      confirmLoading,
      levelRules,
      handleOk
    }
  }
})
</script>

<style></style>
