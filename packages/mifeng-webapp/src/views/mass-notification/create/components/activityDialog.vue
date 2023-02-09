<template>
  <a-modal v-model:visible="visible" width="75%" title="选择活动" @ok="submit">
    <PlusTable
      class="p0"
      :pagination="pagination"
      :loading="loading"
      :columns="columns"
      :data-source="tableData"
      :scroll="{ x: 'max-content' }"
      rowKey="id"
      :search="{ hiddenNum: 4 }"
      :row-selection="{ selectedRowKeys, onSelect, preserveSelectedRowKeys: true }"
      :request="handlerSearch"
      @change="handleTableChange"
    >
      <template #searchToolBar>
        <a-button type="primary" html-type="submit">查询</a-button>
      </template>
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'headImage'">
          <img :src="record.headImage" alt="" width="120" height="120" />
        </template>
      </template>
    </PlusTable>
  </a-modal>
</template>
<script>
import { inject, ref, reactive, watch, computed } from 'vue'
import { useAntTable } from '@/use/useAntTable'
import { getActivityList } from '@/api/activity/activity'
import { distributionChambers } from '@/api/mass-notification'
import { getInfoList, getInvesActivityList } from '@/api/attract/index'
import { PUBLISH_STATUS_MAP, MEMBER_TYPE_MAP, NOTIFICATION_TYPE } from '@/constant/mass-notification'
import dayjs from 'dayjs'
export default {
  props: {
    // 2 普通活动 3招商活动
    activityType: {
      type: Number,
      default: 2
    },
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const visible = ref(false)
    const { selectedData, ...activityInfo } = useDialog(props)
    const submit = () => {
      emit('update:value', selectedData.value)
      visible.value = false
    }
    // 打开弹框
    const open = () => {
      visible.value = true
    }
    return {
      visible,
      ...activityInfo,
      submit,
      open
    }
  }
}
function useDialog(props) {
  const statusList = [
    { id: 0, name: '全部' },
    { id: 1, name: '待开始' },
    { id: 2, name: '进行中' },
    { id: 3, name: '已结束' },
    { id: 4, name: '报名中' }
  ]
  const chamberList = reactive([])
  const columns = reactive([
    {
      title: '活动来源',
      dataIndex: 'chamberName',
      filter: computed(() => props.activityType === NOTIFICATION_TYPE.INVESTMENT),
      valueType: 'select',
      hideInTable: true,
      formItemProps: {
        options: chamberList,
        allowClear: true
      },
      span: 12
    },
    {
      title: '活动id',
      dataIndex: 'id',
      filter: true,
      valueType: 'text',
      formItemProps: {
        placeholder: '请输入'
      },
      span: 12
    },
    {
      title: '活动头图',
      dataIndex: 'headImage',
      width: 180
    },

    {
      title: '活动名称',
      dataIndex: 'activityName',
      filter: true,
      valueType: 'text',
      width: 180,
      formItemProps: {
        placeholder: '请输入'
      },
      span: 12
    },
    {
      title: '活动时间',
      width: 170,
      dataIndex: 'activityTime',
      customRender: ({ record }) => {
        return (
          dayjs(
            parseInt(props.activityType === NOTIFICATION_TYPE.ACTIVITY ? record.startTime : record.activityStartTime)
          ).format('YYYY-MM-DD HH:mm:ss') +
          '~' +
          dayjs(
            parseInt(props.activityType === NOTIFICATION_TYPE.ACTIVITY ? record.startTime : record.activityEndTime)
          ).format('YYYY-MM-DD HH:mm:ss')
        )
      }
    },
    {
      title: '活动来源',
      dataIndex: 'chamberName',
      width: 180,
      customRender: ({ record }) => {
        return props.activityType === NOTIFICATION_TYPE.INVESTMENT ? record.invesName : record.chamberName
      }
    },
    {
      title: '活动地点',
      dataIndex: 'activityAddress',
      width: 180,
      customRender: ({ record }) => {
        const { province, city, area, addressInfo } = record
        return province + city + area + addressInfo
      }
    },
    {
      title: '报名对象',
      dataIndex: 'isLimit',
      customRender: ({ record }) => {
        const num = record.applyObject === undefined ? 1 : record.applyObject
        return MEMBER_TYPE_MAP.get(num)
      }
    },
    {
      title: '发布状态',
      dataIndex: 'isPublish',
      customRender: ({ record }) => {
        return PUBLISH_STATUS_MAP.get(record.isPublish)
      }
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      filter: true,
      valueType: 'select',
      formItemProps: {
        options: statusList,
        fieldNames: { label: 'name', value: 'id' },
        allowClear: true
      },
      customRender: ({ record }) => {
        const index = statusList.findIndex(item => item.id === record.status)
        return statusList[index].name
      },
      span: 12
    },
    {
      title: '创建时间',
      dataIndex: 'createdTs',
      hideInTable: computed(() => props.activityType === NOTIFICATION_TYPE.INVESTMENT),
      customRender: ({ record }) => {
        return dayjs(parseInt(record.createdTs)).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  ])
  const ckey = inject('ckey')
  const tableFilter = reactive({
    activityName: '',
    id: '',
    status: 0,
    chamberName: '',
    invesKey: '',
    ckey: ''
  })
  const getChamberOptions = async () => {
    let API = distributionChambers
    if (props.activityType === NOTIFICATION_TYPE.INVESTMENT) {
      API = getInfoList
    }
    const { data } = await API()
    chamberList.splice(0, chamberList.length)
    chamberList.push(
      ...data.map(item => {
        return {
          label: item.name,
          value: props.activityType === NOTIFICATION_TYPE.ACTIVITY ? item.ckey : item.invesKey
        }
      })
    )
  }
  const tableData = ref([])
  const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
    async fetchFn({ current: page, pageSize }) {
      let API = getActivityList
      const params = {
        page,
        pageSize,
        ...tableFilter,
        isPublish: 1,
        isInves: false
      }
      if (props.activityType === NOTIFICATION_TYPE.INVESTMENT) {
        API = getInvesActivityList
        params.invesKey = params.chamberName
      } else if (ckey.value) {
        params.ckey = ckey.value
      } else {
        params.ckey = params.chamberName
      }
      const { data } = await API(params)
      tableData.value = data.list || []
      return { total: data.totalRows || 0 }
    }
  })

  getChamberOptions()
  fetchTableData()
  watch(
    () => props.activityType,
    () => {
      fetchTableData({ current: 1 })
      getChamberOptions()
    }
  )
  const selectedRowKeys = ref([])
  const selectedData = ref()
  watch(
    () => props.value,
    val => {
      if (val) selectedRowKeys.value = [val.id]
    },
    {
      immediate: true
    }
  )
  const onSelect = (record, selected) => {
    if (selected) {
      selectedRowKeys.value[0] = record.id
      selectedData.value = record
    } else {
      selectedRowKeys.value[0] = ''
      selectedData.value = null
    }
  }
  const handlerSearch = value => {
    Object.assign(tableFilter, value)
    fetchTableData({ current: 1 })
  }
  return {
    selectedData,
    columns,
    pagination,
    handlerSearch,
    handleTableChange,
    loading,
    tableData,
    selectedRowKeys,
    onSelect
  }
}
</script>
<style lang="scss" scoped></style>
