<template>
  <PlusTable
    :loading="loading"
    :dataSource="tableData"
    :columns="cols"
    @change="handleTableChange"
    :scroll="{ x: 'max-content' }"
  >
    <template #toolBar>
      <a-button type="primary" v-action="'添加职位'" @click="addPost"><plus-outlined />添加职位</a-button>
    </template>
    <template #bodyCell="{ record, column, index }">
      <template v-if="column.dataIndex === 'index'">
        {{ index + 1 }}
      </template>
      <template v-if="column.dataIndex === 'operate'">
        <a-button @click="editForm(record)" v-action="'编辑'" type="link"> 编辑</a-button>
        <a-button @click="showDel(record)" type="link" danger> 删除</a-button>
      </template>
    </template>
  </PlusTable>
  <a-modal v-model:visible="modalVisible" title="新增/编辑职位" @cancel="cancelVisible" @ok="saveForm" okText="保存">
    <a-form ref="form" :model="formObj" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" :rules="rules">
      <a-form-item label="职位名称" name="postName" :rules="{ validator: postNameVaild, trigger: 'blur' }">
        <a-input v-model:value="formObj.postName" maxlength="20" show-count />
      </a-form-item>
      <a-form-item label="会费" name="memberFee">
        <a-input v-model:value="formObj.memberFee" style="width: 270px" />
        <span class="member-fee">元/年</span>
      </a-form-item>

      <a-form-item label="排序" name="level">
        <a-input v-model:value="formObj.level" />
        <span style="font-size: 10px">注：数字越大排序越靠后，且此处排序决定小程序端会员展示的顺序</span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { inject, reactive, ref, getCurrentInstance } from 'vue'
import { useAntTable } from '@/use/useAntTable'
import { getList, save, del, postNameExistValid } from '@/api/member/post'
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue'
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
    { title: '序号', dataIndex: 'index', width: 80 },
    { title: '职位', dataIndex: 'postName' },
    {
      title: '会费（元/年）',
      dataIndex: 'type',
      customRender: ({ record }) => {
        if (record.memberFee >= 100000000) {
          return '￥' + record.memberFee / 100000000 + '亿'
        } else if (record.memberFee >= 10000) {
          return '￥' + record.memberFee / 10000 + '万'
        } else {
          return '￥' + record.memberFee
        }
      },
      width: 140
    },
    { title: '排序', dataIndex: 'level', width: 80 },
    { title: '添加时间', dataIndex: 'createdTs' },
    { title: '修改时间', dataIndex: 'updatedTs' },
    { title: '操作人', dataIndex: 'operator', width: 100 },
    { title: '操作', dataIndex: 'operate', fixed: 'right' }
  ]
  const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
    fetchFn: async () => {
      const {
        data: { data }
      } = await getList({ ckey: ckey.value })
      tableData.value = data
      return {
        total: tableData.value.list
      }
    }
  })
  fetchTableData()
  const formObj = reactive({
    ckey: ckey.value,
    postName: '',
    memberFee: 0,
    level: '',
    id: ''
  })
  const editForm = data => {
    formObj.id = data.id
    formObj.ckey = data.ckey
    formObj.postName = data.postName
    formObj.memberFee = data.memberFee
    formObj.level = data.level
    modalVisible.value = true
  }
  const rules = {
    memberFee: [
      {
        validator: (rule, value) => {
          if (!/^[0]$|^(([1-9]\d*)|[0]\.\d{1,2}|([1-9]\d*)\.\d{1,2})$/.test(value)) {
            return Promise.reject(new Error('可以为0或最多两位小数的正数'))
          } else {
            return Promise.resolve()
          }
        },
        trigger: 'blur'
      }
    ],
    level: [
      {
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject(new Error('排序不能为空'))
          }
          if (!/^([1-9]\d*)$/.test(value)) {
            return Promise.reject(new Error('必须是大于0的整数'))
          } else {
            return Promise.resolve()
          }
        },
        trigger: 'blur'
      }
    ]
  }
  const postNameVaild = async (rule, value) => {
    if (formObj.id) {
      return Promise.resolve()
    }
    if (!value) {
      return Promise.reject(new Error('职位名称不能为空'))
    }
    // 职位名称查重
    const params = {
      ckey: ckey.value,
      postName: formObj.postName
    }
    const response = await postNameExistValid(params)
    if (response.state === 1) {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error(response.msg))
    }
  }
  const modalVisible = ref(false)
  const addPost = () => {
    modalVisible.value = true
    formObj.postName = ''
    formObj.memberFee = 0
    formObj.level = ''
    formObj.id = ''
  }
  const cancelVisible = () => {
    modalVisible.value = false
    proxy.$refs.form.resetFields()
  }
  const saveForm = async () => {
    try {
      await proxy.$refs.form.validateFields()
      await save(formObj)
      fetchTableData()
      modalVisible.value = false
    } catch (error) {}
  }
  const { proxy } = getCurrentInstance()
  const showDel = record => {
    if (tableData.value.length <= 1) {
      proxy.$message.warning('无法删除，请至少保留一个职位')
      return
    }
    formObj.id = record.id
    Modal.confirm({
      title: '删除职位',
      content: `确定删除${record.postName} ?`,
      onOk() {
        delPost()
      }
    })
  }
  const delPost = async () => {
    try {
      await del({ id: formObj.id })
      fetchTableData()
    } catch (err) {
      if (err.state === 0) {
        Modal.confirm({
          title: '温馨提示',
          content: err.msg,
          onOk() {
            goMemberPost()
          },
          okText: '去删除',
          cancelText: '取消删除'
        })
      }
    }
  }

  const router = useRouter()
  const goMemberPost = () => {
    router.push({ name: '商协会成员', query: { memberPostType: formObj.id } })
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
    addPost,
    rules,
    postNameVaild,
    saveForm,
    showDel,
    cancelVisible
  }
}
</script>

<style scoped>
.member-fee {
  margin-left: 10px;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  font-weight: 700;
}
</style>
