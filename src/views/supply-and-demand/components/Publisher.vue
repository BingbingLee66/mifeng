<template>
  <!-- 无任何数据 -->
  <div v-if="isUserEmpty" class="empty-user">
    <span class="empty-user-text">无符合条件的用户</span>
    <el-button type="primary" @click="$emit('close')">我知道了</el-button>
  </div>
  <div v-else>
    <!-- 搜索表单区域 -->
    <el-form
      ref="query"
      :inline="true"
      :model="query"
      label-width="80px"
      label-position="right"
      size="small"
    >
      <el-form-item label="用户ID">
        <el-input v-model="query.userId" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="query.userName" clearable placeholder="关键词" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="query.phone" clearable maxlength="11" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="所属商会">
        <el-select v-model="query.ckey" placeholder="请选择">
          <el-option value="全部" label="全部" />
          <el-option v-for="item in chamberList" :key="item.id" :label="item.name" :value="item.ckey" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 搜索结果区域 -->
    <el-table
      ref="table"
      v-loading="loading"
      class="margin-bottom"
      :data="filterTableData"
      style="width:100%;"
      stripe
      border
      header-row-class-name="tableheader"
      empty-text="暂无数据"
    >
      <el-table-column width="55px" class-name="table-radio-cell">
        <el-radio slot-scope="{row}" :value="selectedData.wxUserId" :label="row.wxUserId" @change="onRadioChange(row)" />
      </el-table-column>
      <el-table-column v-for="it in tableRows" :key="it.prop" :prop="it.prop" :label="it.lable" min-width="100px" />
    </el-table>
    <el-pagination
      :current-page="query.pageNum"
      :page-sizes="[10, 50, 100, 200, 300]"
      :page-size="query.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getChamberAllList } from '@/api/goods/goods'
import { getJoinChamberAndNoFreezesUsers } from '@/api/wx-user'

export default {
  name: 'Publisher',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isUserEmpty: false, // 空数据
      query: {
        userId: '',
        userName: '',
        phone: '',
        ckey: '',
        pageNum: 1,
        pageSize: 10
      },
      chamberList: [], // 商会列表
      tableData: [],
      tableRows: [ // 表格行的初始化
        { prop: 'wxUserId', lable: '用户ID' },
        { prop: 'userName', lable: '用户名' },
        { prop: 'phone', lable: '手机号' },
        { prop: 'chamberName', lable: '所属商会' }
      ],
      selectedData: {},
      total: 0,
      loading: false
    }
  },
  computed: {
    // 过滤掉已选发布者
    filterTableData() {
      const { data: [user], tableData } = this
      if (!user) return tableData
      return tableData.filter(v => user.wxUserId !== v.wxUserId)
    }
  },
  created() {
    this.getChamberList()
    this.getUserList().then(() => {
      this.isUserEmpty = !this.tableData.length
      if (this.isUserEmpty) this.$emit('hideFooter')
    })
  },
  activated() {
    this.initData()
  },
  methods: {
    normalizeParams(query = {}) {
      const params = {}
      Object.entries(query).forEach(([key, value]) => {
        if (value) params[key] = value
        if (key === 'ckey' && value === '全部') delete params[key]
      })
      return params
    },
    initData() {
      if (this.isUserEmpty) {
        this.$emit('hideFooter')
      } else if (this.tableData.length) {
        this.selectedData = this.data
      }
    },
    async getChamberList() {
      const { data: { data = [] }} = await getChamberAllList()
      this.chamberList = data
    },
    // 拉取用户列表
    async getUserList() {
      this.loading = true
      try {
        const { data } = await getJoinChamberAndNoFreezesUsers(this.normalizeParams(this.query))
        this.total = data.totalRows
        this.tableData = data.list || []
      } catch (error) { /*  */ }
      this.loading = false
    },
    handleSearch() {
      this.query.pageNum = 1
      this.getUserList()
    },
    handleSizeChange(e) {
      this.query.pageSize = e
      this.getUserList()
    },
    handleCurrentChange(e) {
      this.query.pageNum = e
      this.getUserList()
    },
    onRadioChange(row) {
      this.selectedData = row
    },
    handleConfirm() {
      const { selectedData } = this
      if (!selectedData.wxUserId) return this.$message({ message: '请选择发布者', type: 'warning' })
      this.$emit('confirm', { type: 'Publisher', data: [selectedData] })
    },
  }
}
</script>

<style scoped lang="scss">
.search {
  display: flex;
}
.empty-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  &-text {
    margin-bottom: 50px;
  }
}

/deep/ .table-radio-cell {

  .cell {
    text-align: center;
  }
 .el-radio__label {
    display: none;
  }
}

</style>
