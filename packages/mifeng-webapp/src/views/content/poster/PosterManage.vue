<template>
  <PlusTable
    class="p-main-padding p-poster-list"
    headerTitle="海报列表"
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content', y: '55vh' }"
    row-key="id"
    :pagination="pagination"
    @change="handleTableChange"
  >
    <template #toolBar>
      <RouterLink to="/content/poster/create">
        <a-button type="primary">
          <template #icon> <PlusOutlined /> </template>新建
        </a-button>
      </RouterLink>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'hyalineQrcodeImage'">
        <a-image class="w-[50px] h-[50px] overflow-hidden" :width="50" :height="50" :src="record.posterImage" />
      </template>
      <template v-if="column.dataIndex === 'status'">
        <a-badge
          :status="POSTER_STATUS_BADGE_MAP.get(record.status)"
          :text="POSTER_STATUS_TEXT_MAP.get(record.status)"
        />
      </template>
      <template v-if="column.dataIndex === 'action'">
        <RouterLink :to="`/content/poster/edit/${record.id}`">
          <a-button size="small" type="link" primary>编辑</a-button>
        </RouterLink>
        <a-button size="small" type="link" primary>
          <RouterLink to="/mass-notification/mass-list">短信记录</RouterLink>
        </a-button>
        <a-button size="small" type="link" primary @click="showWxQrCode(record)">微信分享</a-button>
        <a-button size="small" type="link" danger @click="handlerDelete(record)">删除</a-button>
      </template>
    </template>
  </PlusTable>
  <!-- 微信二维码 -->
  <a-image
    :style="{ display: 'none' }"
    :preview="{
      visible: qrCodeVisible,
      onVisibleChange: setQrCodeVisible
    }"
    :src="qrCodeImage"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { Modal } from 'ant-design-vue'
import { deletePoster } from '@/api/content/poster'
import { usePosterList } from '@/views/content/poster/usePoster'
import { POSTER_STATUS_TEXT_MAP } from '@/constant/poster'
import { PlusOutlined } from '@ant-design/icons-vue'
const POSTER_STATUS_BADGE_MAP = new Map([
  [0, 'success'],
  [1, 'error']
])

// share
const useShare = () => {
  const qrCodeVisible = ref(false)
  const qrCodeImage = ref('')

  const setQrCodeVisible = value => {
    qrCodeVisible.value = value
  }
  const showWxQrCode = record => {
    setQrCodeVisible(true)
    qrCodeImage.value = record.hyalineQrcodeImage
  }

  return {
    showWxQrCode,
    qrCodeVisible,
    setQrCodeVisible,
    qrCodeImage
  }
}

// table
const useTable = () => {
  const handlerDelete = record => {
    // 删除
    Modal.confirm({
      title: '删除',
      content: '是否确定删除该海报？',
      type: 'warning',
      async onOk() {
        await deletePoster(record.id)
        const index = tableData.value.findIndex(item => item.id === record.id)
        if (index > -1) {
          tableData.value.splice(index, 1)
        }
      }
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: 60,
      customRender: ({ index }) => query.page * query.pageSize - query.pageSize + index + 1
    },
    {
      title: '标题',
      dataIndex: 'title'
    },
    {
      title: '新增时间',
      dataIndex: 'createTime'
    },
    {
      title: '状态',
      dataIndex: 'status'
    },
    {
      title: '预览',
      dataIndex: 'hyalineQrcodeImage'
    },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 200 }
  ]

  const { query, list: tableData } = usePosterList()

  const pagination = computed(() => {
    return {
      pageSize: query.pageSize,
      current: query.page,
      total: query.total
    }
  })

  const handleTableChange = async ({ current }) => {
    query.page = current
  }

  return {
    handleTableChange,
    pagination,
    handlerDelete,
    columns,
    tableData
  }
}

const { handleTableChange, pagination, handlerDelete, columns, tableData } = useTable()
const { qrCodeVisible, setQrCodeVisible, qrCodeImage, showWxQrCode } = useShare()
</script>

<style lang="scss" scoped>
.p-poster-list {
  :deep(.p-main-padding) {
    padding: 0;
  }
}
</style>
