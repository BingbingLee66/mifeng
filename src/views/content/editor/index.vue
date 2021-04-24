<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="right" :model="query">
        <el-row>
          <el-col :span="5">
            <el-form-item label="文章标题：">
              <el-input v-model="query.title" placeholder="请输入文章标题"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :span="12" label="栏目：">
              <el-select v-model="query.contentColumnId">
                <el-option v-for="cc in contentColumnOptions" :label="cc.label" :value="cc.value" :key="cc.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item :span="12" label="状态：">
              <el-select v-model="query.status">
                <el-option label="全部" :value="-1"></el-option>
                <el-option label="已发布" :value="1"></el-option>
                <el-option label="已冻结" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="添加时间：" label-width="120px">
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
          <el-col :span="1">
            <el-form-item label=" ">
              <el-button type="primary" @click="fetchData($event)" :actionid="getId('', '查询')" v-if="has('', '查询')">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row>
      <el-button type="primary" size="small" @click="add" :actionid="getId('', '添加文章')" v-if="has('', '添加文章')">添加文章</el-button>
      <el-button type="primary" size="small" @click="articleSourceManager($event)" :actionid="getId('', '文章来源管理')" v-if="has('', '文章来源管理')">文章来源管理</el-button>
    </el-row>
    <el-table id="out-table" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> -->
<!--       <el-table-column label="文章ID" width="80px">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column> -->
      <el-table-column label="文章">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column label="对应栏目" width="200px">
        <template slot-scope="scope">
          {{scope.row.contentColumn}}
        </template>
      </el-table-column>
      <el-table-column label="添加人" width="120px">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="160px">
        <template slot-scope="scope">
          {{scope.row.createdTs}}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 3">已冻结</div>
          <div v-if="scope.row.status == 1">已发布</div>
          <div v-if="scope.row.status == 4">未发布(定时发布)</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)" :actionid="getId('', '编辑')" v-if="has('', '编辑')">编辑</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row)" :actionid="getId('', '冻结')" v-if="has('', '冻结') && scope.row.status == 1 || scope.row.status == 4">冻结</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row)" :actionid="getId('', '解冻')" v-if="has('', '解冻') && scope.row.status == 3">解冻</el-button>
          <el-button type="text" @click="detail($event, scope.row)">详情</el-button>
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

<script src="./editor.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
