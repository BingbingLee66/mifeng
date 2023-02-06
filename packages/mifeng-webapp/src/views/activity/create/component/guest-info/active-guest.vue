<template>
  <div class="guest-wrap">
    <div class="header-wrap">
      <a-button class="mr10" @click="onAdd">添加嘉宾</a-button>
      <a-button class="mr10" @click="guestBankVisible = true">从嘉宾库选</a-button>
      <a-button @click="memberBankVisible = true">
        {{ ckey ? '从会员库选' : '从用户库选' }}
        <template #icon>
          <plus-outlined />
        </template>
      </a-button>
    </div>

    <a-table
      class="mt20 mb15"
      :loading="loading"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      :scroll="{ x: 'max-content', y: '30vh' }"
      style="margin-top: 20px"
      @change="handleTableChange"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'avatar'">
          <img :src="record.portrait[0].url" alt="" width="50" height="50" />
        </template>

        <template v-if="column.dataIndex === 'introduction'">
          <div>
            <div class="text-overflow">{{ record.introduction || '/' }}</div>
            <div v-if="record.introduction && record.introduction.length >= 60">
              【<a-button type="text" @click="showText(record.introduction)"> 查看更多 </a-button>】
            </div>
          </div>
        </template>

        <template v-else-if="column.dataIndex === 'action'">
          <a-button type="link" @click="onEdit(record)"> 编辑 </a-button>
          <a-button type="link" @click="onDel(record)" danger> 移除 </a-button>
        </template>
      </template>
    </a-table>

    <GuestFormDialog
      :id="editId"
      :static-data="staticData"
      :table-data="tableData"
      v-model:visible="formVisible"
      :show-bank="!isBankEdit"
      @add="addStaticData"
      @edit="editStaticData"
      @editChamber="editChamberData"
      @fetchData="onQueryChange"
    />
    <GuestBankDialog
      ref="guestBankDialogRef"
      :static-data="tableData"
      v-model:visible="guestBankVisible"
      @edit="onBankEdit"
      @confirm="addStaticData"
    />
    <MemberBankDialog :static-data="tableData" v-model:visible="memberBankVisible" @confirm="addStaticData" />

    <a-modal title="嘉宾介绍" v-model:visible="textVisible" width="800px" @close="textVisible = false">
      <div>{{ introduction }}</div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, computed, inject, onMounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { Modal } from 'ant-design-vue'
import GuestFormDialog from './guest-form-dialog'
import GuestBankDialog from './guest-bank-dialog'
import MemberBankDialog from './member-bank-dialog'
import { useAntTable } from '@/use/useAntTable'
import { getGuestList } from '@/api/activity/activity-guest'

export default defineComponent({
  name: 'ActiveGuest',
  components: {
    GuestFormDialog,
    GuestBankDialog,
    MemberBankDialog
  },
  emits: ['guestList'],
  setup(props, { emit }) {
    const route = useRoute()
    const ckey = inject('ckey')

    const tableData = ref([])
    const staticData = ref({})
    const timer = ref(null)
    const formVisible = ref(false)
    const guestBankVisible = ref(false)
    const memberBankVisible = ref(false)
    const editId = ref('')
    const isBankEdit = ref(false)
    const textVisible = ref(false)
    const introduction = ref('')
    const guestBankDialogRef = ref()

    const activityId = computed(() => {
      return route.query.activityId || ''
    })

    const showText = val => {
      textVisible.value = true
      introduction.value = val
    }

    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
      fetchFn: async pageOption => {
        const {
          data: { totalRows, list }
        } = await getGuestList({
          activityId: activityId.value,
          page: pageOption.current,
          pageSize: pageOption.pageSize
        })
        tableData.value = list.map(v => {
          return {
            ...v,
            portrait: [{ url: v.portrait }]
          }
        })
        emit('guestList', tableData.value)

        // 输出总数
        return {
          total: totalRows
        }
      }
    })

    const onQueryChange = () => {
      // 创建活动时候，活动嘉宾都是存在本地
      if (!activityId.value) return

      clearTimeout(timer.value)
      timer.value = setTimeout(() => fetchTableData(true), 300)
    }

    const onAdd = () => {
      editId.value = ''
      staticData.value = {}
      isBankEdit.value = false
      formVisible.value = true
    }

    const onEdit = row => {
      staticData.value = row
      isBankEdit.value = false
      editId.value = row.id
      formVisible.value = true
    }

    const onBankEdit = row => {
      isBankEdit.value = true
      editId.value = row.id
      staticData.value = row
      formVisible.value = true
    }

    const onDel = async row => {
      Modal.confirm({
        title: '确认移除该嘉宾？',
        content: '此次移除不影响嘉宾库数据',
        onOk() {
          const index = tableData.value.findIndex(v => v.id === row.id)

          tableData.value.splice(index, 1)
          emit('guestList', tableData.value)
        }
      })
    }

    const addStaticData = val => {
      if (val.length) {
        tableData.value = tableData.value.concat(val)
      } else {
        tableData.value.unshift(val)
      }

      emit('guestList', tableData.value)
    }

    const editStaticData = (val, type) => {
      const findIndex = tableData.value.findIndex(v => (type === 'chamber' ? v.chamberGuestsId : v.id) === val.id)

      if (findIndex < 0) return
      tableData.value.splice(findIndex, 1, val)
      emit('guestList', tableData.value)
    }

    const editChamberData = val => {
      guestBankDialogRef.value.onQueryChange()
      editStaticData(val, 'chamber')
    }

    onMounted(() => {
      onQueryChange()
    })

    onBeforeMount(() => {
      clearTimeout(timer.value)
    })

    return {
      loading,
      tableData,
      staticData,
      timer,
      columns: [
        {
          title: '头像',
          dataIndex: 'avatar'
        },
        { title: '姓名', dataIndex: 'name' },
        { title: '职位/称谓', dataIndex: 'post' },
        { title: '所在公司/组织', dataIndex: 'unit' },
        { title: '嘉宾介绍', dataIndex: 'introduction', width: 200 },
        { title: '操作', fixed: 'right', width: '120', dataIndex: 'action' }
      ],
      activityId,
      ckey,

      formVisible,
      guestBankVisible,
      memberBankVisible,
      editId,
      isBankEdit,
      textVisible,
      introduction,
      guestBankDialogRef,
      pagination,

      showText,
      onEdit,
      onDel,
      onAdd,
      onBankEdit,
      addStaticData,
      editChamberData,
      editStaticData,
      handleTableChange,
      onQueryChange
    }
  }
})
</script>

<style lang="scss">
.text-overflow {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}
</style>
<style scoped lang="scss">
.guest-wrap {
  margin-bottom: 20px;
}
</style>
