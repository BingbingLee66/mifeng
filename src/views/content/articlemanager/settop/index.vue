<template>
  <div class="app-container">
    <el-table id="out-table" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> -->
      <!-- <el-table-column label="ID">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column> -->
      <el-table-column label="文章">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column label="来源" width="180px">
        <template slot-scope="scope">
          <div v-if="scope.row.publishType == 1">{{scope.row.chamberName}}</div>
          <div v-if="scope.row.publishType == 2">{{scope.row.companyName}}</div>
          <div v-if="scope.row.publishType == 3 || scope.row.publishType == 4">{{scope.row.sourceName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="180px">
        <template slot-scope="scope">
          {{scope.row.publishTs}}
        </template>
      </el-table-column>
      <el-table-column label="置顶时间" width="180px">
        <template slot-scope="scope">
          {{scope.row.topTs}}
        </template>
      </el-table-column>
      <el-table-column label="排序" width="180px">
        <template slot-scope="scope">
          {{scope.row.topLevel}}
        </template>
      </el-table-column>
      <el-table-column label="操作人" width="180px">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="cancelTop(scope.row)" :actionid="getId('', '取消置顶')" v-if="has('', '取消置顶')">取消置顶</el-button> -->
          <el-button type="text" @click="cancelTop(scope.row)">取消置顶</el-button>
          <!-- <el-button type="text" @click="top(scope.row)" :actionid="getId('', '编辑')" v-if="has('', '编辑')">编辑</el-button> -->
          <el-button type="text" @click="top(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script src="./settop.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
