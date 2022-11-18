<template>
  <div class="container">
    <!-- 操作栏 -->
    <el-row>
      <el-button icon="el-icon-folder-add" type="primary" size="medium" @click="handleEvent('add')">新增领导</el-button>
      <el-button type="primary" size="medium" @click="handleEvent('use')">功能开关</el-button>
      <el-tooltip class="item" effect="dark" content="可设置小程序的商会主页是否使用此功能" placement="top">
        <i class="el-icon-question" />
      </el-tooltip>
    </el-row>
    <!-- 表格数据 -->
    <ysh-table
      :table-config="tableConfig"
      :table-column="tableColumn"
      :table-data="tableData"
      @handleOrder="handleOrder"
    >
      <template v-slot:operate="row">
        <span class="text-blue cur ml-10" @click="handleEvent('edit', row.data)">编辑</span>
        <span class="text-blue cur ml-10" @click="handleEvent('show', row.data)">展示</span>
        <span class="text-yellow cur ml-10" @click="handleEvent('hide', row.data)">隐藏</span>
        <span class="text-red cur ml-10" @click="handleEvent('delete', row.data)">删除</span>
      </template>
    </ysh-table>

    <!-- 新增/编辑banner弹窗 -->
    <add-dialog ref="dialogRef1" @Refresh="fetchData" />
    <!-- 切换频率弹窗 -->
    <use-dialog ref="dialogRef2" @Refresh="fetchData" />
  </div>
</template>

<script>
import TableMixins from '@/mixins/yshTable'
import { changeOrder } from '@/utils/utils'
import Kingkong from '@/api/home-config/KingKong'
import AddDialog from './Dialog/AddDialog'
import UseDialog from './Dialog/UseDialog'
import _data from './data'

export default {
  components: { AddDialog, UseDialog },
  // 查询，重置，分页，多选等操作（混入方式实现）
  mixins: [TableMixins],
  data() {
    return {
      tableConfig: {
        loading: false,
        selection: false,
        maxHeight: window.innerHeight - 190 + 'px'
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
    /** 获取领导风采列表 */
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
      this.tableData = res.data.list
      this.pageData.total = res.data.totalRows
      this.tableConfig.loading = false
    },

    /** 新增|编辑|删除|展示|隐藏领导风采 */
    handleEvent(event, data) {
      switch (event) {
        case 'add':
          this.$refs.dialogRef1.$emit(event)
          break
        case 'edit':
          this.$refs.dialogRef1.$emit(event, data)
          break
        case 'use':
          this.$refs.dialogRef2.$emit(event, data)
          break
        case 'delete':
          this.handleDelete(data)
          break
        case 'show':
          this.handleShow(event, data)
          break
        case 'hide':
          this.handleShow(event, data)
          break
        default:
          break
      }
    },

    /** 调整上下顺序 */
    handleOrder(event, data) {
      changeOrder(this.tableData, data.id, event)
    },

    /* 展示/隐藏 */
    handleShow(event, data) {
      console.log('show data', event, data)
    },

    /** 删除 */
    handleDelete() {
      this.$confirm('确认移除该banner图吗?', '提示', {
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
    }
  }
}
</script>
