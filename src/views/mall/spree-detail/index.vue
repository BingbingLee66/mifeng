<template>
  <div class="app-container">
    <div class="coupon-detail-container">
      <div class="coupon-detail-wrap">
        <div class="coupon-detail-title">大礼包信息</div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable">优惠券名称：</div>
          <div class="coupon-detail-content">10元福利券</div>
        </div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable">包含优惠券：</div>
          <div class="coupon-detail-content">10元</div>
        </div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable">大礼包发行量：</div>
          <div class="coupon-detail-content">1000张</div>
        </div>
      </div>
      <div class="coupon-detail-wrap">
        <div class="coupon-detail-title">获取规则</div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable"> 每人可获得：</div>
          <div class="coupon-detail-content">最多1份 <span class="red-label">(不可修改)</span></div>
        </div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable"> 可接收/领取的人：</div>
          <div class="coupon-detail-content">不限</div>
        </div>
      </div>
      <div class="coupon-detail-wrap" style="border-bottom: none">
        <div class="coupon-detail-title">使用规则</div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable">有效期：</div>
          <div class="coupon-detail-content">发放后立即生效，有效期3天</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./couponDetail.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';

.coupon-detail-container {
  width: 800px;
  border: 1px solid rgba(215, 215, 215, 1);

  .coupon-detail-wrap {
    padding: 30px 20px 0;
    border-bottom: 1px solid rgba(215, 215, 215, 1);
  }

  .coupon-detail-title {
    font-size: 18px;
    color: #333333;
    font-weight: bolder;
  }

  .coupon-detail-item {
    display: flex;
    align-items: center;
    margin: 30px 0;
    color: #333333;
    font-size: 14px;

    .coupon-detail-lable {
      width: 180px;
      text-align: right;
      margin-right: 10px;
    }

    .coupon-detail-lable:before {
      display: inline-block;
      content: '*';
      color: #ff3333;
      margin-right: 5px;
    }

    .none-before::before {
      display: none;
    }
  }
}
</style>
