<template>
  <div class="app-container">
    <AModal title="请选择文章" v-model:visible="detailVisible" @ok="confirm" @cancel="close" width="50%">
      <PlusTable
        rowKey="id"
        :columns="columns"
        :data-source="dataSource"
        :request="handlerSearch"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        :row-selection="{
          onChange: onSelectChange,
          selectedRowKeys: selectedTableRow,
          preserveSelectedRowKeys: true
        }"
      ></PlusTable>
    </AModal>
  </div>
</template>

<script>
import PlusTable from '@/components/plusTable/PlusTable.vue'
import { defineComponent, ref, getCurrentInstance, reactive } from 'vue'
import { useAntTable } from '@/use/useAntTable/index'
import { officialAccountArticleList } from '@/api/content/officialAccount'
import cloneDeep from 'lodash/cloneDeep'
const columns = [
  {
    title: '文章ID',
    dataIndex: 'id',
    valueType: 'text',
    options: {
      placeholder: '请输入文章Id'
    }
  },
  {
    title: '文章标题:',
    dataIndex: 'title',
    filter: true,
    valueType: 'text',
    options: {
      placeholder: '请输入文章标题'
    }
  }
]
export default defineComponent({
  components: {
    PlusTable
  },
  emits: ['confirm'],
  props: {
    // 编辑的文章id
    articleId: {
      type: String,
      default: null
    }
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()
    const detailVisible = ref(false) // 开启表格
    const query = reactive({
      title: '',
      articleId: Number(props.articleId)
    })
    const id = ref(null)
    const dataSource = ref([])
    const chooseTableData = ref([]) // 选中文章数组
    const unShifTableData = ref([])
    const selectedTableRow = ref([])
    const open = item => {
      item.forEach(item => {
        selectedTableRow.value.push(item.id)
        if (item.id === 0) {
          unShifTableData.value = item
        }
      })
      chooseTableData.value = item
      show()
    }
    const show = () => {
      detailVisible.value = true
      fetchTableData(true)
    }
    // 确定
    const confirm = () => {
      const index = chooseTableData.value.findIndex(item => item.id === 0)
      if (index === -1) {
        chooseTableData.value.unshift(unShifTableData.value)
      }
      if (chooseTableData.value.length > 8) return proxy.$message.error('最多只能选择7篇文章')
      if (chooseTableData.value.length <= 1) return proxy.$message.error('请至少选择一篇文章')
      emit('confirm', chooseTableData.value)
      close()
    }
    // 关闭
    const close = () => {
      selectedTableRow.value = []
      chooseTableData.value = []
      unShifTableData.value = []
      detailVisible.value = false
    }
    const fetchFn = async pageOption => {
      const conditionQuery = reactive({
        pageSize: pageOption.pageSize,
        page: pageOption.current,
        articleId: query.articleId,
        title: query.title
      })
      const { data } = await officialAccountArticleList(conditionQuery)
      data.list.forEach(item => {
        item.isSpecialCommitteeBol = item.isSpecialCommittee === 1
      })
      data.list.forEach((v, index) => {
        v.ids = v.id
        v.key = index
      })
      dataSource.value = data.list

      return {
        total: data.totalRows
      }
    }
    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({ fetchFn })

    // 选中表格
    const onSelectChange = (index, row) => {
      selectedTableRow.value = index
      chooseTableData.value = cloneDeep(row).filter(item => item !== undefined)
    }
    const handlerSearch = value => {
      query.title = value.title
      fetchTableData()
    }
    return {
      props,
      detailVisible,
      query,
      columns,
      chooseTableData,
      id,
      dataSource,
      fetchTableData,
      handleTableChange,
      pagination,
      loading,
      selectedTableRow,
      onSelectChange,
      confirm,
      handlerSearch,
      open,
      close
    }
  }
})
</script>
<style lang="scss" scoped></style>
