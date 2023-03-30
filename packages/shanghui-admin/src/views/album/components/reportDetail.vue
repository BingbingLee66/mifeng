<template>
  <a-modal :visible="visible" title="相册举报详情" width="50%" @cancel="$emit('update:visible', false)">
    <div class="flex-x-start-center">
      <div>冻结处理人： {{ albumInfo.freezeBy }}（{{ albumInfo.freezeById }}）</div>
      <div class="ml-20">处理时间： {{ albumInfo.freezeTime }}</div>
    </div>

    <PlusTable :columns="columns" :data-source="tableData" :scroll="{ x: 'max-content' }" :loading="loading">
    </PlusTable>
    <template #footer>
      <a-button type="primary" :loading="freezeLoading" @click="onFreeze">{{
        albumInfo.albumStatus == 1 ? '冻结' : '解冻'
      }}</a-button>
      <a-button @click="$emit('update:visible', false)">返回</a-button>
    </template>
  </a-modal>
</template>
<script setup>
import { getReportById } from '@/api/report'
import { changeAlbumFreezeStatus } from '@business/common/src/album/api'
import { inject, reactive, ref, watch } from 'vue'

import { useAntTable } from '@business/logics/src/useAntTable'
import { Modal } from 'ant-design-vue'
const emit = defineEmits(['update:visible'])
const dateFormat = inject('$filters')?.dateFormat
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  albumInfo: {
    type: Object,
    default: () => {}
  }
})
const tableData = ref([])
const { fetchTableData, loading } = useAntTable({
  async fetchFn() {
    const { data } = await getReportById(props.albumInfo.albumId)
    tableData.value = data || []
  }
})
watch(
  () => props.visible,
  newV => {
    if (!newV) return
    fetchTableData()
  }
)
const columns = reactive([
  {
    title: '举报人',
    dataIndex: 'reportId',
    customRender: ({ record: { reportId, reportName } }) => {
      return (
        <div>
          <div style="color:#66b1ff">{reportId}</div>
          {reportName}
        </div>
      )
    }
  },
  {
    title: '举报内容',
    dataIndex: 'configId',
    customRender: ({ record: { configId, reportContent, configValueInfo } }) => {
      return <div>{configId === '4' ? '其他理由：' + reportContent : configValueInfo}</div>
    },
    width: 200
  },
  {
    title: '举报时间',
    dataIndex: 'reportTime',
    width: 200,
    customRender: ({ record: { reportTime } }) => {
      return <div>{dateFormat(reportTime, 'YYYY-MM-DD HH:mm')}</div>
    }
  }
])
const freezeLoading = ref(false)
const onFreeze = async () => {
  const [status, id] = [props.albumInfo.albumStatus, props.albumInfo.albumId]
  Modal.confirm({
    title: '',
    content: status ? '是否冻结？' : '是否解冻？',
    async onOk() {
      await changeAlbumFreezeStatus({ id, status: +!status })
      emit('success')
      emit('update:visible', false)
    }
  })
}
</script>
<style lang="scss" scoped></style>
