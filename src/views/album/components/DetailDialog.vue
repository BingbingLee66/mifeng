<template>
  <el-dialog
    :visible="visible"
    title="相册举报详情"
    width="50%"
    @close="close"
  >
    <div class="flex-x-start-center">
      <div>冻结处理人： 张三（1234）</div>
      <div class="ml-20">处理时间： 2022-10-23 14:23</div>
    </div>

    <KdTable v-loading="loading" style="margin-top:20px;" :columns="columns" :rows="tableData" />

    <div class="flex-x-end-center mt-20">
      <el-button v-dbClick type="primary" @click.native="onFreeze">冻结</el-button>
      <el-button v-dbClick @click.native="close">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),

  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: '',
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
          render: ({ row }) => <div><div style='color:#66b1ff'>{row.albumCkey}</div>{row.albumName}</div>
        },
        {
          label: '举报内容',
          render: ({ row }) => <div>涉嫌咋骗</div>
        },
        { label: '举报时间', prop: 'reportTime' },
      ]
    },
  },
  watch: {
    visible(n) {
      if (!n) return
      // TODO 获取详情逻辑
    }
  },
  methods: {
    async onFreeze() {
      await this.$confirm('', '是否冻结？')
      // TODO 冻结
      console.log('冻结')
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
