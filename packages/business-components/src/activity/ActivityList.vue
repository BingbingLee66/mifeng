<template>
  <a-tabs
    v-model:activeKey="tableFilter.isPublish"
    class="bg-white pl-8"
    @change="handlerSearch({ activityName: '', status: ACTIVITY_STATUS.ALL })"
  >
    <a-tab-pane :key="PUBLISH_TYPE.PUBLISHED" tab="已发布" />
    <a-tab-pane :key="PUBLISH_TYPE.UN_PUBLISH" tab="未发布" />
  </a-tabs>
  <PlusTable
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    :search="{ hiddenNum: 4 }"
    :request="handlerSearch"
    @change="handleTableChange"
    :pagination="pagination"
    :loading="loading"
    :resizable="true"
  >
    <template #searchToolBar>
      <a-button type="primary" html-type="submit">查询</a-button>
    </template>
    <template #filterItem="{ column }">
      <a-form-item v-if="column.dataIndex === 'id'" :name="column.dataIndex" :label="column.title">
        <a-input
          autocomplete="off"
          v-model:value="tableFilter.id"
          :placeholder="`请输入${column.title}`"
          @change="
            e => {
              if (!/^[0-9]\d*$/.test(e.data)) tableFilter.id = tableFilter.id.slice(0, tableFilter.id.length - 1)
            }
          "
        ></a-input>
      </a-form-item>
    </template>
  </PlusTable>
  <WeightModal ref="WeightModalRef" :API="updateActivitySort"></WeightModal>
</template>
<script setup>
import { useAntTable } from '@business/logics/src/useAntTable'
import { ref, reactive, inject, computed } from 'vue'
import {
  getActivityList,
  publishActivity,
  updateActivitySort,
  delActivity
} from '@business/common/src/activity/api/activity'
import {
  PUBLISH_TYPE_MAP,
  PUBLISH_TYPE,
  APPLY_OBJECT_TYPE,
  ACTIVITY_STATUS,
  ACTIVITY_STATUS_MAP,
  ACTIVITY_STATUS_BRIDGE
} from '@business/common/src/activity/constant'
import { getMapDict, downloadFile } from '@business/common/src/utils/index'
import { Modal, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import WeightModal from './weightModal.vue'
const props = defineProps({
  /** 拓展表格字段 */
  inheritedColumns: {
    type: Object,
    default: {}
  },
  /** 拓展表格筛选项  秘锋请传ckey */
  tableFilter: {
    type: Object,
    default: {}
  },
  /** 拓展表格操作列  (record)=>{return JSX} */
  tableOperations: {
    type: Function,
    default: () => {}
  }
})
const WeightModalRef = ref()
const $filters = inject('$filters')
const tableData = ref([])
const tableFilter = reactive({
  activityName: '',
  id: '',
  isPublish: PUBLISH_TYPE.PUBLISHED,
  status: APPLY_OBJECT_TYPE.ALL,
  ...props.tableFilter
})

const columns = reactive([
  {
    title: '活动ID',
    dataIndex: 'id',
    filter: true,
    hideInTable: true
  },
  {
    title: '活动名称',
    dataIndex: 'activityName',
    filter: true,
    hideInTable: true,
    valueType: 'text'
  },
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
    customRender: ({ record: { id, activityName } }) => {
      return (
        <div>
          <div class="red-label">{id}</div>
          <div>{activityName}</div>
        </div>
      )
    }
  },
  {
    title: '报名时间',
    dataIndex: 'applyTime',
    customRender: ({ record: { applyStartTime, applyEndTime } }) => {
      return (
        <div>
          <div>{$filters.dateFormat(applyStartTime)}~</div>
          <div>{$filters.dateFormat(applyEndTime)}</div>
        </div>
      )
    }
  },
  {
    title: '活动时间',
    dataIndex: 'activityTime',
    customRender: ({ record: { startTime, endTime } }) => {
      return (
        <div>
          <div>{$filters.dateFormat(startTime)}~</div>
          <div>{$filters.dateFormat(endTime)}</div>
        </div>
      )
    }
  },
  {
    title: '活动地点',
    dataIndex: 'addressInfo',
    width: 200,
    customRender: ({ record: { province, city, area, addressInfo } }) => {
      return (
        <div>
          {province}
          {city}
          {area}
          {addressInfo}
        </div>
      )
    }
  },
  ...props.inheritedColumns,
  {
    title: '参加人数',
    dataIndex: 'isLimit',
    customRender: ({ record }) => {
      return record.isLimit ? `限${record.applyCount}人` : '不限'
    },
    width: 100
  },
  {
    title: '活动状态',
    dataIndex: 'status',
    customRender: ({ record: { status } }) => {
      return (
        <div>
          <a-badge status={ACTIVITY_STATUS_BRIDGE.get(+status)} />
          {ACTIVITY_STATUS_MAP.get(status)}
        </div>
      )
    },
    filter: computed(() => tableFilter.isPublish === PUBLISH_TYPE.PUBLISHED),
    valueType: 'select',
    formItemProps: {
      options: getMapDict(ACTIVITY_STATUS_MAP),
      allowClear: true
    },

    initialValue: ACTIVITY_STATUS.ALL
  },
  {
    title: '创建时间',
    dataIndex: 'createdTs',
    customRender: ({ record: { createdTs } }) => {
      return <div>{$filters.dateFormat(createdTs)}</div>
    }
  },
  { title: '创建人', dataIndex: 'operatorName', width: 100 },
  {
    title: '权重',
    dataIndex: 'sort',
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
    dataIndex: 'operate',
    fixed: 'right',
    width: 100,
    customRender: ({ record }) => {
      return (
        <div>
          {tableFilter.isPublish === PUBLISH_TYPE.PUBLISHED ? (
            <div>
              <a-button onClick={() => showUpdate(record, PUBLISH_TYPE.UN_PUBLISH)} type="link" danger>
                取消发布
              </a-button>
              {record.status !== 1 ? (
                <a-button type="link" onClick={() => goVerifyDetail(record)}>
                  报名审核
                </a-button>
              ) : (
                ''
              )}
            </div>
          ) : (
            <div>
              <div>
                <a-button type="link" onClick={() => showUpdate(record, PUBLISH_TYPE.PUBLISHED)}>
                  发布
                </a-button>
              </div>
              <a-button type="link" onClick={() => showDel(record)} danger>
                删除
              </a-button>
            </div>
          )}
          <div>
            <a-button type="link" onClick={() => editActivity(record)}>
              编辑
            </a-button>
          </div>
          <a-button type="link" onClick={() => goDetail(record)}>
            详情
          </a-button>
          {record.status === ACTIVITY_STATUS.STARTING && !tableFilter.ckey ? (
            <a-button type="link" onClick={() => updateTime(record)}>
              修改活动时间
            </a-button>
          ) : (
            ''
          )}
          <a-button type="link" onClick={() => downloadFile({ url: record.qrCode, title: '活动二维码' })}>
            下载活动二维码
          </a-button>
          <a-button type="link" onClick={() => copyActivityUrl(record)}>
            复制活动链接
          </a-button>
          {props.tableOperations(record)}
        </div>
      )
    }
  }
])

const handlerSearch = value => {
  delete value.id
  Object.assign(tableFilter, value)
  fetchTableData(1)
}
const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
  async fetchFn({ current: page, pageSize }) {
    const params = {
      page,
      pageSize,
      ...tableFilter
    }
    const { data } = await getActivityList(params)
    tableData.value = data.list || []
    return { total: data.totalRows || 0 }
  }
})
fetchTableData()

const showUpdate = ({ id }, isPublish) => {
  Modal.confirm({
    title: '提示',
    content: isPublish === 0 ? '确认取消发布吗？' : '确认发布吗？',
    async onOk() {
      const params = {
        id,
        isPublish
      }
      await publishActivity(params)
      fetchTableData()
    }
  })
}
// 编辑活动
const router = useRouter()
const editActivity = row => {
  router.push({
    name: '创建活动',
    query: {
      activityId: row.id,
      type: PUBLISH_TYPE_MAP.get(tableFilter.isPublish)
    }
  })
}
// 查看审核详情
const goVerifyDetail = ({ id: activityId }) => {
  router.push({
    name: '审核详情',
    query: {
      activityId,
      status: 0
    }
  })
}
const showDel = ({ id }) => {
  Modal.confirm({
    title: '提示',
    content: '确认删除吗？',
    async onOk() {
      await delActivity({ id })
      fetchTableData()
    }
  })
}
const goDetail = ({ id: activityId }) => {
  router.push({
    name: 'activityDetail',
    query: {
      activityId
    }
  })
}
const copyActivityUrl = async r => {
  await navigator.clipboard.writeText(r.activityUrl)
  message.success('复制成功')
}
</script>
<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
</style>
