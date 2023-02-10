<template>
  <div class="information-wrap">
    <PlusTable
      :scroll="{ x: 'max-content' }"
      row-key="id"
      :columns="columns"
      :data-source="tableList"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      :request="handleSearch"
    >
      <template #toolBar>
        <a-button type="primary" @click="showAddLabel(true)"><plus-outlined />创建标签组</a-button>
        <span class="create-btn">给会员打标签后，可实现快速筛选</span></template
      >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <div style="color: red">{{ record.name }}</div>
        </template>
        <template v-if="column.dataIndex === 'memberLabelVOList'">
          <template v-for="(item, index) in record.memberLabelVOList" :key="item.id">
            <a-tag class="label-btn" v-if="index < 3">{{ item.name }}</a-tag>
          </template>
          <a-button @click="showMoreLabel(record)" v-if="record.memberLabelVOList.length > 3" type="link"
            >查看更多</a-button
          >
        </template>
        <template v-if="column.dataIndex === 'operator'">
          <div>{{ record.operatorName }}</div>
          <div>{{ $filters.dateFormat(record.updatedTs) }}</div>
        </template>

        <template v-if="column.dataIndex === 'action'">
          <a-button type="link" @click="handleEdit(record)"> 编辑 </a-button>
          <a-button type="link" danger class="text-red-cur ml-10" @click="handleDel(record)">删除</a-button>
          <a-tooltip :title="`冻结原因：${record.frozenReasons}`" v-if="record.status === 2">
            <a-tag>平台冻结</a-tag>
          </a-tooltip>
        </template>
      </template>
    </PlusTable>
    <!-- 表格 end -->
    <!-- 弹框组件 -->
    <a-modal v-model:visible="labelMoreVisible" title="查看标签">
      <div>标签组：{{ moreLabelObj.name }}</div>
      <div>
        标签：<a-button
          class="label-btn more-label-btn"
          v-for="(item, index) in moreLabelObj.memberLabelVOList"
          :key="index"
          >{{ item.name }}</a-button
        >
      </div>
      <template #footer>
        <a-button type="primary" @click="labelMoreVisible = false">知道了</a-button>
      </template>
    </a-modal>
    <!-- 添加标签 -->
    <a-modal v-model:visible="addlabelVisible" title="添加标签" @ok="submitAddLabel" @cancel="cancelModal">
      <a-form :validateOnRuleChange="true" ref="formRef" labelAlign="left" :model="dynamicValidateForm">
        <a-form-item
          :label="index === 0 ? '标签组' : '标签' + index"
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="index"
          :name="['domains', index, 'value']"
          :rules="{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }"
        >
          <a-input
            style="width: 70%; margin-right: 8px"
            v-model:value="domain.value"
            allowClear
            :maxlength="15"
            showCount
          />
          <close-circle-outlined
            v-if="dynamicValidateForm.domains.length > 1"
            class="dynamic-delete-button"
            @click="removeDomain(domain)"
          />
        </a-form-item>
        <a-form-item>
          <a-button @click="addLable">添加标签</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { getLabelGroupLst, addLabelGroup, delLabelGroup, editLabelGroup } from '@/api/member/label'
import { useAntTable } from '@/use/useAntTable'
import { CloseCircleOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { cloneDeep } from 'lodash'
import PlusTable from '@/components/plusTable/PlusTable.vue'

function useTable() {
  const tableList = ref([])
  const tableFilter = {
    labelGroupName: '',
    labelName: ''
  }

  const { fetchTableData, loading, pagination, handleTableChange } = useAntTable({
    async fetchFn({ current, pageSize }) {
      const { data } = await getLabelGroupLst({
        ...tableFilter,
        pageNum: current,
        pageSize,
        selectType: 3
      })
      tableList.value = data.list || []
      return { total: data.totalRows }
    }
  })
  fetchTableData()
  const handleDel = r => {
    Modal.confirm({
      title: '删除标签组？',
      content: '确定删除该标签组吗？删除后，会员将自动卸下标签',
      async onOk() {
        const { state, msg } = await delLabelGroup({
          ids: [r.id]
        })
        if (state !== 1) throw msg
        fetchTableData()
      }
    })
  }

  const addlabelVisible = ref(false)
  const formRef = ref()
  // 1 新增 2编辑
  const labelType = ref(1)
  let delLabelItems = []
  const dynamicValidateForm = reactive({
    domains: [{ value: '' }, { value: '' }]
  })
  function showAddLabel(falg, type = 1) {
    labelType.value = type
    if (labelType.value === 1) {
      dynamicValidateForm.domains = [{ value: '' }, { value: '' }]
    }
    addlabelVisible.value = falg
  }

  function addLable() {
    formRef.value.validate().then(() => {
      if (labelSome()) dynamicValidateForm.domains.push({ value: '', key: Date.now() })
      else {
        message.error('标签存在重复值')
      }
    })
  }
  // 判断标签是否存在重复值
  const labelSome = () => {
    const arr = dynamicValidateForm.domains.map(item => item.value)
    const setArr = new Set(arr)
    if (arr.length === setArr.size) {
      // 不存在重复
      return true
    } else {
      return false
    }
  }
  // 重置
  const resetForm = () => {
    formRef.value.resetFields()
  }
  // 删除标签
  const removeDomain = item => {
    item.status = 0
    const index = dynamicValidateForm.domains.indexOf(item)
    if (index !== -1) {
      const labelItem = dynamicValidateForm.domains.splice(index, 1)
      delLabelItems.push(...cloneDeep(labelItem))
    }
  }

  const addLabelGroupFunc = async () => {
    const labelList = dynamicValidateForm.domains.slice(1).map(item => {
      return { name: item.value }
    })
    const name = dynamicValidateForm.domains[0].value
    const res = await addLabelGroup({ labelList, name, weight: 999 })

    if (res.state === 1) {
      showAddLabel(false)
      fetchTableData()
    } else {
      message.error(res.msg)
    }
  }
  // 提交标签表单
  const submitAddLabel = async () => {
    formRef.value
      .validate()
      .then(() => {
        if (labelSome()) {
          labelType.value === 1 ? addLabelGroupFunc() : editLabelGroupFunc()
        } else {
          message.error('标签存在重复值')
        }
      })
      .catch(error => {
        console.log('error', error)
      })
  }
  const currentUpdate = ref()
  // 点击编辑标签
  const handleEdit = record => {
    const { name, memberLabelVOList } = record
    dynamicValidateForm.domains = memberLabelVOList.map(item => {
      return {
        value: item.name,
        id: item.id,
        status: item.status
      }
    })

    dynamicValidateForm.domains.unshift({ value: name })
    currentUpdate.value = record
    showAddLabel(true, 2)
  }
  // 编辑标签请求
  const editLabelGroupFunc = async () => {
    const { id } = currentUpdate.value
    const { value: name } = dynamicValidateForm.domains[0]
    const labelList = dynamicValidateForm.domains.slice(1).map(item => {
      return { name: item.value, id: item.id, status: item.status }
    })
    const delLabelList = delLabelItems.map(item => {
      return { name: item.value, id: item.id, status: item.status }
    })
    const allLabelList = [...labelList, ...delLabelList]
    const param = {
      id,
      name,
      labelList: allLabelList,
      weight: 0
    }
    const res = await editLabelGroup(param)
    if (res.state === 1) {
      showAddLabel(false)
      fetchTableData()
    } else {
      message.error(res.msg)
    }
  }
  const { proxy } = getCurrentInstance()
  const cancelModal = () => {
    delLabelItems = []
    proxy.$refs.formRef.resetFields()
  }
  const handleSearch = value => {
    Object.assign(tableFilter, value)
    fetchTableData(1)
  }
  return {
    loading,
    tableList,
    pagination,
    handleTableChange,
    fetchTableData,
    handleDel,
    showAddLabel,
    addlabelVisible,
    dynamicValidateForm,
    addLable,
    removeDomain,
    resetForm,
    submitAddLabel,
    formRef,
    addLabelGroupFunc,
    handleEdit,
    currentUpdate,
    cancelModal,
    handleSearch
  }
}

export default {
  components: { CloseCircleOutlined, PlusTable },
  setup() {
    const table = useTable()

    const labelMoreVisible = ref(false)
    const moreLabelObj = ref({})
    const showMoreLabel = _obj => {
      const { name, memberLabelVOList } = _obj
      moreLabelObj.value = {
        name,
        memberLabelVOList
      }
      labelMoreVisible.value = true
    }

    return {
      ...toRefs(table),
      labelMoreVisible,
      showMoreLabel,
      moreLabelObj,
      columns: [
        {
          title: '标签组',
          dataIndex: 'labelGroupName',
          filter: true,
          hideInTable: true,
          valueType: 'text',
          formItemProps: {
            placeholder: '请输入'
          },
          span: 8
        },
        {
          title: '标签',
          dataIndex: 'labelName',
          filter: true,
          hideInTable: true,
          valueType: 'text',
          formItemProps: {
            placeholder: '标签'
          },
          span: 8
        },
        { title: '标签组', dataIndex: 'name' },
        { title: '标签', dataIndex: 'memberLabelVOList' },
        { title: '更新信息', dataIndex: 'operator' },
        { title: '操作', dataIndex: 'action' }
      ]
    }
  }
}
</script>
<style scoped lang="scss">
.label-btn {
  margin-right: 5px;
}
.more-label-btn {
  margin: 5px 5px 5px 0px;
}
.ant-form-item-control-input-content {
  display: flex;
}

.create-btn {
  margin-left: 10px;
}
</style>
