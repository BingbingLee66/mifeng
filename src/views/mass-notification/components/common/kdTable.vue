<template>
  <div>
    <!-- :row-key="(row) => { return row.id }" -->
    <el-table
      ref="multipleTable"
      border
      :data="table.tableData"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="id"
      :reserve-selection="true"
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
      console.log('val',val)
      this.$emit('tableSelect', val)
    },
    // 设置某一行选中
    toggleSelection(rows) {
      // console.log('rows',rows)
      if (!rows.length > 0) return;
      this.$nextTick(()=>{
 rows.forEach(row => {
        // console.log('row',row)
        // console.log('this.table.tableData',this.table.tableData);
        // console.log('this.table.tableData.find(item=>item.id===row.id)',this.table.tableData.find(item=>item.id===row.id))
       this.table.tableData.find(item=>item.id===row.id) && this.$refs['multipleTable'].toggleRowSelection(this.table.tableData.find(item=>item.id===row.id),true);
      })
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
