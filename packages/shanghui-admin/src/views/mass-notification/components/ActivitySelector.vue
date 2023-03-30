<template>
  <a-modal :visible="props.visible" title="选择活动" width="90%" @cancel="emit('update:visible', false)" @ok="onSubmit">
    <PlusTable
      row-key="id"
      :row-selection="rowSelection"
      :loading="loading"
      :columns="fiveGColumns"
      :data-source="tableData"
      :pagination="pagination"
      :request="handleSearch"
      :search="{ hiddenNum: 4 }"
      :scroll="{ y: 600 }"
      @change="handleTableChange"
      bordered
    >
    </PlusTable>
  </a-modal>
</template>

<script setup>
import PlusTable from '@business/components/src/plus-table/PlusTable.vue'
import { ref, reactive, onMounted, computed, watch, getCurrentInstance } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { useRowSelection } from '@business/logics/src/useRowSelection'
import { getActivityList } from '@business/common/src/activity/api/activity'
import { getInfoList, getInvesActivityList } from '@/api/attract/index'
import { distributionChambers } from '@/api/mass-notification'
import dayjs from 'dayjs'
const emit = defineEmits(['update:visible', 'addActivity'])
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  // 2 普通活动 3招商活动
  activityType: {
    type: Number,
    default: 2
  },
  activityList: {
    type: Array,
    default() {
      return []
    }
  }
})
const chamberOptions = ref([])
const getChamberOption = async () => {
  const fetchApi = {
    2: distributionChambers,
    3: getInfoList
  }[props.activityType]
  const { data } = await fetchApi()
  chamberOptions.value = data.map(item => ({
    value: props.activityType === 2 ? item.ckey : item.invesKey,
    label: item.name
  }))
}

const fiveGColumns = ref([
  {
    title: '来源商会',
    hideInTable: true,
    dataIndex: props.activityType === 2 ? 'ckey' : 'invesKey',
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: computed(() => {
        return chamberOptions.value
      })
    },
    width: 300
  },
  {
    title: '活动ID',
    dataIndex: 'id',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入文章标题'
    },
    width: 80
  },
  {
    title: '活动头图',
    dataIndex: 'activeHead',
    customRender: ({ record }) => {
      return <img style="width:100px;height:80px" src={record.headImage} />
    },
    width: 180
  },
  {
    title: '活动名称',
    dataIndex: 'activityName',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入文章标题'
    },
    width: 180
  },
  {
    title: '活动时间',
    dataIndex: 'activeTime',
    customRender: ({ record }) => {
      return (
        dayjs(parseInt(props.activityType === 2 ? record.startTime : record.activityStartTime)).format(
          'YYYY-MM-DD HH:mm:ss'
        ) +
        '~' +
        dayjs(parseInt(props.activityType === 2 ? record.startTime : record.activityEndTime)).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      )
    }
  },
  {
    title: '活动地点',
    dataIndex: 'address',
    customRender: ({ record }) => {
      return record.province + record.city + record.area + record.addressInfo
    },
    width: 150
  },
  {
    title: '活动来源',
    dataIndex: 'chamberName',
    customRender: ({ record }) => {
      return props.activityType === 2 ? record.chamberName : record.invesName
    },
    width: 150
  },
  {
    title: '报名对象',
    dataIndex: 'applyObject',
    customRender: ({ record }) => {
      return record.applyObject === 0 ? '不限' : '商会会员'
    },
    width: 100
  },
  {
    title: '发布状态',
    dataIndex: 'chamberName',
    customRender: ({ record }) => {
      return record.isPublish ? '已发布' : '未发布'
    },
    width: 100
  },
  {
    title: '活动状态',
    dataIndex: 'status',
    filter: true,
    valueType: 'select',
    initialValue: 0,
    formItemProps: {
      options: [
        { value: 0, label: '全部' },
        { value: 1, label: '待开始' },
        { value: 2, label: '进行中' },
        { value: 3, label: '已结束' },
        { value: 4, label: '报名中' }
      ]
    },
    customRender: ({ record }) => {
      return { 1: '待开始', 2: '进行中', 3: '已结束', 4: '报名中' }[record.status]
    },
    width: 100
  },
  {
    title: '发布时间',
    hideInTable: computed(() => {
      return props.activityType !== 2
    }),
    dataIndex: 'createdTs',
    customRender: ({ record }) => {
      return dayjs(+record.createdTs).format('YYYY-MM-DD HH:mm:ss')
    }
  }
])

const query = reactive({
  activityName: '',
  id: null,
  status: 0,
  chamberName: '',
  invesKey: '',
  ckey: ''
})
const tableData = ref([])
onMounted(async () => {
  await fetchTableData()
  getChamberOption()
})
watch(
  () => props.visible,
  async () => {
    await fetchTableData()
  }
)

const fetchFn = async pageOption => {
  rowSelection.selectedRowItems = []
  rowSelection.selectedRowKeys = []
  const conditionQuery = reactive({
    pageSize: pageOption.pageSize,
    page: pageOption.current,
    ...query,
    isInves: false,
    isPublish: 1
  })
  const fetchApi = {
    2: getActivityList,
    3: getInvesActivityList
  }[props.activityType]
  const { data } = await fetchApi(conditionQuery)
  tableData.value = data.list
  return {
    total: data.totalRows
  }
}
const { pagination, fetchTableData, loading, handleTableChange } = useAntTable({ fetchFn })

const rowSelection = useRowSelection({ type: 'radio' })

const { proxy } = getCurrentInstance()
const onSubmit = () => {
  if (!rowSelection.selectedRowKeys.length) return proxy.$message.warning('请选择活动')
  emit('addActivity', rowSelection.selectedRowItems[0])
  emit('update:visible', false)
}

const handleSearch = value => {
  Object.assign(query, value)
  fetchTableData({ current: 1 })
}
</script>

<style lang="scss" scoped>
.p-main-padding {
  padding: 0;
}
</style>
