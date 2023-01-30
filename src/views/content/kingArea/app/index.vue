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
      <el-button icon="el-icon-delete" type="primary" size="medium" @click="handleDelete">删除 </el-button>
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
          <div class="label">{{ scope.row.id }}</div>
        </template>
      </el-table-column>
      <el-table-column label="入口名称" width="150px">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="入口icon" width="130px">
        <template slot-scope="scope">
          <img
            class="goods-preview"
            :src="scope.row.image"
            style="width: 67px; height: 67px"
            @click="openPreviewModal(scope.row.image)"
          >
        </template>
      </el-table-column>
      <el-table-column label="关联内容" width="100px">
        <template slot-scope="scope">
          {{ scope.row.jsonContext }}
        </template>
      </el-table-column>
      <el-table-column label="顺序" width="100px">
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
      <el-table-column label="状态" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">无效</span>
          <span v-if="scope.row.status === 1">使用中</span>
          <span v-if="scope.row.status === 2">冻结</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="160px">
        <template slot-scope="scope">
          {{ formatTime(scope.row.updatedTs) }}
        </template>
      </el-table-column>
      <el-table-column label="操作人" width="160px">
        <template slot-scope="scope">
          {{ scope.row.creatorName }}
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
            class="text-yellow cur ml-10"
            @click="handleEvent('status', scope.row)"
          >冻结</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑金刚区弹窗 -->
    <Dialog ref="dialogRef" @refresh="fetchData" />
  </div>
</template>

<script>
import TableMixins from '@/mixins/yshTable'
import Dialog from './Dialog'
// import _data from './data'
import Kingkong from '@/api/home-config/KingKong'
import { parseTime } from '@/utils/index'
import { changeOrder } from '@/utils/utils'

export default {
  components: {
    Dialog
  },
  // 查询，重置，分页，多选等操作（混入方式实现）
  mixins: [TableMixins],
  data() {
    return {
      /** 表格数据 */
      // tableConfig: {
      //   loading: false,
      //   selection: false,
      //   maxHeight: window.innerHeight - 260 + 'px'
      // },
      // tableColumn: _data.tableColumn,
      tableData: [],
      selectionDatas: [],
      tableDataId: [],
      isIndeterminate: false,
      checkAll: false,
      checkedNumber: []
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

      if (res.state !== 1) return
      this.tableData = res.data.list
      this.tableData.forEach(() => {
        this.selectionDatas.push({ itemCheck: false })
      })
      console.log(this.tableData, 'table')
      console.log(this.selectionDatas, 'check')
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
      const res = await Kingkong.updateKingkongStatus(data.id, status)
      if (res.state === 1) {
        this.$message.success(res.msg)
        this.fetchData(1)
      } else {
        this.$message.error(res.msg)
      }
    },
    /** 调整上下顺序 */
    async handleOrder(event, data) {
      console.log(' order data ', data)
      changeOrder(this.tableData, data.id, event)
    },
    /** 删除金刚区 */
    handleDelete() {
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
          this.tableDataId.push(this.tableData[item].id)
        }
      }
      if (!isdel) {
        this.handleDeleteKing()
      }
    },
    async handleDeleteKing() {
      const res = await Kingkong.deleteKingkong(this.tableDataId)
      if (res.state === 1) {
        this.$message.success(res.msg)
        this.fetchData(1)
      } else {
        this.$message.error(res.msg)
      }
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
