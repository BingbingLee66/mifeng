const formColumns = [
  {
    title: '状态',
    dataIndex: 'auditStatus',
    initialValue: 0,
    filter: true,
    hideInTable: true,
    valueType: 'select',
    formItemProps: {
      options: [
        { label: '所有', value: -1 },
        { label: '待审核', value: 0 },
        { label: '已通过', value: 1 },
        { label: '已驳回', value: 2 }
      ]
    }
  }
]
const tableColumns = [
  { title: '用户名', dataIndex: 'uname' },
  { title: '会员名字/联系人姓名', dataIndex: 'name', width: 180 },
  { title: '手机号/联系人电话', dataIndex: 'phone', width: 150 },
  { title: '会内职位', dataIndex: 'postName', width: 140 },
  { title: '提交时间', dataIndex: 'createdTs' },
  { title: '状态', dataIndex: 'auditStatus' },
  { title: '操作', dataIndex: 'operation', fixed: 'right', width: 150 }
]
const columns = [...formColumns, ...tableColumns]

export default { columns, tableColumns }
