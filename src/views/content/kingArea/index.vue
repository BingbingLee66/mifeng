<template>
  <div class="container">
    <!-- 表单搜索区域start -->
    <el-form
      :inline="true"
      :model="formKingKong"
      ref="formKingKong"
      class="demo-form-inline"
    >
      <el-form-item label="金刚区名称" prop="name">
        <el-input v-model="formKingKong.name" placeholder="关键词"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="creatorName">
        <el-input
          v-model="formKingKong.creatorName"
          placeholder="关键词"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createdTime">
        <el-date-picker
          value-format="timestamp"
          v-model="formKingKong.createdTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="kingKongAreaListFunc">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表单搜索区域end -->
    <div class="addButton">
      <el-button type="primary" @click="showAddDialog">添加金刚区</el-button>
    </div>

    <!-- 金刚区列表区域start -->
    <el-table :data="tableData" border>
      <el-table-column prop="name" label="金刚区名称" width="180">
      </el-table-column>
      <el-table-column prop="image" label="金刚区图片" width="180">
        <template slot-scope="scope">
          <el-image :src="scope.row.image" class="king-img" :preview-src-list="srcList(scope.row.image)"/>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="跳转链接" width="180">
      </el-table-column>

      <el-table-column label="创建信息" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.creatorName }}</div>
          <div>{{ scope.row.createdTs | dateFormat(scope.row.createdTs) }}</div>
        </template>
      </el-table-column>

      <el-table-column label="更新信息" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.operatorName || '-'}}</div>
          <div>{{ scope.row.updatedTs | dateFormat(scope.row.updatedTs) }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="weight" label="权重" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="updateWeight(scope.row)">{{
            scope.row.weight
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteKingKong(scope.row)"
            >移除</el-button
          >
          <el-button type="text" @click="update(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 金刚区列表区域end -->
    <!-- 分页start -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 分页end -->
    </div>

    <!-- 添加金刚区对话框start -->
    <addKingKongDialog ref="addDialog"></addKingKongDialog>
    <!-- <kdDialog title=""></kdDialog> -->
    <!-- 添加金刚区对话框end -->
    <!-- 编辑权重对话框 -->
    <kdDialog
      ref="weightKdDialog"
      dialogTitle="编辑权重"
      dialogWidth="40%"
      @savePopupData="submitWeight"
     @hide="hide"
    >
      <div slot="content">
        <el-form
          ref="formWeightKdDialog"
          :rules="weightRules"
          label-width="120px"
          :model="formWeight"
          label-position="right"
          class="demo-ruleForm"
        >
          <el-form-item label="权重：" prop="weight">
            <el-input onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"  v-model="formWeight.weight" ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </kdDialog>
  </div>
</template>

<script src="./kingarea.js"></script>

<style rel="stylesheet/scss" lang="scss" >
@import "src/styles/common.scss";
.container {
  padding: 15px 0px 15px 10px;
}
.addButton {
  margin-bottom: 20px;
}
.king-img {
  width: 150px;
  height: 120px;
}
</style>
