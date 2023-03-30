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
      <a-button type="primary" v-action="'添加商会'" @click="addChamber">添加商会</a-button>
      当商协会权重为0时，将隐藏其在前台【推荐商协会】和【新入驻商协会】页面的展示
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'level'">
        <span class="blue-label" @click="openInputModal({ defaultValue: record.level, payload: record })">
          {{ record.level }}
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
          <a-button v-action="'详情'" type="link" @click="showDetail(record)"> 详情 </a-button>
          <a-button v-action="'编辑'" type="link" @click="editChamber(record)"> 编辑 </a-button>
          <a-button v-action="'冻结'" v-if="record.status === 1" type="link" @click="freezeAccount(record)">
            冻结账号
          </a-button>
          <a-button v-action="'解冻'" v-else type="link" @click="unfreezeAccount(record)"> 解冻账号 </a-button>
          <a-button type="link" @click="remarksPeople(record)"> 备注负责人 </a-button>
          <a-button v-if="record.livePermission === 0" type="link" @click="adoptDetailDialog(record)">
            开通直播窗口权限
          </a-button>
          <a-button v-else type="link" @click="adoptDetailDialog(record)" danger> 禁用直播窗口权限</a-button>
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
  <addEditChamber
    :claimVisible="addEditVisible"
    :ckey="curCkey"
    @closeAddEdit="closeAddEdit"
    :areaOptions="areaOptions"
    :chamberId="chamberId"
  ></addEditChamber>
  <detailChamber :detailVisible="detailVisible" :chamberId="detailIds" @closeDetail="closeDetail"> </detailChamber>
  <freezedModal :freezedVisible="freezedVisible" @submitReason="submitReason" @closeFreeze="closeFreeze"></freezedModal>
  <remarkChamber
    :businessArr="businessArr"
    :operatingArr="operatingArr"
    :remarkVisible="remarkVisible"
    :chamberName="remarkObj.name"
    @closeremark="closeremark"
    @submitRemark="submitRemark"
  ></remarkChamber>
</template>

<script setup>
import { reactive, ref, defineAsyncComponent, createVNode } from 'vue'
import PlusTable from '@business/components/src/plus-table/PlusTable'
import { getAreaTree } from '@business/common/src/user/api'
import { useInputModal } from '@business/components/src/input-modal/hook'
import { Modal } from 'ant-design-vue'
// import dayjs from 'dayjs'
import {
  getList,
  businessList,
  operatingLlist,
  updateChamberLevel,
  chamberStatusUpdate,
  updateDirector,
  livePermissionUpdate
} from '@/api/chamber/manager'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { CHAMBER_STATUS_OPTION, LIVE_STATUS_OPTIONS, inSource, inSourceObj } from '@/constant/chamber'
const InputModal = defineAsyncComponent(() => import('@business/components/src/input-modal'))
const addEditChamber = defineAsyncComponent(() => import('./components/add-edit-chamber.vue'))
const detailChamber = defineAsyncComponent(() => import('./components/detail-chamber.vue'))
const freezedModal = defineAsyncComponent(() => import('./components/freezed-chamber.vue'))
const remarkChamber = defineAsyncComponent(() => import('./components/remark-chamber.vue'))
const areaOptions = ref([])
// 商务负责人
const businessArr = ref([])
// 运营负责人
const operatingArr = ref([])

const { openInputModal, visible, confirmLoading, handleOk, defaultValue, inputModalRules } = useInputModal({
  async handleOk(weights, payload) {
    await updateChamberLevel({ chamberId: payload.id, level: weights })
    fetchTableData()
  },
  inputModalRules: [
    { required: true, message: '请输入权重', trigger: 'blur' },
    { pattern: /^[\d]{0,3}$/, message: '请输入0-999数字', trigger: ['blur', 'change'] }
  ]
})
const getAreaOption = async () => {
  const { data } = await getAreaTree()
  areaOptions.value = data.map(item => {
    return {
      value: item.code,
      label: item.name,
      children: item.children.map(item2 => {
        return {
          value: item2.code,
          label: item2.name
        }
      })
    }
  })
}
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
getAreaOption()
const tableFilter = reactive({
  name: '',
  status: '',
  cities: [],
  userName: '',
  businessName: '',
  operatingName: '',
  settledSource: '',
  registerTime: '',
  livePermission: ''
})
const columns = reactive([
  {
    title: '商/协会logo',
    dataIndex: 'systemLogo',
    customRender: ({ record }) => <img style="width: 44px; height: 44px;" src={record.systemLogo} />
  },
  {
    title: '商协会名称',
    dataIndex: 'name',
    filter: true,
    hideInTable: false,
    valueType: 'text',
    width: 220
  },
  {
    title: '地区',
    dataIndex: 'province',
    customRender: ({ record }) => {
      return record.province + record.city
    }
  },
  {
    title: '商/协会账号',
    dataIndex: 'userName',
    filter: true,
    hideInTable: true,
    valueType: 'text'
  },
  {
    title: '地区',
    dataIndex: 'cities',
    filter: true,
    valueType: 'cascader',
    hideInTable: true,
    formItemProps: {
      options: areaOptions,
      placeholder: '请选择地区',
      maxTagCount: 'responsive',
      multiple: '',
      showCheckedStrategy: 'SHOW_CHILD'
    },
    customRender: ({ record }) => {
      return record.province ? record.province + record.city : record.city
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
    title: '入驻来源',
    dataIndex: 'settledSource',
    filter: true,
    hideInTable: false,
    valueType: 'select',
    initialValue: '',
    formItemProps: {
      options: inSource,
      fieldNames: { label: 'label', value: 'value' }
    },
    customRender: ({ record }) => {
      return inSourceObj[record.settledSource]
    }
  },
  {
    title: '注册时间',
    dataIndex: 'registerTime',
    filter: true,
    hideInTable: false,
    valueType: 'dateTimeRange',
    customRender: ({ record }) => {
      return record.registerTime
    }
  },
  {
    title: '账号',
    dataIndex: 'userName',
    filter: false,
    hideInTable: false,
    valueType: 'text'
  },
  {
    title: '权重',
    dataIndex: 'level',
    filter: false,
    hideInTable: false,
    valueType: 'text'
  },
  {
    title: '创建时间',
    dataIndex: 'createdTs',
    filter: false,
    hideInTable: false,
    valueType: 'text'
  },
  {
    title: '状态',
    dataIndex: 'status',
    filter: true,
    hideInTable: false,
    valueType: 'select',
    initialValue: '',
    formItemProps: {
      options: CHAMBER_STATUS_OPTION,
      fieldNames: { label: 'name', value: 'id' }
    }
  },
  {
    title: '直播窗口权限',
    filter: true,
    dataIndex: 'livePermission',
    hideInTable: true,
    valueType: 'select',
    initialValue: '',
    formItemProps: {
      options: LIVE_STATUS_OPTIONS,
      fieldNames: { label: 'name', value: 'id' }
    }
  },
  { title: '操作', dataIndex: 'action', fixed: 'right' }
])
const list = ref([])

const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
  async fetchFn({ current: page, pageSize }) {
    const params = {}
    Object.assign(params, {
      page,
      pageSize,
      ...tableFilter
    })
    if (tableFilter.cities) {
      params.city = tableFilter.cities
        .reduce((acc, cur) => {
          acc.push(cur[1])
          return acc
        }, [])
        .join(',')
    }
    if (tableFilter.registerTime) {
      ;[params.startTime, params.endTime] = tableFilter.registerTime
    }
    delete params.cities
    delete params.registerTime
    const { data } = await getList(params)
    list.value = data.data.list || []
    return { total: data.data.totalRows || 0 }
  }
})
fetchTableData()
const handlerSearch = value => {
  Object.assign(tableFilter, value)
  fetchTableData({ current: 1 })
}
// 添加商会
const curCkey = ref('')
const chamberId = ref(NaN)
const addEditVisible = ref(false)
const addChamber = () => {
  chamberId.value = NaN
  curCkey.value = ''
  addEditVisible.value = true
}
const closeAddEdit = flag => {
  addEditVisible.value = false
  chamberId.value = NaN
  if (flag) fetchTableData()
}
// 编辑商会
const editChamber = record => {
  chamberId.value = record.id
  curCkey.value = record.ckey
  addEditVisible.value = true
}
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
// 商会详情
const detailIds = ref(NaN)
const detailVisible = ref(false)
const showDetail = record => {
  detailVisible.value = true
  detailIds.value = record.id
}
const closeDetail = () => {
  detailVisible.value = false
}
// 冻结账号
const freezedVisible = ref(false)
const freezedCkey = ref('')
const freezeAccount = record => {
  freezedVisible.value = true
  freezedCkey.value = record.ckey
}
const closeFreeze = () => {
  freezedVisible.value = false
}
const submitReason = async reason => {
  const params = {
    ckey: freezedCkey.value,
    freezeReason: reason,
    status: 0
  }
  await chamberStatusUpdate(params)
  await fetchTableData()
  await closeFreeze()
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
const adoptDetailDialog = async record => {
  const { ckey, livePermission } = record
  await livePermissionUpdate({ ckey, grantPermission: !livePermission })
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
