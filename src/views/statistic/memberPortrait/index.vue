<template>
  <div class="app-container">
    <div class="block">
      <div style="height:20px;margin-bottom: 10px;">
        <span style="font-weight: 600; font-size: 18px;float: left;">会员画像</span>
      </div>
    </div>
    <el-row>
      <el-col :span="24">
      <!-- <v-chart :options="tradeBarData" class="chart section" ref="barChart" :style="{'width': '100%'}"/> -->
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <v-chart :options="ageBarData" class="chart section" ref="barChart" style="width: 100%;"/>
      </el-col>
      <el-col :span="12">
        <v-chart :options="genderBarData" class="chart section" ref="barChart" style="width: 100%;"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <v-chart :options="yearsBarData" class="chart section" ref="barChart" style="width: 100%;"/>
      </el-col>
    </el-row>
  </div>
</template>

<script src="./memberData.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";

.meaning-wrap .meaning-item {
  margin-bottom: 20px;
}

.meaning-wrap .meaning-item .tit {
  font-weight: 700;
  font-size: 15px;
}

.meaning-wrap .meaning-item .sub {
  font-size: 14px;
  line-height: 22px;
}
</style>
<style>
.data-card {
  width: 100%;
  height: 120px;
  border-radius: 2px;
  border: 1px solid #ccc;
}

.d-card-box {
  float: left;
  width: 24.5%;
  height: 100%;
  text-align: center;
  display: table;
}

.card-box-3 {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
}

.card-key {
}

.card-value {
  margin-top: 10px;
  color: #008000;
  font-weight: 600;
}

.h-cut-line {
  float: left;
  width: 1px;
  height: 100%;
  border-left: 1px solid #ccc;
}
</style>
