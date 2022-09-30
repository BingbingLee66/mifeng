<template>
  <el-dialog
    :visible="visible"
    title="相册举报详情"
    width="50%"
    @close="close"
  >
    <div class="flex-x-start-center">
      <div>冻结处理人： {{ albumInfo.freezeBy }}（{{ albumInfo.freezeById }}）</div>
      <div class="ml-20">处理时间： {{ albumInfo.freezeTime }}</div>
    </div>

    <KdTable v-loading="loading" style="margin-top:20px;" :columns="columns" :rows="tableData" />

    <div class="flex-x-end-center mt-20">
      <el-button v-dbClick type="primary" @click.native="onFreeze">冻结</el-button>
      <el-button v-dbClick @click.native="close">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { getReportById } from '@/api/report'
import { changeAlbumFreezeStatus } from '@/api/album'

export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),

  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    albumInfo: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      loading: false,
      tableData: []
    }
  },
  computed: {
    columns() {
      return [
        {
          label: '举报人', width: 200,
          render: ({ row }) => <div><div style="color:#66b1ff">{row.reportId}</div>{row.reportName}</div>
        },
        {
          label: '举报内容',
          render: ({ row }) => <div>{row.configId === '4' ? row.reportContent : row.configValueInfo}</div>
        },
        { label: '举报时间', prop: 'reportTime' },
      ]
    },
  },
  watch: {
    visible(n) {
      if (!n) return
      this.fetchDetail()
    }
  },
  methods: {
    async fetchDetail() {
      const { state, data } = await getReportById(this.albumInfo.albumId)
      if (!state) return
      this.tableData = data
    },

    async onFreeze() {
      const freezeParams = {
        0: {
          title: '是否解冻？',
          status: 1,
        },
        1: {
          title: '是否冻结？',
          status: 0,
        }
      }[this.albumInfo.albumStatus]

      await this.$confirm('', freezeParams.title)

      const { state, msg } = await changeAlbumFreezeStatus({ id: this.$route.query.id, status: freezeParams.status })
      if (state) {
        this.$message.success('操作成功')
        this.$emit('success')
      } else {
        this.$message.error(msg)
      }

      this.close()
    },

    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
