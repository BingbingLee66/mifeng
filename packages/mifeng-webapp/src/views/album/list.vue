<template>
  <PlusTable
    :loading="loading"
    :dataSource="tableData"
    :columns="tableCols"
    :scroll="{ x: 'max-content' }"
    :pagination="pagination"
    @change="handleTableChange"
    bordered
  >
    <template #filterItem>
      <a-input
        v-model:value="tableFilter.albumName"
        allowClear
        style="width: 300px"
        placeholder="相册名称"
        @change="onQueryChange({ albumName: tableFilter.albumName })"
      >
        <template #prefix>
          <search-outlined />
        </template>
      </a-input>
    </template>
    <template #searchToolBar>
      <div></div>
    </template>
  </PlusTable>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { useAntTable } from '@/use/useAntTable'
import { defineComponent, reactive, ref, inject, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAlbumList, deleteAlbum, auditAlbum } from '@/api/album'
import { UPDATE_TYPE_OPTIONS, ALBUM_TYPES_LIST } from './constant'
export default defineComponent({
  name: 'AlbumList',
  setup() {
    const tableFilter = reactive({
      albumName: ''
    })
    // tableFilter变化时实时获取数据绑定的timer
    let QueryChangetimer = null
    const ckey = inject('ckey')
    const router = useRouter()
    const tableData = ref()
    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
      fetchFn: async pageOption => {
        const params = { ...tableFilter, ckey: ckey.value, total: true }
        params.pageSize = pageOption.pageSize
        params.pageNum = pageOption.current
        const {
          data: { list, totalRows }
        } = await getAlbumList(params)

        tableData.value = list

        // 输出总数
        return {
          total: totalRows
        }
      }
    })

    const tableCols = [
      {
        title: '相册信息',
        width: 200,
        dataIndex: 'albumName',
        filter: true,
        customRender: ({ record }) => (
          <div>
            <div style="color:#66b1ff">{record.albumCkey}</div>
            {record.albumName}
          </div>
        )
      },
      {
        title: '关联业务',
        width: 200,
        customRender: ({ record }) =>
          +record.type === 2 ? (
            <div>
              活动<div style="color:#66b1ff">{record.businessId}</div>
              {record.businessName}
            </div>
          ) : (
            '-'
          )
      },
      {
        title: '图片数',
        dataIndex: 'imgNum',
        width: 80
      },
      {
        title: '浏览量',
        dataIndex: 'browseNum',
        width: 80
      },
      {
        title: '浏览人数',
        dataIndex: 'visitorsNum',
        width: 100
      },
      {
        title: '点赞数',

        dataIndex: 'likeNum',
        width: 80
      },

      {
        title: '下载数',
        dataIndex: 'downloadNum',
        width: 80
      },
      {
        title: '分享数',
        dataIndex: 'shareNum',
        width: 80
      },
      {
        title: '相册状态',
        width: 100,
        customRender: ({ record }) => {
          return record.status === 0 ? (
            <span style="color:#f56c6c">
              <a-badge status="error" />
              冻结
            </span>
          ) : record.auditStatus === 0 ? (
            <span style="color:#f56c6c">
              <a-badge status="error" /> 隐藏
            </span>
          ) : (
            <span style="color:#67c23a">
              <a-badge status="success" />
              正常
            </span>
          )
        }
      },
      {
        title: '浏览量',
        dataIndex: 'readPeopleNum',
        customRender: ({ record }) => {
          return record.readPeopleNum || 0
        },
        width: 100
      },
      {
        title: '操作',
        fixed: 'right',
        width: 185,
        dataIndex: 'operations',
        customRender: ({ record }) => (
          <div>
            <div>
              <a-button type="link" onClick={() => router.push({ path: '/album/edit', query: { id: record.id } })}>
                编辑
              </a-button>
              <a-button type="link" onClick={() => router.push({ path: '/album/detail', query: { id: record.id } })}>
                进入相册
              </a-button>
            </div>
            <div>
              <a-button
                style="margin-left:0"
                type="link"
                onClick={() => hideAlbum(record)}
                danger={record.auditStatus === 1}
              >
                {+record.auditStatus === 1 ? '隐藏' : '公开'}
              </a-button>
              <a-button type="link" onClick={() => delAlbum(record)} danger>
                删除
              </a-button>
            </div>
          </div>
        )
      }
    ]
    const hideAlbum = async row => {
      Modal.confirm({
        title: '',
        content: row.auditStatus ? '是否隐藏？' : '是否公开？',
        async onOk() {
          await auditAlbum({ albumId: row.id, type: row.auditStatus ? 0 : 1 })
          fetchTableData()
        }
      })
    }
    const delAlbum = async row => {
      Modal.confirm({
        title: '',
        content: '删除相册会一并删除里面的图片，是否删除？',
        async onOk() {
          await deleteAlbum({ albumId: row.id })
          fetchTableData()
        }
      })
    }
    const onQueryChange = async query => {
      Object.assign(tableFilter, query)
      clearTimeout(QueryChangetimer)
      QueryChangetimer = setTimeout(() => fetchTableData(true), 300)
    }
    onUnmounted(() => {
      clearTimeout(QueryChangetimer)
    })
    fetchTableData()
    return {
      pagination,
      handleTableChange,
      loading,
      onQueryChange,
      tableFilter,
      ckey,
      tableData,
      tableCols,
      UPDATE_TYPE_OPTIONS,
      ALBUM_TYPES_LIST
    }
  }
})
</script>

<style lang="scss" scoped>
div {
  word-break: break-all;
}
</style>
