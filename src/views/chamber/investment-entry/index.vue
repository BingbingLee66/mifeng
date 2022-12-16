<template>
  <div class="container">
    <div class="query-form">
      <el-form ref="query" :inline="true" :model="query" label-width="100px" label-position="right" size="small">
        <el-form-item label="姓名">
          <el-input v-model.trim="query.name" clearable maxlength="20" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model.trim="query.phone" clearable maxlength="11" />
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model.trim="query.company" clearable maxlength="50" />
        </el-form-item>
        <el-form-item label="所属商协会" prop="chamberName">
          <el-input v-model.trim="query.chamberName" clearable maxlength="30" />
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
            v-model="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="手填商协会" prop="fillChamberName">
          <el-input v-model.trim="query.fillChamberName" clearable maxlength="30" />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" size="small" @click.native="selectData($event)">查询 </el-button>
          <el-button type="info" @click="reset">重置</el-button>

        </el-form-item>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <ysh-table
      :page-data="pageData"
      :table-config="tableConfig"
      :table-column="tableColumn"
      :table-data="tableData"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    >
      <template v-slot:chamber="row">
        <div v-for="item in row.data.chamberNames" :key="item.index">{{ item }}</div>
      </template>
    </ysh-table>
  </div>
</template>
<script>
import { getInvsetmentList } from '@/api/chamber/manager'
import _data from './data'

export default {
  data() {
    return {
      tableConfig: {
        loading: false,
        selection: false,
      },
      tableColumn: _data.tableColumn,
      tableData: [],
      query: {
        name: '',
        phone: '',
        company: '',
        chamberName: '',
        fillChamberName: '',
      },
      date: [],
      pageData: {
        pageSizes: [10, 20, 50, 100, 500],
        limit: 10,
        total: 10,
        currentpage: 1
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const { currentpage, limit } = this.pageData
      const { data, state, msg } = await getInvsetmentList({
        ...this.query,
        startTime: this.date ? this.date[0] : '',
        endTime: this.date ? this.date[1] : '',
        page: currentpage,
        pageSize: limit
      })
      if (state === 200 || state === 1) {
        this.tableData = data.list
        this.pageData.total = data.totalRows
      } else this.$message(msg)
    },
    handleSizeChange(val) {
      this.pageData.limit = val
      this.pageData.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pageData.currentpage = val
      this.fetchData()
    },
    selectData() {
      this.pageData.currentpage = 1
      this.fetchData()
    },
    reset() {
      this.query = {
        name: '',
        phone: '',
        company: '',
        chamberName: '',
        fillChamberName: ''
      }
      this.date = []
    }
  }
}
</script>
<style></style>
