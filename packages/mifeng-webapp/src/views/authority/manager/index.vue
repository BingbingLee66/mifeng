<template>
  <PlusTable
    :data-source="tableData"
    :loading="loading"
    :pagination="pagination"
    @change="handleTableChange"
    :columns="columns"
    bordered
  >
    <template #toolBar>
      <a-button v-action="'新增角色'" type="primary" @click="showEditModal('')"> <plus-outlined />新建角色 </a-button>
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'operate'">
        <span class="operate">
          <a-button type="link" @click="setPermission(record.id)" v-action="'设置权限'">设置权限</a-button>
          <a-button type="link" @click="showEditModal(record)" v-action="'编辑角色'">编辑角色</a-button>
          <a-button
            type="link"
            @click="changeStatus(record)"
            v-action="record.status ? '冻结' : '解冻'"
            :danger="record.status"
            >{{ record.status ? '冻结' : '解冻' }}</a-button
          >
          <a-button type="link" @click="showDelModal(record)" v-action="'删除'" danger>删除</a-button>
        </span>
      </template>
    </template>
  </PlusTable>
  <a-modal v-model:visible="editNameVisible" title="新增/编辑角色" @ok="editRoleName" @cancel="cancelModal">
    <a-form :model="editRoleItem" autocomplete="off" ref="addRole">
      <a-form-item label="角色" name="roleName" :rules="[{ required: true, message: '角色不能为空' }]">
        <a-input v-model:value="editRoleItem.roleName" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { useAntTable } from '@/use/useAntTable'
import { getList, updateStatus, save, delRole } from '@/api/authority/manager'
import { ref, inject, getCurrentInstance } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const columns = [
      { title: '序号', dataIndex: 'key' },
      { title: '角色', dataIndex: 'roleName' },
      { title: '更新时间', dataIndex: 'updatedTs' },
      {
        title: '状态',
        dataIndex: 'statusName',
        customRender: ({ record }) => {
          return (
            <div>
              <a-badge status={record.status ? 'success' : 'error'} />
              {record.statusName}
            </div>
          )
        }
      },
      { title: '操作', dataIndex: 'operate' }
    ]
    const { pagination, handleTableChange, fetchTableData, loading, tableData } = getTableData()
    const ckey = inject('ckey')
    const editNameVisible = ref(false)
    const editRoleItem = ref({ roleName: '' })
    const router = useRouter()
    const { proxy } = getCurrentInstance()
    const operatetions = operations()

    return {
      tableData,
      columns,
      pagination,
      handleTableChange,
      fetchTableData,
      loading,
      editRoleItem,
      editNameVisible,
      ...operatetions
    }

    function getTableData() {
      const ckey = inject('ckey')
      const tableData = ref([])
      const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
        fetchFn: async pageOption => {
          const condition = {
            pageSize: pageOption.pageSize,
            page: pageOption.current,
            ckey: ckey.value
          }
          const {
            data: {
              data: { list, totalRows }
            }
          } = await getList(condition)
          if (list) {
            list.forEach((e, index) => {
              e.key = index + pageOption.pageSize * (pageOption.current - 1) + 1
              e.statusName = e.status ? '正常' : '已冻结'
            })
          }
          tableData.value = list
          return {
            total: totalRows
          }
        }
      })
      fetchTableData()
      return { pagination, handleTableChange, fetchTableData, loading, tableData }
    }

    function operations() {
      const cancelModal = () => {
        proxy.$refs.addRole.resetFields()
      }

      const showDelModal = ({ id }) => {
        Modal.confirm({
          title: '提示',
          content: '确定删除？',
          onOk: async () => {
            await delRole({ id })
            fetchTableData()
          },
          onCancel() {
            message.warn('取消删除')
          }
        })
      }

      const showEditModal = data => {
        editNameVisible.value = true
        // if (data) editRoleItem.value = Object.assign({}, data)
        // else editRoleItem.value = {}
        editRoleItem.value.id = data.id || ''
        editRoleItem.value.roleName = data.roleName
        editRoleItem.value.status = data.status || 1
        editRoleItem.value.ckey = data.ckey || ckey.value
      }

      const setPermission = roleId => {
        router.push('/authority/manager/setup?roleId=' + roleId)
      }

      const editRoleName = async () => {
        await proxy.$refs.addRole.validateFields()
        const { id, roleName, status, ckey } = editRoleItem.value
        if (!/^\S{1,15}$/.test(roleName)) return message.error('角色长度为1-15个字！')

        async function saveRoleName() {
          await save({ id, roleName, status, ckey }).then(res => {
            if (res.state === 0) return message.error(res.msg)
            editNameVisible.value = false
            fetchTableData()
          })
        }
        saveRoleName()
      }

      const changeStatus = async data => {
        const params = {
          id: data.id,
          action: data.status === 0 ? 'active' : 'notactive'
        }
        const { state } = await updateStatus(params)
        if (state === 1) {
          message.success(`${data.status ? '冻结成功' : '解冻成功'}`)
          fetchTableData()
        }
      }

      return {
        cancelModal,
        showDelModal,
        showEditModal,
        setPermission,
        changeStatus,
        editRoleName
      }
    }
  }
}
</script>
<style scoped>
.operate a {
  margin-right: 15px;
  color: #409eff;
}

.operate a:hover {
  color: #f4c820;
}

.centerBtn {
  left: 50%;
  margin-top: 15px;
  transform: translateX(-50%);
}
</style>
