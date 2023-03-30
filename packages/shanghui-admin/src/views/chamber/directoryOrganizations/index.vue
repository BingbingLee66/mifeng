<template>
  <PlusTable
    :row-selection="{
      onChange: onChange,
      selectedRowKeys: selectedTableRow,
      preserveSelectedRowKeys: true,
      getCheckboxProps: getCheckbox
    }"
    row-key="id"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :request="handlerSearch"
    :data-source="list"
    @change="handleTableChange"
  >
    <template #toolBar>
      <span v-action="'导入社会组织'">
        <a-dropdown class="mr-2">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="showImportDialog">立即导入 </a-menu-item>
              <a-menu-item key="2" @click="downloadTemplate"> 下载模板 </a-menu-item>
            </a-menu>
          </template>
          <a-button type="primary">
            导入社会组织名单
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </span>
      <a-button @click="addOrgDialog" v-action="'添加社会组织'" class="mr-2">添加社会组织</a-button>
      <a-button @click="delConfirm" v-action="'删除社会组织'" class="mr-2">删除</a-button>
      <a-button @click="toClaim" v-action="'认领入驻'" class="mr-2">认领入驻</a-button>
      <a-button @click="setWeights" class="mr-2">批量权重</a-button>
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'action'">
        <a-button v-if="record.auditStatus != 0" v-action="'详情'" type="link" @click="showDetail(record)">
          详情
        </a-button>
      </template>
      <template v-if="column.dataIndex === 'wight'">
        <span class="blue-label" @click="oneWeight(record)">
          {{ record.level }}
        </span>
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
  <importDialog :importVisible="importVisible" @closeImportDialog="closeImportDialog"></importDialog>
  <addOrganization
    ref="addOrg"
    :addVisible="addVisible"
    :areaOptions="areaOptions"
    @closeOrgDialog="closeOrgDialog"
    @submitOrg="submitOrg"
  ></addOrganization>
  <detailOrganization :detailVisible="detailVisible" :orgId="currentOrgId" @closeDetailDialog="closeDetailDialog">
  </detailOrganization>
  <claimSettle
    :claimId="claimId"
    :claimVisible="claimVisible"
    :areaOptions="areaOptions"
    @closeClaim="closeClaim"
    @success="successClaim"
  >
  </claimSettle>
</template>

<script setup>
import PlusTable from '@business/components/src/plus-table/PlusTable'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import {
  getListInfo,
  updateOrganizationsSort,
  setOrganization,
  delOrganization,
  batchUpdateOrganization
} from '@/api/chamber/directoryOrganizations'
import { reactive, ref, defineAsyncComponent, createVNode } from 'vue'
import { getAreaTree } from '@business/common/src/user/api'
import { useInputModal } from '@business/components/src/input-modal/hook'
import { downloadFile } from '@business/common/src/utils'
import importDialog from './components/importDialog.vue'
import {
  inSourceObj,
  inState,
  dataSource,
  dataSourceObj,
  organizationState,
  codestatusOptions,
  orgStatusOptions,
  ORG_STATE_MAP,
  stateMap,
  SignStatusOptions
} from '@/constant/chamber'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
const InputModal = defineAsyncComponent(() => import('@business/components/src/input-modal'))
const addOrganization = defineAsyncComponent(() => import('./components/add-organization.vue'))
const detailOrganization = defineAsyncComponent(() => import('./components/detail-org.vue'))
const claimSettle = defineAsyncComponent(() => import('./components/claim-settle.vue'))
const areaOptions = ref([])
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
getAreaOption()
const columns = reactive([
  {
    title: '社会组织名录',
    dataIndex: 'name',
    filter: true,
    hideInTable: false,
    valueType: 'text',
    width: 220
  },
  {
    title: '统一社会信用代码',
    dataIndex: 'socialCode',
    filter: false,
    hideInTable: false,
    valueType: 'text',
    width: 220
  },
  {
    title: '地区',
    dataIndex: 'cities',
    filter: true,
    valueType: 'cascader',
    hideInTable: true,
    formItemProps: {
      options: areaOptions,
      placeholder: '请选择地区'
    },
    customRender: ({ record }) => {
      return record.province ? record.province + record.city : record.city
    }
  },
  {
    title: '展示权重',
    dataIndex: 'wight',
    filter: true,
    hideInTable: false,
    valueType: 'text'
  },
  {
    title: '数据来源',
    dataIndex: 'dataSource',
    filter: true,
    hideInTable: false,
    valueType: 'select',
    initialValue: '',
    formItemProps: {
      options: dataSource,
      placeholder: '数据来源',
      fieldNames: { label: 'label', value: 'value' }
    },
    customRender: ({ record }) => {
      return dataSourceObj[record.dataSource]
    }
  },
  {
    title: '入驻状态',
    dataIndex: 'auditStatus',
    filter: true,
    hideInTable: false,
    valueType: 'select',
    formItemProps: {
      options: inState,
      placeholder: '数据来源',
      fieldNames: { label: 'label', value: 'value' }
    },
    customRender: ({ record }) => {
      return stateMap.get(record.auditStatus)
    }
  },
  {
    title: '签约状态',
    dataIndex: 'signStatus',
    filter: true,
    hideInTable: true,
    valueType: 'select',
    formItemProps: {
      options: SignStatusOptions,
      placeholder: '签约状态',
      fieldNames: { label: 'label', value: 'value' }
    },
    customRender: ({ record }) => {
      return stateMap.get(record.auditStatus)
    }
  },
  {
    title: '主要人员',
    dataIndex: 'chamberPerson',
    filter: false,
    hideInTable: false,
    valueType: 'texts'
  },

  {
    title: '入驻来源',
    dataIndex: 'settledSource',
    filter: true,
    hideInTable: false,
    valueType: 'select',
    initialValue: '',
    formItemProps: {
      options: dataSource,
      fieldNames: { label: 'label', value: 'value' }
    },
    customRender: ({ record }) => {
      return inSourceObj[record.settledSource]
    }
  },
  {
    title: '组织状态',
    dataIndex: 'status',
    filter: true,
    hideInTable: false,
    valueType: 'select',
    initialValue: '',
    formItemProps: {
      options: organizationState,
      fieldNames: { label: 'label', value: 'value' }
    },
    customRender: ({ record }) => {
      return ORG_STATE_MAP.get(record.status)
    }
  },
  {
    title: '信用状态',
    dataIndex: 'codestatus',
    filter: true,
    hideInTable: false,
    valueType: 'select',
    initialValue: -1,
    formItemProps: {
      options: codestatusOptions,
      fieldNames: { label: 'label', value: 'value' }
    },
    customRender: ({ record }) => {
      return orgStatusOptions[record.creditStatus]
    }
  },
  { title: '操作', dataIndex: 'action', fixed: 'right' }
])
const tableFilter = reactive({
  name: '',
  province: '',
  wight: '',
  auditStatus: '',
  settledSource: '',
  dataSource: '',
  status: '',
  codestatus: -1,
  signStatus: ''
})
const list = ref([])
const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
  async fetchFn({ current: page, pageSize }) {
    const params = {
      pageNum: page,
      pageSize,
      ...tableFilter
    }
    if (tableFilter.cities) {
      // eslint-disable-next-line prefer-destructuring
      params.cities = tableFilter.cities[1]
    }
    const { data } = await getListInfo(params)
    list.value = data.list || []
    return { total: data.totalRows || 0 }
  }
})
fetchTableData()
const handlerSearch = value => {
  Object.assign(tableFilter, value)
  fetchTableData({ current: 1 })
}
const selectedTableRow = ref([])
const onChange = index => {
  selectedTableRow.value = index
}
const getCheckbox = record => ({
  disabled: record.auditStatus === 1
})
// 权重
const isMany = ref(false) // 判断是否批量
const { openInputModal, visible, confirmLoading, handleOk, defaultValue, inputModalRules } = useInputModal({
  async handleOk(weights, payload) {
    if (isMany.value) {
      const params = {
        ids: selectedTableRow.value,
        weight: weights
      }
      await batchUpdateOrganization(params)
      fetchTableData()
    } else {
      await updateOrganizationsSort({ id: payload.id, weight: weights })
      fetchTableData()
    }
  },
  inputModalRules: [
    { required: true, message: '请输入权重', trigger: 'blur' },
    { pattern: /^[\d]{0,3}$/, message: '请输入0-999数字', trigger: ['blur', 'change'] }
  ]
})
const oneWeight = record => {
  isMany.value = false
  openInputModal({ defaultValue: record.level, payload: record })
}

// 导入社会组织名单
const downloadTemplate = () => {
  downloadFile({
    url: 'https://ysh-cdn.kaidicloud.com/ysh-prod/user/f672877aaf30452aba69fd168f6654ff.xlsx',
    title: '社会组织名录导入模板.xlsx'
  })
}
const importVisible = ref(false)
const showImportDialog = () => {
  importVisible.value = true
}
const closeImportDialog = () => {
  importVisible.value = false
}
// 添加社会组织
const addOrg = ref()
const addVisible = ref(false)
const addOrgDialog = () => {
  addVisible.value = true
}
const closeOrgDialog = () => {
  addVisible.value = false
}
const submitOrg = async value => {
  const res = await setOrganization(value)
  if (res.state === 0) return
  closeOrgDialog()
  addOrg.value.resetForm()
}
// 社会组织详情
const currentOrgId = ref(NaN)
const detailVisible = ref(false)
const showDetail = record => {
  currentOrgId.value = record.id
  detailVisible.value = true
}
const closeDetailDialog = () => {
  detailVisible.value = false
}
// 删除
const checkIsEmpty = () => {
  if (selectedTableRow.value.length === 0) message.warn('请选择删除的数据')
}
const delConfirm = () => {
  checkIsEmpty()
  const params = {
    ids: selectedTableRow.value
  }
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '此操作将永久删除该数据, 是否继续?',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      await delOrganization(params)
      await fetchTableData()
    },
    onCancel() {}
  })
}
// 认领入驻
const claimVisible = ref(false)
const claimId = ref(NaN)
const closeClaim = () => {
  claimVisible.value = false
  claimId.value = NaN
}
const successClaim = () => {
  fetchTableData()
  selectedTableRow.value = []
}
const toClaim = () => {
  if (selectedTableRow.value.length !== 1) return message.warn('只能选择列表中的一个社会组织')
  // eslint-disable-next-line prefer-destructuring
  claimId.value = selectedTableRow.value[0]
  claimVisible.value = true
}
// 批量权重
const setWeights = () => {
  checkIsEmpty()
  isMany.value = true
  openInputModal()
}
</script>

<style scoped></style>
