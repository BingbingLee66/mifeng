import { POSITION_STATUS_MAP, BANNER_STATUS_MAP } from '@/constant/home-update'

export const tableColumn = [
  {
    title: '活动ID/名称',
    dataIndex: 'label'
  },
  {
    title: '活动列表图',
    dataIndex: 'contentImg'
  },
  {
    title: '顺序',
    dataIndex: 'order',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 100,
    fixed: 'right'
  }
]

export const tableColumn1 = [
  {
    title: '',
    dataIndex: 'keyword',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入ID/名称'
    }
  },
  {
    title: '活动ID/名称',
    dataIndex: 'label'
  },
  {
    title: '活动列表图',
    dataIndex: 'contentImg'
  }
]

export const tableColumn2 = [
  {
    title: '供需ID',
    dataIndex: 'id'
  },
  {
    title: '供需标题',
    dataIndex: 'contentTitle'
  },
  {
    title: '顺序',
    dataIndex: 'order'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    fixed: 'right'
  }
]

export const tableColumn3 = [
  {
    title: '文章ID',
    dataIndex: 'id'
  },
  {
    title: '文章标题',
    dataIndex: 'contentTitle'
  },
  {
    title: '顺序',
    dataIndex: 'order'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    fixed: 'right'
  }
]

export const tableColumn4 = [
  {
    title: '文章ID',
    dataIndex: 'id'
  },
  {
    title: '文章标题',
    dataIndex: 'contentTitle'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    fixed: 'right'
  }
]

export const tableColumn5 = [
  {
    title: '',
    dataIndex: 'keyword',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入ID/名称'
    }
  },
  {
    title: '文章ID',
    dataIndex: 'id'
  },
  {
    title: '文章标题',
    dataIndex: 'contentTitle'
  }
]

export const tableColumn6 = [
  {
    title: '',
    dataIndex: 'keyword',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入ID/名称'
    }
  },
  {
    title: '供需ID/文章ID',
    dataIndex: 'id'
  },
  {
    title: '供需标题/文章标题',
    dataIndex: 'contentTitle'
  }
]

export const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80
  },
  {
    title: '推荐位',
    dataIndex: 'position',
    width: 130,
    customRender: ({ record }) => {
      return POSITION_STATUS_MAP.get(record.position)
    }
  },
  {
    title: '可推荐内容类型',
    dataIndex: 'optionalType',
    width: 130
  },
  {
    title: '当前使用内容',
    dataIndex: 'contentStr',
    width: 130
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }) => {
      return BANNER_STATUS_MAP.get(record.status)
    }
  },
  {
    title: '更新时间',
    dataIndex: 'updateTs',
    width: 130
  },
  {
    title: '操作人',
    dataIndex: 'operatorStr',
    width: 180
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 130,
    fixed: 'right'
  }
]
