<template>
  <PlusTable
    row-key="edge_device_id"
    :loading="loading"
    :scroll="{ x: 'max-content' }"
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    @change="handleTableChange"
    bordered
  >
    <template #toolBar>
      <AButton type="primary" @click="addColumn"><plus-outlined />新增栏目</AButton>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'id'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'handle'">
        <a-button type="link" @click="openVisible(record)"> 编辑 </a-button>
        <a-button v-if="record.status === SETUP_STSTUE_TYPEY.NORMAL" type="link" @click="updateState(record)">
          冻结
        </a-button>
        <a-button v-else type="link" @click="updateState(record)"> 解冻 </a-button>
      </template>
    </template>
  </PlusTable>
  <InputModel
    v-model:visible="setLevelVisiable"
    label="权重"
    title="权重"
    :rules="levelRules.level"
    :defaultValue="setlevelVal"
    @ok="handleLevelOK"
  />
  <a-modal :visible="addColumnVisiable" title="添加/编辑栏目" @ok="handleColumnOK" @cancel="handleColumnClose">
    <a-form ref="formRef" :model="addLevelObj" :rules="levelRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
      <a-form-item label="栏目名称" name="columnName" has-feedback>
        <a-input allowClear v-model:value="addLevelObj.columnName" placeholder="限5个字符内" />
      </a-form-item>
      <a-form-item label="权重" name="level" has-feedback>
        <a-input allowClear v-model:value="addLevelObj.level" placeholder="请输入大于零的数" />
      </a-form-item>
      <a-form-item label="展示路径" name="showUrl">
        <a-radio-group v-model:value="addLevelObj.showUrl">
          <a-radio :value="1">标签聚合页</a-radio>
          <a-radio :value="2">合作商会</a-radio>
          <a-radio :value="3">合作商会+标签聚合页</a-radio>
          <a-radio :value="4">tab栏</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import PlusTable from '@business/components/src/plus-table/PlusTable.vue'
import InputModel from '@business/components/src/input-modal/index.vue'
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { getInfoColumnList, save, updateStatus, updateColumnLevel } from '@business/common/src/content/api/columnsetup'
import { SETUP_TYPEURL_MAP, SETUP_STSTUE_TYPEY } from '@/constant/content'
const columns = ref([
  {
    title: '序号',
    key: 'id'
  },
  {
    title: '栏目',
    dataIndex: 'columnName'
  },
  {
    title: '展示路径',
    customRender: ({ record }) => {
      return SETUP_TYPEURL_MAP.get(record.typeUrl)
    }
  },
  {
    title: '权重',
    dataIndex: 'level',
    customRender: ({ record }) => {
      return (
        <a-button
          type="link"
          onclick={() => {
            setLevel(record)
          }}
        >
          {record.level}
        </a-button>
      )
    }
  },
  {
    title: '更新信息',
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.updater}</div>
          <div>{record.updatedTs}</div>
        </div>
      )
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }) => {
      return (
        <a-badge
          status={{ 0: 'error', 1: 'success' }[record.status]}
          text={{ 0: '已冻结', 1: '正常' }[record.status]}
        />
      )
    }
  },
  {
    title: '操作',
    key: 'handle'
  }
])
const tableData = ref([])
const { proxy } = getCurrentInstance()
const updateState = async record => {
  const params = {
    id: record.id,
    action: record.status === 0 ? 'active' : 'notactive'
  }
  await updateStatus(params)
  fetchTableData()
}

const setlevelId = ref()
const setLevelVisiable = ref(false)
const setlevelVal = ref()
const addLevelObj = reactive({
  columnName: '',
  level: '',
  showUrl: ''
})
const checkLevel = (rule, value) => {
  if (!/^([0-9]\d*)$/.test(value) && value !== '' && value !== null) {
    return Promise.reject(new Error('权重范围：0-999'))
  } else if (value > 999) {
    return Promise.reject(new Error('权重范围：0-999'))
  } else {
    return Promise.resolve()
  }
}
const checkName = (rule, value) => {
  if (Object.values(value).length > 5) {
    return Promise.reject(new Error('栏目名称不能字数大于5'))
  } else {
    return Promise.resolve()
  }
}
// 权重rule
const levelRules = {
  columnName: [
    { required: true, message: '请输入栏目名称', trigger: ['blur', 'change'] },
    {
      validator: checkName,
      trigger: ['blur', 'change']
    }
  ],
  level: [
    { required: true, message: '权重不能为空', trigger: ['blur', 'change'] },
    {
      validator: checkLevel,
      trigger: ['blur', 'change']
    }
  ],
  showUrl: [{ required: true, message: '展示路径不能为空', trigger: ['blur', 'change'] }]
}
const setLevel = record => {
  setlevelId.value = record.id
  setlevelVal.value = record.level
  setLevelVisiable.value = true
}

const addColumnVisiable = ref(false)
const addColumn = () => {
  addColumnVisiable.value = true
}

const handleLevelOK = async level => {
  const params = {
    id: setlevelId.value,
    level
  }
  await updateColumnLevel(params)
  proxy.$message.success('修复权重成功')
  setLevelVisiable.value = false
}
const formRef = ref(null)
const OrgObj = {
  id: null,
  level: null,
  typeUrl: 1,
  columnName: null
}
const handleColumnOK = async () => {
  try {
    await formRef.value.validateFields()
    const params = {
      columnName: addLevelObj.columnName,
      level: addLevelObj.level,
      typeUrl: addLevelObj.showUrl,
      id: addLevelObj.id
    }
    await save(params)
    fetchTableData()
    handleColumnClose()
  } catch (err) {
    console.error(err)
  }
}
const handleColumnClose = () => {
  Object.assign(addLevelObj, OrgObj)
  formRef.value.resetFields()
  addColumnVisiable.value = false
}
const openVisible = record => {
  addLevelObj.columnName = record.columnName
  addLevelObj.level = record.level
  addLevelObj.showUrl = record.typeUrl
  addLevelObj.id = record.id
  addColumnVisiable.value = true
}

onMounted(async () => {
  await fetchTableData()
})
const fetchFn = async pageOption => {
  const conditionQuery = reactive({
    pageSize: pageOption.pageSize,
    page: pageOption.current
  })
  const {
    data: { data }
  } = await getInfoColumnList(conditionQuery)
  tableData.value = data.list
  return {
    total: data.totalRows
  }
}
const { pagination, fetchTableData, loading, handleTableChange } = useAntTable({ fetchFn })
</script>
<style lang="scss" scoped></style>
