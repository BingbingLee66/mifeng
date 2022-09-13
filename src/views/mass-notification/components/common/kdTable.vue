<template>
  <div>
    <!-- tableData:{{ tableData }} -->
    <!-- <span>{{ $attrs }}--{{ $attrs.columnConfig }}</span> -->
    <!-- <span>{{ $attrs }}</span> -->
    <!-- <span>{{tableMsg}}</span>  -->
    <!-- :row-key="(row) => { return row.id }" -->
    <el-table
      ref="multipleTable"
      border
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :row-key="rowKeys"
      :reserve-selection="true"
      @selection-change="handleSelectionChange"
    >

      <template v-for="col in columnConfig">
        <!-- <el-table-column v-if="col.type === 'select'" :key="col.id" type="selection" width="55" />
        <el-table-column v-if="col.type === 'img'" :key="col.id" :label="col.label">
          <template slot-scope="scope">
            <div>
              <img :src="scope.row.headImage" class="headImage">
            </div>
          </template>
        </el-table-column> -->
        <el-table-column
          v-if="col.type === undefined || col.type === 'general'"
          :key="col.id"
          :width="col.width"
          :formatter="col.formatter"
          :prop="col.prop"
          :label="col.label"
        >
          <template slot-scope="scope">
            <span v-if="col.render">
              <RenderCell :scope="scope" :render="col.render" />
            </span>
            <!-- 如果有formatter就优先使用formatter，因为solt的优先级比它高 -->
            <span v-else-if="col.prop">{{ col.formatter? col.formatter(scope.row) : scope.row[col.prop] }}</span>
            <!-- <span>{{ scope.row }}</span> -->
          </template>
          <!-- <el-table-column v-if="col.isOperation"> -->
        </el-table-column>
        <el-table-column v-else :key="col.id ? col.id :col.prop" v-bind="col" />
      </template>
    </el-table>
  </div>
</template>

<script>
import RenderCell from './renderCell.vue'
export default {
  name: 'TableComponent',
  // inject: ['tableMsg'],
  components: { RenderCell },
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
    return {}
  },
  created() {
    // console.log('tableData', this.tableData)
  },
  methods: {
    rowKeys(row) {
      return row.id
    },
    handleSelectionChange(val) {
      console.log('val', val)
      this.$emit('tableSelect', val)
    },
    // 设置某一行选中
    toggleSelection(rows) {
      console.log('rows', rows)
      console.log('.$refs[multipleTable].selection', this.$refs['multipleTable'].selection)
      if (!rows.length > 0) return
      // this.$nextTick(() => {
      //   rows.forEach(row => {
      //     this.tableData.find(item => item.id === row.id) &&
      //       this.$refs['multipleTable'].toggleRowSelection(
      //         this.tableData.find(item => item.id === row.id),
      //         true
      //       )
      //   })
      // })
    }
    // toggleSelection(rows) {
    //   console.log('rows', rows)
    //   console.log('.$refs[multipleTable].selection', this.$refs['multipleTable'].selection)
    //   if (!rows.length > 0) return
    //   this.$nextTick(() => {
    //     rows.forEach(row => {
    //       this.tableMsg.tableData.find(item => item.id === row.id) &&
    //         this.$refs['multipleTable'].toggleRowSelection(
    //           this.tableMsg.tableData.find(item => item.id === row.id),
    //           true
    //         )
    //     })
    //   })
    // }
  }
}
</script>

<style>
.headImage {
  width: 88px;
  height: 60px;
}
</style>
