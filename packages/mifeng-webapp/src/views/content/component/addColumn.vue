<template>
  <div>
    <AModal
      v-model:visible="props.addColumnVisible"
      :confirm-loading="confirmLoading"
      title="添加/编辑栏目"
      @ok="handleOk"
      @cancel="cancelModel"
    >
      <AForm
        ref="formRef"
        :model="formObj"
        :rules="rules"
        label-position="right"
        label-width="100px"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
        autocomplete="off"
      >
        <AFormItem label="栏目名称：" name="columnName" has-feedback>
          <AInput
            autocomplete="off"
            allowClear
            v-model:value="formObj.columnName"
            :maxlength="5"
            placeholder="限5个字符内"
          />
        </AFormItem>
        <AFormItem label="权重：" name="level" has-feedback>
          <AInput autocomplete="off" allowClear v-model:value="formObj.level" placeholder="请输入大于零的数" />
        </AFormItem>
      </AForm>
    </AModal>
  </div>
</template>

<script>
import { save } from '@/api/content/columnsetup'
import { defineComponent, ref, reactive, inject, watch } from 'vue'

export default defineComponent({
  props: {
    addColumnVisible: {
      type: Boolean,
      default: false
    },
    editObj: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['update:addColumnVisible', 'freshData'],
  setup(props, { emit }) {
    const confirmLoading = ref(false)
    const AddColumnVisible = ref(props.addColumnVisible)
    const checkNumber = (rule, value) => {
      if (!/^([0-9]\d*)$/.test(value) && value !== '' && value !== null) {
        return Promise.reject(new Error('权重范围：0-999'))
      } else if (value > 999) {
        return Promise.reject(new Error('权重范围：0-999'))
      } else {
        return Promise.resolve()
      }
    }
    const ckey = inject('ckey')
    const formRef = ref(null)
    const formObj = reactive({
      columnName: null,
      level: null,
      id: null,
      ckey: ckey.value,
      contentModuleId: '3'
    })
    const rules = {
      columnName: [{ required: true, message: '请输入栏目名称', trigger: ['blur', 'change'] }],
      level: [
        { required: true, message: '请输入权重', trigger: ['blur', 'change'] },
        { validator: checkNumber, trigger: ['blur', 'change'] }
      ]
    }
    watch(
      () => props.addColumnVisible,
      Val => {
        if (Val) {
          // 是否编辑
          if (props.editObj?.isEdit) {
            formObj.id = props.editObj.id
          } else {
            formObj.id = null
          }
          formObj.columnName = props.editObj?.columnName
          formObj.level = props.editObj?.level
          formObj.ckey = props.editObj?.ckey || ckey.value
          formObj.contentModuleId = props.editObj?.activeName || '3'
        }
      },
      { immediate: true, deep: true }
    )
    const cancelModel = () => {
      formRef.value.resetFields()
      AddColumnVisible.value = false
      emit('update:addColumnVisible', AddColumnVisible.value)
    }
    const handleOk = async () => {
      try {
        await formRef.value.validateFields()
        formObj.columnName = formObj.columnName.replace(/\s*/g, '')
        confirmLoading.value = true
        await save(formObj)
        confirmLoading.value = false
        AddColumnVisible.value = false
        formRef.value.resetFields()
        emit('update:addColumnVisible', AddColumnVisible.value)
        emit('freshData')
      } catch (errorInfo) {
        return false
      }
    }
    return {
      checkNumber,
      cancelModel,
      handleOk,
      formRef,
      confirmLoading,
      props,
      formObj,
      rules
    }
  }
})
</script>

<style></style>
