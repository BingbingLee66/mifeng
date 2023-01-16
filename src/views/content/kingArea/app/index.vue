<template>
  <div>
    <!-- 操作栏 -->
    <el-row>
      <el-button
        icon="el-icon-folder-add"
        type="primary"
        size="medium"
        @click="handleEvent('add')"
      >新增功能入口</el-button>
      <el-button icon="el-icon-delete" type="primary" size="medium" @click="deleteKingkong">删除 </el-button>
    </el-row>

    <!-- 表格数据 -->
    <ysh-table
      :table-config="tableConfig"
      :table-column="tableColumn"
      :table-data="tableData"
      @handleOrder="handleOrder"
      @handleSelectionChange="handleSelectionChange"
    >
      <template v-slot:number="" />
      <template v-slot:operate="row">
        <span class="text-blue cur ml-10" @click="handleEvent('edit', row.data)">编辑</span>
        <span
          v-if="row.data.status === 2"
          class="text-blue cur ml-10"
          @click="handleEvent('status', row.data)"
        >启用</span>
        <span
          v-if="row.data.status === 1"
          class="text-yellow cur ml-10"
          @click="handleEvent('status', row.data)"
        >冻结</span>
      </template>
    </ysh-table>

    <!-- 新增/编辑金刚区弹窗 -->
    <Dialog ref="dialogRef" @refresh="fetchData" />
  </div>
</template>

<script>
import TableMixins from '@/mixins/yshTable'
import Dialog from './Dialog'
import _data from './data'
import Kingkong from '@/api/home-config/KingKong'

export default {
  components: {
    Dialog
  },
  // 查询，重置，分页，多选等操作（混入方式实现）
  mixins: [TableMixins],
  data() {
    return {
      /** 表格数据 */
      tableConfig: {
        loading: false,
        selection: false,
        maxHeight: window.innerHeight - 260 + 'px'
      },
      tableColumn: _data.tableColumn,
      tableData: [],
      selectionDatas: []
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    /** 获取app金刚区列表数据 */
    async fetchData() {
      this.tableConfig.loading = true
      const params = {
        clientType: 1,
        pageNum: 1,
        pageSize: 100
      }
      const res = await Kingkong.getKingkongList(params)
      console.log(res, 'res')
      if (res.state !== 1) return
      this.tableData = res.data.list
      this.pageData.total = res.data.totalRows
      this.tableConfig.loading = false
    },

    /** 金刚区新增|编辑|更新*/
    handleEvent(event, data) {
      switch (event) {
        case 'add':
          this.$refs.dialogRef.$emit(event, data)
          break
        case 'edit':
          this.$refs.dialogRef.$emit(event, data)
          break
        case 'status':
          this.handleStatus(data)
          break
        default:
          break
      }
    },

    /** 启用/冻结金刚区 */
    async handleStatus(data) {
      const status = data.status === 1 ? 2 : 1
      const res = await Kingkong.changeKingkongStatus(data.id, status)
      if (res.state === 1) {
        this.$message.success(res.msg)
        this.fetchData(1)
      } else {
        this.$message.error(res.msg)
      }
    },

    /** 移除金刚区 */
    handleDelete(data) {
      if (!data) return
      this.$confirm('确认移除该金刚区吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await Kingkong.deleteKingkong(data)
          if (res.state === 1) {
            this.$message.success(res.msg)
            this.fetchData(1)
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$message.info('已取消移除')
        })
    },
    /** 调整上下顺序 */
    async handleOrder(event, data) {
      console.log(' order data ', data)
      const num = event === 'up' ? data.num - 1 : data.num + 1
      const res = await Kingkong.updateKingkongWeight(data.id, num)
      if (res.state === 1) {
        this.fetchData()
        this.$message.success(res.msg)
        // changeOrder(this.tableData, data.id, event)
      } else {
        this.$message.error(res.msg)
      }
    },
    deleteKingkong() {},
    handleSelectionChange(value) {
      console.log(value)
      const datas = value
      this.selectionDatas = []
      for (const data of datas) {
        this.selectionDatas.push(data.id)
      }
    }
  }
}
</script>
