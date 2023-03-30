<template>
  <PlusTable
    :scroll="{ x: 'max-content' }"
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template #bodyCell="{ record, column, index }">
      <template v-if="column.dataIndex === 'index'">
        {{ index + 1 }}
      </template>
      <template v-if="column.dataIndex === 'changeStatus'">
        <a-switch v-model:checked="record.isCheck" @change="handleSwitchChange(record)" />
      </template>
      <template v-if="column.dataIndex === 'order'">
        <arrow-up-outlined v-if="index !== 0" style="cursor: pointer" @click="handleOrder(record, index, 0)" />
        <arrow-down-outlined
          v-if="index !== tableData.length - 1"
          class="ml10"
          style="cursor: pointer"
          @click="handleOrder(record, index, 1)"
        />
      </template>
      <template v-if="column.dataIndex === 'operate'">
        <a-button type="link" @click="openInputModal({ defaultValue: record.name, payload: record })">编辑</a-button>
        <a-button type="link" @click="handleStatus(record.id, 1)" v-if="record.status === '0'">展示</a-button>
        <a-button type="text" @click="handleStatus(record.id, 0)" danger v-if="record.status === '1' && !record.isCheck"
          >隐藏</a-button
        >
      </template>
    </template>
  </PlusTable>
  <InputModal
    v-model:visible="visible"
    title="编辑栏目"
    label="栏目名称"
    :defaultValue="defaultValue"
    :confirmLoading="confirmLoading"
    :rules="inputModalRules"
    @ok="handleOk"
  >
  </InputModal>
</template>
<script setup>
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { ref, defineAsyncComponent, watch } from 'vue'
import { getTabList, showTab, defaultTab, sortTab, updateTab } from '@/api/home-update/tab'
import { TAB_STATUS_MAP } from '@/constant/home-update'

import { useInputModal } from '@business/components/src/input-modal/hook'
const InputModal = defineAsyncComponent(() => import('@business/components/src/input-modal'))
const { openInputModal, visible, confirmLoading, handleOk, defaultValue, inputModalRules } = useInputModal({
  async handleOk(name, { id }) {
    await updateTab({ id, name })
    fetchTableData()
  },
  inputModalRules: [
    { min: 1, max: 6, message: '只限6个字以内哦', trigger: 'blur' },
    { required: true, message: '请输入栏目名称', trigger: 'blur' }
  ]
})
const props = defineProps({
  clientType: { type: String, default: '' }
})
watch(
  () => props.clientType,
  () => {
    fetchTableData(true)
  }
)
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80
  },
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80
  },
  {
    title: '栏目名称',
    dataIndex: 'name',
    width: 100
  },
  {
    title: '顺序',
    dataIndex: 'order',
    width: 130
  },
  {
    title: '默认选中',
    dataIndex: 'changeStatus',
    width: 130
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }) => {
      return record.isCheck ? '默认使用中' : TAB_STATUS_MAP.get(record.status)
    }
  },
  {
    title: '更新时间',
    dataIndex: 'updatedTs',
    width: 130
  },
  {
    title: '操作人',
    dataIndex: 'operator',
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
    const { data } = await getTabList({
      type: props.clientType
    })
    data.length &&
      data.forEach(item => {
        item.isCheck = item.changeStatus === '1'
      })
    tableData.value = data
    return {
      total: data.length
    }
  }
})
fetchTableData()
const handleStatus = async (id, status) => {
  try {
    await showTab({
      id,
      status
    })
    fetchTableData()
  } catch (err) {}
}
const handleSwitchChange = async ({ id, isCheck }) => {
  try {
    await defaultTab({
      id,
      status: isCheck ? 1 : 0
    })
    fetchTableData()
  } catch (err) {}
}

const handleOrder = async (record, index, status) => {
  const moveid = record.id
  const bemoveid = status ? tableData.value[index + 1].id : tableData.value[index - 1].id
  await sortTab({ moveid, bemoveid, status })
  fetchTableData()
}
</script>
<style lang="scss" scoped></style>
