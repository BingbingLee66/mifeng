<template>
  <div class="app-container">
    <div class="coupon-form-container">
      <el-form label-width="160px">
        <div class="coupon-form-wrap">
          <div class="coupon-form-title">发放优惠券</div>
          <div class="coupon-form-item">
            <el-form-item label="包含优惠券：" required>
              <draggable v-model="couponList" ghost-class="ghost" group="couponList" animation="500" @start="couponListStart" @end="couponListEnd">
                <transition-group>
                  <div class="add-coupon" v-for="(item, index) in couponList" :key="index">
                    <div class="add-item">
                      <el-input style="width: 200px;" size="mini" v-model="item.couponId" maxlength="12" placeholder="优惠券ID" @input="e => handleInt(e,index,'couponId')" @blur="e => handleBlur(e,index,'couponId')"></el-input>
                      <div class="tips" style="color: #333333;font-size: 13px;">{{item.name}}</div>
                      <div class="tips" style="color: #F56C6C;font-size: 13px;">{{item.errTips}}</div>
                    </div>
                    <div class="add-item">
                      <el-input style="width: 120px;margin-right: 10px;" size="mini" maxlength="2" v-model="item.couponNum" placeholder="数量（1-10）" @input="e => handleInt(e,index,'couponNum')" @blur="e => handleBlur(e,index,'couponNum')"></el-input>
                      <span class="blue-label" v-if="couponList.length>1" @click="delCoupon(index)">删除</span>
                      <span class="blue-label" v-if="couponList.length>1">移动</span>
                      <div class="tips" style="color: #ff3333;">{{ item.tip }}</div>
                    </div>
                  </div>
                </transition-group>
              </draggable>
              <div style="line-height: 1.5;">
                <span class="blue-label" @click="addCoupon">新增</span>
              </div>
            </el-form-item>
          </div>
          <div class="coupon-form-item radio-form">
            <el-form-item label="优惠券接收方：" required>
              <el-radio-group v-model="issueType" @change="handleChange">
                <div style="width: 500px">
                  <el-radio label="1">发给指定手机号</el-radio>
                  <div v-if="issueType==='1'" style="margin-top:10px;">
                    <el-input style="width: 400px;" type="textarea" resize="none" :rows="8" v-model="phone" placeholder=""></el-input>
                    <div style="margin-top:10px;line-height:1.5;" class="red-label">
                      <div>提示：</div>
                      <div>1.输入多个手机号时，请以回车换行。</div>
                      <div>2.单次指定的手机号不得大于1000个。</div>
                    </div>
                  </div>
                </div>
                <div style="width: 500px">
                  <el-radio label="2">发给指定商/协会成员</el-radio>
                  <div v-if="issueType==='2'" style="margin-top:10px;">
                    <el-select style="width:200px;" v-model="chamberId" placeholder="请选择商/协会成员" clearable>
                      <el-option v-for="chamber in chamberOptions" :key="chamber.id" :label="chamber.name" :value="chamber.id" />
                    </el-select>
                  </div>
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <el-form-item label=" ">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script src="./create.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';

.coupon-form-container {
  width: 900px;
  // border: 1px solid rgba(215, 215, 215, 1);

  .coupon-form-wrap {
    padding: 30px 20px 0;
    // border-bottom: 1px solid rgba(215, 215, 215, 1);
  }

  .coupon-form-title {
    font-size: 18px;
    color: #333333;
    font-weight: bolder;
    margin-bottom: 20px;
  }

  .add-coupon {
    margin: 10px 0;
    display: flex;

    .add-item {
      line-height: 1;
      margin-right: 10px;

      .tips {
        color: #333;
        margin-top: 10px;
      }
    }
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

