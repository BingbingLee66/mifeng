<template>
  <a-tabs
    v-model:activeKey="activeKey"
    class="bg-white pl-8"
    @change="
      handlerSearch({
        activityName: '',
        id: null,
        status: 0
      })
    "
  >
    <a-tab-pane key="published" tab="已发布" />
    <a-tab-pane key="unpublish" tab="未发布" />
  </a-tabs>
  <PlusTable
    :columns="columns"
    :data-source="list"
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
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'listImage'">
        <a-image
          style="width: 88px; height: 60px"
          :src="record.listImage"
          :preview="{ imgVisible: false }"
          @click="showImage(record.listImage)"
        />
        <div style="display: none">
          <a-image-preview-group :preview="{ imgVisible, onVisibleChange: vis => (imgVisible = vis) }">
            <a-image v-for="(item, index) in qrCode" :src="item" :key="index" />
          </a-image-preview-group>
        </div>
      </template>
      <template v-if="column.dataIndex === 'applyTime'">
        <div>{{ $filters.dateFormat(record.applyStartTime) }}~</div>
        <div>{{ $filters.dateFormat(record.applyEndTime) }}</div>
      </template>
      <template v-if="column.dataIndex === 'activityTime'">
        <div>{{ $filters.dateFormat(record.startTime) }}~</div>
        <div>{{ $filters.dateFormat(record.endTime) }}</div>
      </template>
      <template v-if="column.dataIndex === 'addressInfo'">
        <div>{{ record.province }}{{ record.city }}{{ record.area }}{{ record.addressInfo }}</div>
      </template>
      <template v-if="column.dataIndex === 'createdTs'">
        <div>{{ $filters.dateFormat(record.createdTs) }}</div>
      </template>
      <template v-if="column.dataIndex === 'sort'">
        <span class="blue-label" @click="openInputModal({ defaultValue: record.sort, payload: record })">
          {{ record.sort }}
        </span>
      </template>
      <template v-if="column.dataIndex === 'operate'">
        <div v-if="activeKey == 'published'">
          <a-button @click="showUpdate(record, 0)" type="link" danger>取消发布</a-button>
          <a-button v-if="record.status !== 1" type="link" @click="goVerifyDetail(record)">报名审核</a-button>
        </div>
        <div v-else>
          <div><a-button type="link" @click="showUpdate(record, 1)">发布</a-button></div>
          <a-button type="link" @click="showDel(record)" danger>删除</a-button>
        </div>
        <div><a-button type="link" @click="editActivity(record)">编辑</a-button></div>
        <a-button type="link" @click="goDetail(record)">详情</a-button>
        <a-button v-if="record.status === 2 && !ckey" type="link" @click="updateTime(record)">修改活动时间</a-button>
        <a-button type="link" @click="downloadQrCode(record)">下载活动二维码</a-button>
        <a-button type="link" @click="copyActivityUrl(record)">复制活动链接</a-button>
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
      <div>权重请控制在0-999，权重为0不在前台展示</div>
    </template>
  </InputModal>
</template>
<script>
import PlusTable from '@/components/plusTable/PlusTable.vue'
import { useAntTable } from '@/use/useAntTable'
import { ref, reactive, inject, computed } from 'vue'
import { APPLY_OBJECT_MAP, PUBLISH_TYPE_MAP } from '@/constant/activity'
import { Modal, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useInputModal } from '@/components/InputModal/hooks'
import InputModal from '@/components/InputModal/index.vue'
import { getActivityList, publishActivity, updateActivitySort, delActivity } from '@/api/activity/activity'
import { downloadByBlob } from '../util'
export default {
  components: {
    PlusTable,
    InputModal
  },
  setup() {
    const tableInfo = useTable()
    const imgVisible = ref(false)
    const qrCode = ref([])
    const showImage = image => {
      imgVisible.value = true
      qrCode.value = [image]
    }
    return {
      ...tableInfo,
      showImage,
      imgVisible,
      qrCode,
      ...useInputModal({
        async handleOk(sort, payload) {
          const { state, msg } = await updateActivitySort({ id: payload.id, sort })
          if (state !== 1) throw msg
          payload.sort = sort
        },
        inputModalRules: [
          { required: true, message: '请输入权重', trigger: 'blur' },
          { pattern: /^[\d]{0,3}$/, message: '请输入0-999数字', trigger: ['blur', 'change'] }
        ]
      })
    }
  }
}
function useTable() {
  const activeKey = ref('published')
  const tableColumns = [
    { title: '活动列表图', dataIndex: 'listImage', width: 180 },
    {
      title: '活动ID/名称',
      dataIndex: 'id',
      width: 200,
      customRender: ({ record }) => {
        return (
          <div style="width:200px">
            <div style="color:red">{record.id}</div>
            <div>{record.activityName}</div>
          </div>
        )
      }
    },
    { title: '报名时间', dataIndex: 'applyTime' },
    { title: '活动时间', dataIndex: 'activityTime' },
    { title: '活动地点', dataIndex: 'addressInfo', width: 200 },
    {
      title: '报名对象',
      dataIndex: 'applyObject',
      customRender: ({ record }) => {
        return APPLY_OBJECT_MAP.get(record.applyObject)
      },
      width: 100
    },
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
      customRender: ({ record }) => {
        const index = statusList.findIndex(item => item.id === record.status)
        return (
          <div>
            <a-badge status={statusMap.get(+record.status)} />
            {statusList[index].name}
          </div>
        )
      }
    },
    { title: '创建时间', dataIndex: 'createdTs' },
    { title: '创建人', dataIndex: 'operatorName', width: 100 },
    { title: '权重', dataIndex: 'sort', width: 80 },
    { title: '操作', dataIndex: 'operate', fixed: 'right', width: 100 }
  ]
  const statusList = [
    { id: 0, name: '全部' },
    { id: 1, name: '待开始' },
    { id: 2, name: '进行中' },
    { id: 3, name: '已结束' },
    { id: 4, name: '报名中' }
  ]
  const statusMap = new Map([
    [1, 'default'],
    [2, 'processing'],
    [3, 'error'],
    [4, 'processing']
  ])
  const columns = reactive([
    {
      title: '活动ID',
      dataIndex: 'id',
      filter: true,
      hideInTable: true,
      valueType: 'text'
    },
    {
      title: '活动名称',
      dataIndex: 'activityName',
      filter: true,
      hideInTable: true,
      valueType: 'text'
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      filter: computed(() => activeKey.value === 'published'),
      hideInTable: true,
      valueType: 'select',
      formItemProps: {
        options: statusList,
        fieldNames: { label: 'name', value: 'id' },
        allowClear: true
      }
    },
    ...tableColumns
  ])
  const list = ref([])
  const tableFilter = reactive({
    activityName: '',
    id: null,
    status: 0
  })
  const handlerSearch = value => {
    Object.assign(tableFilter, value)
    fetchTableData({ current: 1 })
  }

  const ckey = inject('ckey')
  const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
    async fetchFn({ current: page, pageSize }) {
      const params = {
        page,
        pageSize,
        ...tableFilter,
        isPublish: PUBLISH_TYPE_MAP.get(activeKey.value),
        ckey: ckey.value
      }
      const { data } = await getActivityList(params)
      list.value = data.list || []
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
        type: PUBLISH_TYPE_MAP.get(activeKey.value)
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
        const params = {
          id
        }
        await delActivity(params)
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
  const downloadQrCode = r => {
    downloadByBlob(r.qrCode, '活动二维码')
  }
  const copyActivityUrl = r => {
    navigator.clipboard.writeText(r.activityUrl)
    message.success('复制成功')
  }
  return {
    activeKey,
    ckey,
    columns,
    list,
    fetchTableData,
    pagination,
    handleTableChange,
    loading,
    handlerSearch,
    showUpdate,
    editActivity,
    goVerifyDetail,
    showDel,
    goDetail,
    downloadQrCode,
    copyActivityUrl
  }
}
</script>
<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
</style>
