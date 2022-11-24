<template>
  <div>
    <ysh-table
      :table-config="tableConfig"
      :table-column="tableColumn"
      :table-data="tableData"
      @handleOrder="handleOrder"
      @handleSwitchChange="handleSwitchChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <template v-slot:operate="row">
        <span
          class="text-blue cur ml-10"
          @click="handleEvent('edit', row.data)"
        >编辑</span>
        <span
          v-if="row.data.status === '0'"
          class="text-blue cur ml-10"
          @click="handleEvent('status', row.data)"
        >展示</span>
        <span
          v-if="row.data.status === '1' && !row.data.changeStatus"
          class="text-yellow cur ml-10"
          @click="handleEvent('status', row.data)"
        >隐藏</span>
      </template>
    </ysh-table>

    <!-- 新增/编辑栏目弹窗 -->
    <add-dialog ref="dialogRef" @refresh="fetchData" />
  </div>
</template>

<script>
import TableMixins from '@/mixins/yshTable'
import { changeOrder } from '@/utils/utils'
import AddDialog from '../Dialog/AddDialog'
import _data from './data'
import Home from '@/api/home-config/Home'

export default {
  components: { AddDialog },
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
        maxHeight: window.innerHeight - 200 + 'px'
      },
      tableColumn: _data.tableColumn,
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /** 获tab列表 */
    async fetchData() {
      this.tableConfig.loading = true
      const res = await Home.getTabList({
        type: this.clientType
      })
      if (res.state !== 1) return
      res.data.forEach(item => {
        item.changeStatus = item.changeStatus === '1'
      })
      this.tableData = res.data

      this.tableConfig.loading = false
    },

    /** 编辑|展示|隐藏 */
    handleEvent(event, data) {
      switch (event) {
        case 'edit':
          this.$refs.dialogRef.$emit(event, data)
          break
        case 'status':
          this.handleStatus(data)
          break
      }
    },

    /** 展示|隐藏 */
    async handleStatus(data) {
      const res = await Home.showTab({
        id: data.id,
        status: data.status === '1' ? 0 : 1
      })
      if (res.state === 1) {
        this.$message.success(res.msg)
        this.fetchData()
      } else {
        this.$message.error(res.msg)
      }
    },

    /** 默认选中 */
    async handleSwitchChange(event, data) {
      const res = await Home.defaultTab({
        id: data.id,
        status: event ? 1 : 0
      })
      if (res.state === 1) {
        if (event) this.$message.success(res.msg)
        this.fetchData()
      } else {
        this.$message.error(res.msg)
      }
    },

    /** 调整上下顺序 */
    async handleOrder(event, data) {
      const idx = this.tableData.findIndex(i => i.id === data.id)
      let bemoveid, status, moveid
      if (event === 'up') {
        moveid = data.id
        bemoveid = this.tableData[idx - 1].id
        status = 0
      } else {
        moveid = data.id
        bemoveid = this.tableData[idx + 1].id
        status = 1
      }
      const res = await Home.sortTab({ moveid, bemoveid, status })
      if (res.state === 1) {
        changeOrder(this.tableData, data.id, event)
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>
