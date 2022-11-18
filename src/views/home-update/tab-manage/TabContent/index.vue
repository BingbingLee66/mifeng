<template>
  <div>
    <!-- 操作栏 -->
    <el-row>
      <el-button icon="el-icon-folder-add" type="primary" size="medium" @click="handleEvent('add')">新增栏目</el-button>
    </el-row>
    <!-- 表格数据 -->
    <ysh-table
      :table-config="tableConfig"
      :table-column="tableColumn"
      :table-data="tableData"
      @handleOrder="handleOrder"
      @handleSwitchChange="handleSwitchChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <template v-slot:operate="row">
        <span class="text-blue cur ml-10" @click="handleEvent('edit', row.data)">编辑</span>
        <span class="text-blue cur ml-10" @click="handleEvent('show', row.data)">展示</span>
        <span class="text-yellow cur ml-10" @click="handleEvent('hide', row.data)">隐藏</span>
        <span class="text-red cur ml-10" @click="handleEvent('delete', row.data)">删除</span>
      </template>
    </ysh-table>

    <!-- 新增/编辑栏目弹窗 -->
    <add-dialog ref="dialogRef" @Refresh="fetchData" />
  </div>
</template>

<script>
import TableMixins from '@/mixins/yshTable'
import { changeOrder } from '@/utils/utils'
import Kingkong from '@/api/home-config/KingKong'
import AddDialog from '../Dialog/AddDialog'
import _data from './data'

export default {
  components: { AddDialog },
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
  computed: {
    deleteDisable() {
      return this.selectionData.length === 0
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
      const res = await Kingkong.getKingkongList(params)
      if (res.state !== 1) return
      res.data.list.forEach((item, index) => {
        item.serialNumber = index + 1
        item.switch = index === 0
      })
      this.tableData = res.data.list
      this.pageData.total = res.data.totalRows
      this.tableConfig.loading = false
    },

    /** 金刚区新增|编辑|删除|启用|冻结 */
    handleEvent(event, data) {
      switch (event) {
        case 'add':
          // 新增
          this.handleDialog('add')
          break
        case 'edit':
          // 编辑
          this.handleDialog('edit', data)
          break
        case 'rate':
          // 切换频率
          this.handleDialog('rate', data)
          break
        case 'head':
          // 设为首图
          this.handleDialog('rate', data)
          break
        case 'delete':
          // 删除
          this.handleDelete(data)
          break
        case 'frozen':
          // 冻结
          this.handleUse('frozen', data)
          break
        case 'use':
          // 启用
          this.handleUse('use', data)
          break
        default:
          break
      }
    },

    /** 新增/编辑金刚区 */
    handleDialog(event, data) {
      this.$refs.dialogRef.$emit(event, data)
    },

    /** 启用/冻结金刚区 */
    handleUse(event, data) {
      console.log(event, data)
    },

    /** 移除金刚区 */
    handleDelete() {
      this.$confirm('确认移除该金刚区吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const idsArr = this.selectionData.map(item => {
            return item.id
          })
          const res = await Kingkong.deleteKingkong(idsArr)
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

    /** 默认选中 */
    handleSwitchChange(e, data) {
      console.log('switch data', e, data)
    },

    /** 调整上下顺序 */
    handleOrder(event, data) {
      changeOrder(this.tableData, data.id, event)
    }
  }
}
</script>

<style></style>
