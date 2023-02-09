<template>
  <PlusTable
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    row-key="id"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    bordered
  >
    <template #toolBar>
      <a-button type="primary" @click="memberDialogVisible = true">选择会员</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex == 'permissions'">
        <div v-for="item in record.permissionsName" :key="item">
          {{ item }}
        </div>
      </template>
      <template v-if="column.dataIndex == 'operation'">
        <a-button class="p0" type="link" @click="handelOperation(record)">配置权限</a-button>
        <a-button class="p0 delBtn" type="link" @click="handleDel(record.id)" danger>移除</a-button>
      </template>
      <template v-if="column.dataIndex == 'updateInfo'">
        <div>{{ record.operatorName }}</div>
        <div>{{ $filters.dateFormat(new Date(+record.updatedTs)) }}</div>
      </template>
    </template>
  </PlusTable>
  <MemberDialog v-model:visible.async="memberDialogVisible" @fetchFn="fetchMemberData"></MemberDialog>

  <a-modal v-model:visible="authorityVisible" title="配置权限" @ok="handleAuthorityOk">
    <p>请选择要查看的数据</p>
    <a-checkbox-group v-model:value="authorityValue" :options="authorityOptions" />
  </a-modal>
</template>
<script>
import { ref, defineAsyncComponent, inject } from 'vue'
import { useAntTable } from '@/use/useAntTable'
import { Modal } from 'ant-design-vue'
import { getMemberPermissionsList, deleteMemberPermission, setMemberPermissions } from '@/api/authority/front-manager'
export default {
  components: {
    MemberDialog: defineAsyncComponent(() => import('./components/MemberDialog.vue'))
  },
  setup() {
    const memberDialogVisible = ref(false)
    const authorityVisible = ref(false)
    const tableData = ref([])
    const ckey = inject('ckey')
    const authorityValue = ref([])
    const changeAuthorId = ref('')

    const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
      async fetchFn({ current, pageSize }) {
        const { data } = await getMemberPermissionsList({
          page: current,
          pageSize,
          ckey: ckey.value
        })
        tableData.value = data.list || []
        tableData.value.forEach(item => {
          const permissionsName = []
          if (item.permissions && item.permissions.length) {
            item.permissions.forEach(v => {
              const name = v === 1 ? '供需撮合' : v === 2 ? '激活与活跃' : 'APP工作台'
              permissionsName.push(name)
            })
          } else {
            permissionsName.push('--')
          }
          item.permissionsName = permissionsName
        })
        return { total: data.totalRows || 0 }
      }
    })
    fetchTableData()
    const handleAuthorityOk = async () => {
      authorityVisible.value = false
      await setMemberPermissions({ id: changeAuthorId.value, permissions: authorityValue.value })
      fetchTableData()
    }

    const handelOperation = record => {
      authorityVisible.value = true
      authorityValue.value = record.permissions
      changeAuthorId.value = record.id
    }

    const handleDel = useDelAuthority(fetchTableData)

    const fetchMemberData = () => {
      memberDialogVisible.value = false
      fetchTableData()
    }
    return {
      memberDialogVisible,
      authorityVisible,
      columns: [
        { title: '用户名', dataIndex: 'name' },
        { title: '部门', dataIndex: 'departMent' },
        { title: '会内职务', dataIndex: 'postName' },
        { title: '数据查看权限', dataIndex: 'permissions' },
        { title: '操作', dataIndex: 'operation' },
        { title: '更新信息', dataIndex: 'updateInfo' }
      ],
      tableData,
      fetchTableData,
      pagination,
      handleTableChange,
      loading,
      authorityOptions: [
        { value: 1, label: '激活与活跃' },
        { value: 2, label: '供需撮合' },
        { value: 3, label: 'APP工作台' }
      ],
      authorityValue,
      handleAuthorityOk,
      handelOperation,
      handleDel,
      fetchMemberData
    }
  }
}

function useDelAuthority(cb = () => {}) {
  return function handleDel(id) {
    Modal.confirm({
      title: '移除',
      content: '移除后，该会员将无法在前台查看数据，是否继续',
      async onOk() {
        await deleteMemberPermission(id)
        cb()
      }
    })
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.delBtn {
  margin-left: 10px;
}
</style>
