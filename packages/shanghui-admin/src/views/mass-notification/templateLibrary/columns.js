import { SYNC_CHANNELS_TYPE, SYNC_CHANNELS_MAP } from '@/constant/mass-notification'
import dayjs from 'dayjs'
const filterColumn = {
  title: '标题',
  dataIndex: 'title',
  filter: true,
  hideInTable: true,
  valueType: 'text',
  initialValue: '',
  formItemProps: {
    placeholder: '请输入关键字'
  }
}
const commonColum = [
  {
    title: '创建信息',
    dataIndex: 'creator',
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.creator}</div>
          <div>{dayjs(Number(record.createdTs)).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
      )
    }
  },
  {
    title: '操作',
    dataIndex: 'operation'
  }
]
export const columns = {
  [SYNC_CHANNELS_TYPE.TEXT_MESSAGE]: [
    filterColumn,
    {
      title: '模板名称',
      dataIndex: 'templateName'
    },
    {
      title: '模板CODE',
      dataIndex: 'templateCode'
    },
    {
      title: '模板类型',
      dataIndex: 'type',
      customRender: ({ record }) => SYNC_CHANNELS_MAP.get(record.type)
    },
    ...commonColum
  ],
  [SYNC_CHANNELS_TYPE.SUBSCRIBE]: [
    filterColumn,
    {
      title: '模板ID',
      dataIndex: 'templateCode'
    },
    {
      title: '标题',
      dataIndex: 'templateName'
    },
    {
      title: '关键词',
      dataIndex: 'subscriptionNoticeTemplateVo',
      customRender: ({ record }) => {
        return record.subscriptionNoticeTemplateVo?.variableAttributes.map(item => item.value).join('、')
      }
    },
    {
      title: '类型',
      dataIndex: 'type',
      customRender: ({ record }) => SYNC_CHANNELS_MAP.get(record.type)
    },
    ...commonColum
  ],
  [SYNC_CHANNELS_TYPE.APP]: [
    filterColumn,
    {
      title: 'ID',
      dataIndex: 'templateCode'
    },
    {
      title: '标题',
      dataIndex: 'templateName'
    },
    {
      title: '内容',
      dataIndex: 'content'
    },
    ...commonColum
  ]
}
