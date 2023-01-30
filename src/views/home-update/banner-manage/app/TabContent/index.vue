<template>
  <div>
    <!-- 操作栏 -->
    <el-row>
      <el-button
        icon="el-icon-folder-add"
        type="primary"
        size="medium"
        @click="handleEvent('add')"
      >新增banner图</el-button>
      <el-button
        v-if="tableData.length > 0"
        type="primary"
        size="medium"
        @click="handleEvent('rate')"
      >切换频率</el-button>
      <el-button icon="el-icon-delete" type="primary" size="medium" @click="handleDeleteMulti">删除</el-button>
    </el-row>

    <!-- 表格数据 -->
    <el-table
      v-loading="tableConfig.loading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      highlight-current-row
    >
      <el-table-column width="100px">
        <template slot="header" slot-scope="">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >序号</el-checkbox>
        </template>
        <template slot-scope="scope">
          <el-checkbox v-model="selectionDatas[scope.$index].itemCheck" @change="toggleCheck()">{{
            scope.$index + 1
          }}</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="ID" width="100px">
        <template slot-scope="scope">
          <div class="label">{{ scope.row.bannerId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="标题" width="150px">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="图片" width="160px">
        <template slot-scope="scope">
          <img
            class="goods-preview"
            :src="scope.row.img"
            style="width: 120px; height: 80px"
            @click="openPreviewModal(scope.row.img)"
          >
        </template>
      </el-table-column>
      <el-table-column label="关联内容" width="100px">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="轮播顺序" width="100px">
        <template slot-scope="scope">
          <i
            v-if="scope.$index !== 0"
            class="el-icon-top"
            style="font-size: 26px; cursor: pointer"
            @click="handleOrder('up', scope.row)"
          />
          <i
            v-if="scope.$index + 1 !== tableData.length"
            class="el-icon-bottom"
            style="font-size: 26px; cursor: pointer"
            @click="handleOrder('down', scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="切换频率" width="160px">
        <template slot-scope="scope">
          <span v-if="scope.row.switchFrequence">{{ scope.row.switchFrequence + 'ms' }}</span>
          <span v-else>不切换</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">删除</span>
          <span v-if="scope.row.status === 1">使用中</span>
          <span v-if="scope.row.status === 2">冻结</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="160px">
        <template slot-scope="scope">
          {{ formatTime(scope.row.updateTs) }}
        </template>
      </el-table-column>
      <el-table-column label="操作人" width="160px">
        <template slot-scope="scope">
          {{ scope.row.updaterName }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <span class="text-blue cur ml-10" @click="handleEvent('edit', scope.row)">编辑</span>
          <span
            v-if="scope.row.status === 2"
            class="text-blue cur ml-10"
            @click="handleEvent('status', scope.row)"
          >启用</span>
          <span
            v-if="scope.row.status === 1"
            class="text-blue cur ml-10"
            @click="handleEvent('status', scope.row)"
          >冻结</span>
          <span
            v-if="scope.row.num !== 1 && scope.row.status !== 2"
            class="text-blue cur ml-10"
            @click="handleEvent('top', scope.row)"
          >置顶</span>
          <span
            v-if="scope.row.status === 2"
            class="text-red cur ml-10"
            @click="handleEvent('delete', scope.row)"
          >删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentPage"
      :style="{ 'padding-top': '15px' }"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 新增/编辑banner弹窗 -->
    <add-dialog ref="dialogRef1" :client-type="'1'" @refresh="fetchData" />
    <!-- 切换频率弹窗 -->
    <rate-dialog ref="dialogRef2" @refresh="fetchData" />
  </div>
</template>

<script>
import TableMixins from '@/mixins/yshTable'
// import { tableColumn } from './data'
import AddDialog from '../Dialog/AddDialog'
import RateDialog from '../Dialog/RateDialog'
import Home from '@/api/home-config/Home'
import { parseTime } from '@/utils/index'

export default {
  components: { AddDialog, RateDialog },
  // 查询，重置，分页，多选等操作（混入方式实现）
  mixins: [TableMixins],
  data() {
    return {
      // tableConfig: {
      //   loading: false,
      //   selection: false,
      //   maxHeight: window.innerHeight - 260 + 'px'
      // },
      // tableColumn,
      tableData: [],
      currentPage: 1,
      limit: 10,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      isIndeterminate: false,
      checkAll: false,
      checkedNumber: [],
      selectionDatas: [],
      tableDataId: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /** 获取banner图列表数据 */
    async fetchData() {
      this.tableConfig.loading = true
      const res = await Home.getBannerList({
        clientType: 1,
        page: this.currentPage,
        pageSize: this.limit
      })
      if (res.state !== 1) return
      const resData = res.data
      console.log(resData, 'res')
      this.tableData = resData.list
      this.tableData.forEach(() => {
        this.selectionDatas.push({ itemCheck: false })
      })
      console.log(this.tableData)
      this.total = res.data.totalRows
      this.tableConfig.loading = false
    },

    /** 新增|编辑|删除|启用|冻结banner图 */
    handleEvent(event, data) {
      switch (event) {
        case 'add':
          this.$refs.dialogRef1.$emit(event)
          break
        case 'edit':
          this.$refs.dialogRef1.$emit(event, data)
          break
        case 'rate':
          this.$refs.dialogRef2.$emit(event, this.tableData[0].switchFrequence)
          break
        case 'delete':
          this.handleDelete(data)
          break
        case 'status':
          this.handleStatus(data)
          break
        case 'top':
          this.handleTop(data)
          break
        default:
          break
      }
    },

    /* 置顶 */
    async handleTop(data) {
      const res = await Home.topBanner(data.bannerId)
      if (res.state === 1) {
        this.$message.success(res.msg)
        this.fetchData()
      } else {
        this.$message.error(res.msg)
      }
    },

    /** 启用/冻结 */
    async handleStatus(data) {
      const res = await Home.changeBannerStatus({
        bannerId: data.bannerId,
        status: data.status === 1 ? 2 : 1
      })
      if (res.state === 1) {
        this.$message.success(res.msg)
        this.fetchData()
      } else {
        this.$message.error(res.msg)
      }
    },

    /** 删除 */
    handleDelete(data) {
      this.$confirm('确认删除该banner图吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await Home.deleteBanner([data.bannerId])
          if (res.state === 1) {
            this.$message.success('删除成功')
            this.fetchData()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    },
    /** 批量删除 */
    handleDeleteMulti() {
      const delList = []
      let isdel = false
      this.selectionDatas.forEach((item, index) => {
        if (item.itemCheck) {
          delList.push(index)
        }
      })
      console.log(delList, 'del')
      for (const item of delList) {
        if (this.tableData[item].status === 1) {
          this.$message.error('使用中的入口不可删除')
          isdel = true
          break
        } else {
          this.tableDataId.push(this.tableData[item].bannerId)
        }
      }
      if (isdel) {
        this.handleDeleteBanner()
      }
    },
    async handleDeleteBanner() {
      const res = await Home.deleteBanner(this.tableDataId)
      this.tableDataId = []
      if (res.state === 1) {
        this.$message.success(res.msg)
        this.fetchData()
      } else {
        this.$message.error(res.msg)
      }
    },
    /** 调整上下顺序 */
    async handleOrder(event, data) {
      const res = await Home.changeBannerOrder({
        bannerId: data.bannerId,
        num: event === 'up' ? data.num - 1 : data.num + 1
      })
      if (res.state === 1) {
        this.fetchData()
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    /** 调整显示条数 */
    handleSizeChange(val) {
      this.limit = val
      this.currentPage = 1
      this.fetchData()
    },
    /** 调整显示页数 */
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    handleCheckAllChange(val) {
      this.selectionDatas.forEach(item => {
        item.itemCheck = val
      })
      this.isIndeterminate = false
    },
    toggleCheck() {
      const temp = this.selectionDatas.filter(item => item.itemCheck)
      this.checkAll = temp.length === this.tableData.length
      this.isIndeterminate = temp.length > 0 && temp.length < this.tableData.length
    },
    formatTime(date) {
      return parseTime(date)
    }
  }
}
</script>
