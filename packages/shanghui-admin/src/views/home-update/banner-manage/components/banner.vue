<template>
  <PlusTable
    :scroll="{ x: 'max-content' }"
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template #toolBar>
      <a-button type="primary" class="mr-5" @click="openModal"><plus-outlined />新增banner图</a-button>
      <a-button type="primary" @click="openRateModal" v-if="tableData.length > 0">切换频率</a-button>
    </template>
    <template #bodyCell="{ record, column, index }">
      <template v-if="column.dataIndex === 'index'">
        {{ index + 1 }}
      </template>
      <template v-if="column.dataIndex === 'img'">
        <a-image class="img-preview" :src="record.img" />
      </template>
      <template v-if="column.dataIndex === 'num'">
        <arrow-up-outlined v-if="index !== 0" style="cursor: pointer" @click="handleOrder(record, 1)" />
        <arrow-down-outlined
          v-if="index !== tableData.length - 1"
          class="ml10"
          style="cursor: pointer"
          @click="handleOrder(record, 0)"
        />
      </template>
      <template v-if="column.dataIndex === 'updateTs'">
        <div>{{ $filters.dateFormat(record.updateTs) }}</div>
      </template>
      <template v-if="column.dataIndex === 'operate'">
        <a-button type="link" @click="openModal(record)">编辑</a-button>
        <a-button type="link" @click="handleStatus(record)" v-if="record.status === 2">启用</a-button>
        <a-button type="text" @click="handleStatus(record)" danger v-if="record.status === 1">冻结</a-button>
        <a-button type="text" @click="handleDelete(record)" danger v-if="record.status === 2">删除</a-button>
        <a-button type="link" @click="handleTop(record)" v-if="record.num !== 1 && record.status !== 2">置顶</a-button>
      </template>
    </template>
  </PlusTable>
  <FormModal ref="formDialog" :client-type="clientType" @refresh="fetchTableData" />
  <ChangeRate ref="rateDialog" @refresh="fetchTableData" />
</template>
<script setup>
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { ref, defineProps, watch } from 'vue'
import { getBannerList, changeBannerOrder, topBanner, changeBannerStatus, deleteBanner } from '@/api/content/banner'
import { BANNER_STATUS_MAP } from '@/constant/home-update'
import { Modal } from 'ant-design-vue'
import FormModal from './edit-modal.vue'
import ChangeRate from './change-rate.vue'
const props = defineProps({
  clientType: { type: String, default: '' }
})
watch(
  () => props.clientType,
  () => {
    fetchTableData(true)
  }
)
const formDialog = ref()
const openModal = (record = {}) => {
  formDialog.value.open(record)
}
const rateDialog = ref()
const openRateModal = () => {
  rateDialog.value.open(tableData.value[0].switchFrequence)
}
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80
  },
  {
    title: 'ID',
    dataIndex: 'bannerId',
    width: 80
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: 150
  },
  {
    title: '图片',
    dataIndex: 'img',
    width: 150
  },
  {
    title: '关联内容',
    dataIndex: 'content',
    width: 150
  },
  {
    title: '轮播顺序',
    dataIndex: 'num',
    width: 130
  },
  {
    title: '切换频率',
    dataIndex: 'switchFrequence',
    width: 130,
    customRender: ({ record }) => {
      return record.switchFrequence ? record.switchFrequence + 'ms' : '不切换'
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }) => {
      return BANNER_STATUS_MAP.get(record.status)
    }
  },
  {
    title: '更新时间',
    dataIndex: 'updateTs',
    width: 180
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
  fetchFn: async () => {
    const {
      data: { list, totalRows }
    } = await getBannerList({
      clientType: props.clientType,
      pageNum: 1,
      pageSize: 100
    })
    tableData.value = list
    return {
      total: totalRows
    }
  }
})
fetchTableData()
const handleTop = async ({ bannerId }) => {
  try {
    await topBanner(bannerId)
    fetchTableData()
  } catch (err) {}
}
/** 启用/冻结 */
const handleStatus = async ({ bannerId, status }) => {
  try {
    await changeBannerStatus({
      bannerId,
      status: status === 1 ? 2 : 1
    })
    fetchTableData()
  } catch (err) {}
}
const handleDelete = async ({ bannerId }) => {
  Modal.confirm({
    title: '提示',
    content: '确认删除该banner图吗?',
    async onOk() {
      await deleteBanner([bannerId])
      fetchTableData()
    }
  })
}
const handleOrder = async (record, status) => {
  const { bannerId } = record
  const num = status ? record.num - 1 : record.num + 1
  await changeBannerOrder({ bannerId, num, clientType: props.clientType })
  fetchTableData()
}
</script>
<style lang="scss" scoped>
.img-preview {
  width: 90px;
  height: 90px;
}
</style>
