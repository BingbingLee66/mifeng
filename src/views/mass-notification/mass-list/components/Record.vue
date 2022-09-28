<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <el-dialog
      title="分配记录"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-row>
        <el-col :span="2">
          <div class="distribution">分配时间</div>
        </el-col>
        <el-col :span="11">
          <el-date-picker
            v-model="createdTime"
            value-format="timestamp"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="fetchData(true)">
            查询
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="listLoading"
        style="margin-top: 20px"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="分配时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.creator }}
            {{ scope.row.createdTs | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="distributionSum" label="分配数量" align="center" />
        <el-table-column prop="remainSum" label="分配后剩余短信总数" align="center" />

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

      <div class="dialog-footer">
        <el-button type="primary" @click="handleClose">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  distributionList
} from '@/api/mass-notification'
export default {
  data() {
    return {
      dialogVisible: false,
      listLoading: false,
      list: [], // 列表
      currentpage: 1,
      limit: 10,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      id: null,
      createdTime: [], // 时间
    }
  },
  methods: {
    async show(row) {
      this.id = row.id
      this.fetchData(true)
      this.dialogVisible = true
    },
    // 取消
    handleClose() {
      this.dialogVisible = false
      this.currentpage = 1
      this.limit = 10
      this.total = 0
      this.id = null
      this.list = []
      this.createdTime = []
    },
    // 列表数据
    async fetchData(reset) {
      if (reset) this.currentpage = 1
      this.listLoading = true
      const parmas = {
        id: this.id,
        pageSize: this.limit,
        page: this.currentpage,
        startTime: this.createdTime && this.createdTime.length > 0 ? this.createdTime[0] : '',
        endTime: this.createdTime && this.createdTime.length > 0 ? this.createdTime[1] : '',
      }
      const res = await distributionList(parmas)
      this.listLoading = false
      this.list = res.data.list || []
      this.total = res.data.totalRows || 0
    },
    handleSizeChange(val) {
      this.limit = val
      this.fetchData(true)
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    }
  }
}
</script>
<style scoped lang="scss">
.distribution{
  line-height: 37px;
  font-size: 16px;
}
.dialog-footer{
  margin-top: 40px;
  width: 100%;
  text-align: center;
}
</style>
