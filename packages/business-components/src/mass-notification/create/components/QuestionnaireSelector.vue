<template>
  <a-modal
    :visible="visible"
    width="75%"
    title="选择问卷"
    @ok="onSubmit"
    @update:visible="$emit('update:visible', $event)"
    v-bind="$attrs"
  >
    <PlusTable
      class="p0"
      :columns="columns"
      :data-source="tableData"
      :scroll="{ x: 'max-content' }"
      row-key="id"
      :pagination="pagination"
      :request="handleSearch"
      :row-selection="{
        selectedRowKeys: selectedData.map(v => v.id),
        onSelect,
        preserveSelectedRowKeys: true,
        hideSelectAll: true
      }"
      @change="handleTableChange"
    />
  </a-modal>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { STATE_MAP } from '@business/common/src/quest-survey/constant'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { getQuestionnaireList } from '@business/common/src/quest-survey/api'
import { message } from 'ant-design-vue'
export default {
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: null
    }
  },
  emits: ['update:value', 'update:visible'],
  setup(props, { emit }) {
    // 查询参数
    const query = reactive({ title: '' })
    // 表格数据
    const tableData = ref([])
    // 分页参数 | 表格change事件处理 | 拉取表格数据函数
    const { pagination, handleTableChange, fetchTableData } = useAntTable({
      async fetchFn({ current, pageSize }) {
        const { title = '' } = query
        const { data } = await getQuestionnaireList({
          pageNum: current,
          pageSize,
          questionnaireTitle: title
        })
        tableData.value = data.list
        return { total: data.totalRows }
      }
    })
    // 执行查询筛选
    const handleSearch = e => {
      Object.assign(query, e)
      fetchTableData()
    }

    fetchTableData()

    const selectedData = ref([])
    const onSelect = (record, selected) => {
      selectedData.value = selected ? [record] : []
    }

    watch(
      () => props.visible,
      visible => {
        if (visible) selectedData.value = props.value ? [props.value] : []
      },
      {
        immediate: true
      }
    )

    const onSubmit = async () => {
      if (!selectedData.value.length) return message.warning('请选择问卷')
      emit('update:value', selectedData.value[0] || null)
      emit('update:visible', false)
    }
    return {
      query,
      columns: [
        { title: 'ID', dataIndex: 'id' },
        {
          title: '问卷标题',
          dataIndex: 'title',
          filter: true,
          valueType: 'text',
          formItemProps: {
            placeholder: '请输入',
            initialValue: ''
          }
        },
        { title: '状态', dataIndex: 'state', customRender: ({ record }) => STATE_MAP[record.state] },
        { title: '答卷', dataIndex: 'answersCount' },
        { title: '创建时间', dataIndex: 'createdTs' }
      ],
      tableData,
      pagination,
      handleTableChange,
      fetchTableData,
      handleSearch,
      selectedData,
      onSelect,
      onSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
//
</style>
