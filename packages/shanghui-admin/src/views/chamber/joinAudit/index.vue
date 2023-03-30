<template>
  <PlusTable
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :request="handlerSearch"
    :data-source="list"
    @change="handleTableChange"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'action'">
        <a-button v-if="record.auditStatus != 0" type="link" @click="showDetail(record)"> 详情 </a-button>
        <a-button v-if="record.auditStatus == 0" type="link" @click="adoptDetailDialog(record)"> 通过 </a-button>
        <a-button v-if="record.auditStatus == 0" type="link" @click="rejectDetailDialog(record)" danger>
          驳回
        </a-button>
      </template>
    </template>
  </PlusTable>
  <adpotModal
    :adoptVisible="adoptVisible"
    :adoptDetail="adoptDetail"
    @closeAdoptModal="closeAdoptModal"
    @submitAdopt="submitAdopt"
  ></adpotModal>
  <rejectModal
    :adoptDetail="adoptDetail"
    :rejectVisible="rejectVisible"
    @closeRejectModal="closeRejectModal"
    @submitReject="submitReject"
  ></rejectModal>
  <detailModal :adoptDetail="adoptDetail" :detailVisible="detailVisible" @closeDetailModal="closeDetailModal">
  </detailModal>
</template>

<script setup>
import PlusTable from '@business/components/src/plus-table/PlusTable'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { getJoinList, updateAudit } from '@/api/chamber/manager'
import { reactive, ref } from 'vue'
import { Modal } from 'ant-design-vue'
import { statusList, STATUS_LIST_MAP, statusSource, STATUS_SOURCE_MAP } from '@/constant/chamber'
import adpotModal from './adopt-modal.vue'
import rejectModal from './reject-modal.vue'
import detailModal from './detail-modal.vue'
const columns = reactive([
  { title: '序号', customRender: ({ index }) => index + 1, width: 80 },
  {
    title: '商/协会名称',
    dataIndex: 'name',
    filter: false,
    hideInTable: false,
    valueType: 'text',
    width: 200
  },
  {
    title: '商/协会logo',
    dataIndex: 'systemLogo',
    customRender: ({ record }) => (
      <img style="width: 70px; height: 70px; border-radius:50%; object-fit: cover" src={record.systemLogo} />
    )
  },
  {
    title: '联系人姓名',
    dataIndex: 'president',
    filter: false,
    hideInTable: false,
    valueType: 'text'
  },
  {
    title: '联系人手机号',
    dataIndex: 'phone',
    filter: false,
    hideInTable: false,
    valueType: 'text'
  },
  {
    title: '办公地址',
    dataIndex: 'address',
    filter: false,
    hideInTable: false,
    valueType: 'text',
    width: 200
  },
  {
    title: '社会团体法人登记证',
    dataIndex: 'license',
    customRender: ({ record }) => (
      <a href={record.license} target="_blank">
        <img style="width: 80px; height: 35px;" src={record.license} />
      </a>
    )
  },
  {
    title: '推荐人',
    dataIndex: 'referrer',
    filter: false,
    hideInTable: false,
    valueType: 'text'
  },
  {
    title: '申请人ID',
    dataIndex: 'userId',
    filter: false,
    hideInTable: false,
    valueType: 'text'
  },
  {
    title: '申请时间',
    dataIndex: 'createdTs',
    filter: false,
    hideInTable: false,
    valueType: 'text'
  },

  {
    title: '入驻来源',
    dataIndex: 'settledSource',
    filter: false,
    hideInTable: false,
    valueType: 'select',
    customRender: ({ record }) => {
      return STATUS_SOURCE_MAP.get(record.settledSource)
    }
  },
  {
    title: '状态',
    dataIndex: 'auditStatus',
    filter: true,
    hideInTable: false,
    valueType: 'select',
    initialValue: 0,
    formItemProps: {
      options: statusList,
      fieldNames: { label: 'name', value: 'id' }
    },
    customRender: ({ record }) => {
      return STATUS_LIST_MAP.get(record.auditStatus)
    }
  },
  {
    title: '申请来源',
    dataIndex: 'settledSource',
    filter: true,
    hideInTable: true,
    valueType: 'select',
    initialValue: '',
    formItemProps: {
      options: statusSource,
      fieldNames: { label: 'name', value: 'id' }
    }
  },
  { title: '操作', dataIndex: 'action', fixed: 'right' }
])
const list = ref([])
const tableFilter = reactive({ auditStatus: 0, settledSource: '' })
const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
  async fetchFn({ current: page, pageSize }) {
    const params = {
      page,
      pageSize,
      ...tableFilter
    }
    const { data } = await getJoinList(params)
    list.value = data.data.list || []
    return { total: data.data.totalRows || 0 }
  }
})
fetchTableData()
const handlerSearch = value => {
  Object.assign(tableFilter, value)
  fetchTableData({ current: 1 })
}
// 通过dialogs
const adoptVisible = ref(false)
const adoptDetail = ref({})
const closeAdoptModal = () => {
  adoptVisible.value = false
}
const adoptDetailDialog = value => {
  adoptDetail.value = value
  adoptVisible.value = true
}
const submitAdopt = async value => {
  const params = {
    chamberId: adoptDetail.value.id,
    password: value.pass,
    level: adoptDetail.value.level,
    auditStatus: 1
  }
  const res = await updateAudit(params)
  if (res.state === 1) adoptVisible.value = false
  fetchTableData()
}
// 驳回
const rejectVisible = ref(false)
const rejectDetailDialog = value => {
  rejectVisible.value = true
  adoptDetail.value = value
}
const closeRejectModal = () => {
  rejectVisible.value = false
}
const submitReject = value => {
  Modal.confirm({
    content: '确定驳回？',
    onOk() {
      const params = {
        chamberId: adoptDetail.value.id,
        rejectRemark: value.value,
        level: adoptDetail.value.level,
        auditStatus: 2
      }
      updateAudit(params).then(() => {
        rejectVisible.value = false
        fetchTableData()
      })
    },
    cancelText: '取消',
    onCancel() {
      Modal.destroyAll()
      rejectVisible.value = false
    }
  })
}
// 查看详情
const detailVisible = ref(false)
const showDetail = value => {
  adoptDetail.value = value
  detailVisible.value = true
}
const closeDetailModal = () => {
  detailVisible.value = false
}
</script>

<style scoped></style>
