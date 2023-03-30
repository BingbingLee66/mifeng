<template>
  <PlusTable
    row-key="id"
    :loading="loading"
    :columns="fiveGColumns"
    :data-source="tableData"
    :pagination="pagination"
    :request="handleSearch"
    @change="handleTableChange"
    bordered
  >
    <template #toolBar>
      <div>
        <a-button
          class="ml-3"
          type="primary"
          @click="
            router.push({
              path: '/mass-notification/5g/create'
            })
          "
        >
          新建模板
        </a-button>
      </div>
    </template>
  </PlusTable>
  <Preview5G v-model:visible="dialog.visible" :template-id="dialog.data.id" />
</template>

<script setup>
import PlusTable from '@business/components/src/plus-table/PlusTable.vue'
import { ref, reactive, onMounted } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { get5GTemplateList, deleteTemplate } from '@/api/mass-notification'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { auditStatus } from '../../../constant/mass-notification'
import { formatSize } from '@/utils/formate-num'
import { Modal } from 'ant-design-vue'
import Preview5G from './components/Preivew5G.vue'
const router = useRouter()
const fiveGColumns = ref([
  {
    title: '模板ID',
    dataIndex: 'id'
  },
  {
    title: '标题',
    dataIndex: 'templateName',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入文章标题'
    },
    width: 300
  },
  {
    title: '大小',
    dataIndex: 'size',
    customRender: ({ record }) => {
      return formatSize(record.extend.size, 1)
    }
  },
  {
    title: '提审时间',
    dataIndex: 'createdTs',
    customRender: ({ record }) => {
      return dayjs(+record.createdTs).format('YYYY-MM-DD hh:mm:ss')
    }
  },
  {
    title: '审核状态',
    dataIndex: 'auditStatus',
    filter: true,
    valueType: 'select',
    initialValue: '',
    formItemProps: {
      options: [
        { value: '', label: '全部' },
        { value: 0, label: '审核中' },
        { value: 1, label: '已通过' },
        { value: 2, label: '未通过' }
      ]
    },
    customRender: ({ record }) => {
      return auditStatus[record.auditStatus]
    }
  },
  {
    title: '操作',
    key: 'handle',
    customRender: ({ record }) => {
      return (
        <div>
          <a-button type="link" onClick={() => openDialog(record)}>
            预览
          </a-button>
          <a-button type="link" onClick={() => onDelete(record)}>
            删除
          </a-button>
        </div>
      )
    }
  }
])

const query = reactive({
  templateName: '',
  auditStatus: ''
})
// const { proxy } = getCurrentInstance()
const dialog = reactive({
  visible: false,
  data: {}
})
const openDialog = record => {
  dialog.visible = true
  dialog.data = record
}
const onDelete = async record => {
  Modal.confirm({
    content: '确定删除？',
    okText: '删除',
    async onOk() {
      await deleteTemplate(record.id)
      await fetchTableData()
    }
  })
}

const tableData = ref([])
onMounted(async () => {
  await fetchTableData()
})
const fetchFn = async pageOption => {
  const conditionQuery = reactive({
    pageSize: pageOption.pageSize,
    page: pageOption.current,
    ...query
  })
  const { data } = await get5GTemplateList(conditionQuery)
  tableData.value = data.list
  return {
    total: data.totalRows
  }
}
const { pagination, fetchTableData, loading, handleTableChange } = useAntTable({ fetchFn })

const handleSearch = value => {
  Object.assign(query, value)
  fetchTableData({ current: 1 })
}
</script>

<style lang="scss" scoped></style>
