<template>
  <div class="app-container">
    <div class="department_container">
      <div class="tit">部门管理 <span class="sub_tit"> 在这里创建、编辑和删除部门 </span></div>
      <div style="margin-top:30px">
        <el-table
          :data="tableData"
          style="width: 80%;margin-bottom: 20px;"
          row-key="id"
          border
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column
            prop="name"
            label="部门名称"
            width="480">
            <!-- <template slot-scope="scope">
              {{ scope.row.name }}
            </template>-->
          </el-table-column>
          <el-table-column
            prop="num"
            label="成员数"
            width="280">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.$index === 0">编辑商会名称</el-button>
              <el-button type="text" v-if="scope.$index === 0">添加部门</el-button>
              <el-button type="text" v-if="scope.$index !== 0">编辑部门</el-button>
              <el-button type="text" v-if="scope.$index !== 0">添加子部门</el-button>
              <el-button type="text" v-if="scope.$index !== 0">删除部门</el-button>
              <!-- <el-button type="text" @click="openTransfer(scope.row)" :actionid="getId('', '转让')" v-if="has('', '转让')">转让</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script src="./department-manage.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
