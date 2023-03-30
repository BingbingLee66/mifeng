<template>
  <PlusTable
    rowKey="id"
    :columns="tableColumns"
    :data-source="tableData"
    :request="handlerSearch"
    :pagination="pagination"
    :loading="loading"
    header-title="会员图片直播"
    @change="handleTableChange"
    bordered
  >
    <template #toolBar>
      <a-button class="mr-5" :loading="downLoading" @click="onDownLoadSignin">导出模版</a-button>
      <a-button type="primary" @click="importVisible = true">导入</a-button>
    </template>
  </PlusTable>
  <SetLevel v-model:setLevelVisible="setLevelVisible" @freshData="fetchTableData()" :levelObj="levelObj" />
  <AModal v-model:visible="importVisible" title="导表" :footer="null">
    <a-upload-dragger
      v-model:fileList="upFileList"
      name="file"
      :multiple="true"
      :customRequest="uploadFile"
      @remove="handlerRemove"
    >
      <inbox-outlined :style="{ fontSize: 25 + 'px' }"></inbox-outlined>
      <div class="text-xl my-6">上传批量导入表</div>
    </a-upload-dragger>
    <div class="mt-6 flex justify-around">
      <a-button :loading="downLoading" @click="onDownLoadSignin"> 下载导入表 </a-button>
      <a-button type="primary" @click="onUploadSignin"> 确认导入 </a-button>
    </div>
  </AModal>
</template>

<script setup>
import { getIpCardList, getCardExcel, uploadSignin } from '@business/common/src/activity/api/activity-verify'
import { onMounted, ref, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useAntTable } from '@business/logics/src/useAntTable'
import SetLevel from './components/setLevel'
import { downloadFile } from '@business/common/src/utils'
import dayjs from 'dayjs'
const router = useRouter()
const query = reactive({
  activityId: null,
  namephone: ''
})
const { proxy } = getCurrentInstance()
const setLevelVisible = ref(false)
const importVisible = ref(false)
const levelObj = ref(null)
const tableData = ref([])
const useTableColumn = () => {
  const tableColumns = ref([
    {
      title: '用户信息',
      dataIndex: 'namephone',
      filter: true,
      valueType: 'text',
      formItemProps: {
        placeholder: '用户名称、手机号',
        allowClear: true
      },
      customRender: ({ record }) => {
        return (
          <div>
            {record.uavatar ? <img style="width:50px;height:50px" src={record.uavatar} alt="" /> : ''}
            <div>{record.userName}</div>
            <div>{record.phone}</div>
          </div>
        )
      }
    },
    { title: '所属商会', dataIndex: 'chamberName' },
    {
      title: '操作',
      width: 200,
      customRender: ({ record }) => {
        return (
          <div>
            <a-button type="link" onClick={() => updateWeight(record)}>
              {record.sort}
            </a-button>
          </div>
        )
      }
    }
  ])
  const updateWeight = record => {
    setLevelVisible.value = true
    levelObj.value = record
  }
  return { tableColumns }
}

const upFileList = ref([])
const uploadFile = e => {
  const isTrueFileType = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ].includes(e.file.type)
  if (isTrueFileType) {
    upFileList.value = [e.file]
  } else {
    proxy.$message.error('上传文件只能是 XLSX 或 XLS 格式!')
    upFileList.value = []
  }
}
const handlerRemove = () => {
  upFileList.value = []
}
const onUploadSignin = async () => {
  if (!upFileList.value.length) return proxy.$message.error('请选择上传文件')
  const formData = new FormData()
  formData.append('activityId', query.activityId)
  formData.append('file', upFileList.value[0])
  await uploadSignin(formData)
  importVisible.value = false
  fetchTableData()
}
const downLoading = ref(false)
const onDownLoadSignin = async () => {
  downLoading.value = true
  const now = dayjs().format('YYYY年-MM月-DD日')
  try {
    const blob = await getCardExcel(query.activityId)
    await downloadFile({
      url: window.URL.createObjectURL(blob),
      title: `${now}参与人与名片排序.xlsx`
    })
  } catch (error) {
    proxy.$message.error('下载失败')
  }

  downLoading.value = false
}

const fetchFn = async pageOption => {
  const conditionQuery = reactive({
    pageSize: pageOption.pageSize,
    page: pageOption.current,
    status: 1,
    namephone: query.namephone
  })
  const {
    data: { list, totalRows }
  } = await getIpCardList(query.activityId, conditionQuery)
  tableData.value = list
  return {
    total: totalRows
  }
}
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({ fetchFn })
const { tableColumns } = useTableColumn(query)
const handlerSearch = value => {
  query.namephone = value.namephone
  fetchTableData()
}
onMounted(() => {
  query.activityId = router.currentRoute.value.query.activityId || ''
  fetchTableData()
})
</script>

<style lang="scss" scoped></style>
