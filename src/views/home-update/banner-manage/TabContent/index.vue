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
        v-if="this.tableData.length > 0"
        type="primary"
        size="medium"
        @click="handleEvent('rate')"
      >切换频率</el-button>
    </el-row>

    <!-- 表格数据 -->
    <ysh-table
      :table-config="tableConfig"
      :table-column="tableColumn"
      :table-data="tableData"
      @handleOrder="handleOrder"
      @handleSelectionChange="handleSelectionChange"
    >
      <template v-slot:operate="row">
        <span
          class="text-blue cur ml-10"
          @click="handleEvent('edit', row.data)"
        >编辑</span>
        <span
          v-if="row.data.status === 2"
          class="text-blue cur ml-10"
          @click="handleEvent('status', row.data)"
        >启用</span>
        <span
          v-if="row.data.status === 1"
          class="text-blue cur ml-10"
          @click="handleEvent('status', row.data)"
        >冻结</span>
        <span
          v-if="row.data.num !== 1 && row.data.status !== 2"
          class="text-blue cur ml-10"
          @click="handleEvent('top', row.data)"
        >置顶</span>
        <span
          v-if="row.data.status === 2"
          class="text-red cur ml-10"
          @click="handleEvent('delete', row.data)"
        >删除</span>
      </template>
    </ysh-table>

    <!-- 新增/编辑banner弹窗 -->
    <add-dialog ref="dialogRef1" :client-type="clientType" @refresh="fetchData" />
    <!-- 切换频率弹窗 -->
    <rate-dialog ref="dialogRef2" @refresh="fetchData" />
  </div>
</template>

<script>
import TableMixins from '@/mixins/yshTable'
import { changeOrder } from '@/utils/utils'
import { tableColumn } from './data'
import AddDialog from '../Dialog/AddDialog'
import RateDialog from '../Dialog/RateDialog'
import Home from '@/api/home-config/Home'

export default {
  components: { AddDialog, RateDialog },
  // 查询，重置，分页，多选等操作（混入方式实现）
  mixins: [TableMixins],
  props: {
    clientType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableConfig: {
        loading: false,
        selection: false,
        maxHeight: window.innerHeight - 260 + 'px'
      },
      tableColumn,
      tableData: []
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
        clientType: this.clientType,
        pageNum: 1,
        pageSize: 100
      })
      if (res.state !== 1) return
      const resData = res.data
      this.tableData = resData.list
      this.tableData.forEach(i => {
        i.id = i.bannerId
      })
      this.pageData.total = resData.totalRows
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
          const res = await Home.deleteBanner([ data.bannerId ])
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

    /** 调整上下顺序 */
    async handleOrder(event, data) {
      const res = await Home.changeBannerOrder({
        bannerId: data.bannerId,
        num: event === 'up' ? data.num - 1 : data.num + 1
      })
      if (res.state === 1) {
        changeOrder(this.tableData, data.id, event)
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>
