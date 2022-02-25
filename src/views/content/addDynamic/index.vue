<template>
  <div class="app-container">
    <div class="promulgator">
      <div>
        <span style="color: #ff0101">*</span>
        <span class="handle">选择发布者</span>
        <el-button
          type="primary"
          size="small"
          @click="showOfficialComponent($event)"
          >去选择
        </el-button>
        <span class="text-tips"
          >仅可选择一位发布者，重选后，新选择的发布者将会替换已选发布者</span
        >
      </div>

      <el-table class="table" :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="date" label="用户ID" width="180">
        </el-table-column>
        <el-table-column prop="name" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="手机号"> </el-table-column>
        <el-table-column prop="name" label="所属商会" width="180">
        </el-table-column>
        <el-table-column prop="name" label="操作" width="180">
          <template slot-scope="scope">
          <el-button  type="text"  @click="detail($event, scope.row)">
            移除
          </el-button>

        </template>
        </el-table-column>
      </el-table>
    </div>

    <officialComponent
      :type="2"
      ref="OfficialComponent"
      title="添加发布者"
    ></officialComponent>
  </div>
</template>

<script src="./index.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.promulgator {
  font-size: 14px;
  color: #333333;
  font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
  font-weight: 700;
  .text-tips {
    color: #aaaaaa;
    margin-left: 15px;
  }
  .handle {
    margin-right: 20px;
  }
  .table {
    margin-top: 20px;
  }
}
.contentHtml {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  img {
    width: 20% !important;
    height: 20% !important;
  }
}
#myhtml img {
  width: 20% !important;
  height: 20% !important;
}
</style>
