<template>
  <PlusTable
    :scroll="{ x: 'max-content' }"
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :request="handlerSearch"
  >
    <template #toolBar>
      <a-button type="primary" @click="templateOperation(1)" class="mr-4">批量配置模板</a-button>
      <a-button type="primary" @click="templateOperation(2)" class="mr-4">批量分配短信</a-button>
      <a-button type="primary" disabled class="mr-4"> 短信总量： {{ statistics.smsDistributionSum || 0 }} </a-button>
      <a-button type="primary" disabled> 剩余短信： {{ statistics.smsRemainSum || 0 }} </a-button>
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'smsDistributionNum'">
        <a-button type="link" @click="templateOperation(5, record)">{{ record.smsDistributionNum }}</a-button>
      </template>
      <template v-if="column.dataIndex === 'operate'">
        <a-button type="link" @click="templateOperation(3, record)">管理模板</a-button>
        <a-button type="link" @click="templateOperation(4, record)">分配短信</a-button>
      </template>
    </template>
  </PlusTable>
  <!--  批量配置模板 -->
  <ConfigUration v-model:show-configuration="showConfiguration" @onClick="fetchTableData" />
  <!--  批量分配短信 -->
  <Allocation v-model:show-configuration="showAllocation" @onClick="fetchTableData" />
  <!-- 管理模板 -->
  <Management ref="showManagement" />
  <!-- 分配短信 -->
  <AllotDialog ref="Allot" @onClick="fetchTableData" />
  <!-- 分配记录 -->
  <RecordDialog ref="Record" />
</template>
<script setup>
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { templateList, templateDistributionSmsStat } from '@business/common/src/mass-notification/api/index'
import { reactive, ref, defineAsyncComponent } from 'vue'
const AllotDialog = defineAsyncComponent(() => import('./Allot.vue'))
const RecordDialog = defineAsyncComponent(() => import('./Record.vue'))
const ConfigUration = defineAsyncComponent(() => import('./Config.vue'))
const Allocation = defineAsyncComponent(() => import('./Allocation.vue'))
const Management = defineAsyncComponent(() => import('./Management.vue'))
const props = defineProps({
  chambersOptions: {
    type: Array,
    default: () => []
  }
})
const columns = [
  {
    dataIndex: 'chamberName',
    title: '商协会名称',
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: props.chambersOptions,
      fieldNames: { label: 'name', value: 'ckey' },
      defaultValue: undefined
    }
  },
  {
    dataIndex: 'smsTempNum',
    title: '短信模板'
  },
  {
    dataIndex: 'subscriptionTempNum',
    title: '订阅消息模板'
  },
  {
    dataIndex: 'appNoticeTempNum',
    title: 'APP通知模板'
  },
  {
    dataIndex: 'smsDistributionSum',
    title: '短信总数'
  },
  {
    dataIndex: 'smsRemainSum',
    title: '短信剩余量'
  },
  {
    dataIndex: 'smsSuccSum',
    title: '短信发送成功'
  },
  {
    dataIndex: 'smsFailSum',
    title: '短信发送失败'
  },
  {
    dataIndex: 'smsDistributionNum',
    title: '分配记录'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    fixed: 'right'
  }
]
const tableData = ref([])
const tableFilter = reactive({
  chamberName: ''
})
const handlerSearch = value => {
  tableFilter.chamberName = value.chamberName || ''
  fetchTableData(true)
}
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
  fetchFn: async pageOption => {
    const condition = {
      pageSize: pageOption.pageSize,
      page: pageOption.current,
      ckey: tableFilter.chamberName
    }
    const {
      data: { list, totalRows }
    } = await templateList(condition)
    tableData.value = list
    return {
      total: totalRows
    }
  }
})
// 模板分配短信统计
const statistics = reactive({})
const butionSmsStat = async () => {
  const { data } = await templateDistributionSmsStat()
  Object.assign(statistics, data)
}

const showConfiguration = ref(false)
const showAllocation = ref(false)
const showManagement = ref(null)
const Allot = ref(null)
const Record = ref(null)
// 1.批量配置模板 2.批量分配短信 3.管理模板 4.分配短信
const templateOperation = (type, row) => {
  switch (type) {
    case 1:
      showConfiguration.value = true
      break
    case 2:
      showAllocation.value = true
      break
    case 3:
      showManagement.value.show(row)
      break
    case 4:
      Allot.value.show(row)
      break
    case 5:
      Record.value.show(row)
      break
  }
}
fetchTableData()
butionSmsStat()
</script>
<style lang="scss" scoped>
.mass {
  background-color: #f2f2f2;
  font-size: 16px;
  color: #7f7f7f;
  padding: 10px;
  display: inline-block;
  border-radius: 4px;
}
.note {
  font-size: 20px;
  font-weight: 700;
}
</style>
