<template>
  <a-modal title="数据导入" :visible="addVisible" width="500px" @cancel="onClose" :footer="null">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
    >
      <a-form-item label="社会组织名称" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="会长姓名" name="president">
        <a-input v-model:value="formState.president" />
      </a-form-item>
      <a-form-item label="统一社会信用代码" name="socialCode">
        <a-input v-model:value="formState.socialCode" />
      </a-form-item>
      <a-form-item label="地区" name="citys">
        <a-cascader v-model:value="formState.citys" :options="areaOptions" placeholder="请选择地区" />
      </a-form-item>
      <a-form-item label="办公地址" name="address">
        <a-input v-model:value="formState.address" />
      </a-form-item>
      <a-form-item label="成立时间" name="establishTime">
        <a-date-picker v-model:value="formState.establishTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" htmlType="submit">确定</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { reactive, ref } from 'vue'
const formRef = ref()
defineProps({
  addVisible: {
    type: Boolean,
    default: false
  },
  areaOptions: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['closeOrgDialog', 'submitOrg'])
const resetForm = () => {
  formRef.value.resetFields()
}
const formState = reactive({
  name: '',
  president: '',
  socialCode: '',
  citys: [],
  province: '',
  address: '',
  establishTime: ''
})
const rules = reactive({
  name: [{ required: true, message: '社会组织名称不能为空', trigger: 'blur' }],
  president: [{ required: true, message: '会长名称不能为空', trigger: 'blur' }],
  socialCode: [{ required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }],
  citys: [{ required: true, message: '地区不为空', trigger: 'blur' }],
  address: [{ required: true, message: '办公地址不能为空', trigger: 'blur' }],
  establishTime: [{ required: true, message: '成立时间不能为空', trigger: 'blur' }]
})
const onClose = () => {
  emit('closeOrgDialog')
  resetForm()
}
const onFinish = () => {
  const params = {
    ...formState,
    province: formState.citys[0] || '',
    city: formState.citys[1] || '',
    establishTime: +new Date(formState.establishTime)
  }
  delete params.citys
  emit('submitOrg', params)
}
defineExpose({
  resetForm
})
</script>

<style scoped></style>
