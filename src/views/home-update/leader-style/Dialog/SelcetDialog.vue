<template>
  <div>
    <el-dialog
      v-if="dialogVisible"
      title="内容资源"
      width="800px"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      @closed="close"
    >
      <ysh-table
        ref="tableRef"
        :table-config="tableConfig"
        :table-column="tableColumn"
        :table-data="tableData"
        :page-data="pageData"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        @handleSelectionChange="handleSelectionChange"
      />
      <div class="mt-40 text-center">
        <el-button class="mr-20" @click="close">上一步</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableMixins from '@/mixins/yshTable'
import { getChamberContentList } from '@/api/content/article'

export default {
  // 查询，重置，分页，多选等操作（混入方式实现）
  mixins: [TableMixins],
  props: {
    contentType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      /** 表格配置 */
      tableConfig: {
        loading: true,
        selection: true,
        maxHeight: window.innerHeight - 400 + 'px'
      },
      tableData: [],
      tableColumn: [
        {
          label: '文章ID',
          prop: 'id',
          align: 'center',
          width: '200px'
        },
        {
          label: '文章标题',
          prop: 'title',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$on('select', () => {
        this.dialogVisible = true
        this.fetchData(1)
      })
    })
  },
  methods: {
    /** 获取推荐内容列表（根据类容类型） */
    async fetchData(page) {
      const { currentpage, limit } = this.pageData
      const res = await getChamberContentList({
        pageSize: limit,
        page: page === 1 ? 1 : currentpage,
        ckey: this.$store.getters.ckey,
        title: '',
        contentModuleId: 5,
        contentColumnId: -1,
        status: 1,
        column: '',
        orderType: 1
      })
      if (res.data.data.list && res.data.data.list.length > 0) {
        res.data.data.list.forEach(i => {
          i.label = i.id + ' ' + i.title
        })
      }
      this.tableData = res.data.data.list
      this.pageData.total = res.data.data.totalRows
      this.tableConfig.loading = false
    },
    close() {
      this.pageData.currentpage = 1
      this.pageData.total = 0
      this.tableData = []
      this.dialogVisible = false
    },
    confirm() {
      this.$emit('confirm', this.selectionData)
      this.close()
    }
  }
}
</script>
