<template>
  <div class="app-container">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="changeAll">全选</el-checkbox>
    <el-checkbox-group v-model="checkList">
      <el-table v-loading="listLoading" element-loading-text="Loading" border fit
        :data="list"
        :span-method="arraySpanMethod">
          <el-table-column label="一级">
            <template slot-scope="scope">
              <el-checkbox v-if="scope.row.level1 != '——'" :key="scope.row.pMenuId" :label="scope.row.pMenuId + '@menu1'" @change="changeChecked($event, scope.row.pMenuId + '@menu1', scope.row)">{{scope.row.level1}}</el-checkbox>
              <div v-if="scope.row.level1 == '——'">——</div>
            </template>
          </el-table-column>
          <el-table-column label="二级">
            <template slot-scope="scope">
              <el-checkbox v-if="scope.row.level2 != '——'" :key="scope.row.cMenuId" :label="scope.row.cMenuId + '@menu2'" @change="changeChecked($event, scope.row.cMenuId + '@menu2', scope.row)">{{scope.row.level2}}</el-checkbox>
              <div v-if="scope.row.level2 == '——'">——</div>
            </template>
          </el-table-column>
          <el-table-column label="三级">
            <template slot-scope="scope">
              <el-checkbox v-if="scope.row.level3 != '——'" :key="scope.row.tabId" :label="scope.row.tabId + '@tab'" @change="changeChecked($event, scope.row.tabId + '@tab', scope.row)">{{scope.row.level3}}</el-checkbox>
              <div v-if="scope.row.level3 == '——'">——</div>
            </template>
          </el-table-column>
          <el-table-column label="四级">
            <template slot-scope="scope">
              <el-checkbox v-if="scope.row.level4 != '——'" :key="scope.row.id" :label="scope.row.id + '@auth'" @change="changeChecked($event, scope.row.id + '@auth', scope.row)">{{scope.row.level4}}</el-checkbox>
              <div v-if="scope.row.level4 == '——'">——</div>
            </template>
          </el-table-column>
      </el-table>
    </el-checkbox-group>
    <br/>
    <el-button type="primary" size="small" @click="save">确定</el-button>
  </div>

</template>
<script src="./setup.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
