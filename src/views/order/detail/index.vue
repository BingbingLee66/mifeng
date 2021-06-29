<template>
  <div class="app-container">
    <div class="o-contain">
      <el-row>
        <el-col :span="8">
          订单号：{{detailObj.orderSn}}
        </el-col>
        <el-col :span="8">
          付款方式：{{payType(detailObj.payType)}}
        </el-col>
        <el-col :span="8">
          买家：{{detailObj.wxUserName}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          下单时间：{{detailObj.createTime | dateFormat}}
        </el-col>
        <el-col :span="8">
          订单状态：{{status(detailObj.status)}}
        </el-col>
        <el-col :span="8">
          收件人姓名：{{detailObj.consignee}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          付款时间：{{detailObj.payTime}}
        </el-col>
        <el-col :span="8">
          发货时间：{{detailObj.shippingTime | dateFormat}}
        </el-col>
        <el-col :span="8">
          收件人手机号：{{detailObj.mobile}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          拼单成功时间：{{detailObj.fightTime | dateFormat}}
        </el-col>
        <el-col :span="8">
          收货时间：{{detailObj.confirmReceivingTime | dateFormat}}
        </el-col>
        <el-col :span="8">
          收货地址：{{detailObj.consigneeAddress}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          购买方式：{{buyType(detailObj.fightStatus)}}
        </el-col>
        <el-col :span="8">
          供货商家：{{detailObj.supplierName}}
        </el-col>
        <el-col :span="8" v-if="!isChamber">
          所属商会：{{chamberName(detailObj.ckey)}}
        </el-col>
      </el-row>
    </div>
    <div class="block form-border o-table-box">
      <el-row class="o-table-th">
        <el-col :span="3" class="o-table-content">商品ID</el-col>
        <el-col :span="6" class="o-table-content">商品名称</el-col>
        <el-col :span="3" class="o-table-content">规格</el-col>
        <el-col :span="3" class="o-table-content">商品单价（元）</el-col>
        <el-col :span="3" class="o-table-content">商品数量（件）</el-col>
        <el-col :span="3" class="o-table-content">商品总价（元）</el-col>
        <el-col :span="3" class="o-table-content">实收金额（元）</el-col>
      </el-row>
      <el-row class="o-table-td">
        <el-col :span="3" class="o-table-content o-table-input">
          {{detailObj.idGoods}}
        </el-col>
        <el-col :span="6" class="o-table-content o-table-input">
          {{detailObj.name}}
        </el-col>
        <el-col :span="3" class="o-table-content o-table-input">
          {{!detailObj.codeName ? '无' : detailObj.codeName}}
        </el-col>
        <el-col :span="3" class="o-table-content o-table-input">
          ¥{{detailObj.price}}
        </el-col>
        <el-col :span="3" class="o-table-content o-table-input">
          {{detailObj.count}}
        </el-col>
        <el-col :span="3" class="o-table-content o-table-input">
          ¥{{detailObj.totalPrice}}
        </el-col>
        <el-col :span="3" class="o-table-content o-table-input">
          ¥{{detailObj.realPrice}}
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script src="./detail.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.o-contain {
  width: 100%;
  background-color: #eee;
  padding: 30px;
}
.o-table-box {
  margin-top: 20px;
  width: 100%;
  background: inherit;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  text-align: center;
  padding: 20px;
}
.o-table-th {
  border: 1px solid #333;
  background-color: #b7f0ff;
  font-size: 14px;
  line-height: 40px;
}
.o-table-content {
  border-left: 1px solid #333;
  /*border-bottom: 1px solid #333;*/
  margin: 0 0 -1px -1px;
  padding: 0 3px;
}
.o-table-td {
  margin-top: -21px !important;
  border: 1px solid #333;
  /*padding: 20px;*/
  /*background-color: #fff;*/
  display: flex;
  display: -webkit-flex;
}
.o-table-input {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
