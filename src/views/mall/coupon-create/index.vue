<template>
  <div class="app-container">
    <div class="coupon-form-container">
      <el-form :model="formObj" :rules="rules" ref="formObj" label-width="160px">
        <div class="coupon-form-wrap">
          <div class="coupon-form-title">优惠券类型</div>
          <div class="coupon-form-item">
            <el-form-item label="优惠券类型：" prop="type">
              <el-select style="width: 150px;" disabled v-model="formObj.type" placeholder="请选择活动区域">
                <el-option label="现金劵" value="1"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="coupon-form-item radio-form">
            <el-form-item label="适用条件：" prop="condition">
              <el-radio-group v-model="formObj.condition">
                <div style="width: 500px">
                  <el-radio label="1">全场劵</el-radio>
                  <span>任何商品都可以使用</span>
                </div>
                <div>
                  <el-radio label="2">商品劵</el-radio>
                  <span>只有指定商品，才可以使用</span>
                  <div style="margin-top: 10px;" v-if="formObj.condition==='2'">
                    <el-button type="danger" size="small" @click="openAddDialog">选择可用劵商品</el-button>
                    <span v-if="selectedItemLength>0">已选{{ selectedItemLength }}款</span>
                    <span v-if="selectedItemLength>0" class="blue-label" @click="openRemoveDialog">点击查看</span>
                  </div>
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="coupon-form-item">
            <el-form-item label="是否放进大礼包：" prop="isGiftPack">
              <el-checkbox v-model="formObj.isGiftPack" @change="putGiftPack">会放进大礼包</el-checkbox>
            </el-form-item>
          </div>
        </div>
        <div class="coupon-form-wrap">
          <div class="coupon-form-title">优惠券信息</div>
          <div class="coupon-form-item">
            <el-form-item label="优惠券名称：" prop="name">
              <el-input style="width: 200px;" v-model="formObj.name" placeholder="8个字内" show-word-limit maxlength="8" @input="handleSpace"></el-input>
            </el-form-item>
          </div>
          <div class="coupon-form-item">
            <el-form-item label="面值金额：" prop="amount">
              <el-input style="width: 150px;" v-model="formObj.amount" @input="e => handleNumber(e,'amount')">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="coupon-form-item radio-form require-label">
            <el-form-item label="满额限额：" prop="isLimit">
              <el-radio-group v-model="formObj.isLimit" @change="e => handleChange(e,'limitValue','disLimitValue')">
                <div style="width: 500px">
                  <el-radio label="1">无门槛使用</el-radio>
                </div>
                <div class="radio-input">
                  <el-radio label="2">满</el-radio>
                  <el-input :disabled="disLimitValue" size="small" v-model="limitValue" @input="e => handleNumber(e,'limitValue')" />
                  元可用
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="coupon-form-item radio-form require-label">
            <el-form-item label="发行量：" prop="isIssue" ref="issueForm">
              <el-radio-group v-model="formObj.isIssue" @change="e => handleChange(e,'issueValue','disIssueValue')">
                <div style="width: 500px">
                  <el-radio label="1">无张数限制</el-radio>
                </div>
                <div class="radio-input" v-if="!giftPackFlag">
                  <el-radio label="2">共</el-radio>
                  <el-input :disabled="disIssueValue" size="small" v-model="issueValue" @input="e => handleNumber(e,'issueValue')" />
                  张
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div class="coupon-form-wrap">
          <div class="coupon-form-title">获取规则</div>
          <div class="coupon-form-item radio-form require-label">
            <el-form-item label="每人可获得：" prop="isGain" ref="gainForm">
              <el-radio-group v-model="formObj.isGain" @change="e => handleChange(e,'gainValue','disGainValue')">
                <div style="width: 500px">
                  <el-radio label="1">无张数限制</el-radio>
                </div>
                <div class="radio-input" v-if="!giftPackFlag">
                  <el-radio label="2">最多获得</el-radio>
                  <el-input :disabled="disGainValue" size="small" v-model="gainValue" @input="e => handleNumber(e,'gainValue')" />
                  张
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div class="coupon-form-wrap" style="border-bottom: none">
          <div class="coupon-form-title">使用规则</div>
          <div class="coupon-form-item radio-form require-label">
            <el-form-item label="有效期：" prop="timeType" ref="timeTypeForm">
              <el-radio-group v-model="formObj.timeType" @change="e => handleChange(e,'dayValue','disDayValue')">
                <div class="radio-input" v-if="!giftPackFlag">
                  <el-radio label="1">指定日期</el-radio>
                  <el-date-picker :disabled="disRangeDay" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="rangeDay" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                  </el-date-picker>
                </div>
                <div class="radio-input">
                  <el-radio label="2">领取后立即生效，有效期</el-radio>
                  <el-input v-model="dayValue" :disabled="disDayValue" size="small" @input="e => handleNumber(e,'dayValue')" />
                  天
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="coupon-form-item radio-form">
            <el-form-item label="是否仅限新人使用：" prop="isNew">
              <el-radio-group v-model="formObj.isNew">
                <div style="width: 500px">
                  <el-radio label="1">是，仅限未下单用户使用</el-radio>
                </div>
                <div class="radio-input">
                  <el-radio label="2">否</el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="coupon-form-item radio-form">
            <el-form-item label="是否可赠送：" prop="isGive">
              <el-radio-group v-model="formObj.isGive">
                <div style="width: 500px">
                  <el-radio label="1">可以赠送</el-radio>
                </div>
                <div class="radio-input">
                  <el-radio label="2">禁止赠送</el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div style="width:900px;text-align:center;margin-top: 30px;">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button>取消</el-button>
    </div>
    <!-- 可用劵商品弹窗 -->
    <add-dialog ref="addDialog" @localChange='localChange' />
    <remove-dialog ref="removeDialog" @localChange='localChange' />
  </div>
</template>

<script src="./coupon-create.js"></script>

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

<style lang="scss">
.require-label .el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
</style>

