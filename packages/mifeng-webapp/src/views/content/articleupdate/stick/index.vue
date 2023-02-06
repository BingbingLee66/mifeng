<template>
  <PlusTable
    row-key="edge_device_id"
    bordered
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :customRow="customRow"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'sort'">
        <a-tooltip placement="topLeft" title="拖动排序" arrow-point-at-center>
          <menu-outlined />
        </a-tooltip>
      </template>
      <template v-if="column.key === 'created'">
        <div>{{ record.operator }}</div>
        <div>{{ record.createdTs }}</div>
      </template>
      <template v-if="column.key === 'updated'">
        <div>{{ record.updater }}</div>
        <div>{{ record.updatedTs }}</div>
      </template>
      <template v-if="column.key === 'firstPublishTs'">
        <div v-if="record.status === ARTICLE_STATUS.normalSetTime">定时发布</div>
        {{ record.firstPublishTs }}
      </template>
      <template v-if="column.key === 'status'">
        <div v-if="record.status === ARTICLE_STATUS.freezeByChamber">已冻结(商会)</div>
        <div v-if="record.status === ARTICLE_STATUS.freezeByPlatform">已冻结(平台)</div>
        <div v-if="record.status === ARTICLE_STATUS.normal">正常</div>
      </template>
      <template v-if="column.key === 'handle'">
        <AButton type="link" @click="updateTop(record)" danger> 取消置顶 </AButton>
      </template>
    </template>
  </PlusTable>
  <!-- 置顶弹窗 -->
  <a-modal v-model:visible="stickShow" title="置顶设置" width="500px" @ok="updateTopTime" @cancel="cancelUpdate">
    <a-form :model="formState" ref="stickForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item label="置顶时间" name="stickTime" :rules="[{ required: true, message: '请输入置顶时间' }]">
        <a-range-picker v-model:value="formState.stickTime" show-time value-format="YYYY-MM-DD HH:mm:ss" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { chamberTopList, updateChamberTop, getTopList, updateTopActiveTime, updateTopSort } from '@/api/content/article'
import { defineComponent, ref, onMounted, inject, reactive } from 'vue'
import { useAntTable } from '@/use/useAntTable/index'
import { ARTICLE_STATUS } from '../../../../constant/content'
import { useDrag } from '@/use/useTableDrag'
import dayjs from 'dayjs'
import PlusTable from '@/components/plusTable/PlusTable.vue'
const columns = [
  {
    title: '排序',
    dataIndex: 'sort',
    width: 120
  },
  { title: '文章ID', dataIndex: 'id', key: 'id', width: 120 },
  { title: '文章标题', dataIndex: 'title', key: 'title', width: 150 },
  { title: '创建信息', key: 'created', width: 150 },
  { title: '更新信息', key: 'updated', width: 150 },
  { title: '发布时间', dataIndex: 'firstPublishTs', key: 'firstPublishTs', width: 150 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 150 },
  { title: '操作', key: 'handle', width: 150, fixed: 'right' }
]
export default defineComponent({
  components: { PlusTable },
  setup() {
    const ckey = inject('ckey')
    const tableData = ref([])
    const fetchFn = async pageOption => {
      if (ckey.value) {
        const conditionQuery = {
          limit: pageOption.pageSize,
          page: pageOption.current,
          ckey: ckey.value
        }
        const { data } = await chamberTopList(conditionQuery)
        tableData.value = data
      } else {
        const {
          data: { data }
        } = await getTopList()
        tableData.value = data
      }
      return {
        total: 0
      }
    }
    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({ fetchFn })
    const currentId = ref(null)

    // update置顶
    const updateTop = async row => {
      // 这里只有取消置顶 统一都是传0
      const params = { articleId: row.id, ckey: row.ckey, type: 0 }
      await updateChamberTop(params)
      fetchTableData(true)
    }
    const updateSort = async list => {
      const sortInfoList = list.map((item, index) => {
        return { id: item.id, sort: 999 - index }
      })
      await updateTopSort({
        ckey: ckey.value,
        sortInfoList
      })
    }
    const { customRow } = useDrag(tableData, updateSort)
    // 修改置顶时间
    const stickShow = ref(false)
    const formState = reactive({ stickTime: [], articleId: null, ckey: '', type: 1 })
    const initStickTime = () => {
      const start = dayjs()
      const end = dayjs().add(1, 'year')
      return [start, end]
    }
    const showStickModal = row => {
      formState.articleId = row.id
      formState.ckey = row.ckey
      if (row.validPeriodStartTs) {
        formState.stickTime = [row.validPeriodStartTs, row.validPeriodEndTs]
      } else {
        // 兼容旧数据
        formState.stickTime = initStickTime()
      }
      stickShow.value = true
    }
    const stickForm = ref()
    // 文章置顶
    const updateTopTime = async () => {
      await stickForm.value.validateFields()
      const { articleId, ckey } = formState
      const data = {
        articleId,
        ckey,
        startTs: new Date(formState.stickTime[0]).getTime(),
        endTs: new Date(formState.stickTime[1]).getTime()
      }
      await updateTopActiveTime(data)
      fetchTableData(true)
      stickShow.value = false
    }
    const cancelUpdate = () => {
      // 清空表单校验
      stickForm.value.resetFields()
      stickShow.value = false
    }
    // 在页面加载后请求数据
    onMounted(() => {
      fetchTableData(true)
    })

    return {
      columns,
      ckey,
      pagination,
      handleTableChange,
      fetchTableData,
      loading,
      tableData,
      currentId,
      ARTICLE_STATUS,
      fetchFn,
      updateTop,
      updateTopTime,
      customRow,
      cancelUpdate,
      stickForm,
      showStickModal,
      stickShow,
      formState
    }
  }
})
</script>
