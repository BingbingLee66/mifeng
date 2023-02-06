<template>
  <div class="c-publisher">
    <TableFilter @reset="resetFilters" @fetch="fetchTableData" showAll clearable>
      <TableFilterItem label="用户ID">
        <AInput v-model:value="tableFilter.userId" placeholder="请输入" allowClear style="width: 200px" />
      </TableFilterItem>
      <TableFilterItem label="用户名">
        <AInput v-model:value="tableFilter.userName" placeholder="关键词" allowClear style="width: 200px" />
      </TableFilterItem>

      <TableFilterItem label="手机号">
        <AInput v-model:value="tableFilter.phone" placeholder="请输入" allowClear style="width: 200px" />
      </TableFilterItem>
    </TableFilter>
    <ATable
      :rowKey="record => record.wxUserId"
      :row-selection="{
        selectedRowKeys: selectedKeys,
        onSelect: handleSelect,
        type: 'radio',
        preserveSelectedRowKeys: true
      }"
      :loading="loading"
      :dataSource="tableData"
      :columns="tableCols"
      :scroll="{ x: 'max-content', y: '30vh' }"
      :pagination="pagination"
      @change="handleTableChange"
      bordered
    >
    </ATable>
  </div>
</template>

<script>
import { getChamberAllList } from '@/api/goods/goods'
import { getJoinChamberAndNoFreezesUsers } from '@/api/wx-user'
import { useAntTable } from '@/use/useAntTable'
import { useResetFilter } from '@/use/useResetFilter'
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { Message } from 'ant-design-vue'
export default defineComponent({
  name: 'publisher',
  components: {},
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup(props, { emit }) {
    const tableFilter = reactive({
      userId: '',
      userName: '',
      phone: '',
      ckey: '全部'
    })
    const tableData = ref([])
    const chamberOptions = ref()
    const tableCols = [
      {
        title: '用户ID',
        dataIndex: 'wxUserId',
        width: 120
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        width: 120
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        width: 120
      }
    ].filter(item => !item.hidden)
    // table已选key
    const selectedKeys = ref([])
    const { resetFilters } = useResetFilter({ ...toRefs(tableFilter) })

    const getChamberOps = async () => {
      const {
        data: { data = [] }
      } = await getChamberAllList()
      chamberOptions.value = data.map(item => ({ label: item.name, value: item.ckey }))
      chamberOptions.value.unshift({ label: '全部', value: '全部' })
    }

    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
      fetchFn: async pageOption => {
        const params = { ...tableFilter }
        params.pageSize = pageOption.pageSize
        params.pageNum = pageOption.current

        Object.entries(params).forEach(([key, value]) => {
          if ((key === 'ckey' && value === '全部') || value === '') delete params[key]
        })
        const {
          data: { list = [], totalRows }
        } = await getJoinChamberAndNoFreezesUsers(params)
        tableData.value = list
        // 输出总数
        return {
          total: totalRows
        }
      }
    })

    const initData = () => {
      if (
        tableFilter.userId !== '' ||
        tableFilter.userName !== '' ||
        tableFilter.phone !== '' ||
        tableFilter.ckey !== '全部'
      ) {
        // 存在搜索条件 则 重置
        resetFilters()
        fetchTableData() // 重拉数据
      }

      selectedKeys.value = []
      if (props.data.length) selectedKeys.value = [props.data[0].wxUserId]
    }
    let current
    const handleSelect = record => {
      selectedKeys.value = [record.wxUserId]
      current = tableData.value.find(item => item.wxUserId === selectedKeys.value[0])
    }
    // 提交数据 由modal调取
    const handleConfirm = () => {
      if (!selectedKeys.value.length) return Message.warning('请选择发布者')
      if (!current) return emit('close')
      emit('confirm', {
        type: 'Publisher',
        data: [current]
      })
    }

    // 初始化数据
    getChamberOps()
    fetchTableData()

    return {
      tableData,
      tableFilter,
      tableCols,
      resetFilters,
      selectedKeys,
      handleSelect,
      pagination,
      handleTableChange,
      fetchTableData,
      loading,
      initData,
      chamberOptions,
      handleConfirm
    }
  }
})
</script>

<style lang="scss" scoped>
.ellipsis {
  @include ellipsis(2);
}
.ant-btn-link {
  color: #409eff;
}
</style>
