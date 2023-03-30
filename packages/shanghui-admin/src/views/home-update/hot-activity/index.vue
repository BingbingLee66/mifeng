<template>
  <PlusTable
    headerTitle="热门活动"
    :row-selection="rowSelection"
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    row-key="id"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :request="handlerSearch"
  >
    <template #searchToolBar="{ form }">
      <a-button v-action="'查询'" type="primary" html-type="submit">查询</a-button>
      <a-button
        style="margin: 0 8px"
        @click="
          () => {
            form.resetFields()
            tableFilter.activityId = ''
          }
        "
        >重置</a-button
      >
    </template>
    <template #filterItem="{ column }">
      <a-form-item v-if="column.dataIndex === 'activityId'" :name="column.dataIndex" :label="column.title">
        <a-input
          autocomplete="off"
          v-model:value="tableFilter.activityId"
          :placeholder="`请输入${column.title}`"
          @change="
            e => {
              if (!/^[0-9]\d*$/.test(e.data))
                tableFilter.activityId = tableFilter.activityId.slice(0, tableFilter.activityId.length - 1)
            }
          "
        ></a-input>
      </a-form-item>
    </template>
    <template #toolBar>
      <a-button type="primary" @click="handleDel()">移除</a-button>
      <a-button class="ml-5" type="danger" @click="openAddModal"> 添加活动</a-button>
    </template>
  </PlusTable>
  <WeightModal ref="WeightModalRef" :API="updateHotActivitySort"></WeightModal>
  <a-modal v-model:visible="addModal.visible" title="添加活动" width="80%" @ok="handleAdd">
    <PlusTable
      :row-selection="addModal.rowSelection"
      :columns="addModal.columns"
      :data-source="addModal.tableData"
      :scroll="{ x: 'max-content' }"
      row-key="id"
      :pagination="addModal.pagination"
      :loading="addModal.loading"
      @change="addModal.handleTableChange"
      :request="addModal.handlerSearch"
      :search="{ defaultCollapsed: false }"
    >
      <template #searchToolBar="{ form }">
        <a-button type="primary" html-type="submit">查询</a-button>
        <a-button
          style="margin: 0 8px"
          @click="
            () => {
              form.resetFields()
              addModal.tableFilter.activityId = ''
            }
          "
          >重置</a-button
        >
      </template>
      <template #filterItem="{ column }">
        <a-form-item v-if="column.dataIndex === 'activityId'" :name="column.dataIndex" :label="column.title">
          <a-input
            autocomplete="off"
            v-model:value="addModal.tableFilter.activityId"
            :placeholder="`请输入${column.title}`"
            @change="
              e => {
                if (!/^[0-9]\d*$/.test(e.data))
                  addModal.tableFilter.activityId = addModal.tableFilter.activityId.slice(
                    0,
                    addModal.tableFilter.activityId.length - 1
                  )
              }
            "
          ></a-input>
        </a-form-item>
      </template>
    </PlusTable>
  </a-modal>
</template>
<script setup>
import { ref, reactive } from 'vue'
import {
  addHotActivity,
  delHotActivity,
  getActivitySource,
  getHotActivityList,
  updateHotActivitySort
} from '@/api/activity/hot-activity/index'
import { useRowSelection } from '@business/logics/src/useRowSelection'
import { useAntTable } from '@business/logics/src/useAntTable'
import {
  HOT_ACTIVITY_STATUS_MAP,
  HOT_ACTIVITY_STATUS,
  PUBLISH_STATUS_MAP,
  PUBLISH_STATUS
} from '@business/common/src/activity/constant'
import { getMapDict } from '@business/common/src/utils/index'
import WeightModal from '@business/components/src/activity/weightModal'
import { Message, Modal } from 'ant-design-vue'
const WeightModalRef = ref()
const rowSelection = useRowSelection()
const tableData = ref([])
const tableFilter = reactive({
  activityId: '',
  activityName: '',
  activityStatus: -1,
  isPublish: -1,
  ckey: '',
  isAdd: 0
})

const chamberOptions = reactive([])
const getChamberOptions = async () => {
  const { data } = await getActivitySource()
  chamberOptions.push(...data)
}

const columns = [
  {
    title: '活动列表图',
    dataIndex: 'listImage',
    customRender: ({ record: { listImage } }) => {
      return <a-image src={listImage} />
    },
    width: 115
  },
  {
    title: '活动ID/名称',
    dataIndex: 'activityId&activityName',
    customRender: ({ record: { activityId, activityName } }) => {
      return (
        <div>
          <div class="red-label">{activityId}</div>
          <div>{activityName}</div>
        </div>
      )
    }
  },
  {
    title: '活动ID',
    hideInTable: true,
    dataIndex: 'activityId',
    filter: true,
    valueType: 'text',
    span: 7,
    formItemProps: {
      maxlength: 9
    }
  },
  {
    title: '活动名称',
    hideInTable: true,
    dataIndex: 'activityName',
    filter: true,
    valueType: 'text',
    span: 7
  },
  {
    title: '活动时间',
    dataIndex: 'activityStartTime',
    customRender: ({ record: { activityStartTime, activityEndTime } }) => {
      return (
        <div>
          {activityStartTime} - {activityEndTime}
        </div>
      )
    }
  },
  {
    title: '活动地点',
    dataIndex: 'province',
    customRender: ({ record: { province, city, area, addressInfo } }) => {
      return (
        <div>
          {province}
          {city}
          {area}
          {addressInfo}
        </div>
      )
    },
    width: 200
  },
  {
    title: '活动来源',
    dataIndex: 'ckey',
    filter: true,
    valueType: 'select',
    span: 7,
    formItemProps: {
      options: chamberOptions,
      fieldNames: { label: 'name', value: 'ckey' }
    },
    customRender: ({ record: { chamberName } }) => {
      return <div>{chamberName === null ? '凯迪云商会' : chamberName}</div>
    },
    width: 100
  },
  {
    title: '报名对象',
    dataIndex: 'applyObject',
    customRender: ({ record: { applyObject, chamberName } }) => {
      if (applyObject === 0) return '不限'
      else if (applyObject === 1 && chamberName === null) return '限云商会成员'
      else if (applyObject === 1 && chamberName !== null) return '限本商会成员'
    },
    width: 120
  },
  {
    title: '报名人数',
    dataIndex: 'isLimit',
    customRender: ({ record: { isLimit, applyCount } }) => {
      if (isLimit === 0) return '不限'
      if (isLimit === 1) return `限${applyCount}人`
    },
    width: 100
  },
  {
    title: '签到人数',
    dataIndex: 'signNum',
    customRender: ({ record: { signNum } }) => {
      return `${signNum}人`
    },
    width: 100
  },
  {
    title: '发布状态',
    dataIndex: 'isPublish',
    customRender: ({ record: { isPublish } }) => {
      return PUBLISH_STATUS_MAP.get(isPublish)
    },
    filter: true,
    hideInAdd: true,
    valueType: 'select',
    span: 7,
    formItemProps: {
      options: getMapDict(PUBLISH_STATUS_MAP)
    },
    initialValue: PUBLISH_STATUS.ALL,
    width: 100
  },
  {
    title: '活动状态',
    dataIndex: 'activityStatus',
    customRender: ({ record: { status } }) => {
      return status === 0 ? '--' : HOT_ACTIVITY_STATUS_MAP.get(status)
    },
    filter: true,
    valueType: 'select',
    span: 7,
    formItemProps: {
      options: getMapDict(HOT_ACTIVITY_STATUS_MAP)
    },
    initialValue: HOT_ACTIVITY_STATUS.ALL,
    width: 100
  },
  {
    title: '创建时间',

    dataIndex: 'createdTs'
  },
  {
    title: '创建人',
    hideInAdd: true,
    dataIndex: 'operatorName',
    width: 100
  },
  {
    title: '权重',
    dataIndex: 'isLimit',
    hideInAdd: true,
    customRender: ({ record }) => {
      return (
        <span class="blue-label" onClick={() => WeightModalRef.value.openWeightModal(record)}>
          {record.sort}
        </span>
      )
    },
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'operation',
    hideInAdd: true,
    customRender: ({ record }) => {
      return (
        <a-button type="primary" onClick={() => handleDel(record)}>
          移除
        </a-button>
      )
    },
    fixed: 'right'
  }
]

const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
  async fetchFn({ current, pageSize }) {
    rowSelection.onChange([]) // 拉取表格数据之前清空选中
    const { data } = await getHotActivityList({
      ...tableFilter,
      pageSize,
      page: current
    })
    tableData.value = data.list || []
    return { total: data.totalRows || 0 }
  }
})

const handlerSearch = value => {
  delete value.activityId
  Object.assign(tableFilter, value)
  fetchTableData(1)
}

const addModal = reactive({
  visible: false,
  rowSelection: useRowSelection(),
  tableData: [],
  tableFilter: {
    activityId: '',
    activityName: '',
    activityStatus: -1,
    ckey: '',
    isAdd: 1
  },
  columns: columns.filter(item => !item.hideInAdd)
})
Object.assign(addModal, {
  ...useAntTable({
    async fetchFn({ current, pageSize }) {
      //  rowSelection.onChange([]) // 拉取表格数据之前清空选中
      const { data } = await getHotActivityList({
        ...addModal.tableFilter,
        pageSize,
        page: current
      })
      addModal.tableData = data.list || []
      addModal.rowSelection.onChange([]) // 拉取表格数据之前清空选中
      return { total: data.totalRows || 0 }
    }
  }),
  handlerSearch: value => {
    delete value.activityId
    Object.assign(addModal.tableFilter, value)
    addModal.fetchTableData(1)
  }
})
const openAddModal = () => {
  addModal.visible = true
  addModal.fetchTableData()
}
const handleAdd = async () => {
  if (!addModal.rowSelection.selectedRowKeys.length) {
    return Message.error('请先选择活动')
  }
  await addHotActivity(addModal.rowSelection.selectedRowKeys)
  addModal.visible = false
  fetchTableData()
}
const handleDel = row => {
  const delIds = []
  /** 批量删除 */
  if (!row) {
    if (!rowSelection.selectedRowKeys.length) {
      Message.error('请先选择活动')
      return
    }
    delIds.push(...rowSelection.selectedRowKeys)
  } else delIds.push(row.id) // 单条删除
  Modal.confirm({
    title: '移除确认框',
    content: '确定移除?',
    async onOk() {
      await delHotActivity(delIds)
      fetchTableData()
    }
  })
}
fetchTableData()
getChamberOptions()
</script>
<style lang="scss" scoped></style>
