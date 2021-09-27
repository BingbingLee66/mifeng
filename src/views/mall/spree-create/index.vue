<template>
  <div class="app-container">
    <div class="coupon-form-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
        <div class="coupon-form-wrap">
          <div class="coupon-form-title">大礼包信息</div>
          <div class="coupon-form-item">
            <el-form-item label="大礼包名称：" prop="name">
              <el-input style="width: 200px;" v-model="ruleForm.name" placeholder="8个字内" show-word-limit maxlength="8"></el-input>
            </el-form-item>
          </div>
          <div class="coupon-form-item">
            <el-form-item label="包含优惠券：">
              <draggable v-model="ruleForm.couponList" ghost-class="ghost" group="couponList" animation="500" @start="couponListStart" @end="couponListEnd">
                <transition-group>
                  <div class="add-coupon" v-for="(id, index) in ruleForm.couponList" :key="index">
                    <el-input style="width: 200px;" v-model="ruleForm.couponList[index]" placeholder="优惠券ID"></el-input>
                    <span class="blue-label" @click="delCoupon(index)">删除</span>
                    <span class="blue-label">移动</span>
                  </div>
                </transition-group>
              </draggable>
              <div class="blue-label" @click="addCoupon">新增</div>
            </el-form-item>
          </div>
          <div class="coupon-form-item">
            <el-form-item label="大礼包发行量：" prop="resource">
              <el-input style="width: 150px;" size="small" v-model="ruleForm.name" />份
            </el-form-item>
          </div>
        </div>
        <div class="coupon-form-wrap">
          <div class="coupon-form-title">获取规则</div>
          <div class="coupon-form-item">
            <el-form-item label="每人可获得：">
              <div>最多1份 <span class="red-label"> (不可修改) </span></div>
            </el-form-item>
          </div>
          <div class="coupon-form-item">
            <el-form-item label="可接收/领取的人：">
              <div>不限</div>
            </el-form-item>
          </div>
        </div>
        <div class="coupon-form-wrap" style="border-bottom: none">
          <div class="coupon-form-title">使用规则</div>
          <div class="coupon-form-item">
            <el-form-item label="有效期：" prop="resource">
              <el-time-picker is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间" v-model="ruleForm.date2" style="width: 300px"></el-time-picker>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div style="width:900px;text-align:center;margin-top: 30px;">
      <el-button type="primary" @click="submitForm">保存</el-button>
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

  .add-coupon {
    margin: 10px 0;
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

