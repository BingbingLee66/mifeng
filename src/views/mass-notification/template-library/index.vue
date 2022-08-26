<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="短信通知" name="1" />
      <el-tab-pane label="订阅消息" name="2" />
      <el-tab-pane label="APP通知" name="3" />
    </el-tabs>
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="left" :model="query" :inline="true">
        <el-form-item label="标题：">
          <el-input v-model="query.title" clearable placeholder="请输入关键词" />
        </el-form-item>
        <el-button type="primary" @click="fetchData(true)">查询 </el-button>
        <el-row>
          <el-button type="primary" @click="onSynchronization"
            >{{ activeName == 1 ? '同步短信模板' : activeName == 2 ? '同步订阅模板' : '申请模板' }}
          </el-button>
        </el-row>
      </el-form>
      <el-table
        :key="random"
        v-loading="listLoading"
        style="margin-top:20px;"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <!-- 短信通知 -->
        <template v-if="activeName == 1">
          <el-table-column prop="title" label="模板名称" align="center" />
          <el-table-column prop="title" label="模板CODE" align="center" />
          <el-table-column label="模板类型" align="center">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="创建信息" align="center">
            <template slot-scope="scope">
              {{ scope.row.uname }}
            </template>
          </el-table-column>
          <el-table-column label="审核状态" align="center">
            <template slot-scope="scope">
              {{ scope.row.uname }}
            </template>
          </el-table-column>
        </template>

        <!-- 订阅消息 -->
        <template v-if="activeName == 2">
          <el-table-column prop="ID" label="模板ID" align="center" />
          <el-table-column prop="title" label="标题" align="center" />
          <el-table-column label="关键词" align="center">
            <template slot-scope="scope">
              {{ scope.row.uname }}
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center">
            <template slot-scope="scope">
              {{ scope.row.uname }}
            </template>
          </el-table-column>
        </template>

        <!-- APP通知 -->
        <template v-if="activeName == 3">
          <el-table-column prop="ID" label="ID" align="center" />
          <el-table-column prop="title" label="标题" align="center" />
          <el-table-column label="内容" align="center">
            <template slot-scope="scope">
              {{ scope.row.uname }}
            </template>
          </el-table-column>
        </template>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="particulars(scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top:20px"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="pageSizes"
        :page-size="limit"
        :total="total"
        :current-page.sync="currentpage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <!-- 详情 -->
      <Details ref="details" :active-name="activeName" />
    </div>
  </div>
</template>

<script src="./library.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
</style>
