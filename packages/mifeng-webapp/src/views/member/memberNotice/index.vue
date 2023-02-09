<template>
  <PlusTable
    headerTitle="会员缴费通知"
    :row-selection="rowSelection"
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    row-key="phone"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :request="handlerSearch"
  >
    <template #searchToolBar="{ form }">
      <a-button v-action="'查询'" type="primary" html-type="submit">查询</a-button>
      <a-button style="margin: 0 8px" @click="() => form.resetFields()">重置</a-button>
    </template>
    <template #toolBar>
      <a-button v-action="'发短信'" class="ml20" type="primary" @click="openSmsVisible">发短信</a-button>
      <a-button class="ml20" type="primary" @click="$router.push({ name: '短信记录' })"> 短信记录</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'demandId'">
        <div style="color: red">{{ record.demandId }}</div>
        <div class="ell2">{{ record.title }}</div>
      </template>
    </template>
  </PlusTable>
  <a-modal v-model:visible="smsModal.visible" width="60%" title="群发短信" :footer="null">
    <a-form
      ref="formRef"
      :model="smsModal"
      :label-col="{ span: 3 }"
      :wrapperCol="{ span: 20, offset: 1 }"
      autocomplete="off"
      @finish="handleSend"
    >
      <AFormItem label="发送对象"> 共{{ rowSelection.selectedRowKeys.length }}个会员 </AFormItem>
      <AFormItem
        label="短信内容"
        name="msg"
        :rules="[
          { required: true, message: '短信内容不能为空', trigger: 'blur' },
          { max: 200, message: '短信内容最多200个字', trigger: 'change' }
        ]"
        ><a-textarea v-model:value="smsModal.msg" style="width: 80%" :rows="8" :disabled="true"
      /></AFormItem>
      <AFormItem :wrapperCol="{ offset: 10 }">
        <a-button size="large" class="mr20" :loading="smsModal.submitLoading" type="primary" html-type="submit"
          >确定</a-button
        >
        <a-button size="large" @click="smsModal.visible = false">取消</a-button>
      </AFormItem>
    </a-form>
  </a-modal>
</template>
<script setup>
import { inject, ref, reactive, onUnmounted } from 'vue'
import { Message } from 'ant-design-vue'
import { useAntTable } from '@/use/useAntTable'
import { useRowSelection } from '@/use'
import { MEMBER_TYPE_LIST } from '../constant'
import { getMemberFeeNoticeList, sendSms } from '@/api/member/memberFee'
import { getMemberOptions } from '@/api/member/post'
import { getSetting } from '@/api/system/setting'
import { watchActionRequestEffect } from '@/utils/permission'

const ckey = inject('ckey')
const dateFormat = inject('$filters')?.dateFormat
const tableFilter = reactive({
  uname: '',
  memberName: '',
  phone: '',
  type: -1,
  memberPostId: -1
})
const rowSelection = useRowSelection()
const tableData = ref([])
const memberPostOptions = reactive([])
const columns = [
  { title: '用户名', dataIndex: 'uname', filter: true, valueType: 'text', span: 7 },
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
    width: 160
  },
  {
    title: '职位',
    dataIndex: 'memberPostId',
    filter: true,
    hideInTable: true,
    valueType: 'select',
    initialValue: -1,
    formItemProps: {
      options: memberPostOptions
    }
  },
  {
    title: '缴费状态',
    dataIndex: 'type',
    filter: true,
    hideInTable: true,
    valueType: 'select',
    initialValue: -1,
    formItemProps: {
      options: MEMBER_TYPE_LIST
    }
  },
  { title: '职位', dataIndex: 'memberPostName' },

  {
    title: '最近缴费时间',
    dataIndex: 'payTs',
    customRender: ({ record: { payTs } }) => {
      return dateFormat(payTs)
    }
  },

  {
    title: '缴费状态',
    dataIndex: 'activeTs',
    customRender: ({ record: { activeTs } }) => {
      return (
        <div>
          <a-badge status={+activeTs - new Date() > 0 ? 'success' : 'error'} />
          {+activeTs - new Date() > 0 ? '已缴会费' : '未缴会费'}
        </div>
      )
    }
  }
]

const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
  async fetchFn({ current, pageSize }) {
    rowSelection.onChange([]) // 拉取表格数据之前清空选中
    const {
      data: { data }
    } = await getMemberFeeNoticeList({
      ...tableFilter,
      pageSize,
      page: current
    })
    tableData.value = data.list || []
    return { total: data.totalRows || 0 }
  }
})
const getMemberPost = async () => {
  try {
    const { data } = await getMemberOptions({ ckey: ckey.value })
    memberPostOptions.splice(0, memberPostOptions.length)
    memberPostOptions.push(...data.data)
    memberPostOptions.unshift({ label: '全部', value: -1 })
  } catch (error) {
    Message.error('获取职位列表失败')
  }
}

const handlerSearch = value => {
  Object.assign(tableFilter, value)
  fetchTableData(1)
}

const smsModal = reactive({
  visible: false,
  msg: '',
  submitLoading: false
})
const openSmsVisible = () => {
  if (rowSelection.selectedRowKeys.length === 0) {
    Message.error('请先选择相应的会员')
    return
  }
  smsModal.visible = true
}
const getMemberFeeMsg = async () => {
  const params = {
    key: 'memberFeeMsg'
  }
  const { data } = await getSetting(params)
  smsModal.msg = data.value
}
const handleSend = async () => {
  smsModal.submitLoading = true
  const param = {
    mobiles: rowSelection.selectedRowKeys.join(','),
    msg: smsModal.msg,
    type: 0, // 立即发送
    sendTs: null
  }
  await sendSms(param)
  rowSelection.selectedRowKeys = []
  smsModal.visible = false
  smsModal.submitLoading = false
}
const stopWatcher = watchActionRequestEffect('查询', () => {
  fetchTableData()
})
onUnmounted(() => {
  stopWatcher()
})

getMemberPost()
getMemberFeeMsg()
</script>
