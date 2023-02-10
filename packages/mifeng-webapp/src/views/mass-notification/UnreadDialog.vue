<template>
  <a-modal width="70%" class="unread-dialog" v-bind="$attrs" @ok="sendUnread" v-model:visible="visible">
    <template #title>
      <div style="width: 100%; cursor: move">接收人</div>
    </template>
    <div>
      确认给以下
      <span class="red">{{ selection.data.length }}</span>
      位未读用户重新发送通知吗？
    </div>
    <PlusTable
      :columns="CHAMBER_MEMBER_COLUMNS"
      :data-source="dataSource"
      :scroll="{ x: 'max-content' }"
      row-key="id"
      :row-selection="{ onChange: onSelectChange }"
      :pagination="pagination"
      @change="handleTableChange"
      :request="handlerSearch"
      class="p0"
    >
    </PlusTable>
  </a-modal>
</template>

<script setup>
import { unreadList, unreadRetry } from '@/api/mass-notification'
import { ref, computed, reactive, watch } from 'vue'
import { CHAMBER_MEMBER_COLUMNS } from '@/constant/mass-notification'
import { message } from 'ant-design-vue'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:visible'])

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

const dataSource = ref([])

const query = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  gsId: 0
})

const selection = reactive({
  data: []
})

const handlerSearch = () => {
  getUnreadList()
}

const handleTableChange = async ({ current, pageSize }) => {
  query.page = current
  query.pageSize = pageSize
  getUnreadList()
}

const getUnreadList = async () => {
  const { data } = await unreadList(query)
  dataSource.value = data.list
  query.total = data.totalRows
}

const onSelectChange = selectedRowKeys => {
  selection.data = selectedRowKeys
}

const sendUnread = async () => {
  if (!selection.data.length) return message.error('至少选择一个哦~')
  await unreadRetry({
    gsId: query.gsId,
    riIds: selection.data
  })
  visible.value = false
}

watch(
  () => props.id,
  val => {
    query.gsId = val
    getUnreadList()
  },
  { immediate: true }
)
</script>

<style lang="scss">
.unread-dialog {
  min-width: 1000px;
}
.red {
  color: #f5222d;
}
.button-footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  .ant-btn {
    margin: 0 20px;
  }
}
</style>
