<template>
  <a-modal title="数据导入" :visible="importVisible" width="500px" @cancel="onClose" :footer="null">
    <div>
      <div>导入说明</div>
      <div>1、请勿增加、删除、修改表格中的字段</div>
      <div>2、其他字段多次导入数据会进行覆盖</div>
    </div>
    <div v-if="execelDate" style="mt-4">
      <a-upload
        name="file"
        :before-upload="beforeUploadFile"
        :show-upload-list="false"
        action="/"
        :customRequest="uploadCustomRequest"
      >
        <span>导入文件：</span>
        <a-button><upload-outlined></upload-outlined>点击上传</a-button>
        <div>支持扩展名：xsl、xslx</div>
      </a-upload>
    </div>
    <div v-if="execelDate.state" class="tableTitle" />
    <div v-if="execelDate.state === 1">
      <div>
        导入结果：导入成功 <span style="color: red">{{ execelDate.data.successCount }}</span> 条记录,导入失败
        <span style="color: red">{{ execelDate.data.failureCount }}</span> 条记录
      </div>
      <div>导入失败详情：</div>
      <a-table
        :pagination="false"
        :dataSource="execelDate.data.failureReasonList"
        :columns="columns"
        border
        style="width: 100%"
      >
        <!-- <a-table-column prop="row" label="行标(表头不算在内)" /> -->
        <!-- <a-table-column prop="reason" label="失败原因" /> -->
      </a-table>
    </div>
    <div v-else style="margin-left: 50px">
      <div>{{ execelDate.msg }}</div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import { uploadOrganizationsData } from '@/api/chamber/directoryOrganizations'
import { message } from 'ant-design-vue'
defineProps({
  importVisible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['closeImportDialog'])
const onClose = () => {
  emit('closeImportDialog')
}
const execelDate = ref({})
const beforeUploadFile = file => {
  if (
    !['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(
      file.type
    )
  ) {
    message.error('上传文件只能是 XLSX 或 XLS 格式!')
    return false
  }
}
const uploadCustomRequest = async e => {
  console.log(e, 'eeee')
  const formData = new FormData()
  formData.append('file', e.file)
  const res = await uploadOrganizationsData(formData)
  execelDate.value = res
}
const columns = [
  {
    title: '行标（表头不算在内）',
    dataIndex: 'row',
    key: 'row'
  },
  {
    title: '失败原因',
    dataIndex: 'reason',
    key: 'reason'
  }
]
</script>

<style scoped>
.tableTitle {
  height: 30px;
  border-bottom: 2px solid gray;
}
</style>
