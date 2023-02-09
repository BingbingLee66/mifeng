<template>
  <PlusTable
    :data-source="tableData"
    :loading="loading"
    :pagination="pagination"
    @change="handleTableChange"
    bordered
    :scroll="{ x: 'max-content' }"
    :columns="columns"
  >
    <template #toolBar>
      <a-button v-action="'新增成员'" type="primary" @click="showEditMemberModal('')">
        <plus-outlined />新建成员
      </a-button>
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'operate'">
        <span class="operate">
          <a-button type="link" v-action="'编辑'" @click="showEditMemberModal(record)">编辑</a-button>
          <a-button
            type="link"
            v-action="record.status ? '冻结' : '解冻'"
            @click="changeStatus(record)"
            :danger="record.status"
          >
            {{ record.status ? '冻结' : '解冻' }}
          </a-button>
          <a-button type="link" v-action="'删除'" @click="showDelModal(record)" danger>删除</a-button>
        </span>
      </template>
    </template>
  </PlusTable>
  <a-modal v-model:visible="editMemberVisible" title="新增/编辑角色" @ok="editMemberInfo" @cancel="cancelModal">
    <a-form ref="addMemberForm" :model="editMemberItem" :rules="rules" :label-col="labelCol">
      <a-form-item label="登录账号" name="userName" colon>
        <a-input v-model:value="editMemberItem.userName" />
      </a-form-item>
      <a-form-item
        label="登录密码"
        name="password"
        colon
        :require="true"
        :rules="
          !isEdit
            ? [{ required: true, trigger: 'blur', validator: checkPassword }]
            : [{ required: false, trigger: 'blur' }]
        "
      >
        <a-input-password v-model:value="editMemberItem.password" />
      </a-form-item>
      <a-form-item label="姓名" name="remark" colon validateTrigger="[]">
        <a-input v-model:value="editMemberItem.remark" />
      </a-form-item>
      <a-form-item label="所属角色" name="roleId" colon>
        <a-select placeholder="请选择角色" v-model:value="editMemberItem.roleId" :options="roleOptions"></a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { getList, updateStatus, save, delRole } from '@/api/authority/user'
import { message, Modal } from 'ant-design-vue'
import { getOptions } from '@/api/authority/manager'
import { useAntTable } from '@/use/useAntTable'
import { checkUserName, checkPassword, checkName, checkCkey } from './validator'
import { ref, reactive, inject, getCurrentInstance } from 'vue'

export default {
  setup() {
    const columns = [
      { title: '序号', dataIndex: 'key' },
      { title: '账号', dataIndex: 'userName' },
      { title: '成员名称', dataIndex: 'remark' },
      { title: '成员角色', dataIndex: 'roleName' },
      { title: '更新时间', dataIndex: 'updatedTs' },
      { title: '最近登录', dataIndex: 'lastLogonTs' },
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
      { title: '操作', dataIndex: 'operate', fixed: 'right' }
    ]
    const isEdit = ref(false)
    const rules = reactive({
      userName: [{ required: true, trigger: 'blur', validator: checkUserName, max: 20 }],
      remark: [{ required: true, trigger: 'blur', validator: checkName }],
      roleId: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
      ckey: [{ validator: checkCkey, trigger: 'change' }]
    })
    const ckey = inject('ckey')
    const { roleOptions } = getRole(ckey.value)
    const { pagination, handleTableChange, fetchTableData, loading, tableData } = getTableData()

    const editMemberVisible = ref(false)
    const editMemberItem = ref({
      userName: '',
      password: '',
      remark: undefined,
      roleId: '',
      ckey: ''
    })
    const operate = operations()

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
              e.password = ''

              for (const v of roleOptions.value) {
                if (v.value === e.roleId) {
                  e.roleName = v.label
                  break
                }
              }
              if (!e.roleName) e.roleName = '未知角色'
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

    function getRole(ckey) {
      const roleOptions = ref({})
      async function getRoleOptions() {
        const {
          data: { data }
        } = await getOptions({ ckey })

        roleOptions.value = data
      }
      getRoleOptions()

      return { roleOptions }
    }

    const { proxy } = getCurrentInstance()
    function operations() {
      const cancelModal = () => {
        proxy.$refs.addMemberForm.resetFields()
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

      const showEditMemberModal = data => {
        // 新增data为空 isEdit = false
        editMemberVisible.value = true
        if (data) {
          isEdit.value = true
          editMemberItem.value = Object.assign({}, data)
        } else {
          isEdit.value = false
          editMemberItem.value = {}
        }
      }

      const editMemberInfo = async () => {
        await proxy.$refs.addMemberForm.validateFields()
        if (!editMemberItem.value.ckey) {
          editMemberItem.value.ckey = ckey.value
        }
        await save(editMemberItem.value)
        editMemberVisible.value = false
        fetchTableData()
      }

      const changeStatus = async record => {
        const params = {
          id: record.id,
          action: record.status === 0 ? 'active' : 'notactive'
        }
        const { state } = await updateStatus(params)
        if (state === 1) {
          message.success(`${record.status ? '冻结成功' : '解冻成功'}`)
          fetchTableData()
        }
      }

      return { cancelModal, showEditMemberModal, changeStatus, showDelModal, editMemberInfo }
    }

    return {
      columns,
      rules,
      labelCol: {
        style: {
          width: '100px',
          textAlign: 'right'
        }
      },
      checkPassword,
      isEdit,
      tableData,
      pagination,
      handleTableChange,
      fetchTableData,
      loading,
      roleOptions,
      editMemberVisible,
      editMemberItem,
      ...operate
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
