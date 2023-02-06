<template>
  <div class="c-supplyLable">
    <div class="dialog-desc">提示：最多可选5个，已选 {{ selectedKeys.length }} 个</div>
    <ATable
      :rowKey="record => record.id"
      :row-selection="{
        selectedRowKeys: selectedKeys,
        onChange: handleSelectChange,
        hideSelectAll: true
      }"
      :loading="loading"
      :dataSource="tableData"
      :columns="tableCols"
      :scroll="{ x: 'max-content', y: '30vh' }"
      bordered
    >
    </ATable>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { getAvailableLabelList } from '@/api/lable'
import { Message } from 'ant-design-vue'
export default defineComponent({
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup(props, { emit }) {
    const tableCols = [
      {
        title: '标签id',
        dataIndex: 'id',
        width: 120
      },
      {
        title: '标签名称',
        dataIndex: 'name',
        width: 120
      }
    ]
    const tableData = ref([])
    const selectedKeys = ref([])
    const loading = ref(false)
    const getLableList = async () => {
      loading.value = true
      try {
        const { data = [] } = await getAvailableLabelList()
        tableData.value = data
      } catch (error) {
        /*  */
      }
      loading.value = false
      initData()
    }
    const initData = () => {
      if (!tableData.value.length) return
      selectedKeys.value = props.data.map(v => v.id)
      /* this.tableData.forEach(v => {
        this.$refs.table.toggleRowSelection(v, selectedIds.includes(v.id))
      }) */
    }
    const handleSelectChange = keys => {
      selectedKeys.value = keys
    }
    const handleConfirm = () => {
      if (!selectedKeys.value.length) return Message.warning('请选择供需标签')
      if (selectedKeys.value.length > 5) return Message.warning('最多可选5个供需标签')
      emit('confirm', {
        type: 'SupplyLable',
        data: [...tableData.value.filter(item => selectedKeys.value.includes(item.id))]
      })
    }
    getLableList()
    return { tableCols, selectedKeys, tableData, handleConfirm, initData, handleSelectChange, loading }
  }
})
</script>

<style scoped lang="scss"></style>
