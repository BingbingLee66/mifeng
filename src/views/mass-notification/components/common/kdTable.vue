<template>
  <div>
    <el-table
      ref="multipleTable"
      border
      :data="table.tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <template v-for="col in table.columnConfig">
        <el-table-column v-if="col.type === 'select'" :key="col.id" type="selection" width="55"> </el-table-column>
        <el-table-column v-if="col.type === 'img'" :label="col.label" :key="col.id"  >
          <template slot-scope="scope">
              <div>
              <img :src="scope.row.headImage" class="headImage"/>
              </div>
            </template>
        </el-table-column>
        <el-table-column v-if="col.type==='general'" :width="col.width" :key="col.id" :formatter="col.formatter" :prop="col.prop" :label="col.label">
          <!-- <el-table-column v-if="col.isOperation"> -->
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'TableComponent',
  inject: ['table'],
  props: {
    // tableData: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // },
    // // 表格col配置
    // columnConfig: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
  },

  date() {
    return {}
  },
  created() {
    // console.log('tableData', this.tableData)
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit('tableSelect', val)
    },
    // 设置某一行选中
    toggleSelection(rows) {
      if (!rows.length > 0) return
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row)
      })
    }
  }
}
</script>

<style>
.headImage{
  width: 88px;
  height: 60px;
}
</style>
