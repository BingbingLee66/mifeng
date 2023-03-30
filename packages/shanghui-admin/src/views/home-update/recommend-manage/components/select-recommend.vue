<template>
  <a-modal v-model:visible="visible" title="内容资源" @cancel="close" width="900px">
    <PlusTable
      :scroll="{ x: 'max-content' }"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      :row-key="rowKey"
      :rowSelection="rowSelection"
      :request="handleSearch"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'contentImg'">
          <img class="img-preview" :src="record.contentImg" />
        </template>
      </template>
    </PlusTable>
    <template #footer>
      <a-button @click="close">上一步</a-button>
      <a-button type="primary" @click="confirm">确认</a-button>
    </template>
  </a-modal>
</template>
<script>
import { defineComponent, ref, computed, reactive } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { tableColumn1, tableColumn5, tableColumn6 } from './tableCol'
import { getContentList } from '@/api/home-update/recommend'
import { useRowSelection } from '@business/logics/src/useRowSelection'
export default defineComponent({
  emits: ['confirm'],
  props: {
    contentType: {
      type: String
    }
  },
  setup(props, { emit }) {
    const columns = computed(() => {
      if (position.value === 3) {
        return tableColumn5
      } else if (position.value === 2) {
        return tableColumn6
      } else if (position.value === 1) {
        return tableColumn1
      } else {
        return []
      }
    })
    const rowSelection = useRowSelection()
    const rowKey = ref('')
    const position = ref('')
    const visible = ref(false)
    const select = data => {
      if (data === 3) {
        rowSelection.type = 'radio'
      }
      rowKey.value = 'id'
      position.value = data
      fetchTableData(1)
      visible.value = true
    }
    const tableData = ref([])
    const tableFilter = reactive({
      keyword: ''
    })
    const handleSearch = value => {
      tableFilter.keyword = value.keyword || ''
      fetchTableData(true)
    }

    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
      fetchFn: async pageOption => {
        const {
          data: { list, totalRows }
        } = await getContentList({
          contentType: props.contentType,
          pageNum: pageOption.current,
          pageSize: pageOption.pageSize,
          keyword: tableFilter.keyword
        })
        list.length &&
          list.forEach(i => {
            i.id = i.contentId
            i.label = i.contentId + ' ' + i.contentTitle
          })

        tableData.value = list
        return {
          total: totalRows
        }
      }
    })
    const close = () => {
      pagination.current = 1
      tableData.value = []
      visible.value = false
    }
    const confirm = () => {
      emit('confirm', rowSelection.selectedRowItems)
    }
    /** 选择推荐内容类型 */

    return {
      visible,
      pagination,
      handleTableChange,
      fetchTableData,
      loading,
      tableData,
      close,
      columns,
      select,
      confirm,
      rowSelection,
      rowKey,
      handleSearch
    }
  }
})
</script>
<style lang="scss" scoped>
.img-preview {
  width: 100px;
  height: 80px;
}
</style>
