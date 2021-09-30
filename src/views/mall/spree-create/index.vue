<template>
  <div class="app-container">
    <div class="coupon-form-container">
      <el-form :model="formObj" :rules="rules" ref="form" label-width="160px">
        <div class="coupon-form-wrap">
          <div class="coupon-form-title">大礼包信息</div>
          <div class="coupon-form-item">
            <el-form-item label="大礼包名称：" prop="giftName">
              <el-input style="width: 200px;" size="mini" v-model="formObj.giftName" placeholder="8个字内" show-word-limit maxlength="8" @input="handleSpace"></el-input>
            </el-form-item>
          </div>
          <div class="coupon-form-item">
            <el-form-item label="包含优惠券：">
              <draggable v-model="couponList" ghost-class="ghost" group="couponList" animation="500" @start="couponListStart" @end="couponListEnd">
                <transition-group>
                  <div class="mb-10" v-for="(item, index) in couponList" :key="index">
                    <el-input style="width: 200px;" size="mini" v-model="item.id" placeholder="优惠券ID" maxlength="12" @input="e => handleInt(e,index)" @blur="e => handleBlur(e,index)"></el-input>
                    <span class="blue-label" v-if="couponList.length>1" @click="delCoupon(index)">删除</span>
                    <span style="color: #e6a23c;cursor: pointer;" v-if="couponList.length>1">移动</span>
                    <div style="line-height: 1.2;color: #333333;font-size: 14px;">{{ item.name }}</div>
                    <div style="line-height: 1.2;color: #FF0000;font-size: 14px;">{{ item.errTip }}</div>
                  </div>
                </transition-group>
              </draggable>
              <div style="line-height: 1">
                <span class="blue-label" @click="addCoupon">新增</span>
              </div>
            </el-form-item>
          </div>
          <div class="coupon-form-item">
            <el-form-item label="大礼包发行量：" prop="quota">
              <el-input style="width: 200px;" size="mini" v-model="formObj.quota" @input="e => handleNumber(e,'quota')" />
              份
            </el-form-item>
          </div>
        </div>
        <div class="coupon-form-wrap">
          <div class="coupon-form-title">获取规则</div>
          <div class="coupon-form-item">
            <el-form-item label="每人可获得：" prop="limit">
              <div>
                <span>最多{{ formObj.obtainLimit }}份</span>
                <span class="red-label"> (不可修改) </span>
              </div>
            </el-form-item>
          </div>
          <div class="coupon-form-item">
            <el-form-item label="可接收/领取的人：" prop="person">
              <el-radio disabled v-model="formObj.person" label="1">不限</el-radio>
            </el-form-item>
          </div>
        </div>
        <div class="coupon-form-wrap" style="border-bottom: none">
          <div class="coupon-form-title">使用规则</div>
          <div class="coupon-form-item">
            <el-form-item label="有效期：" prop="date">
              <el-date-picker style="width: 260px" size="mini" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="formObj.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div style="width:900px;text-align:center;margin-top: 30px;">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script src="./create.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';

.coupon-form-container {
  width: 900px;
  border: 1px solid rgba(215, 215, 215, 1);

  .coupon-form-wrap {
    padding: 30px 20px 0;
    border-bottom: 1px solid rgba(215, 215, 215, 1);
  }

  .coupon-form-title {
    font-size: 18px;
    color: #333333;
    font-weight: bolder;
    margin-bottom: 20px;
  }

  .radio-form {
    .el-radio-group {
      font-size: 14px;
    }

    .el-radio {
      margin-right: 5px;
      margin-top: 12px;
    }

    .radio-input {
      width: 500px;
      display: flex;
      align-items: center;
      margin-top: 10px;

      .el-radio {
        margin-top: 0;
      }

      .el-input {
        width: 100px;
        margin-right: 5px;
      }
    }
  }
}
</style>

