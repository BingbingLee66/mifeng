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
          v-if="row.data.use === 0"
          class="text-blue cur ml-10"
          @click="handleEvent('use', row.data)"
        >启用</span>
        <span
          v-if="row.data.use === 1"
          class="text-yellow cur ml-10"
          @click="handleEvent('frozen', row.data)"
        >冻结</span>
        <span
          v-if="row.data.status !== 1"
          class="text-red cur ml-10"
          @click="handleEvent('delete', row.data)"
        >删除</span>
      </template>
    </ysh-table>

    <!-- 新增/编辑功能入口弹窗 -->
    <Dialog ref="dialogRef" @refresh="fetchData" />
  </div>
</template>

<script>
import TableMixins from '@/mixins/yshTable'
import { changeOrder } from '@/utils/utils'
import Kingkong from '@/api/home-config/KingKong'
import _data from './data'
import Dialog from './Dialog'

export default {
  components: { Dialog },
  // 查询，重置，分页，多选等操作（混入方式实现）
  mixins: [TableMixins],
  data() {
    return {
      tableConfig: {
        loading: false,
        selection: false,
        maxHeight: window.innerHeight - 260 + 'px'
      },
      tableColumn: _data.tableColumn,
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /** 获取小程序金刚区列表数据 */
    async fetchData() {
      this.tableConfig.loading = true
      const params = {
        clientType: 0,
        name: '',
        creatorName: '',
        createdTsBegin: '',
        createdTsEnd: '',
        pageNum: 1,
        pageSize: 100
      }
      const res = await Kingkong.getKingkongListV1(params)
      if (res.state !== 1) return
      res.data.list.forEach(i => {
        i.status = 1
        i.use = 1
      })
      this.tableData = res.data.list
      this.pageData.total = res.data.totalRows
      this.tableConfig.loading = false
    },

    /** 金刚区新增|编辑|删除|启用|冻结 */
    handleEvent(event, data) {
      switch (event) {
        case 'add':
          this.$refs.dialogRef.$emit(event, data)
          break
        case 'edit':
          this.$refs.dialogRef.$emit(event, data)
          break
        case 'delete':
          this.handleDelete(data)
          break
        case 'frozen':
          this.handleUse('frozen', data)
          break
        case 'use':
          this.handleUse('use', data)
          break
        default:
          break
      }
    },

    /** 启用/冻结金刚区 */
    async handleUse(event, data) {
      console.log(event, data)
      const res = await Kingkong.useKingkong({
        id: data.id,
        use: event === 'use' ? 1 : 0
      })
      if (res.state === 1) {
        this.$message.success(res.msg)
        changeOrder(this.tableData, data.id, event)
      } else {
        this.$message.error(res.msg)
      }
    },

    /** 移除金刚区 */
    handleDelete(data) {
      this.$confirm('确认移除该金刚区吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await Kingkong.deleteKingkongV1([data.id])
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
      const idx = this.tableData.findIndex(i => i.id === data.id)
      const upId = this.tableData[idx - 1].id
      const downId = this.tableData[idx + 1].id
      const params = {
        moveId: data.id,
        bemoveid: event === 'up' ? upId : downId,
        status: event === 'up' ? 0 : 1
      }
      const res = await Kingkong.changeKingkongOrder(params)
      if (res.state === 1) {
        this.$message.success(res.msg)
        changeOrder(this.tableData, data.id, event)
      } else {
        this.$message.error(res.msg)
      }
    },
  }
}
</script>
