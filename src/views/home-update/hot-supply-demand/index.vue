<template>
  <div class="app-container">
    <!-- 搜索表单start -->
    <el-form
      ref="formSupplyDemand"
      label-position="right"
      :inline="true"
      :model="query"
    >
      <el-form-item label="供需标题">
        <el-input v-model="query.title" placeholder="关键词" />
      </el-form-item>
      <el-form-item label="来源商会">
        <el-select
          v-model="query.ckey"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="chamber in chamberOptions"
            :key="chamber.ckey"
            :label="chamber.name"
            :value="chamber.ckey"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="供需状态">
        <el-select v-model="query.status" placeholder="请选择状态">
          <el-option
            v-for="chamber in statusList"
            :key="chamber.value"
            :label="chamber.label"
            :value="chamber.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="冻结状态">
        <el-select v-model="query.publishStatus" placeholder="请选择状态">
          <el-option
            v-for="chamber in publishStatusList"
            :key="chamber.value"
            :label="chamber.label"
            :value="chamber.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-select v-model="query.publishTime" placeholder="请选择">
          <el-option
            v-for="chamber in publishTimeList"
            :key="chamber.value"
            :label="chamber.label"
            :value="chamber.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="供需ID">
        <el-input v-model="query.id" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="">
        <el-button @click="fetchData($event)">查询 </el-button>
      </el-form-item>
    </el-form>
    <!-- 搜索表单end -->

    <!-- 供需列表start -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="供需ID/名称" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.id }}</div>
          <div>{{ scope.row.title }}</div>
        </template>
      </el-table-column>
      <el-table-column label="发布信息" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.publishName }}</div>
          <div>{{ scope.row.publishTime }}</div>
        </template>
      </el-table-column>
      <el-table-column label="可见性" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.platform === 1">全平台可见</div>
          <div v-else>部分商会可见</div>
        </template>
      </el-table-column>
      <el-table-column label="供需状态" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 1">生效中</div>
          <div v-else-if="scope.row.status === 2">已关闭(过期关闭)</div>
          <div v-else-if="scope.row.status === 3">已关闭(成功合作)</div>
          <div v-else-if="scope.row.status === 4">已关闭(终止对接)</div>
        </template>
      </el-table-column>
      <el-table-column label="冻结状态" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.publishStatus === 1">正常</div>
          <div v-else-if="scope.row.publishStatus === 2">平台冻结</div>
          <div v-else-if="scope.row.status === 3">商会冻结</div>
        </template>
      </el-table-column>
      <el-table-column label="创建信息" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.operatorName }}</div>
          <div>{{ scope.row.createdTs }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="权重" width="120">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="delete scope.row">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 供需列表end -->
  </div>
</template>

<script src="./hotSupplyDemand.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
