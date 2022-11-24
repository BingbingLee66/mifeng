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
        @handleSligleChange="handleSligleChange"
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
import { tableColumn1, tableColumn5, tableColumn6 } from './data'
import Home from '@/api/home-config/Home'

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
        selection: false,
        single: false,
        singleKey: 'id',
        maxHeight: window.innerHeight - 400 + 'px'
      },
      tableData: [],
      /** 推荐位 1-轮播推荐 2-内容推荐 3-内容推荐卡片 */
      position: null
    }
  },
  computed: {
    tableColumn() {
      if (this.position === 3) {
        return tableColumn5
      } else if (this.position === 2) {
        return tableColumn6
      } else if (this.position === 1) {
        return tableColumn1
      } else {
        return []
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$on('select', position => {
        if (position === 3) {
          this.tableConfig.single = true
          this.tableConfig.selection = false
        } else {
          this.tableConfig.single = false
          this.tableConfig.selection = true
        }
        this.position = position
        this.dialogVisible = true
        this.fetchData(1)
      })
    })
  },
  methods: {
    /** 获取推荐内容列表（根据类容类型） */
    async fetchData(page) {
      const { currentpage, limit } = this.pageData
      const res = await Home.getContentList({
        contentType: this.contentType,
        pageNum: page === 1 ? 1 : currentpage,
        pageSize: limit
      })
      if (res.state === 1) {
        const resData = res.data
        if (resData.list && resData.list.length > 0) {
          resData.list.forEach(i => {
            i.id = i.contentId
            i.label = i.contentId + ' ' + i.contentTitle
          })
        }
        this.tableData = resData.list
        this.pageData.total = resData.totalRows
        this.tableConfig.loading = false
      }
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
