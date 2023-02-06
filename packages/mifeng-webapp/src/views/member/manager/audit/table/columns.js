const formColumns = [
  {
    title: '审核状态',
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
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    initialValue: '',
    filter: true,
    hideInTable: true,
    valueType: 'text'
  },
  {
    title: '入会类型',
    dataIndex: 'type',
    initialValue: -1,
    filter: true,
    hideInTable: true,
    valueType: 'select',
    formItemProps: {
      options: [
        { label: '全部', value: -1 },
        { label: '个人', value: 0 },
        { label: '企业', value: 1 },
        { label: '社会组织', value: 2 }
      ]
    }
  },
  {
    title: '姓名',
    dataIndex: 'name',
    initialValue: '',
    filter: true,
    hideInTable: true,
    valueType: 'text'
  },
  {
    title: '用户名',
    dataIndex: 'uname',
    initialValue: '',
    filter: true,
    hideInTable: true,
    valueType: 'text'
  }
]
const tableColumns = [
  {
    title: '用户头像',
    dataIndex: 'uavatar',
    customRender: ({ record }) => (
      <img
        style="width: 70px; height: 70px; border-radius:50%; object-fit: cover"
        src={record.uavatar || 'https://ysh-cdn.kaidicloud.com/prod/png/yunshanghui-nologo.png.png'}
      />
    )
  },
  { title: '用户名', dataIndex: 'uname' },
  { title: '入会类型', dataIndex: 'type', width: 100 },
  { title: '联系信息', dataIndex: 'contactInfo' },
  {
    title: '所属部门',
    dataIndex: 'departmentName',
    customRender: ({ record }) => {
      return record.departmentName || '--'
    },
    width: 100
  },
  { title: '会内职位', dataIndex: 'postName' },
  { title: '申请时间/申请途径', dataIndex: 'registerType', width: 200 },
  { title: '状态', dataIndex: 'auditStatus' },
  { title: '操作', dataIndex: 'operation', fixed: 'right', width: 180 }
]
const columns = [...formColumns, ...tableColumns]

export default { columns }
