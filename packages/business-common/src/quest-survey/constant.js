import dayjs from 'dayjs'
// 问卷状态
export const STATE_MAP = {
  0: '未发布',
  1: '已发布',
  2: '已冻结',
  3: '已停止',
  9: '已结束',
}
export const columns = [
  { title: 'ID', dataIndex: 'id' },
  {
    title: '问卷标题',
    dataIndex: 'title',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入',
      initialValue: '',
    },
    width: 150,
  },

  {
    title: '答卷状态',
    dataIndex: 'state',
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: [
        { label: '全部', value: '' },
        ...Object.entries(STATE_MAP).map(([key, value]) => ({
          label: value,
          value: key,
        })),
      ],
      initialValue: '',
    },
    customRender: ({ record }) => (
      <div>
        {STATE_MAP[record.state]}
        {+record.state === 2 ? (
          <a-tooltip placement="top" title={record.freezing}>
            <info-circle-outlined />
          </a-tooltip>
        ) : (
          ''
        )}
      </div>
    ),
  },
  { title: '答卷', dataIndex: 'answersCount' },
  {
    title: '创建时间',
    dataIndex: 'createdTs',
    valueType: 'datePicker',
    formItemProps: { initialValue: '' },
    customRender: ({ record }) =>
      dayjs(record.createdTs).format('YYYY-MM-DD HH:mm'),
  },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 200,
  },
]
