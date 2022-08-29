<template>
<div>
  <el-table
  ref="multipleTable"
    border
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <template v-for="col in columnConfig">
      <el-table-column v-if="col.type === 'select'" :key="col" type="selection" width="55"> </el-table-column>
      <el-table-column v-else :key="col" :formatter="col.formatter" :prop="col.prop" :label="col.label">
        <!-- <el-table-column v-if="col.isOperation"> -->
      </el-table-column>
    </template>
  </el-table>
</div>
  
</template>

<script>
export default {
  name: 'TableComponent',
  props: {
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    // 表格col配置
    columnConfig: {
      type: Array,
      default() {
        return []
      }
    }
  },

  date() {
    return {
   
    }
  },
  created(){
    console.log('tableData', this.tableData)
  },
  methods: {
    handleSelectionChange(){},
  }
}
</script>

<style></style>
