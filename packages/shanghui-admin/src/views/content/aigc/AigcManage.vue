<template>
  <panel>
    <a-tabs v-model:activeKey="activeName" class="bg-white" @change="fetchTableData(true)">
      <a-tab-pane :key="TAB.TURN_ON" :tab="TAB.TURN_ON" />
      <a-tab-pane :key="TAB.TIMES_CONFIG" :tab="TAB.TIMES_CONFIG" />
    </a-tabs>
    <PlusTable
      v-show="activeName === TAB.TURN_ON"
      :loading="loading"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      @change="handleTableChange"
      bordered
    >
      <template #toolBar><div></div></template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'handle'">
          <a-switch
            v-model:checked="record.switchStatus"
            :loading="record.loading"
            @click="(checked, event) => changeStatusHandler(checked, event, record)"
          />
        </template>
      </template>
    </PlusTable>
    <div v-show="activeName === TAB.TIMES_CONFIG">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 3 }"
        :wrapperCol="{ span: 12 }"
        autocomplete="off"
        @finish="save"
      >
        <a-form-item label="是否限制次数" name="useLimit">
          <a-radio-group v-model:value="formState.useLimit">
            <a-radio :value="false">不限制</a-radio>
            <a-radio :value="true">限制</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item v-if="formState.useLimit" label="每日初始体验次数" name="useQuota">
          <a-input v-model:value="formState.useQuota" />
        </a-form-item>

        <a-form-item label="分享成功奖励次数" name="shareAddUseQuota">
          <a-input v-model:value="formState.shareAddUseQuota" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 2 }">
          <a-button type="primary" html-type="submit">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
  </panel>
</template>
<script setup>
import { ref } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { queryAigcList, switchStatus, queryLimitListConfig, setLimitListConfig } from '@/api/content/aigc'
import { message } from 'antd'
const TAB = {
  TURN_ON: '开启功能',
  TIMES_CONFIG: '次数配置'
}
const activeName = ref(TAB.TURN_ON)
const columns = ref([
  { title: '应用场景', dataIndex: 'controlFunction', key: 'controlFunction', width: 120 },
  { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 175 },
  { title: '更新人', dataIndex: 'operatorName', key: 'operatorName', width: 175 },
  { title: '操作', key: 'handle', width: 150, fixed: 'right' }
])
const tableData = ref([])

const formState = ref({
  shareAddUseQuota: '',
  useLimit: true,
  useQuota: ''
})

const fetchFn = async pageOption => {
  const prams = {
    pageSize: pageOption.pageSize,
    page: pageOption.current
  }
  const {
    data: { records }
  } = await queryAigcList(prams)
  tableData.value = records.map(item => {
    return { ...item, loading: false }
  })
  return {
    total: records.total
  }
}
const { pagination, fetchTableData, loading } = useAntTable({ fetchFn })
fetchTableData(true)
const handleTableChange = () => {
  fetchTableData(true)
}
const changeStatusHandler = async (checked, event, record) => {
  record.loading = true
  try {
    await switchStatus({
      id: record.id,
      switchStatus: record.switchStatus
    })
  } catch (error) {
    record.switchStatus = !record.switchStatus
    message.error(error.message)
  }
  record.loading = false
}

const queryLimit = async () => {
  const { data } = await queryLimitListConfig()
  formState.value = data
}
queryLimit()

const save = async () => {
  await setLimitListConfig({
    shareAddUseQuota: formState.value.shareAddUseQuota,
    useLimit: formState.value.useLimit,
    useQuota: formState.value.useQuota
  })
}
</script>
