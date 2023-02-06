<template>
  <PlusTable
    rowKey="id"
    :columns="tableColumns"
    :data-source="tableData"
    :request="handlerSearch"
    :pagination="pagination"
    :loading="loading"
    header-title="会员图片直播"
    @change="handleTableChange"
    bordered
  >
  </PlusTable>
</template>

<script setup>
import { cancelReleAlbum, getAlbumList, updateAlbumTop } from '@/api/album'
import { onMounted, ref, inject, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAntTable } from '@/use/useAntTable/index'
import { Modal } from 'ant-design-vue'

const ckey = inject('ckey')
const router = useRouter()
const query = reactive({
  activityId: null,
  albumName: '',
  total: true
})
const tableData = ref([])
const useTableColumn = query => {
  const toggleTop = async record => {
    Modal.confirm({
      title: `确定${record.topStatus ? '取消置顶' : '置顶'}？`,
      async onOk() {
        await updateAlbumTop({
          activityId: query.activityId,
          albumCkey: record.albumCkey,
          topStatus: record.topStatus ? 0 : 1
        })
        fetchTableData()
      }
    })
  }
  const toggleRelevance = async record => {
    Modal.confirm({
      title: `确定取消关联？`,
      async onOk() {
        await cancelReleAlbum({
          albumCkey: record.albumCkey
        })
        fetchTableData()
      }
    })
  }
  const tableColumns = ref([
    {
      title: '相册信息',
      dataIndex: 'albumName',
      filter: true,
      valueType: 'text',
      formItemProps: {
        placeholder: '相册名称、用户名称、手机号',
        allowClear: true
      },
      width: 200,
      span: 12,
      customRender: ({ record }) => {
        return (
          <div>
            <div style="color:#66b1ff">{record.albumCkey}</div>
            {record.albumName}
          </div>
        )
      }
    },
    {
      title: '用户信息',
      width: 200,
      customRender: ({ record }) => {
        return (
          <div>
            <img src={record.businessImg} alt="" width="50" height="50" />
            <div>{record.businessName}</div>
            <div>{record.number}</div>
          </div>
        )
      }
    },
    { title: '图片数', dataIndex: 'imgNum' },
    { title: '浏览量', dataIndex: 'browseNum' },
    { title: '浏览人数', dataIndex: 'visitorsNum' },
    { title: '点赞数', dataIndex: 'likeNum' },
    { title: '下载数', dataIndex: 'downloadNum' },
    { title: '分享数', dataIndex: 'shareNum' },
    {
      title: '相册状态',
      customRender: ({ record }) => {
        if (record.status) {
          return <div style="color:#67c23a">正常</div>
        } else {
          return <div style="color:#f56c6c">冻结</div>
        }
      }
    },
    {
      title: '操作',
      fixed: 'right',
      customRender: ({ record }) => {
        return (
          <div>
            <a-button
              type="link"
              onClick={() =>
                router.push({
                  path: '/album/detail',
                  query: { id: record.id, editAuth: 0, albumCkey: record.albumCkey }
                })
              }
            >
              查看
            </a-button>
            <a-button type="link" onClick={() => toggleTop(record)}>
              {record.topStatus ? '取消置顶' : '置顶'}
            </a-button>
            <a-button type="link" onClick={() => toggleRelevance(record)}>
              取消关联
            </a-button>
          </div>
        )
      }
    }
  ])
  return { tableColumns }
}

const fetchFn = async pageOption => {
  const conditionQuery = reactive({
    pageSize: pageOption.pageSize,
    page: pageOption.current,
    ckey,
    ...query
  })
  const {
    data: { list, totalRows }
  } = await getAlbumList(conditionQuery)
  tableData.value = list
  return {
    total: totalRows
  }
}
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({ fetchFn })
const { tableColumns } = useTableColumn(query)
const handlerSearch = value => {
  query.albumName = value.albumName
  fetchTableData()
}
onMounted(() => {
  query.activityId = router.currentRoute.value.query.id || ''
  fetchTableData()
})
</script>

<style lang="scss" scoped></style>
