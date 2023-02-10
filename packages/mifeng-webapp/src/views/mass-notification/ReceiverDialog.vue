<template>
  <a-modal title="接收人" width="70%" class="receiver-dialog" v-bind="$attrs" v-model:visible="visible">
    <PlusTable
      :columns="columns"
      class="p0"
      :row-selection="props.type === RECEIVER_TYPE.MEMBER_SPECIFY ? rowSelection : null"
      :data-source="tableData"
      :loading="loading"
      :scroll="{ x: 'max-content' }"
      row-key="id"
      :pagination="pagination"
      :search="{ hiddenNum: 4 }"
      @change="handleTableChange"
      :request="handlerSearch"
    >
      <template #filterItem="{ column }">
        <a-form-item label="用户标签(平台创建)" v-if="column.dataIndex === 'tagIds'">
          <a-cascader
            multiple
            style="width: 400px"
            :showSearch="{ filter: (inputValue, path) => path.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 }"
            v-model:value="query.tagIds"
            placeholder="请选择标签"
            :options="platformOptions"
          ></a-cascader>
        </a-form-item>
      </template>
    </PlusTable>

    <template #footer>
      <a-button v-if="props.type !== RECEIVER_TYPE.MEMBER_SPECIFY" type="primary " @click="visible = false"
        >我知道了</a-button
      >
      <template v-else>
        <a-button @click="visible = false">取消</a-button>
        <a-button type="primary " @click="handleOk">确认</a-button>
      </template>
    </template>
  </a-modal>
</template>

<script setup>
import PlusTable from '@/components/plusTable/PlusTable.vue'
import { receiverInfoList, getChamberMemberList } from '@/api/mass-notification'

import { useAntTable } from '@/use/useAntTable'
import { useRowSelection } from '@/use'
import { ref, computed, reactive, watch, inject } from 'vue'
import { CHAMBER_MEMBER_COLUMNS, RECEIVER_TYPE } from '@/constant/mass-notification'

const props = defineProps({
  /** 接收人类型 */
  type: {
    type: Number,
    default: null
  },
  visible: {
    type: Boolean,
    default: false
  },
  id: {
    type: String
  },
  /** 已选数组（编辑回显） */
  selectedList: {
    type: Array,
    default: () => []
  }
})
const ckey = inject('ckey')

const emit = defineEmits(['update:visible', 'seletedNumChange', 'receiverChange'])

const visible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  }
})

const tableData = ref([])
const rowSelection = useRowSelection()

const query = reactive({
  keyword: '',
  gsId: 0
})
const handlerSearch = value => {
  Object.assign(query, { keyword: value?.keyword || '' })
  fetchTableData(true)
}
const handleOk = () => {
  emit('seletedNumChange', rowSelection.selectedRowKeys.length, props.type)
  emit('receiverChange', rowSelection.selectedRowKeys)
  visible.value = false
}
const columns = [
  {
    title: '搜索',
    filter:
      props.type === RECEIVER_TYPE.All ||
      props.type === RECEIVER_TYPE.MEMBER_SPECIFY ||
      props.type === RECEIVER_TYPE.MEMBER_SELF ||
      !props.type,
    hideInTable: true,
    dataIndex: 'keyword',
    valueType: 'text',
    formItemProps: {
      placeholder: '手机号/姓名/企业名称'
    }
  },
  ...CHAMBER_MEMBER_COLUMNS
]
const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
  async fetchFn({ current, pageSize }) {
    if (!props.type) {
      const params = {
        keyword: query.keyword,
        gsId: query.gsId,
        page: current,
        pageSize
      }
      const { data } = await receiverInfoList(params)
      tableData.value = data.list.map(v => {
        return { ...v.extend, id: v.id }
      })
      return { total: data.totalRows || 0 }
    }
    // 劫持变量
    const { type } = props
    emit('seletedNumChange', -1, type)

    const params = { page: current, pageSize, ckey: ckey.value }

    if (props.type === RECEIVER_TYPE.POSITION_SPECIFY) {
      params.postIds = props.selectedList
    }
    if (props.type === RECEIVER_TYPE.DEPARMENT_SPECIFY) {
      params.departmentIds = props.selectedList
    }
    params.keyword = query.keyword
    const {
      data: { list, totalRows }
    } = await getChamberMemberList(params)
    tableData.value = list
    emit('seletedNumChange', totalRows, type)
    if (type === RECEIVER_TYPE.MEMBER_SPECIFY) emit('seletedNumChange', props.selectedList.length, type)
    return { total: totalRows || 0 }
  }
})

watch(
  () => props.id,
  val => {
    query.gsId = val
    fetchTableData()
  },
  { immediate: true }
)
watch(
  () => props.selectedList,
  newV => {
    rowSelection.selectedRowKeys = newV
    if (!newV.length) return
    // 刷新表格
    if ([RECEIVER_TYPE.POSITION_SPECIFY, RECEIVER_TYPE.DEPARMENT_SPECIFY].includes(props.type)) fetchTableData()
  },
  { immediate: true }
)
watch(
  () => props.type,
  async val => {
    // 刷新表格
    if ([RECEIVER_TYPE.POSITION_SPECIFY, RECEIVER_TYPE.DEPARMENT_SPECIFY].includes(props.type)) return
    if (val) handlerSearch()
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.receiver-dialog {
  min-width: 1000px;
}
</style>
