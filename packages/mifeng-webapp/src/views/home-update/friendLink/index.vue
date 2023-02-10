<template>
  <AddDialog v-model:visible.async="addDialogVisible" @fetchFn="fetchFriendData" />
  <PlusTable
    :columns="columns"
    :data-source="tableData"
    row-key="id"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :request="handlerSearch"
  >
    <template #toolBar>
      <a-button class="ml20" type="primary" @click="addDialogVisible = true"><plus-outlined />添加友情单位</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex == 'friendChamberLogo'">
        <a-image
          class="chamber-logo"
          :src="record.friendChamberLogo"
          fallback="data:image/png;base64,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"
        />
      </template>
      <template v-if="column.dataIndex == 'weight'">
        <a-button class="p0" type="link" @click="openInputModal({ defaultValue: record.weight, payload: record })">
          {{ record.weight }}
        </a-button>
      </template>
      <template v-if="column.dataIndex == 'addInfo'">
        <div>{{ store.state.user.name }}</div>
        <div>{{ $filters.dateFormat(+record.createdTs) }}</div>
      </template>
      <template v-if="column.dataIndex == 'operation'">
        <a-button class="p0" type="link" @click="handleDel(record.id)" danger>移除</a-button>
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
  />
</template>
<script>
import { ref, defineAsyncComponent, watch } from 'vue'
import { Modal } from 'ant-design-vue'
import { useAntTable } from '@/use/useAntTable'
import { getFriendLinks, editFriendLinksWeight, delFriendLinks } from '@/api/home/friendLink'
import { useStore } from 'vuex'
import { useInputModal } from '@/components/InputModal/hooks'

export default {
  components: {
    AddDialog: defineAsyncComponent(() => import('./components/AddDialog.vue')),
    InputModal: defineAsyncComponent(() => import('@/components/InputModal/index.vue'))
  },
  setup() {
    const addDialogVisible = ref(false)
    const store = useStore()
    const tableFilter = ref({
      friendChamberName: ''
    })
    const tableData = ref([])
    let queryFirstPage = 0

    watch(
      () => tableFilter.value.friendChamberName,
      () => {
        queryFirstPage = 1
      },
      { immediate: true }
    )
    const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
      async fetchFn({ current, pageSize }) {
        const { data } = await getFriendLinks({
          pageNum: queryFirstPage || current,
          pageSize,
          chamberName: tableFilter.value.friendChamberName
        })
        queryFirstPage = 0
        tableData.value = data.list || []

        return { total: data.totalRows || 0 }
      }
    })
    const handlerSearch = async value => {
      tableFilter.value = value
      setTimeout(() => {
        fetchTableData()
      }, 500)
    }

    fetchTableData()
    const handleDel = useDelHotDeman(fetchTableData)
    const fetchFriendData = () => {
      addDialogVisible.value = false
      fetchTableData()
    }
    return {
      store,
      addDialogVisible,
      columns: [
        { title: '商协会logo', dataIndex: 'friendChamberLogo', width: 200, align: 'center' },
        {
          title: '商协会名称',
          dataIndex: 'friendChamberName',
          align: 'center',
          width: 200,
          filter: true,
          valueType: 'text',
          formItemProps: {
            placeholder: '请输入关键词'
          },
          span: 12
        },
        { title: '权重', dataIndex: 'weight', width: 120, align: 'center' },
        { title: '添加信息', dataIndex: 'addInfo', width: 200, align: 'center' },
        { title: '操作', dataIndex: 'operation', width: 120, align: 'center', fixed: 'right' }
      ],
      tableData,
      fetchTableData,
      pagination,
      handleTableChange,
      loading,
      handlerSearch,
      ...useInputModal({
        async handleOk(value, payload) {
          const { state, msg } = await editFriendLinksWeight({ id: payload.id, value })
          if (state !== 1) throw msg
          payload.weight = value
        },

        inputModalRules: [
          { required: true, message: '请输入权重', trigger: 'blur' },
          { pattern: /^[\d]{0,3}$/, message: '请输入0-999数字', trigger: ['blur', 'change'] }
        ]
      }),
      fetchFriendData,
      handleDel
    }
  }
}

// 移除热门供需
function useDelHotDeman(cb = () => {}) {
  return function handleDel(id) {
    Modal.confirm({
      title: '移除',
      content: '确认将该商协会从友情单位中移除？',
      async onOk() {
        const { state, msg } = await delFriendLinks(id)
        if (state !== 1) throw msg
        cb()
      }
    })
  }
}
</script>
<style>
.chamber-logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
.action {
  font-weight: bold;
}
</style>
