<template>
  <div class="app-container">
    <div class="coupon-form-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
        <div class="coupon-form-wrap">
          <div class="coupon-form-title">优惠券类型</div>
          <div class="coupon-form-item">
            <el-form-item label="优惠券类型：" prop="region">
              <el-select style="width: 150px;" disabled v-model="ruleForm.region" placeholder="请选择活动区域">
                <el-option label="现金劵" value="1"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="coupon-form-item radio-form">
            <el-form-item label="适用条件：" prop="resource">
              <el-radio-group v-model="ruleForm.resource">
                <div style="width: 500px">
                  <el-radio label="全场劵"></el-radio>
                  <span>任何商品都可以使用</span>
                </div>
                <div>
                  <el-radio label="商品劵"></el-radio>
                  <span>只有指定商品，才可以使用</span>
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="coupon-form-item">
            <el-form-item label="是否放进大礼包：" prop="delivery">
              <el-checkbox label="会放进大礼包" name="type"></el-checkbox>
            </el-form-item>
          </div>
        </div>
        <div class="coupon-form-wrap">
          <div class="coupon-form-title">优惠券信息</div>
          <div class="coupon-form-item">
            <el-form-item label="优惠券名称：" prop="name">
              <el-input style="width: 200px;" v-model="ruleForm.name" placeholder="8个字内" show-word-limit maxlength="8"></el-input>
            </el-form-item>
          </div>
          <div class="coupon-form-item">
            <el-form-item label="面值金额：" prop="name">
              <el-input style="width: 150px;" v-model="ruleForm.name">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="coupon-form-item radio-form">
            <el-form-item label="满额限额：" prop="resource">
              <el-radio-group v-model="ruleForm.resource">
                <div style="width: 500px">
                  <el-radio label="无门槛使用"></el-radio>
                </div>
                <div class="radio-input">
                  <el-radio label="满"></el-radio>
                  <el-input size="small" v-model="ruleForm.name"/>
                  元可用
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="coupon-form-item radio-form">
            <el-form-item label="发行量：" prop="resource">
              <el-radio-group v-model="ruleForm.resource">
                <div style="width: 500px">
                  <el-radio label="无张数限制"></el-radio>
                </div>
                <div class="radio-input">
                  <el-radio label="共"></el-radio>
                  <el-input size="small" v-model="ruleForm.name"/>
                  张
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div class="coupon-form-wrap">
          <div class="coupon-form-title">获取规则</div>
          <div class="coupon-form-item radio-form">
            <el-form-item label="每人可获得：" prop="resource">
              <el-radio-group v-model="ruleForm.resource">
                <div style="width: 500px">
                  <el-radio label="无张数限制"></el-radio>
                </div>
                <div class="radio-input">
                  <el-radio label="最多获得"></el-radio>
                  <el-input size="small" v-model="ruleForm.name"/>
                  张
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div class="coupon-form-wrap" style="border-bottom: none">
          <div class="coupon-form-title">使用规则</div>
          <div class="coupon-form-item radio-form">
            <el-form-item label="有效期：" prop="resource">
              <el-radio-group v-model="ruleForm.resource">
                <div class="radio-input">
                  <el-radio label="指定日期"></el-radio>
                  <el-time-picker is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间" v-model="ruleForm.date2" style="width: 300px"></el-time-picker>
                </div>
                <div class="radio-input">
                  <el-radio label="领取后立即生效，有效期"></el-radio>
                  <el-input size="small" v-model="ruleForm.name"/>
                  天
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="coupon-form-item radio-form">
            <el-form-item label="是否仅限新人使用：" prop="resource">
              <el-radio-group v-model="ruleForm.resource">
                <div style="width: 500px">
                  <el-radio label="是，仅限未下单用户使用"></el-radio>
                </div>
                <div class="radio-input">
                  <el-radio label="否"></el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="coupon-form-item radio-form">
            <el-form-item label="是否可赠送：" prop="resource">
              <el-radio-group v-model="ruleForm.resource">
                <div style="width: 500px">
                  <el-radio label="可以赠送"></el-radio>
                </div>
                <div class="radio-input">
                  <el-radio label="禁止赠送"></el-radio>
                </div>
              </el-radio-group>
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
@import "src/styles/common.scss";

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

