import dayjs from 'dayjs'
import { ORIGIN_MAP, ORIGIN_OPTION } from '@/constant/follow.js'

export const useTableClomn = () => {
  const tableColumns = [
    {
      title: '头像',
      dataIndex: 'uavatar',
      customRender: ({ record }) => (
        <div>
          <img src={record.uavatar} alt="" width="50" height="50" />
        </div>
      )
    },
    { title: '用户名', dataIndex: 'uname' },
    {
      title: '已加入的商协会',
      dataIndex: 'chamberList',
      customRender: ({ record }) => {
        return record.chamberList
          ? record.chamberList.map(i => {
              return <div>{i}</div>
            })
          : '--'
      }
    },
    {
      title: '关注来源',
      dataIndex: 'type',
      customRender: ({ record }) => {
        return <div>{record.type !== 0 ? ORIGIN_MAP.get(record.type) : '--'}</div>
      }
    },
    { title: '引发关注的内容', dataIndex: 'notice' },
    {
      title: '关注日期',
      dataIndex: 'createdTs',
      customRender: ({ record }) => {
        return <div>{dayjs(+record.createdTs).format('YYYY-MM-DD·hh:mm:ss')}</div>
      }
    }
  ]

  const columns = [
    {
      title: '关注来源',
      dataIndex: 'type',
      filter: true,
      valueType: 'select',
      hideInTable: true,
      initialValue: 0,
      formItemProps: {
        options: ORIGIN_OPTION
      }
    },
    ...tableColumns
  ]

  return { columns }
}
