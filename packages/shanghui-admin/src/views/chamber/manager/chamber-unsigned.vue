<template>
  <PlusTable
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :request="handlerSearch"
    :data-source="list"
    @change="handleTableChange"
  >
    <template #toolBar>
      <a-button type="primary" class="mr-2" @click="openQrCodeModal">生成邀请码</a-button>
      <a-button type="primary" @click="exportExcelCode(2)">导出表格</a-button>
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'weight'">
        <span class="blue-label" @click="openInputModal({ defaultValue: record.weight, payload: record })">
          {{ record.weight }}
        </span>
      </template>
      <template v-if="column.dataIndex === 'status'">
        <span v-if="record.status === 1">正常</span>
        <a-tooltip v-else>
          <template #title> {{ record.freezeReason }} </template>
          已冻结<question-circle-outlined />
        </a-tooltip>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="btn">
          <a-button type="link" @click="remarksPeople(record)"> 备注负责人 </a-button>
          <a-button type="link" @click="openMarkSignModal(record)"> 标记已签约</a-button>
          <a-button type="link" @click="openExtendedModal(record)"> 延长试用</a-button>
          <a-button type="link" @click="unfreezeAccount(record)"> 解冻</a-button>
        </div>
      </template>
    </template>
  </PlusTable>
  <InputModal
    v-model:visible="visible"
    title="编辑权重"
    label="权重"
    :defaultValue="defaultValue"
    :confirmLoading="confirmLoading"
    :rules="inputModalRules"
    @ok="handleOk"
  >
    <template v-slot:desc>
      <div>权重值范围为0-999</div>
      <div>权重值为0时，商会不在小程序端显示</div>
      <div>权重值越大的商会，在小程序那边的显示会越靠前</div>
      <div>权重值越大的商会，在小程序社会组织名录列表会越靠前</div>
    </template>
  </InputModal>
  <remarkChamber
    :businessArr="businessArr"
    :operatingArr="operatingArr"
    :remarkVisible="remarkVisible"
    :chamberName="remarkObj.chamberName"
    @closeremark="closeremark"
    @submitRemark="submitRemark"
  ></remarkChamber>
  <createQrcode :qr-visible="qrVisible" @submitQrcode="submitQrcode" @closeQrCodeModal="closeQrCodeModal">
  </createQrcode>
  <extendedUse
    :extendedVisible="extendedVisible"
    :extendedObj="recordObj"
    @submitExtended="submitExtended"
    @closeExtendedModal="closeExtendedModal"
  ></extendedUse>
  <markSigned
    :markSignedVisible="markSignedVisible"
    :markObj="markObj"
    @closeMarkSignModal="closeMarkSignModal"
    @submitMarkSigned="submitMarkSigned"
  ></markSigned>
</template>

<script setup>
import { reactive, defineAsyncComponent, ref, createVNode } from 'vue'
import PlusTable from '@business/components/src/plus-table/PlusTable'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import {
  unsignedData,
  businessList,
  operatingLlist,
  updateDirector,
  updateChamberLevel,
  exportUnSigned,
  registerCodeDownload,
  chamberStatusUpdate,
  addTryTime,
  chamberSign
} from '@/api/chamber/manager'
import { useInputModal } from '@business/components/src/input-modal/hook'
import { downloadFile } from '@business/common/src/utils'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { CHAMBER_FREEZE_OPTION, PROBATION_STATUS_OPTIONS } from '@/constant/chamber'
const InputModal = defineAsyncComponent(() => import('@business/components/src/input-modal'))
const remarkChamber = defineAsyncComponent(() => import('./components/remark-chamber.vue'))
const createQrcode = defineAsyncComponent(() => import('./components/create-qrcode.vue'))
const extendedUse = defineAsyncComponent(() => import('./components/extended-use.vue'))
const markSigned = defineAsyncComponent(() => import('./components/mark-signed.vue'))
// 商务负责人
const businessArr = ref([])
// 运营负责人
const operatingArr = ref([])
const useList = async () => {
  const fetchDataFunc = async () => {
    const {
      data: { business }
    } = await businessList()
    const {
      data: { operating }
    } = await operatingLlist()
    businessArr.value = business.map(item => {
      return {
        label: item,
        value: item
      }
    })
    operatingArr.value = operating.map(item => {
      return {
        label: item,
        value: item
      }
    })
  }
  await fetchDataFunc()
}
useList()
const { openInputModal, visible, confirmLoading, handleOk, defaultValue, inputModalRules } = useInputModal({
  async handleOk(weights, payload) {
    await updateChamberLevel({ chamberId: payload.chamberId, level: weights })
    fetchTableData()
  },
  inputModalRules: [
    { required: true, message: '请输入权重', trigger: 'blur' },
    { pattern: /^[\d]{0,3}$/, message: '请输入0-999数字', trigger: ['blur', 'change'] }
  ]
})
const columns = reactive([
  {
    title: '商/协会名称',
    dataIndex: 'chamberName',
    filter: true,
    hideInTable: false,
    valueType: 'text',
    width: 220
  },
  {
    title: '联系人手机号',
    dataIndex: 'contactPhone',
    filter: true,
    hideInTable: true,
    valueType: 'text',
    width: 220
  },
  {
    title: '联系人',
    customRender: ({ record }) => {
      return (
        <span>
          <div>【商务】{record.contactName}</div>
          <div>【运营】{record.contactPhone}</div>
        </span>
      )
    }
  },
  {
    title: '负责人',
    customRender: ({ record }) => {
      return (
        <span>
          <div>【商务】{record.business}</div>
          <div>【运营】{record.operating}</div>
        </span>
      )
    }
  },
  {
    title: '注册时间',
    dataIndex: 'registerTime',
    filter: false,
    hideInTable: false,
    valueType: 'dateTimeRange',
    customRender: ({ record }) => {
      return dayjs(parseInt(record.registerTime)).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '权重',
    dataIndex: 'weight',
    filter: false,
    hideInTable: false,
    valueType: 'text'
  },
  {
    title: '邀请码',
    dataIndex: 'inviteCode',
    filter: true,
    hideInTable: false,
    valueType: 'text'
  },
  {
    title: '是否已过试用期',
    dataIndex: 'trialPassDue',
    filter: true,
    hideInTable: true,
    valueType: 'select',
    initialValue: '',
    formItemProps: {
      options: PROBATION_STATUS_OPTIONS,
      fieldNames: { label: 'name', value: 'id' },
      allowClear: true
    },
    customRender: ({ record }) => {
      return record.trialPassDue ? '已过期' : '未过期'
    }
  },
  {
    title: '过期时间',
    dataIndex: 'trialExpireTime',
    filter: false,
    hideInTable: false,
    customRender: ({ record }) => {
      return dayjs(parseInt(record.trialExpireTime)).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    filter: true,
    hideInTable: false,
    valueType: 'select',
    initialValue: '',
    formItemProps: {
      options: CHAMBER_FREEZE_OPTION,
      fieldNames: { label: 'name', value: 'id' }
    }
  },
  {
    title: '商务负责人',
    dataIndex: 'businessName',
    filter: true,
    valueType: 'select',
    hideInTable: true,
    formItemProps: {
      options: businessArr,
      fieldNames: { label: 'label', value: 'value' },
      allowClear: true
    }
  },
  {
    title: '运营负责人',
    dataIndex: 'operatingName',
    filter: true,
    valueType: 'select',
    hideInTable: true,
    formItemProps: {
      options: operatingArr,
      fieldNames: { label: 'label', value: 'value' },
      allowClear: true
    }
  },
  { title: '操作', dataIndex: 'action', fixed: 'right' }
])
const list = ref([])
const tableFilter = reactive({})
const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
  async fetchFn({ current: page, pageSize }) {
    const params = {}
    Object.assign(params, {
      page,
      pageSize,
      ...tableFilter
    })
    const { data } = await unsignedData(params)
    list.value = data.list || []
    return { total: data.totalRows || 0 }
  }
})
fetchTableData()
const handlerSearch = value => {
  Object.assign(tableFilter, value)
  fetchTableData({ current: 1 })
}
// 备注负责人
const remarkVisible = ref(false)
const remarkObj = ref({})
const remarksPeople = record => {
  remarkVisible.value = true
  remarkObj.value = record
}
const closeremark = () => {
  remarkVisible.value = false
}
const submitRemark = async value => {
  const params = {
    ...value,
    ckey: remarkObj.value.ckey
  }
  await updateDirector(params)
  await closeremark()
  await fetchTableData()
}
const codeNum = ref()
const exportExcelCode = async (type = 1) => {
  let blob = null
  if (type === 1) {
    blob = await registerCodeDownload({ codeNum: codeNum.value })
  } else {
    // 后端同个字段 不同的接口不一样的叫法很坑的
    // const { name: chamberName, contactPhone, inviteCodePastDue = null, status, businessName = null, operatingName = null } = {...this.query}
    const params = {
      area: [],
      businessName: null,
      chamberName: '',
      contactPhone: '13',
      date: '',
      name: '',
      operatingName: null,
      settledSource: '',
      status: '',
      userName: ''
    }
    try {
      blob = await exportUnSigned(params)
    } catch (error) {
      message.error(error)
    }
  }
  await downloadFile({
    title: `【${type === 1 ? '生成邀请码' : '未签约商会列表'}】.xlsx`,
    url: window.URL.createObjectURL(blob)
  })
}
const qrVisible = ref(false)
const openQrCodeModal = () => {
  qrVisible.value = true
}
const closeQrCodeModal = () => {
  qrVisible.value = false
}
const submitQrcode = async value => {
  codeNum.value = value.codeNum
  await exportExcelCode(1)
  await closeQrCodeModal()
}
// 解冻账号
const unfreezeAccount = record => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: `该商协会由于【${record.freezeReason}】被冻结，是否确定解冻账号？`,
    async onOk() {
      const params = {
        ckey: record.ckey,
        status: 1
      }
      await chamberStatusUpdate(params)
      await fetchTableData()
    },
    onCancel() {}
  })
}
// 延长试用
const recordObj = ref({})
const extendedVisible = ref(false)
const openExtendedModal = record => {
  extendedVisible.value = true
  recordObj.value = record
}
const closeExtendedModal = () => {
  extendedVisible.value = false
}
const submitExtended = async value => {
  const params = {
    ckey: recordObj.value.ckey,
    addDay: value
  }
  await addTryTime(params)
  await closeExtendedModal()
  await fetchTableData()
}
// 标记已签约
const markObj = ref({})
const markSignedVisible = ref(false)
const openMarkSignModal = record => {
  markObj.value = record
  markSignedVisible.value = true
}
const closeMarkSignModal = () => {
  markSignedVisible.value = false
}
const submitMarkSigned = async value => {
  const { ckey, chamberName } = markObj.value
  const params = {
    ...value,
    ckey,
    chamberName
  }
  await chamberSign(params)
  await closeMarkSignModal()
  await fetchTableData()
}
</script>

<style scoped>
.btn {
  display: flex;
  width: 220px;
  flex-direction: column;
}
</style>
