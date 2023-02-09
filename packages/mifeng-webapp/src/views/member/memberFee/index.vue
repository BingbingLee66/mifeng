<template>
  <PlusTable
    headerTitle="会费缴纳记录"
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    row-key="phone"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :request="handlerSearch"
    :search="{ hiddenNum: 4 }"
  >
    <template #searchToolBar="{ form }">
      <a-button v-action="'查询'" type="primary" html-type="submit">查询</a-button>
      <a-button style="margin: 0 8px" @click="() => form.resetFields()">重置</a-button>
    </template>
    <template #toolBar
      ><a-button v-action="'添加缴费'" type="primary" @click="handleAdd"><plus-outlined />添加缴费</a-button>
    </template>
  </PlusTable>

  <a-modal v-model:visible="addModal.visible" width="100%" title="添加缴费" :footer="null">
    <PlusTable
      headerTitle="会员列表"
      class="p0"
      :row-selection="rowSelectionAdd"
      :columns="columnsAdd"
      :data-source="tableDataAdd"
      :scroll="{ x: 'max-content' }"
      row-key="id"
      :pagination="paginationAdd"
      :loading="loadingAdd"
      @change="handleTableChangeAdd"
      :search="{ hiddenNum: 4 }"
      :request="handlerSearchAdd"
    >
    </PlusTable>
    <a-form
      ref="formRef"
      class="mt20"
      :model="addModal.formState"
      name="basic"
      :label-col="{ span: 3 }"
      autocomplete="off"
      @finish="addMemberFee"
    >
      <a-form-item
        name="date"
        label="缴费时间"
        :rules="[{ required: true, message: '缴费时间不能为空', trigger: 'blur' }]"
      >
        <a-date-picker v-model:value="addModal.formState.date" showTime />
      </a-form-item>
      <a-form-item
        name="years"
        label="缴费年限"
        :rules="[{ required: true, message: '缴费年限不能为空', trigger: 'blur' }]"
        ><a-select
          v-model:value="addModal.formState.years"
          style="width: 250px"
          placeholder="请选择缴费年限"
          :options="MEMBER_YEARS_LIST"
        />
      </a-form-item>
      <a-form-item name="mamberFee" label="缴费金额">{{ addModal.memberFee * addModal.formState.years }} </a-form-item>
      <a-form-item :wrapper-col="{ offset: 10 }">
        <a-button :loading="addModal.submitLoading" type="primary" html-type="submit">确定</a-button>
        <a-button class="ml20" @click="addModal.visible = false">取消</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { MEMBER_YEARS_LIST } from '../constant.js'
import { inject, ref, reactive, watch } from 'vue'
import { Message, Modal } from 'ant-design-vue'
import { useAntTable } from '@/use/useAntTable'
import { useRowSelection } from '@/use'
import { getMemberFeeList, getMemberList, memberFeePay } from '@/api/member/memberFee'
import { getList } from '@/api/member/post'
import dayjs from 'dayjs'

const ckey = inject('ckey')
const dateFormat = inject('$filters')?.dateFormat
const tableFilter = reactive({
  uname: '',
  memberName: '',
  phone: '',
  date: null
})
const tableData = ref([])
const columns = [
  { title: 'ID', dataIndex: 'id', width: 100 },
  { title: '用户名', dataIndex: 'uname', filter: true, initialValue: '', valueType: 'text', span: 8 },
  {
    title: '会员/联系人姓名',
    dataIndex: 'memberName',
    filter: true,
    valueType: 'text',
    initialValue: '',
    span: 8,
    width: 140
  },
  {
    title: '手机号/联系人电话',
    dataIndex: 'phone',
    filter: true,
    initialValue: '',
    valueType: 'text',
    span: 8,
    width: 150
  },
  {
    title: '时间',
    dataIndex: 'date',
    filter: true,
    valueType: 'dateTimeRange',
    initialValue: null,
    hideInTable: true,
    span: 12,
    formItemProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      showTime: false
    }
  },
  { title: '会内职位', dataIndex: 'memberPostName' },
  {
    title: '缴费时间',
    dataIndex: 'payTs',
    customRender: ({ record: { payTs } }) => {
      return dateFormat(payTs)
    }
  },
  { title: '缴费金额', dataIndex: 'feeAmount', width: 100 },
  {
    title: '支付方式',
    dataIndex: 'type',
    width: 100,
    customRender: ({ record: { type } }) => {
      return +type === 0 ? '后台添加' : '小程序'
    }
  }
]

const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
  async fetchFn({ current, pageSize }) {
    const params = { ...tableFilter }
    delete params.date
    if (tableFilter.date) [params.startTime, params.endTime] = [tableFilter.date[0], tableFilter.date[1]]
    const {
      data: { data }
    } = await getMemberFeeList({
      ...params,
      pageSize,
      page: current
    })
    tableData.value = data.list || []
    return { total: data.totalRows || 0 }
  }
})

const handlerSearch = value => {
  Object.assign(tableFilter, value)
  fetchTableData(true)
}

const addModal = reactive({
  visible: false,
  formState: {
    years: 1
  },
  memberFee: 0,
  postName: '--',
  submitLoading: false
})

const tableFilterAdd = reactive({
  uname: '',
  memberName: '',
  phone: '',
  memberPostId: null
})
const tableDataAdd = ref([])
const rowSelectionAdd = useRowSelection()
const memberPostOptions = reactive([])
const columnsAdd = [
  { title: '用户名', dataIndex: 'uname', filter: true, initialValue: '', valueType: 'text', span: 12 },
  {
    title: '职位',
    dataIndex: 'memberPostId',
    filter: true,
    valueType: 'select',
    hideInTable: true,
    initialValue: null,
    span: 12,
    formItemProps: {
      options: memberPostOptions
    }
  },
  {
    title: '会员/联系人姓名',
    dataIndex: 'memberName',
    filter: true,
    valueType: 'text',
    initialValue: '',
    span: 12,
    customRender: ({ record }) => {
      return +record.type === 0 ? record.name : record.contactName
    },
    width: 140
  },
  {
    title: '手机号/联系人电话',
    dataIndex: 'phone',
    filter: true,
    initialValue: '',
    valueType: 'text',
    span: 12,
    customRender: ({ record }) => {
      return +record.type === 0 ? record.phone : record.contactPhone
    }
  },
  {
    title: '会内职位',
    dataIndex: 'postName',
    customRender: () => {
      return addModal.postName
    }
  }
]
const {
  fetchTableData: fetchTableDataAdd,
  pagination: paginationAdd,
  handleTableChange: handleTableChangeAdd,
  loading: loadingAdd
} = useAntTable({
  async fetchFn({ current, pageSize }) {
    const {
      data: { data }
    } = await getMemberList({
      ...tableFilterAdd,
      pageSize,
      page: current
    })
    rowSelectionAdd.selectedRowKeys = []
    tableDataAdd.value = data.list || []
    return { total: data.totalRows || 0 }
  }
})
const handlerSearchAdd = value => {
  Object.assign(tableFilterAdd, value)
  fetchTableDataAdd(true)
}
const getMemberType = async () => {
  const {
    data: { data }
  } = await getList({ ckey: ckey.value })
  memberPostOptions.splice(0, memberPostOptions.length) // 清空数组
  data.forEach(item => {
    item.value = item.id
    item.label = item.postName
  })
  if (!data.length) return
  memberPostOptions.push(...data)
  tableFilterAdd.memberPostId = data[0].id
  columnsAdd[1].initialValue = data[0].id
}
const handleAdd = async () => {
  loadingAdd.value = true
  try {
    await getMemberType()
    fetchTableDataAdd()
    addModal.visible = true
  } catch (error) {
    Message.error('获取失败，请重试')
  }
  loadingAdd.value = false
}
const addMemberFee = async () => {
  if (!rowSelectionAdd.selectedRowKeys.length) {
    Message.error('请先选择会员')
  }
  addModal.submitLoading = true
  const dto = []
  rowSelectionAdd.selectedRowKeys.forEach(id => {
    const data = tableDataAdd.value.find(item => item.id === id)
    dto.push({
      uname: data.uname,
      chamberName: data.chamberName,
      memberId: data.id,
      memberName: data.type === 0 ? data.name : data.contactName,
      memberPostId: tableFilterAdd.memberPostId,
      memberPostName: addModal.postName,
      phone: data.type === 0 ? data.phone : data.contactPhone,
      wxUserId: data.auditorId
    })
  })
  const param = {
    date: dayjs(addModal.formState.date).valueOf(),
    years: addModal.formState.years,
    memberFee: addModal.memberFee * addModal.formState.years,
    dto
  }
  const { data } = await memberFeePay(param)
  const memberNameResp = data.memberName
  if (memberNameResp.length) {
    Modal.warning({
      title: '以下会员的缴费记录添加失败',
      content: memberNameResp
    })
  }
  fetchTableData()
  addModal.submitLoading = false
  addModal.visible = false
}
watch(
  () => tableFilterAdd.memberPostId,
  newV => {
    const data = memberPostOptions.find(item => item.id === newV)
    addModal.memberFee = data.memberFee
    addModal.postName = data.postName
  }
)
fetchTableData()
</script>
