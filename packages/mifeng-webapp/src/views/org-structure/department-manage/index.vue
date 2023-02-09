<template>
  <PlusTable
    :loading="loading"
    :dataSource="tableData"
    :columns="cols"
    @change="handleTableChange"
    :scroll="{ x: 'max-content' }"
    childrenColumnName="departmentRespList"
    rowKey="id"
  >
    <template #toolBar><a-button type="text">在这里创建、编辑和删除部门</a-button></template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'operate'">
        <template v-if="!record.departmentName">
          <a-button @click="editForm(record, 'add')" type="link"> 添加部门</a-button>
        </template>
        <template v-else>
          <a-button @click="editForm(record, 'edit')" type="link"> 编辑部门名</a-button>
          <a-button @click="editForm(record, 'add')" type="link"> 添加下级部门</a-button>
          <a-button @click="showDel(record)" type="link" danger> 删除部门</a-button>
        </template>
      </template>
    </template>
  </PlusTable>
  <a-modal v-model:visible="modalVisible" :title="formObj.title" @ok="saveForm" okText="保存">
    <a-form :model="formObj" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
      <a-form-item label="上级部门" name="departmentParentName" v-show="formObj.type !== 'edit'">
        {{ formObj.departmentParentName }}
      </a-form-item>
      <a-form-item label="部门名称" name="name">
        <a-input v-model:value="formObj.name" maxlength="20" placeholder="请输入部门名称" show-count />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="delVisible" title="删除职位" @ok="del" okText="删除">
    <p>确认删除该部门吗？</p>
    <p>如果该部门有下级部门，也将一并删除。</p>
    <p>部门下的成员将自动挪到商会下面。</p>
  </a-modal>
</template>

<script>
import { inject, reactive, ref, getCurrentInstance } from 'vue'
import { useAntTable } from '@/use/useAntTable'
import { getDepartmentList, saveDepartment, delDepartment } from '@/api/org-structure/org'
export default {
  setup() {
    const tableObj = table()
    return {
      ...tableObj
    }
  }
}

// 表格
function table() {
  const tableData = ref([])
  const ckey = inject('ckey')
  const cols = [
    {
      title: '部门名称',
      dataIndex: 'departmentName',
      customRender: ({ record }) => {
        if (record.name) {
          return record.name
        }
      }
    },
    {
      title: '成员数',
      dataIndex: 'peopleCount',
      customRender: ({ record }) => {
        if (record.count) {
          return record.count
        }
      }
    },
    { title: '操作', dataIndex: 'operate' }
  ]
  const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
    fetchFn: async () => {
      const params = {
        ckey: ckey.value,
        parentId: 0
      }
      const res = await getDepartmentList(params)
      tableData.value = res.data.data
      return { total: tableData.value.length }
    }
  })
  fetchTableData()
  const formObj = reactive({
    ckey: ckey.value,
    name: '',
    id: '',
    type: '',
    title: '',
    departmentParentId: '',
    departmentParentName: ''
  })
  const { proxy } = getCurrentInstance()
  const editForm = (data, type) => {
    formObj.type = type
    if (data.allParentName && data.allParentName.split(',').length === 20) {
      proxy.$message.error('当前部门层级已超过20层，无法添加')
      return
    }
    if (type === 'edit') {
      formObj.name = data.departmentName
      formObj.id = data.id
      formObj.title = '编辑部门'
    } else {
      formObj.name = ''
      formObj.id = ''
      formObj.title = '添加下级部门'
    }
    formObj.departmentParentName = data.departmentName || data.name
    formObj.departmentParentId = data.id
    modalVisible.value = true
  }

  const modalVisible = ref(false)
  const saveForm = async () => {
    if (!formObj.name.trim()) {
      proxy.$message.warn('部门名称不能为空')
      return
    }
    const params = {
      ckey: ckey.value,
      id: formObj.id,
      departmentName: formObj.name,
      parentId: formObj.departmentParentId
    }
    const { state } = await saveDepartment(params)
    if (state === 1) {
      fetchTableData()
      modalVisible.value = false
    }
  }
  const showDel = record => {
    formObj.id = record.id
    delVisible.value = true
  }
  const delVisible = ref(false)
  const del = async () => {
    await delDepartment({ id: formObj.id })
    fetchTableData()
    delVisible.value = false
  }

  return {
    formObj,
    tableData,
    cols,
    pagination,
    handleTableChange,
    loading,
    fetchTableData,
    editForm,
    modalVisible,
    saveForm,
    delVisible,
    del,
    showDel
  }
}
</script>

<style scoped>
.tit {
  margin: 20px 0;
}
</style>
