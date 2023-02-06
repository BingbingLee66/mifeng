export const ArticleListCols = [
  { title: '文章ID', dataIndex: 'id', key: 'id', width: 120 },
  { title: '文章标题', dataIndex: 'title', key: 'title', width: 150 },
  { title: '栏目', dataIndex: 'contentColumn', key: 'contentColumn', width: 150 },
  {
    title: '浏览量',
    dataIndex: 'readCount',
    key: 'readCount',
    width: 100,
    sorter: { compare: (a, b) => a.readCount - b.readCount, multiple: 3 }
  },
  {
    title: '点赞量',
    dataIndex: 'commentLikeNums',
    key: 'commentLikeNums',
    width: 100,
    sorter: { compare: (a, b) => a.commentLikeNums - b.commentLikeNums, multiple: 2 }
  },
  {
    title: '评论量',
    dataIndex: 'commentNums',
    key: 'commentNums',
    width: 100,
    sorter: { compare: (a, b) => a.commentNums - b.commentNums, multiple: 1 }
  },
  { title: '创建信息', dataIndex: 'createdTs', key: 'createdTs', width: 150 },
  { title: '发布时间', dataIndex: 'firstPublishTs', key: 'firstPublishTs', width: 150 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 150 },
  { title: '是否置顶', dataIndex: 'isChamberTop', key: 'isChamberTop', width: 150 },
  { title: '操作', key: 'handle', width: 150 }
]

export const AboutListCols = [
  { title: '序号', key: 'id', width: 120 },
  { title: '栏目', dataIndex: 'contentColumn', key: 'contentColumn', width: 175 },
  {
    title: '文章内容',
    dataIndex: 'contentHtml',
    key: 'contentHtml',
    width: 175
  },
  { title: '权重', dataIndex: 'sort', key: 'sort' },
  { title: '创建信息', key: 'createdTs', width: 150 },
  { title: '更新信息', key: 'updatedTs', width: 150 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 150 },
  { title: '操作', key: 'handle', width: 150, fixed: 'right' }
]

export const HonorListCols = [
  { title: '序号', key: 'id', width: 120 },
  { title: '文章内容', dataIndex: 'contentHtml', key: 'contentHtml' },
  { title: '创建信息', key: 'createdTs', width: 250 },
  { title: '更新信息', key: 'updatedTs', width: 250 },
  { title: '操作', key: 'handle', width: 200, fixed: 'right' }
]
