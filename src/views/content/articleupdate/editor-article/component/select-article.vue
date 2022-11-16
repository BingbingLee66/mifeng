<template>
  <div class="app-container">
    <el-dialog title="请选择文章" :visible.sync="detailVisible" width="50%">
      <el-form :inline="true">
        <el-form-item label="文章标题:">
          <el-input
            v-model="title"
            clearable
            style="width: 400px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="fetchData(true)"
          >查询</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :key="random"
        v-loading="listLoading"
        style="margin-top: 20px"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          label="操作"
          width="55"
        >
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked" @change="handleChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="id" width="100" label="文章ID" align="center" />
        <el-table-column label="文章标题" align="center">
          <template slot-scope="scope">
            <div class="pre">{{ scope.row.title }}</div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 20px"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="pageSizes"
        :page-size="limit"
        :total="total"
        :current-page.sync="currentpage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div class="btn">
        <el-button @click.native="close">取消</el-button>
        <el-button v-dbClick type="primary" @click="confirm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { officialAccountArticleList } from '@/api/content/officialAccount'
export default {
  data() {
    return {
      detailVisible: false, // 开启表格
      title: '',
      listLoading: false,
      list: [],
      currentpage: 1,
      limit: 10,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      tableData: [], // 选中文章数组
      random: 1, // 动态改变table视图
    }
  },
  methods: {
    // 打开
    open(item) {
      console.log('item', item)
      this.tableData = JSON.parse(JSON.stringify(item))
      this.show()
    },
    // 确定
    confirm() {
      console.log('this.tableData', this.tableData)
      if (this.tableData.length > 8) return this.$message.error('最多只能选择7篇文章')
      if (this.tableData.length <= 1) return this.$message.error('请至少选择一篇文章')
      this.$emit('confirm', this.tableData)
      this.close()
    },
    // 展示
    show() {
      this.detailVisible = true
      this.fetchData(true)
    },
    // 关闭
    close() {
      this.detailVisible = false
      this.limit = 10
      this.currentpage = 1
      this.title = ''
      this.list = []
    },
    handleSizeChange(val) {
      this.limit = val
      this.fetchData(true)
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    },
    // 查询表格
    async fetchData(reset) {
      if (reset) this.currentpage = 1
      this.listLoading = true
      const parmas = {
        pageSize: this.limit,
        page: this.currentpage,
        title: this.title
      }
      const res = await officialAccountArticleList(parmas)
      this.listLoading = false
      this.list = res.data.list || []
      this.total = res.data.totalRows || 0
      this.list.forEach(v => {
        v.checked = false
        this.tableData.forEach(j => {
          if (j.id === v.id) v.checked = true
        })
      })
    },

    // 选中表格
    handleChange(row) {
      const index = this.list.findIndex(item => item.id === row.id)
      this.$set(this.list[index], 'checked', row.checked)

      // checked = tru 则放进数组  false则删除
      if (row.checked) {
        this.tableData.push(this.list[index])
      } else {
        const tableIndex = this.tableData.findIndex(item => item.id === this.list[index].id)
        this.tableData.splice(tableIndex, 1)
      }
      this.$forceUpdate()
      this.random = Math.random()
    }

  },
}
</script>
<style lang="scss" scoped>
.btn{
  width: 100%;
  text-align: center;
  margin: 50px 0 0 0;
}
.pre{
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;  /* 超出部分省略号 */
  word-break: break-all;  /* break-all(允许在单词内换行。) */
  display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
  -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
  -webkit-line-clamp: 2; /* 显示的行数 */
}
/deep/.el-dialog{
  margin-top: 2% !important;
}
</style>
