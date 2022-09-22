<template>
  <div class="wrap">
    <div class="">
      <h2>会员图片直播</h2>
      <el-input v-model="query.albumName" class="input-item" placeholder="相册名称、用户名称、手机号" prefix-icon="el-icon-search" @input="onQueryChange({albumName:$event,pageNum:1})" />
    </div>
    <KdTable v-loading="loading" style="margin-top:20px;" :columns="columns" :rows="tableData" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />
  </div>
</template>

<script>
import { cancelReleAlbum, getAlbumList, updateAlbumTop } from '@/api/album'

export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination')
  },
  props: {},
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        albumName: '',
      },
      total: 0,
      tableData: [],
      loading: false,
      timer: null,
    }
  },

  computed: {
    ckey() {
      return this.$store.getters.ckey
    },

    activityId() {
      return this.$route.query.id || ''
    },

    columns() {
      return [
        {
          label: '相册信息', width: 200,
          render: ({ row }) => <div><div style='color:#66b1ff'>{row.albumCkey}</div>{row.albumName}</div>
        },
        { label: '用户信息', render: ({ row }) =>
          <div>
            <img src={row.businessImg} alt='' width='50' height='50' />
            <div>{row.businessName}</div>
            <div>{row.number}</div>
          </div>
        },
        { label: '图片数', prop: 'imgNum' },
        { label: '浏览量', prop: 'browseNum' },
        { label: '浏览人数', prop: 'visitorsNum' },
        { label: '点赞数', prop: 'likeNum' },
        { label: '下载数', prop: 'downloadNum' },
        { label: '分享数', prop: 'shareNum' },
        { label: '相册状态', render: ({ row }) => row.status ? <span style='color:#67c23a'>正常</span> : <span style='color:#f56c6c'>冻结</span> },
        {
          label: '操作',
          fixed: 'right',
          width: '120',
          render: ({ row }) => <div>
            <el-button type='text' onClick={() => this.goPage({ path: '/album/detail', query: { id: row.id, editAuth: 0, albumCkey: row.albumCkey }})}>查看</el-button>
            <el-button type='text' onClick={() => this.toggleTop(row)}>{ row.topStatus ? '取消置顶' : '置顶' }</el-button>
            <el-button type='text' onClick={() => this.toggleRelevance(row)}>取消关联</el-button>
          </div>
        },
      ]
    },
  },
  created() {
    this.onQueryChange()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    onQueryChange() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.queryTableData(), 300)
    },
    async queryTableData() {
      this.loading = true
      try {
        const { data: { list, totalRows }} = await getAlbumList({
          ...this.query,
          ckey: this.ckey,
          activityId: this.activityId,
          total: true
        })
        this.tableData = list
        this.total = totalRows
      } finally {
        this.loading = false
      }
    },
    goPage(params) {
      this.$router.push(params)
    },
    async toggleTop(row) {
      await this.$confirm('', `确定${row.topStatus ? '取消置顶' : '置顶'}？`)

      const { state, msg } = await updateAlbumTop({
        activityId: this.activityId,
        albumCkey: row.albumCkey,
        topStatus: row.topStatus ? 0 : 1
      })

      if (state) {
        this.$message.success('操作成功')
        this.onQueryChange()
      } else {
        this.$message.error(msg)
      }
    },
    async toggleRelevance(row) {
      await this.$confirm('', '确定取消关联？')

      const { state, msg } = await cancelReleAlbum({
        albumCkey: row.albumCkey,
      })

      if (state) {
        this.$message.success('操作成功')
        this.onQueryChange()
      } else {
        this.$message.error(msg)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 20px;

  .input-item {
    width: 300px;

    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
