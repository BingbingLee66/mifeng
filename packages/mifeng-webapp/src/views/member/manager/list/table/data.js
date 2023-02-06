import { ref, reactive, inject, onMounted } from 'vue'
import { useAntTable } from '@/use/useAntTable'
import { useRowSelection } from '@/use'
import { getMemberList } from '@/api/member/manager'

export function useTableData() {
  const tableFilter = reactive({
    activatedState: 0, // 激活状态 -1未激活 0全部 1已激活
    companyName: '', // 企业/团体名称
    contactName: '', // 联系人姓名
    contactPhone: '', // 联系人电话
    department: -1, // 部门
    sendStatus: '', // 短信发送状态
    memberLabelIds: '', // 会员标签
    memberPostType: -1, // 会内职位
    name: '', // 会员姓名
    phone: '', // 会员手机号
    status: 1, // 账号状态
    tradeType: -1, // 行业
    type: -1, // 入会类型
    uname: '', // 用户名
    tradeLabelIds: '' // **行业标签**
  })
  const ckey = inject('ckey')
  const tableData = ref([])
  // preserveSelectedRowKeys: true 保留上一页所选的数据
  const rowSelection = useRowSelection({ preserveSelectedRowKeys: true })
  const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
    fetchFn: async pageOption => {
      // rowSelection.onChange([])
      const {
        data: {
          data: { list, totalRows }
        }
      } = await getMemberList({
        ckey: ckey.value,
        pageSize: pageOption.pageSize,
        page: pageOption.current,
        ...tableFilter
      })
      tableData.value = list
      return {
        total: totalRows
      }
    }
  })
  const handleSearch = obj => {
    const {
      status,
      uname,
      name,
      phone,
      contactName,
      contactPhone,
      companyName,
      memberPostType,
      department,
      type,
      tradeType,
      activatedState,
      demandLabelIds,
      tradeLabelIds,
      platLabelIds,
      chamberLabelIds,
      sendStatus,
      date
    } = obj
    tableFilter.status = status
    tableFilter.uname = uname
    tableFilter.name = name
    tableFilter.phone = phone
    tableFilter.type = type
    tableFilter.contactName = contactName
    tableFilter.contactPhone = contactPhone
    tableFilter.companyName = companyName
    tableFilter.memberPostType = memberPostType
    tableFilter.type = type
    tableFilter.tradeType = tradeType
    tableFilter.activatedState = activatedState
    tableFilter.sendStatus = sendStatus !== -1 ? sendStatus : ''
    let _memberLabelIds = []
    if (demandLabelIds) {
      tableFilter.demandLabelIds = demandLabelIds.join(',')
    }
    if (department && department !== -1) {
      tableFilter.department = department[department.length - 1].toString()
    }
    if (tradeLabelIds && tradeLabelIds?.length) {
      const _tradeLabelIds = tradeLabelIds.map(i => i[i.length - 1]).join(',')
      tableFilter.tradeLabelIds = _tradeLabelIds
    } else {
      tableFilter.tradeLabelIds = ''
    }
    if (chamberLabelIds && chamberLabelIds?.length) {
      _memberLabelIds = chamberLabelIds.map(i => i[i.length - 1])
    }
    if (platLabelIds && platLabelIds?.length) {
      const _platLabelIds = platLabelIds.map(i => i[i.length - 1])
      _memberLabelIds.push(..._platLabelIds)
    }
    tableFilter.memberLabelIds = _memberLabelIds?.length ? _memberLabelIds.join(',') : ''

    if (date) {
      tableFilter.startTs = date[0] || ''
      tableFilter.endTs = date[1] || ''
    }

    fetchTableData(1)
  }

  onMounted(() => {
    fetchTableData()
  })

  return {
    tableData,
    tableFilter,
    pagination,
    rowSelection,
    loading,
    fetchTableData,
    handleTableChange,
    handleSearch
  }
}
