<template>
  <PlusTable
    headerTitle="短信记录"
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'operation'"
        ><a-button type="link" @click="handleDetail(record)">详情</a-button>
      </template>
    </template>
  </PlusTable>
  <a-modal v-model:visible="detailModal.visible" width="70%" title="短信详情">
    <a-row>
      <a-col :span="10">
        <div class="sms-detail-title">发送时间：</div>
        {{ $filters.dateFormat(detailModal.detailObj.sendTs) }}
      </a-col>
      <a-col :span="10">
        <div class="sms-detail-title">添加人：</div>
        {{ detailModal.detailObj.operator }}
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="22">
        <div class="sms-detail-title">短信内容：</div>
        {{ detailModal.detailObj.msg }}
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="22">
        <div class="sms-detail-title">接收对象：</div>
        共{{ detailModal.detailObj.mobileTotal }}个会员
      </a-col>
    </a-row>
    <PlusTable
      :columns="columns2"
      :data-source="detailModal.detailList"
      :scroll="{ x: 'max-content' }"
      :pagination="pagination2"
      :loading="loading2"
      @change="handleTableChange2"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'"
          ><a-button
            type="link"
            @click="
              $router.push({
                name: '会员详情',
                params: {
                  memberId: record.memberId
                }
              })
            "
            >详情</a-button
          >
        </template>
      </template>
    </PlusTable>
  </a-modal>
</template>

<script setup>
import { inject, ref, reactive } from 'vue'

import { useAntTable } from '@/use/useAntTable'
import { getSmsList, getSmsDetails } from '@/api/member/memberFee'

const dateFormat = inject('$filters')?.dateFormat

const detailModal = reactive({
  visible: false,
  detailList: [],
  detailObj: {}
})
const tableData = ref([])
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    align: 'center',
    width: 80,
    customRender: ({ index }) => `${index + 1}`
  },
  { title: '短信内容', dataIndex: 'msg' },
  {
    title: '发送时间',
    width: 200,
    dataIndex: 'sendTs',
    customRender: ({ record: { sendTs } }) => {
      return dateFormat(sendTs)
    }
  },
  { title: '添加人', dataIndex: 'operator', width: 200 },
  { title: '接收对象(人)', dataIndex: 'mobileTotal', width: 150 },
  { title: '操作', dataIndex: 'operation', fixed: 'right', width: 100 }
]

const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
  async fetchFn({ current, pageSize }) {
    const {
      data: { data }
    } = await getSmsList({
      pageSize,
      page: current
    })
    tableData.value = data.list || []
    return { total: data.totalRows || 0 }
  }
})

const columns2 = [
  { title: '用户名', dataIndex: 'uname' },
  {
    title: '会员姓名/联系人姓名',
    customRender: ({ record }) => {
      return record.type === 1 ? record.contactName : record.memberName
    }
  },
  {
    title: '手机号/联系人电话',
    width: 200,
    customRender: ({ record }) => {
      return record.type === 1 ? record.contactPhone : record.mobile
    }
  },
  { title: '职位', width: 120, dataIndex: 'postName' },
  {
    title: '状态',
    width: 150,
    customRender: ({ record: { smsStatus } }) => {
      if (smsStatus === 'DELIVRD') return '成功'
      else if (smsStatus === 'SUBBMITED') return '未明'
      else return smsStatus
    }
  },
  { title: '操作', dataIndex: 'operation', fixed: 'right', width: 100 }
]
const {
  fetchTableData: fetchTableData2,
  pagination: pagination2,
  handleTableChange: handleTableChange2,
  loading: loading2
} = useAntTable({
  async fetchFn({ current, pageSize }) {
    const {
      data: { data }
    } = await getSmsDetails({
      bid: detailModal.detailObj.bid,
      pageSize,
      page: current
    })
    detailModal.detailList = data.list || []
    return { total: data.totalRows || 0 }
  }
})
const handleDetail = row => {
  Object.assign(detailModal.detailObj, row)
  detailModal.visible = true
  fetchTableData2()
}
fetchTableData()
</script>
<style lang="scss" scoped>
:deep(.plus-table-body) {
  margin-top: 0;
}
.sms-detail-title {
  width: 100px;
  font-size: 15px;
  font-weight: 600;
  float: left;
  margin-bottom: 15px;
}
</style>
