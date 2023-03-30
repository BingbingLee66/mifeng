import { ARTICLE_STATUS_OPT, WORD_STATUS, TIME_STATUS } from '@/constant/content'
export const ArticleListCols = [
  {
    title: '文章ID',
    dataIndex: 'id',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入文章标题'
    }
  },
  {
    title: '文章状态',
    dataIndex: 'status',
    filter: true,
    hideInTable: true,
    valueType: 'select',
    formItemProps: {
      options: ARTICLE_STATUS_OPT,
      placeholder: '请选择',
      defaultValue: -1
    }
  },
  { title: '文章标题', dataIndex: 'title', width: 150 },
  {
    title: '来源商会',
    dataIndex: 'chamberName',
    width: 150,
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: [],
      placeholder: '请选择',
      defaultValue: ''
    }
  },
  { title: '栏目', dataIndex: 'contentColumn', width: 150 },
  {
    title: '浏览量',
    dataIndex: 'readCount',
    sorter: true,
    width: 130
  },
  {
    title: '点赞量',
    dataIndex: 'commentLikeNums',
    sorter: true,
    width: 130
  },
  {
    title: '评论量',
    dataIndex: 'commentNums',
    sorter: true,
    width: 130
  },
  {
    title: '绑定词条',
    dataIndex: 'existEntry',
    width: 100,
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: WORD_STATUS,
      placeholder: '请选择',
      defaultValue: ''
    }
  },
  { title: '来源', dataIndex: 'publishType', width: 150 },
  {
    title: '发布时间',
    dataIndex: 'publishTs',
    width: 150,
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: TIME_STATUS,
      placeholder: '请选择',
      defaultValue: 0
    }
  },
  { title: '状态', dataIndex: 'status', width: 150 },
  { title: '是否置顶', dataIndex: 'isstop', width: 150 },
  { title: '操作', key: 'handle', width: 150, fixed: 'right' }
]
