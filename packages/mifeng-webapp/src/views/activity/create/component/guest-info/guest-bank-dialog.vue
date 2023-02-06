<template>
  <div>
    <a-modal title="从嘉宾库选" :visible="visible" width="800px" @cancel="onClose" @ok="onConfirm">
      <div class="search-wrap flex-x">
        <a-input v-model:value="searchKey" placeholder="搜索姓名" style="width: 200px" />
        <a-button class="ml20" type="primary" @click="onQueryChange">查询</a-button>
      </div>

      <a-table
        class="mt20 mb15"
        row-key="id"
        :loading="loading"
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        :row-selection="rowSelection"
        :scroll="{ x: 'max-content', y: '30vh' }"
        style="margin-top: 20px"
        @change="handleTableChange"
      >
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'avatar'">
            <img :src="record.portrait" alt="" width="50" height="50" />
          </template>

          <template v-if="column.dataIndex === 'introduction'">
            <div class="text-overflow">{{ record.introduction || '/' }}</div>
            <div v-if="record.introduction && record.introduction.length >= 30">
              【<a-button type="text" @click="showText(record.introduction)"> 查看更多 </a-button>】
            </div>
          </template>

          <template v-else-if="column.dataIndex === 'action'">
            <a-button type="link" @click="onDel(record)" danger> 从嘉宾库移除 </a-button>
            <a-button type="link" @click="onEdit(record)"> 编辑 </a-button>
          </template>
        </template>
      </a-table>
    </a-modal>

    <a-modal title="嘉宾介绍" v-model:visible="textVisible" width="800px" @cancel="textVisible = false">
      <div>{{ introduction }}</div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { useAntTable } from '@/use/useAntTable'
import { checkGuess, delChamberGuest, getChamberGuestList } from '@/api/activity/activity-guest'

export default defineComponent({
  name: 'GuestFormDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    staticData: {
      type: Array,
      default: () => []
    }
  },
  emits: ['confirm', 'edit', 'update:visible'],
  setup(props, { emit }) {
    const route = useRoute()
    const ckey = inject('ckey')

    const tableData = ref([])
    const searchKey = ref('')
    const timer = ref(null)
    const selectData = ref([])
    const textVisible = ref(false)
    const introduction = ref('')

    const activityId = computed(() => {
      return route.query.activityId || ''
    })

    watch(
      () => props.visible,
      val => {
        if (val) onQueryChange()
      }
    )

    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
      fetchFn: async pageOption => {
        const {
          data: { totalRows, list }
        } = await getChamberGuestList({
          name: searchKey.value,
          cKey: ckey.value || 'ysh',
          page: pageOption.current,
          pageSize: pageOption.pageSize
        })
        tableData.value = list
        // 输出总数
        return {
          total: totalRows
        }
      }
    })

    const showText = val => {
      textVisible.value = true
      introduction.value = val
    }

    const onQueryChange = () => {
      clearTimeout(timer.value)
      timer.value = setTimeout(() => fetchTableData(true), 300)
    }

    const onClose = () => {
      emit('update:visible', false)
      searchKey.value = ''
    }

    const onEdit = row => {
      emit('edit', { ...row, portrait: [{ url: row.portrait }] })
    }

    const validateGuestRepeat = async () => {
      if (activityId.value) {
        const { state } = await checkGuess(
          selectData.value.map(v => {
            return {
              ...v,
              portrait: v.portrait[0].url,
              activityId: activityId.value,
              isChamber: 1,
              flag: true
            }
          })
        )

        if (!state) return false
      }
      for (let i = 0, len = props.staticData.length; i < len; i++) {
        for (let j = 0, jLen = selectData.value.length; j < jLen; j++) {
          const select = selectData.value[j]
          const item = props.staticData[i]
          if (
            select.name === item.name &&
            select.post === item.post &&
            select.unit === item.unit &&
            select.introduction === item.introduction
          ) {
            return false
          }
        }
      }
      return true
    }

    const onConfirm = async () => {
      if (!selectData.value.length) return message.error('请选择嘉宾')

      if (!(await validateGuestRepeat())) return message.error('存在重复数据，不可操作')

      emit(
        'confirm',
        selectData.value.map((v, i) => {
          delete v.ckey
          return {
            ...v,
            id: +`${Date.now()}${i}`,
            isChamber: 1
          }
        })
      )
      onClose()
    }

    const onDel = async row => {
      Modal.confirm({
        title: '确认从嘉宾库中移除该嘉宾？',
        content: '不影响本次所选嘉宾，仅对嘉宾库进行移除',
        async onOk() {
          await delChamberGuest(row.id)
          onQueryChange()
        }
      })
    }

    return {
      tableData,
      timer,
      selectData,
      textVisible,
      introduction,
      columns: [
        { title: '头像', dataIndex: 'avatar' },
        { title: '姓名', dataIndex: 'name' },
        { title: '职位/称谓', dataIndex: 'post', width: 120 },
        { title: '所在公司/组织', dataIndex: 'unit', width: 140 },
        { title: '嘉宾介绍', dataIndex: 'introduction' },
        { title: '操作', dataIndex: 'action', fixed: 'right', width: '120' }
      ],
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          selectData.value = selectedRows.map(v => {
            return {
              ...v,
              portrait: [{ url: v.portrait }]
            }
          })
        }
      },
      pagination,
      loading,
      searchKey,

      showText,
      onDel,
      onConfirm,
      onEdit,
      handleTableChange,
      onClose,
      onQueryChange
    }
  }
})
</script>
