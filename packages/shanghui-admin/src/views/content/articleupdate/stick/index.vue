<template>
  <PlusTable
    row-key="id"
    :loading="loading"
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    @change="handleTableChange"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'handle'">
        <a-button type="link" @click="updateTop(record)"> 取消置顶 </a-button>
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
</template>

<script setup>
import PlusTable from '@business/components/src/plus-table/PlusTable.vue'
import InputModel from '@business/components/src/input-modal/index.vue'
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { getTopList, cancelTop, updateArticleTopLevel } from '@business/common/src/content/api/article'
import { EDITOR_STATUS_TYPE } from '@/constant/content'
const columns = ref([
  {
    title: '文章ID',
    dataIndex: 'id'
  },
  {
    title: '文章标题',
    dataIndex: 'title'
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
          {record.topLevel}
        </a-button>
      )
    }
  },
  {
    title: '创建信息',
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.operator}</div>
          <div>{record.createdTs}</div>
        </div>
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
    title: '发布时间',
    customRender: ({ record }) => {
      return (
        <div>
          {record.status === EDITOR_STATUS_TYPE.TIMEING ? <div>定时发布</div> : null}
          <div>{record.publishTs}</div>
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
const updateTop = async record => {
  const params = {
    id: record.id
  }
  await cancelTop(params)
  fetchTableData()
}

const setlevelId = ref()
const setLevelVisiable = ref(false)
const setlevelVal = ref()
const checkLevel = (rule, value) => {
  if (!/^([0-9]\d*)$/.test(value) && value !== '' && value !== null) {
    return Promise.reject(new Error('权重范围：0-999'))
  } else if (value > 999) {
    return Promise.reject(new Error('权重范围：0-999'))
  } else {
    return Promise.resolve()
  }
}
// 权重rule
const levelRules = {
  level: [
    { required: true, message: '权重不能为空', trigger: ['blur', 'change'] },
    {
      validator: checkLevel,
      trigger: ['blur', 'change']
    }
  ]
}
const setLevel = record => {
  setlevelId.value = record.id
  setlevelVal.value = record.level
  setLevelVisiable.value = true
}

const handleLevelOK = async level => {
  const params = {
    id: setlevelId.value,
    level
  }
  await updateArticleTopLevel(params)
  proxy.$message.success('修复权重成功')
  setLevelVisiable.value = false
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
  } = await getTopList(conditionQuery)
  tableData.value = data
  return {
    total: 0
  }
}
const { pagination, fetchTableData, loading, handleTableChange } = useAntTable({ fetchFn })
</script>
<style lang="scss" scoped></style>
