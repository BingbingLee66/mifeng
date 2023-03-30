import { SYNC_CHANNELS_TYPE } from '@/constant/mass-notification'
import { TEMPLATE_MAP, NOTIFICATION_TYPE_MAP } from '@business/common/src/mass-notification/constant/mass-notification'
import dayjs from 'dayjs'
export const DETAIL_TYPE = {
  TEMPLATE_LIBRARY: 1,
  TEMPLATE_SETTING: 2
}

export const DETAIL_LIST_SHOW_DATA = new Map([
  [
    SYNC_CHANNELS_TYPE.TEXT_MESSAGE,
    [
      {
        key: 'type',
        label: '模板类型',
        customRender: value => {
          return TEMPLATE_MAP.get(value)
        }
      },
      { key: 'templateName', label: '模板名称' },
      { key: 'templateCode', label: '模板CODE' },
      { key: 'content', label: '模板内容' },
      {
        key: 'smsNoticeTemplateVo',
        label: '变量属性',
        customRender: value => {
          const result = value?.variableAttributes
            .map(item => {
              return item.key + (item.value ? `-${item.value}` : '')
            })
            .join('<br />')
          return result
        }
      },
      {
        key: 'smsNoticeTemplateVo',
        label: '场景链接',
        customRender: value => {
          return value.link
        }
      },
      {
        key: 'smsNoticeTemplateVo',
        label: '场景说明',
        customRender: value => {
          return value.sceneDescription
        }
      },
      {
        key: 'createdTs',
        label: '创建时间',
        customRender: value => {
          return dayjs(Number(value)).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    ]
  ],
  [
    SYNC_CHANNELS_TYPE.SUBSCRIBE,
    [
      { key: 'templateCode', label: '模板ID' },
      { key: 'id', label: '模板编号' },
      { key: 'templateName', label: '标题' },
      {
        key: 'subscriptionNoticeTemplateVo',
        label: '类目',
        customRender: value => {
          return value.category
        }
      },
      {
        key: 'creator',
        label: '操作人'
      },
      {
        key: 'subscriptionNoticeTemplateVo',
        label: '详细内容',
        customRender: value => {
          const result = value?.variableAttributes
            ?.map(item => {
              return item.key + (item.value ? `-${item.value}` : '')
            })
            .join('<br />')
          return result
        }
      },
      {
        key: 'smsNoticeTemplateVo',
        label: '场景说明',
        customRender: value => {
          return value?.sceneDescription
        }
      }
    ]
  ],
  [
    SYNC_CHANNELS_TYPE.APP,
    [
      { key: 'templateName', label: '标题' },
      { key: 'content', label: '模板内容' },
      {
        key: 'appNoticeTemplateVo',
        label: '链接',
        customRender: value => {
          return value?.link
        }
      },
      {
        key: 'createdTs',
        label: '创建时间',
        customRender: value => {
          return dayjs(Number(value)).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    ]
  ],
  [
    'templateSet_APP',
    [
      { key: 'templateName', label: '标题' },
      { key: 'content', label: '模板内容' },
      {
        key: 'appNoticeTemplateVo',
        label: '链接',
        customRender: value => {
          return value?.link
        }
      },
      {
        key: 'appNoticeTemplateVo',
        label: '变量属性',
        customRender: value => {
          const result = value?.variableAttributes
            ?.map(item => {
              return item.key + (item.value ? `-${item.value}` : '')
            })
            .join('<br />')
          return result
        }
      },
      {
        key: 'noticeTypeId',
        label: '缴费类型',
        customRender: value => {
          return NOTIFICATION_TYPE_MAP.get(value.noticeTypeId)
        }
      },
      {
        key: 'createdTs',
        label: '创建时间',
        customRender: value => {
          return dayjs(Number(value)).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        key: 'templateRemark',
        label: '模板备注'
      }
    ]
  ]
])
