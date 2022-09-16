<template>
  <div class="wrap">
    <div class="">
      <h2>相册举报列表</h2>

      <div class="flex-x-start-center">
        <el-input :value="query.albumName" class="input-item" placeholder="相册名称、主体名称" prefix-icon="el-icon-search" @input="onQueryChange({albumName:$event,pageNum:1})" />
        <span class="ml-20">状态：</span>
        <el-select :value="query.status" class="input-item" @change="onQueryChange({status:$event,pageNum:1})">
          <el-option label="全部" value="" />
          <el-option label="正常" value="1" />
          <el-option label="已冻结" value="0" />
        </el-select>
      </div>
    </div>
    <KdTable v-loading="loading" style="margin-top:20px;" :columns="columns" :rows="tableData" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />

    <DetailDialog :id="albumId" :visible.sync="detailDialogVisible" />

  </div>
</template>

<script>

export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
    DetailDialog: () => import('@/views/album/components/DetailDialog')
  },
  props: {},
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        albumName: '',
        status: ''
      },
      total: 0,
      tableData: [],
      loading: false,
      detailDialogVisible: false,
      albumId: '',
    }
  },

  computed: {
    ckey() {
      return this.$store.getters.ckey
    },

    columns() {
      return [
        {
          label: '举报相册', width: 200,
          render: ({ row }) => <div><div style='color:#66b1ff'>{row.albumCkey}</div>{row.albumName}</div>
        },
        {
          label: '相册主体',
          render: ({ row }) => <div><div style='color:#66b1ff'>{row.albumCkey}</div>{row.chamberName}</div>
        },
        { label: '举报次数', prop: 'imgNum' },
        { label: '状态', render: ({ row }) => row.status ? <span style='color:#67c23a'>正常</span> : <span style='color:#f56c6c'>已冻结</span> },
        { label: '处理时间', prop: 'handleTime' },
        {
          label: '操作',
          fixed: 'right',
          width: '120',
          render: ({ row }) => <div>
            <el-button type='text' onClick={() => this.showDetailDialog(row)}>详情</el-button>
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
        // TODO 待完善
        // const { data: { list, totalRows }} = await getAlbumList({
        //   ...this.query,
        //   ckey: this.ckey,
        //   total: true
        // })
        // this.tableData = list
        // this.total = totalRows
      } finally {
        this.loading = false
      }
    },
    async toggleTop() {
      await this.$confirm('', '确定取消置顶？')
      // TODO 待对接
      console.log('删除置顶')
    },

    showDetailDialog(row) {
      this.albumId = row.id
      this.detailDialogVisible = true
    }

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
