<template>
  <div class="app-container">
    <el-dialog title="请选择文章" :visible.sync="detailVisible" width="50%">
      <el-form :inline="true" :model="formObj">
        <el-form-item label="文章标题:">
          <el-input
            v-model="formObj.title"
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
            <el-checkbox v-model="scope.row.checked" />
          </template>
        </el-table-column>
        <el-table-column prop="templateCode" label="文章ID" align="center" />
        <el-table-column label="文章标题" align="center">
          <template slot-scope="scope">
            <div class="pre">{{ scope.row.content }}</div>
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
        <el-button v-dbClick type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog></div>
</template>

<script>
export default {

  data() {
    return {
      detailVisible: false, // 开启表格
      formObj: {
        title: ''
      },
      listLoading: false,
      list: [],
      currentpage: 1,
      limit: 10,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
    }
  },
  methods: {
    // 打开
    open(item) {
      console.log('item', item)
      this.show()
    },
    save() {
      this.$emit('save')
    },
    // 展示
    show() {
      this.detailVisible = true
    },
    // 关闭
    close() {
      this.detailVisible = false
      this.limit = 10
      this.currentpage = 1
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
      // this.listLoading = true
      // const parmas = {
      //   ckey: this.formobj.title,
      //   pageSize: this.limit,
      //   page: this.currentpage,
      // }
      // const res = await distributionTemplates(parmas)
      // this.listLoading = false
      // this.list = res.data.list || []
      // this.total = res.data.totalRows || 0
    },

  },
}
</script>
<style lang="scss" scoped>
.btn{
  width: 100%;
  text-align: center;
  margin: 50px 0 20px 0;
}
.pre{
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;  /* 超出部分省略号 */
  word-break: break-all;  /* break-all(允许在单词内换行。) */
  display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
  -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
  -webkit-line-clamp: 1; /* 显示的行数 */
}
</style>
