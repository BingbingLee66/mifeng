<template>
  <a-tabs v-model:activeKey="clientType" class="bg-white pl-8" @change="fetchTableData">
    <a-tab-pane :key="CLIENT_TYPE.MINIPROGRAM" tab="小程序" />
    <a-tab-pane :key="CLIENT_TYPE.APP" tab="app" />
  </a-tabs>
  <PlusTable
    :scroll="{ x: 'max-content' }"
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template #toolBar>
      <a-button type="primary" @click="openModal()">新增功能入口</a-button>
    </template>
    <template #bodyCell="{ record, column, index }">
      <template v-if="column.dataIndex === 'index'">
        {{ index + 1 }}
      </template>
      <template v-if="column.dataIndex === 'icon'">
        <img class="img-preview" :src="record.icon" />
      </template>
      <template v-if="column.dataIndex === 'order'">
        <arrow-up-outlined v-if="index !== 0" style="cursor: pointer" @click="handleOrder(record, -1)" />
        <arrow-down-outlined
          v-if="index !== tableData.length - 1"
          class="ml10"
          style="cursor: pointer"
          @click="handleOrder(record, 1)"
        />
      </template>
      <template v-if="column.dataIndex === 'updateTs'">
        <div>{{ $filters.dateFormat(record.updateTs) }}</div>
      </template>
      <template v-if="column.dataIndex === 'operate'">
        <a-button type="link" @click="openModal(record)">编辑</a-button>
        <a-button type="link" @click="handleStatus(record)" v-if="record.status === 2">启用</a-button>
        <a-button type="text" @click="handleStatus(record)" danger v-if="record.status === 1">冻结</a-button>
        <a-button type="text" @click="handleDelete(record)" danger v-if="record.status !== 1">删除</a-button>
      </template>
    </template>
  </PlusTable>
  <FormDialog ref="modalRef" @refresh="fetchTableData" :clientType="clientType" />
</template>
<script>
import { ref } from 'vue'
import { CLIENT_TYPE, KINGKONG_STATUS_MAP } from '@/constant/home-update'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import {
  getKingkongListV1,
  changeKingkongOrder,
  deleteKingkongV1,
  changeKingkongStatus
} from '@/api/home-update/kingkong'
import { Modal } from 'ant-design-vue'
import FormDialog from './components/form-dialog.vue'
export default {
  components: {
    FormDialog
  },
  setup() {
    const clientType = ref(0)
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 80
      },
      {
        title: 'ID',
        dataIndex: 'kingKongId',
        width: 80
      },
      {
        title: '入口名称',
        dataIndex: 'title',
        width: 100
      },
      {
        title: '入口icon',
        dataIndex: 'icon',
        width: 100
      },
      {
        title: '关联内容',
        dataIndex: 'content',
        width: 100
      },
      {
        title: '顺序',
        dataIndex: 'order',
        width: 130
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        customRender: ({ record }) => {
          return KINGKONG_STATUS_MAP.get(record.status)
        }
      },
      {
        title: '更新时间',
        dataIndex: 'updateTs',
        width: 130
      },
      {
        title: '操作人',
        dataIndex: 'updaterName',
        width: 180
      },
      {
        title: '操作',
        dataIndex: 'operate',
        width: 130,
        fixed: 'right'
      }
    ]
    const tableData = ref([])
    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
      fetchFn: async pageOption => {
        const {
          data: { list, totalRows }
        } = await getKingkongListV1({
          clientType: clientType.value,
          pageSize: pageOption.pageSize,
          pageNum: pageOption.current
        })
        tableData.value = list
        return {
          total: totalRows
        }
      }
    })
    fetchTableData()
    const handleOrder = async (data, sort) => {
      await changeKingkongOrder(data.kingKongId, data.num + sort)
      fetchTableData()
    }
    const handleDelete = async ({ kingKongId }) => {
      Modal.confirm({
        title: '提示',
        content: '确认移除该金刚区吗?',
        async onOk() {
          await deleteKingkongV1([kingKongId])
          fetchTableData()
        }
      })
    }
    /** 启用/冻结 */
    const handleStatus = async ({ kingKongId, status }) => {
      const status2 = status === 1 ? 2 : 1
      try {
        await changeKingkongStatus(kingKongId, status2)
        fetchTableData()
      } catch (err) {}
    }
    const modalRef = ref()
    const openModal = (record = {}) => {
      modalRef.value.open(record)
    }
    return {
      clientType,
      CLIENT_TYPE,
      columns,
      pagination,
      handleTableChange,
      fetchTableData,
      loading,
      tableData,
      handleOrder,
      handleDelete,
      handleStatus,
      openModal,
      modalRef
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
.img-preview {
  width: 100px;
  height: 100px;
}
</style>
