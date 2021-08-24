<template>
  <div class="app-container">
    <div class="o-contain">
      <el-row>
        <el-col :span="8">
          订单号：{{ detailObj.orderSn }}
        </el-col>
        <el-col :span="8">
          付款方式：{{ payType(detailObj.payType) }}
        </el-col>
        <el-col :span="8">
          买家：{{ detailObj.wxUserName }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          下单时间：
          <span v-if="detailObj.createTime">{{ detailObj.createTime | formatDates }}</span>
          <span v-else> - -</span>
        </el-col>
        <el-col :span="8">
          订单状态：{{ status(detailObj.status) }}
        </el-col>
        <el-col :span="8">
          付款时间：{{ detailObj.payTime ? detailObj.payTime : '- -' }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          发货时间：
          <span v-if="detailObj.shippingTime">{{ detailObj.shippingTime | formatDates}}</span>
          <span v-else> - -</span>
        </el-col>
        <el-col :span="8">
          物流公司：{{ detailObj.shippingCompany ? detailObj.shippingCompany : '--' }}
          <span style="color:#409eff;cursor: pointer" @click="showSendOut">编辑</span>
        </el-col>
        <el-col :span="8">
          物流单号：{{ detailObj.shippingSn ? detailObj.shippingSn : '--' }}
          <span style="color:#409eff;cursor: pointer" @click="showSendOut">编辑</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          购买方式：{{ buyType(detailObj.fightStatus) }}
        </el-col>
        <el-col :span="8">
          拼单成功时间：
          <span v-if="detailObj.fightTime">{{ detailObj.fightTime | formatDates}}</span>
          <span v-else> - -</span>
        </el-col>
        <el-col :span="8">
          供货商家：{{ detailObj.supplierName }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          收件人姓名：{{ detailObj.consignee }}
        </el-col>
        <el-col :span="8">
          收件人手机号：{{ detailObj.mobile }}
        </el-col>
        <el-col :span="8">
          收货地址：{{ detailObj.consigneeAddress }}
        </el-col>
        <!--        <el-col :span="8" v-if="!isChamber">-->
        <!--          所属商会：{{ chamberName(detailObj.ckey) }}-->
        <!--        </el-col>-->
      </el-row>
      <el-row>
        <el-col :span="8">
          收货时间：
          <span v-if="detailObj.confirmReceivingTime">{{ detailObj.confirmReceivingTime | formatDates }}</span>
          <span v-else> - -</span>
        </el-col>
      </el-row>
    </div>
    <div class="block o-table-box">
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
          {{ detailObj.idGoods }}
        </el-col>
        <el-col :span="6" class="o-table-content o-table-input">
          {{ detailObj.name }}
        </el-col>
        <el-col :span="3" class="o-table-content o-table-input">
          {{ !detailObj.codeName ? '无' : detailObj.codeName }}
        </el-col>
        <el-col :span="3" class="o-table-content o-table-input">
          ¥{{ detailObj.price }}
        </el-col>
        <el-col :span="3" class="o-table-content o-table-input">
          {{ detailObj.count }}
        </el-col>
        <el-col :span="3" class="o-table-content o-table-input">
          ¥{{ detailObj.totalPrice }}
        </el-col>
        <el-col :span="3" class="o-table-content o-table-input">
          ¥{{ detailObj.realPrice }}
        </el-col>
      </el-row>
    </div>

    <el-dialog title="发货" :visible.sync="showSendOutDialog" width="25%">
      <el-form ref="shipping" label-position="right" :model="shipping" :rules="shippingRules">
        <el-form-item label-width="110px" label="物流公司：" prop="shippingCompany">
          <el-col :span="20">
            <el-select v-model="shipping.shippingCompany" placeholder="请选择">
              <el-option label="顺丰速运" :value="'顺丰速运'"></el-option>
              <el-option label="京东快递" :value="'京东快递'"></el-option>
              <el-option label="EMS" :value="'EMS'"></el-option>
              <el-option label="申通快递" :value="'申通快递'"></el-option>
              <el-option label="圆通速递" :value="'圆通速递'"></el-option>
              <el-option label="中通快递" :value="'中通快递'"></el-option>
              <el-option label="韵达速递" :value="'韵达速递'"></el-option>
              <el-option label="天天快递" :value="'天天快递'"></el-option>
              <el-option label="百世快递" :value="'百世快递'"></el-option>
              <el-option label="宅急送" :value="'宅急送'"></el-option>
              <el-option label="其他" :value="'其他'"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label-width="110px" label="物流单号：" prop="shippingSn">
          <el-col :span="20">
            <el-input v-model.trim="shipping.shippingSn" placeholder="请输入"/>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :offset="6" :span="20">
            <el-button type="primary" @click="sendOut('shipping')">发布</el-button>
            <el-button @click="showSendOutDialog = false">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
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
