<template>
  <PlusTable
    rowKey="id"
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    bordered
    :pagination="{ hideOnSinglePage: true }"
  />
  <AModal v-model:visible="emitLogoVisible" title="商会LOGO编辑" @ok="handleOk" @cancel="cancelModel">
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
      <AFormItem label="上传图片：" name="systemLogo">
        <ImageUpLoad
          v-model:url="formObj.systemLogo"
          :pattern="new RegExp(/\.(?:png|jpg)$/i)"
          :limit="1"
          class="image-size upload-image"
        />
        <div class="tips">支持格式：png、jpg</div>
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from 'vue'
import { useAntTable } from '@/use/useAntTable/index'
import ImageUpLoad from '@/components/upload/image-uploader'
import { getList, updateLogo } from '@/api/system/property'
const columns = [
  {
    title: '商会logo',
    customRender: ({ record }) => {
      return (
        <div>
          <img style="width: 120px; height: 120px;" src={record.systemLogo} />
        </div>
      )
    }
  },
  {
    title: '操作时间',
    dataIndex: 'updatedTs'
  },
  {
    title: '操作人',
    dataIndex: 'operator'
  },
  {
    title: '操作',
    customRender: ({ record }) => {
      return (
        <div v-action="编辑">
          <a-button
            type="link"
            onClick={() => {
              formObj.systemLogo = record.systemLogo
              emitLogoVisible.value = true
            }}
          >
            编辑
          </a-button>
        </div>
      )
    }
  }
]
const rules = {
  systemLogo: [{ required: true, message: '商会Logo必须上传', trigger: 'blur' }]
}
const ckey = inject('ckey')
const dataSource = ref([])
const formObj = reactive({
  systemLogo: ''
})
const emitLogoVisible = ref(false)
onMounted(async () => {
  await fetchTableData()
})
const fetchFn = async pageOption => {
  const conditionQuery = reactive({
    pageSize: pageOption.pageSize,
    page: pageOption.current,
    ckey
  })
  const {
    data: { data }
  } = await getList(conditionQuery)
  dataSource.value = data
  return {
    total: 0
  }
}
const { fetchTableData, loading } = useAntTable({ fetchFn })
const formRef = ref()
const cancelModel = () => {
  formRef.value.resetFields()
  emitLogoVisible.value = false
}
const handleOk = async () => {
  try {
    await formRef.value.validateFields()
    const params = reactive({
      ckey,
      logoUrl: formObj.systemLogo
    })
    await updateLogo(params)
    emitLogoVisible.value = false
    fetchTableData()
    formRef.value.resetFields()
  } catch (errorInfo) {
    console.error(errorInfo)
  }
}
</script>

<style lang="scss" scoped>
::v-global(.upload-image .ant-upload-picture-card-wrapper),
::v-global(.upload-image .ant-upload),
::v-global(.upload-image .ant-upload-list),
::v-global(.upload-image .ant-upload-list-item),
::v-global(.upload-image .ant-upload-list-item-image),
::v-global(.upload-image .ant-upload-list-picture-card-container) {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  object-fit: fill !important;
}
.image-size {
  width: 180px;
  height: 180px;
}
.tips {
  margin-top: 20px;
}
</style>
