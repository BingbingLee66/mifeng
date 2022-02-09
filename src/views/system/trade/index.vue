<template>
  <div class="app-container">
    <el-col :span="11">
      <el-table ref="myTable" :data="firstlist" v-loading="flistLoading" element-loading-text="Loading" border fit highlight-current-row
      @row-click="rowClick">
        <el-table-column label="一级行业分类">
          <template slot-scope="scope">
            {{scope.row.typeName}}
            <i class="el-icon-close trade-btn" :actionid="getId('', '删除')" v-if="has('', '删除')" @click="delTrade($event, scope.row)"/>
            <i class="el-icon-edit trade-btn" :actionid="getId('', '编辑')" v-if="has('', '编辑')" @click="updateTrade($event, scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <el-row />
      <el-button type="primary" :actionid="getId('', '添加一级行业分类')" v-if="has('', '添加一级行业分类')" @click="addFirstTrade">添加一级行业分类</el-button>
    </el-col>
    <el-col :offset="1" :span="11">
      <el-table :data="secondlist" v-loading="slistLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column :label="sTableTitle">
          <template slot-scope="scope">
            {{scope.row.typeName}}
            <i class="el-icon-close trade-btn" :actionid="getId('', '删除')" v-if="has('', '删除')" @click="delTrade($event, scope.row)"/>
            <i class="el-icon-edit trade-btn" :actionid="getId('', '编辑')" v-if="has('', '编辑')" @click="updateTrade($event, scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <el-row />
      <el-button type="primary" :actionid="getId('', '添加二级行业分类')" v-if="has('', '添加二级行业分类') && parentId == 0" @click="addSecondTrade($event)" disabled>添加二级行业分类</el-button>
      <el-button type="primary" :actionid="getId('', '添加二级行业分类')" v-if="has('', '添加二级行业分类') && parentId > 0" @click="addSecondTrade($event)">添加二级行业分类</el-button>
    </el-col>
  </div>

</template>

<script src="./trade.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.trade-btn {
  float: right;
  margin-top: 2px;
  font-size: 18px;
}
.trade-btn:hover {
  color: red;
  cursor: pointer;
}
</style>
