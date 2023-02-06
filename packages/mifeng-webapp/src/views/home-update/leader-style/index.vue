<template>
  <PlusTable :columns="columns" :data-source="tableData" row-key="id" :pagination="false" :loading="loading">
    <template #toolBar>
      <a-button class="ml20" type="primary" @click="showAddLeader"><plus-outlined />新增领导</a-button>
      <a-tooltip placement="topLeft">
        <template #title>
          <span>可设置小程序的商会主页是否使用此功能</span>
        </template>
        <a-button class="ml20" type="primary" @click="switchVisible = true">功能开关</a-button>
      </a-tooltip>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'serialNumber'">
        {{ index + 1 }}
      </template>
      <template v-if="column.dataIndex === 'order'">
        <arrow-up-outlined v-if="index !== 0" style="cursor: pointer" @click="handleOrder(record, index, 1)" />
        <arrow-down-outlined
          v-if="index !== tableData.length - 1"
          class="ml10"
          style="cursor: pointer"
          @click="handleOrder(record, index)"
        />
      </template>
      <template v-if="column.dataIndex === 'showStatus'">
        <a-badge :status="record.showStatus ? 'success' : 'error'" /> {{ record.showStatus ? '展示' : '隐藏' }}
      </template>
      <template v-if="column.dataIndex === 'operate'">
        <span class="operate">
          <a-button type="link" @click="editLeader(record)">编辑</a-button>
          <a-button type="link" @click="handleStatus(record)">{{ record.showStatus ? '隐藏' : '展示' }}</a-button>
          <a-button type="link" danger @click="delLeader(record)">{{ record.showStatus ? '' : '删除' }}</a-button>
        </span>
      </template>
    </template>
  </PlusTable>
  <a-modal v-model:visible="switchVisible" title="功能开关" @ok="handleSwitchOk" @cancel="cancelSwitch">
    <a-switch v-model:checked="switchType" checked-children="使用" un-checked-children="不使用" />
  </a-modal>
  <addLeader v-model:visible.async="addLeaderVisible" @close="closeAddLeader" v-model:editLeader="leaderRecord" />
</template>

<script>
import { ref, defineAsyncComponent, inject } from 'vue'
import { useAntTable } from '@/use/useAntTable'
import { Modal } from 'ant-design-vue'
import Home from '@/api/home-config/Home'

export default {
  components: {
    addLeader: defineAsyncComponent(() => import('./component/addLeaderDialog.vue')),
    PlusTable: defineAsyncComponent(() => import('@/components/plusTable/PlusTable.vue'))
  },
  setup() {
    const ckey = inject('ckey')
    const tableData = ref([])
    const switchType = ref(false)
    const switchVisible = ref(false)
    const addLeaderVisible = ref(false)
    const leaderRecord = ref({})
    const { fetchTableData, handleTableChange, loading } = useAntTable({
      async fetchFn() {
        const { data } = await Home.getLeaderList({
          pageNum: 1,
          pageSize: 100
        })
        tableData.value = data.list || []
        return { total: data.totalRows || 0 }
      }
    })
    let switchDataType = false
    fetchTableData()
    getSwitch()
    const showAddLeader = () => {
      addLeaderVisible.value = true
      leaderRecord.value = {}
    }
    const handleOrder = async (record, index, isUp) => {
      const sourceId = record.id
      const targetId = isUp ? tableData.value[index - 1].id : tableData.value[index + 1].id
      await Home.sortLeader({ sourceId, targetId })
      fetchTableData()
    }
    const editLeader = record => {
      leaderRecord.value = record
      addLeaderVisible.value = true
    }

    const handleStatus = async record => {
      await Home.changeLeaderStatus({
        id: record.id,
        type: record.showStatus === 1 ? 0 : 1
      })
      fetchTableData()
    }

    const delLeader = record => {
      Modal.confirm({
        title: '移除',
        content: '确认移除吗?',
        async onOk() {
          await Home.deleteLeader(record.id)
          fetchTableData()
        }
      })
    }

    const handleSwitchOk = async () => {
      await Home.switchLeader({ ckey: ckey.value || '', type: switchType.value ? 1 : 0 })
      switchVisible.value = false
      fetchTableData()
      getSwitch()
    }

    const cancelSwitch = () => {
      switchVisible.value = false
      switchType.value = switchDataType
    }
    function getSwitch() {
      async function getSwitchType() {
        const { data } = await Home.getSwitchLeader(ckey.value)
        switchDataType = data
        switchType.value = data
      }
      getSwitchType()
    }
    function closeAddLeader() {
      addLeaderVisible.value = false
      fetchTableData()
    }
    return {
      columns: [
        { title: '序号', dataIndex: 'serialNumber', align: 'center', width: 80 },
        { title: 'ID', dataIndex: 'id', width: 200, align: 'center' },
        { title: '领导名称', dataIndex: 'leaderName', width: 200, align: 'center' },
        { title: '会内职务', dataIndex: 'postName', width: 200, align: 'center' },
        { title: '顺序', dataIndex: 'order', align: 'center', width: 200 },
        { title: '状态', dataIndex: 'showStatus', align: 'center', width: 200 },
        { title: '操作', dataIndex: 'operate', align: 'center', width: 240, fixed: 'right' }
      ],
      tableData,
      fetchTableData,
      handleTableChange,
      loading,
      showAddLeader,
      handleOrder,
      handleStatus,
      delLeader,
      switchVisible,
      switchType,
      handleSwitchOk,
      cancelSwitch,
      addLeaderVisible,
      closeAddLeader,
      editLeader,
      leaderRecord
    }
  }
}
</script>
<style lang="scss" scoped>
.operate a {
  margin-left: 10px;
}
</style>
