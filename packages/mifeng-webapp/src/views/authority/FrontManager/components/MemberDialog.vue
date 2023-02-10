<template>
  <a-modal title="选择会员" width="70%" @ok="handleOkSelect()">
    <PlusTable
      class="p0"
      :row-selection="{ onChange: onSelectChange, selectedRowKeys: selectedTableRow, preserveSelectedRowKeys: true }"
      :columns="columns"
      :data-source="tableData"
      :scroll="{ x: 'max-content' }"
      row-key="memberId"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      :request="handlerSearch"
    />
  </a-modal>
</template>
<script>
import { ref, reactive, inject } from 'vue'
import { getMemberOptions } from '@/api/member/post'
import { useAntTable } from '@/use/useAntTable'
import { getChoosedMemberList, addMemberPermission } from '@/api/authority/front-manager'
import { getDepartmentList } from '@/api/org-structure/org'
import { message } from 'ant-design-vue'

export default {
  setup(props, { emit }) {
    const ckey = inject('ckey')
    const { postOptions } = getOptions()
    const { departmentOptions } = UseGetDepartMent()
    const tableData = ref([])
    const tableFilter = ref({
      uname: '',
      department: -1,
      memberPostType: -1
    })
    let firstPage = false
    const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
      async fetchFn({ current, pageSize }) {
        const { data } = await getChoosedMemberList({
          ...tableFilter.value,
          page: firstPage ? 1 : current,
          pageSize,
          ckey: ckey.value
        })
        tableData.value = data.list || []
        firstPage = false
        return { total: data.totalRows || 0 }
      }
    })

    const handlerSearch = value => {
      firstPage = true
      tableFilter.value.uname = value.memberName || ''
      tableFilter.value.memberPostType = value.memberPost
      const { department } = value
      if (department && department !== -1) {
        tableFilter.value.department = department[department.length - 1].toString()
      }
      fetchTableData()
    }
    fetchTableData()

    const selectedTableRow = ref([])
    const chooseTableData = ref([])
    const handleOkSelect = async () => {
      const memberIds = []
      if (!chooseTableData.value.length) return message.warn('请至少选择一位会员')

      chooseTableData.value.forEach(element => {
        memberIds.push(element.memberId)
      })
      await addMemberPermission({ ckey: ckey.value, memberIds })
      fetchTableData()
      emit('fetchFn')
    }

    // 选中表格
    const onSelectChange = (index, row) => {
      selectedTableRow.value = index
      chooseTableData.value = row.filter(item => item !== undefined)
    }
    return {
      columns: [
        { title: '用户名', dataIndex: 'memberName', filter: true, valueType: 'text' },
        {
          title: '部门',
          dataIndex: 'department',
          initialValue: -1,
          filter: true,
          valueType: 'cascader',
          formItemProps: {
            allowClear: false,
            expandTrigger: 'hover',
            placeholder: '请选择部门',
            changeOnSelect: true,
            fieldNames: { value: 'id', label: 'departmentName', children: 'departmentRespList' },
            options: departmentOptions,
            showCheckedStrategy: 'SHOW_CHILD'
          }
        },
        {
          title: '会员职务',
          initialValue: -1,
          dataIndex: 'memberPost',
          filter: true,
          valueType: 'select',
          formItemProps: { options: postOptions }
        }
      ],
      handlerSearch,
      tableData,
      fetchTableData,
      pagination,
      handleTableChange,
      loading,
      onSelectChange,
      selectedTableRow,
      handleOkSelect
    }
    function getOptions() {
      const ckey = inject('ckey')
      const postOptions = ref([])

      async function getPostOptions() {
        const {
          data: { data }
        } = await getMemberOptions({ ckey: ckey.value })
        postOptions.value = data
        postOptions.value.unshift({ label: '全部', value: -1 })
      }
      getPostOptions()

      return { postOptions }
    }

    // 获取部门配置
    function UseGetDepartMent() {
      const ckey = inject('ckey')
      const departmentOptions = reactive([]) // 部门 options
      async function getDepartmentOptions() {
        // 部门筛选项
        const {
          data: { data: departmentData }
        } = await getDepartmentList({ ckey: ckey.value, parentId: 0 })
        departmentOptions.push(...departmentData[0].departmentRespList)
        departmentOptions.unshift({ departmentName: '全部', id: -1, departmentRespList: [] })
      }
      getDepartmentOptions()
      return { departmentOptions }
    }
  }
}
</script>
