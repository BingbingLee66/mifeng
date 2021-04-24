<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="left" :model="query">
        <el-row>
          <el-col :span="5">
            <el-form-item :span="12" label="操作行为：">
              <el-select clearable v-model="query.actionName" placeholder="请选择操作行为">
                <el-option v-for="(item, index) in typeOptions" :label="item" :value="item" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="4">
            <el-form-item label="操作人：">
              <el-input v-model="query.operator" placeholder="请选择操作人"/>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="9">
            <el-form-item label="操作时间：">
              <el-date-picker
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="query.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label=" ">
              <el-button type="primary" :actionid="getId('', '查询')" v-if="has('', '查询')" @click="fetchData($event)">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="index" label="序号" width="60px">
      </el-table-column>
      <!-- <el-table-column label="ID">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column> -->
      <el-table-column label="操作行为">
        <template slot-scope="scope">
          {{scope.row.actionName}}
        </template>
      </el-table-column>
      <el-table-column label="操作事件">
        <template slot-scope="scope">
          <div v-if="scope.row.tabName">{{scope.row.menuName}}-{{scope.row.tabName}}</div>
          <div v-if="!scope.row.tabName">{{scope.row.menuName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作时间">
        <template slot-scope="scope">
          {{scope.row.createdTs}}
        </template>
      </el-table-column>
      <el-table-column label="操作人">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentpage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>

</template>

<script src="./operatedlog.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
