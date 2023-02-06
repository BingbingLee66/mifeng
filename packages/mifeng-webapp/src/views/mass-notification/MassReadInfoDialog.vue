<template>
  <a-modal
    title="接收人"
    width="70%"
    class="mass-read-dialog"
    v-bind="$attrs"
    :footer="null"
    v-model:visible="visible"
    @ok="handleOk"
  >
    <PlusTable
      :columns="columns"
      :data-source="dataSource"
      :scroll="{ x: 'max-content' }"
      row-key="id"
      :pagination="pagination"
      @change="handleTableChange"
      :request="handlerSearch"
      class="p0"
    >
      <template #filterItem="{ column }">
        <template v-if="column.dataIndex === 'type'">
          类目 :&nbsp;
          <a-radio-group v-model:value="query.status" button-style="solid">
            <a-radio-button v-for="item in readStatus" :key="item.dataIndex" :value="item._key">{{
              `${item.title}${item[item.dataIndex] ? `(${item[item.dataIndex]})` : ''}`
            }}</a-radio-button>
          </a-radio-group>
        </template>
      </template>
    </PlusTable>
  </a-modal>
</template>

<script setup>
import PlusTable from '@/components/plusTable/PlusTable.vue'
import { sendDetailList, sendGetDetail } from '@/api/mass-notification'
import { ref, computed, reactive, watch } from 'vue'
import { READ_INFO_COLUMNS, READ_STATUS_MAP, READ_ADMIN_COLUMNS, RECEIVER_TYPE } from '@/constant/mass-notification'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    required: true
  },
  channelId: {
    type: Number,
    required: true
  },
  receiveTypeId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:visible'])

const handleOk = () => {}

const visible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  }
})

const pagination = computed(() => {
  return {
    pageSize: query.pageSize,
    current: query.page,
    total: query.total
  }
})

// 只有短信才有已读未读 成功失败，其他只有已读和未读
const readStatus = reactive([])

const columns = ref([
  {
    title: '所属类目',
    dataIndex: 'type',
    hideInTable: true,
    filter: true,
    span: 24,
    formItemProps: {
      readStatus
    }
  },
  {
    title: '搜索',
    filter: true,
    hideInTable: true,
    dataIndex: 'keyword',
    valueType: 'text',
    formItemProps: {
      placeholder: '手机号/姓名/企业名称'
    }
  }
])

const dataSource = ref([])

const query = reactive({
  channelTypeId: 0,
  gsId: 0,
  page: 1,
  pageSize: 6,
  keyword: '',
  status: -1
})

/** 获取通知接收情况 */
const handlerSearch = value => {
  Object.assign(query, { keyword: value.keyword })
  getMassList()
}

const handleTableChange = async ({ current }) => {
  query.page = current
  getMassList()
}
// 获取群发列表
const getMassList = async () => {
  const { data } = await sendDetailList(query)
  dataSource.value = data.list.map(v => {
    return { ...v.receiverInfoVO.extend, readStatus: v.readStatus }
  })
  query.total = data.totalRows
}

// 获取群发tab栏目
const getColumns = async (id, channelId, receiveTypeId) => {
  const {
    data: { groupSendStatMap }
  } = await sendGetDetail(id)
  //  清空数组，赋值
  readStatus.splice(0, readStatus.length)
  readStatus.push(
    ...READ_STATUS_MAP.get(channelId).map(item => {
      return { ...item, ...groupSendStatMap[props.channelId] }
    })
  )
  columns.value.push(
    ...(Number(receiveTypeId) === RECEIVER_TYPE.SECRETARIAT_ADMIN ? READ_ADMIN_COLUMNS : READ_INFO_COLUMNS)
  )
}

watch(
  [() => props.id, () => props.channelId, () => props.receiveTypeId],
  async ([id, channelId, receiveTypeId]) => {
    Object.assign(query, {
      channelTypeId: channelId,
      gsId: id
    })
    await getColumns(id, channelId, receiveTypeId)
    query.status = readStatus[0]._key
  },
  { immediate: true }
)

watch(
  () => query.status,
  () => {
    getMassList()
  }
)
</script>

<style lang="scss">
.mass-read-dialog {
  min-width: 1000px;
}
</style>
