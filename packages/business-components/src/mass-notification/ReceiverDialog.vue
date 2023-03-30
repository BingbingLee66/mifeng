<template>
  <a-modal title="接收人" width="80%" class="receiver-dialog" v-bind="$attrs" v-model:visible="visible">
    <PlusTable
      :columns="columns"
      class="p0"
      :row-selection="isSelect ? rowSelection : null"
      :data-source="tableData"
      :loading="loading"
      :scroll="{ x: 'max-content' }"
      row-key="id"
      :pagination="pagination"
      :search="{ hiddenNum: 4 }"
      @change="handleTableChange"
      :request="handlerSearch"
    />

    <template #footer>
      <a-button v-if="!isSelect" type="primary " @click="visible = false">我知道了</a-button>
      <template v-else>
        <a-button @click="visible = false">取消</a-button>
        <a-button type="primary " @click="handleOk">确认</a-button>
      </template>
    </template>
  </a-modal>
</template>

<script setup>
import PlusTable from '@business/components/src/plus-table/PlusTable.vue'
import {
  receiverInfoList,
  getChamberMemberList,
  getMemberList,
  getMemberCountList,
  distributionChambers,
  GetuserAll
  // secretaryAdmin,
  // secretaryuser
} from '@business/common/src/mass-notification/api/index'
import { getLabelGroupLst } from '@business/common/src/labels/api'

import { useAntTable } from '@business/logics/src/useAntTable/index'
import { useRowSelection } from '@business/logics/src/useRowSelection'
import { ref, computed, reactive, watch, inject, onMounted } from 'vue'
import {
  CHAMBER_ALL_MEMBER_COLUMNS,
  CHAMBER_MEMBER_COLUMNS,
  CHAMBER_ADMIN_COLUMNS,
  CHAMBER_ADMIN_MEMBER_COLUMNS,
  CHAMBER_SECRE_MEMBER_COLUMNS,
  RECEIVER_TYPE
} from '@business/common/src/mass-notification/constant/mass-notification'

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

const isSelect = computed(() => {
  return [
    RECEIVER_TYPE.MEMBER_SPECIFY,
    RECEIVER_TYPE.CLERK_BACKGROUND,
    RECEIVER_TYPE.CLERK_FRONT,
    RECEIVER_TYPE.DESIGNATE_SELF
  ].includes(props.type)
})
const isClerk = computed(() => {
  return [RECEIVER_TYPE.CLERK_BACKGROUND, RECEIVER_TYPE.CLERK_FRONT].includes(props.type)
})
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

const useTagIds = value => {
  let Ids = []
  value.map(item => {
    if (item.length === 1) {
      const FirstItem = PlatformOptions.value.filter(e => item[0] === e.value)[0].children.map(v => v.value)
      Ids = Ids.concat(...FirstItem)
    } else if (item.length === 2) {
      Ids = Ids.concat(item[1])
    }
    return item
  })
  return Ids.join()
}
const query = reactive({
  keyword: '',
  gsId: 0
})
const handlerSearch = value => {
  if (value?.tagIds) {
    value.tagIds = useTagIds(value.tagIds)
  }
  Object.assign(query, { ...value, keyword: value?.keyword || '' })
  fetchTableData(true)
}
const handleOk = () => {
  if (props.type === RECEIVER_TYPE.DESIGNATE_SELF) {
    const count = rowSelection.selectedRowItems.reduce((pre, cur) => {
      return pre + cur.memberCount
    }, 0)
    emit('seletedNumChange', count, props.type)
  } else {
    emit('seletedNumChange', rowSelection.selectedRowKeys.length, props.type)
  }
  emit('receiverChange', ckey.value ? rowSelection.selectedRowKeys : rowSelection.selectedRowItems)
  visible.value = false
}

const searchColumns = ref([
  {
    title: '搜索',
    filter: props.type === RECEIVER_TYPE.MEMBER_SPECIFY || props.type === RECEIVER_TYPE.MEMBER_SELF || !props.type,
    hideInTable: true,
    dataIndex: 'keyword',
    valueType: 'text',
    formItemProps: {
      placeholder: '手机号/姓名/企业名称'
    }
  },
  {
    title: '姓名',
    filter: props.type === RECEIVER_TYPE.ALL,
    hideInTable: true,
    dataIndex: 'uname',
    valueType: 'text'
  },
  {
    dataIndex: 'tagIds',
    title: '用户标签(平台创建)',
    filter: computed(() => {
      return isClerk.value
    }),
    hideInTable: true,
    valueType: 'cascader',
    formItemProps: {
      options: computed(() => {
        return PlatformOptions.value
      }),
      multiple: true,
      maxTagCount: 1
    }
  },
  {
    dataIndex: 'chamberId',
    title: '所属商协会',
    filter: computed(() => {
      return isClerk.value
    }),
    hideInTable: true,
    valueType: 'select',
    formItemProps: {
      options: computed(() => {
        return ChamberOptions.value
      })
    }
  }
])

// 获取用户标签
const PlatformOptions = ref()
const getPlatformOptions = async () => {
  const res = await getLabelGroupLst({
    noPaging: true,
    dataSource: 0,
    freeze: 0
  })
  const memberLabelList = res.data.list || []
  PlatformOptions.value = memberLabelList.map(item => {
    const obj = {
      value: item.id,
      label: item.name,
      children: item.memberLabelVOList.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
    }
    return obj
  })
}

// 获取商协会标签
const ChamberOptions = ref()
const getChamberOptions = async () => {
  const { data } = await distributionChambers()
  ChamberOptions.value = data.map(item => {
    return {
      label: item.name,
      value: item.id
    }
  })
  ChamberOptions.value.unshift({ label: '全部', value: -1 })
}

const columns = ref([])
const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
  async fetchFn({ current, pageSize }) {
    if (!props.type) {
      const params = {
        keyword: query.keyword,
        gsId: query.gsId,
        page: current,
        pageSize
      }
      columns.value = [...CHAMBER_ADMIN_COLUMNS, ...searchColumns.value]
      const { data } = await receiverInfoList(params)
      tableData.value = data.list.map(v => {
        return { ...v.extend, id: v.id, name: v.extend.name ? v.extend.name : v.extend.uname }
      })
      return { total: data.totalRows || 0 }
    }
    // 劫持变量
    const { type } = props
    emit('seletedNumChange', -1, type)

    const params = { page: current, pageSize, ckey: ckey.value, ...query }
    let typeApi = 0
    columns.value = [...CHAMBER_ALL_MEMBER_COLUMNS, ...searchColumns.value]
    if (props.type === RECEIVER_TYPE.DESIGNATE_SELF) {
      typeApi = 1
      columns.value = [...CHAMBER_ADMIN_MEMBER_COLUMNS, ...searchColumns.value]
    }
    if (
      [
        RECEIVER_TYPE.MEMBER_SELF,
        RECEIVER_TYPE.MEMBER_SPECIFY,
        RECEIVER_TYPE.POSITION_SPECIFY,
        RECEIVER_TYPE.DEPARMENT_SPECIFY
      ].includes(props.type)
    ) {
      typeApi = 2
      if (props.type === RECEIVER_TYPE.MEMBER_SELF) {
        columns.value = [...CHAMBER_MEMBER_COLUMNS, ...searchColumns.value]
      }
      if (props.type === RECEIVER_TYPE.POSITION_SPECIFY) {
        params.postIds = props.selectedList
      }
      if (props.type === RECEIVER_TYPE.DEPARMENT_SPECIFY) {
        params.departmentIds = props.selectedList
      }
    }
    if (isClerk.value) {
      typeApi = 3
      columns.value = [...CHAMBER_SECRE_MEMBER_COLUMNS, ...searchColumns.value]
    }
    const fetchApi = {
      0: getMemberList,
      1: getMemberCountList,
      2: getChamberMemberList,
      3: GetuserAll
    }[typeApi]
    const {
      data: { list, totalRows }
    } = await fetchApi(params)
    tableData.value = list
    emit('seletedNumChange', totalRows, type)
    if (isSelect.value) emit('seletedNumChange', props.selectedList.length, type)
    return { total: totalRows || 0 }
  }
})
onMounted(() => {
  getPlatformOptions()
  getChamberOptions()
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
    if (
      [RECEIVER_TYPE.POSITION_SPECIFY, RECEIVER_TYPE.DEPARMENT_SPECIFY, RECEIVER_TYPE.PHONE_CUSTOM].includes(props.type)
    )
      return
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
