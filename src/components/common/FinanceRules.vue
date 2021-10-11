<template>
  <div>
    <el-dialog
      title="计算规则"
      :visible.sync="calculationRulesDia"
      width="50%"
      center
      class="calculation-rules-dia"
      :before-close="closeDia"
    >
      <div v-if="position === 'detail'">
        <div class="rule-box">
          <div class="rule-item bbn">
            <div class="rule-left">供货价</div>
            <div class="rule-right">单个订单的供货价=SKU的供货价*数量；</div>
          </div>
          <div class="rule-item bbn">
            <div class="rule-left">买家实付金额</div>
            <div class="rule-right">
              表示买家实际支付的钱。<br />单个订单的买家实付金额
              =（价格-立减优惠）*数量-优惠券金额；<br />如果用户是单买，则价格为单买价；<br />如果用户是拼单，则价格为拼单价；
            </div>
          </div>
          <div class="rule-item bbn">
            <div class="rule-left">应付款金额</div>
            <div class="rule-right">
              表示应该结算给供货商的钱。<br />单个订单的应付款金额 =
              供货价*数量-买家实付金额*（商品服务费率+微信服务费率）；
            </div>
          </div>
          <div class="rule-item bbn">
            <div class="rule-left">价格</div>
            <div class="rule-right">
              表示商品实际售卖的价格。<br />如果用户是单独购买，则单个订单的价格
              = SKU的单买价*数量；<br />如果用户是拼单购买，则单个订单的价格 =
              SKU的拼单价*数量
            </div>
          </div>
          <div class="rule-item bbn">
            <div class="rule-left">商品服务费率</div>
            <div class="rule-right">
              在商品发布时设置，支持修改，故一个商品会存在不同的的商品服务费率；
            </div>
          </div>
          <div class="rule-item bbn">
            <div class="rule-left">商品服务费</div>
            <div class="rule-right">
              单个订单的【商品服务费】= 商品服务费率* 买家实付金额；
            </div>
          </div>
          <div class="rule-item bbn">
            <div class="rule-left">微信手续费率</div>
            <div class="rule-right">
              在商品发布时设置，支持修改，故一个商品会存在不同的的微信服务费率；<br />
              <span class="text-important"
                >此处的“微信手续费”，是由我们的管理员自主设置，和微信商户号那边收取的提现手续费不是同一个。</span
              >
            </div>
          </div>
          <div class="rule-item bbn">
            <div class="rule-left">微信手续费</div>
            <div class="rule-right">
              单个订单的【微信手续费】 = 微信手续费率*买家实付金额；
            </div>
          </div>
          <div class="rule-item bbn">
            <div class="rule-left">立减优惠</div>
            <div class="rule-right">
              单个订单的【立减优惠】= 商品的立减优惠金额*数量；
            </div>
          </div>
          <div class="rule-item">
            <div class="rule-left">优惠卷金额</div>
            <div class="rule-right">
              单个订单的【优惠卷金额】为用户使用的各张优惠券的金额总和；
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="rule-box">
          <div class="rule-item bbn">
            <div class="rule-left">供货价</div>
            <div class="rule-right">
              单个订单的供货价=SKU的供货价*数量；<br />此处的【供货价】为该结算单内各个订单的供货价的总合；
            </div>
          </div>
          <div class="rule-item bbn">
            <div class="rule-left">买家实付金额</div>
            <div class="rule-right">
              表示买家实际支付的钱。<br />单个订单的买家实付金额
              =（价格-立减优惠）*数量-优惠券金额；<br />如果用户是单买，则价格为单买价；<br />如果用户是拼单，则价格为拼单价；<br />此处的【买家实付金额】为该结算单内，所有订单的买家实付金额的总和；
            </div>
          </div>
          <div class="rule-item bbn">
            <div class="rule-left">应付款金额</div>
            <div class="rule-right">
              表示应该结算给供货商的钱。<br />单个订单的应付款金额 =
              供货价*数量-买家实付金额*（商品服务费率+微信服务费率）；<br />此处的【应付款金额】为该结算单内，所有订单的应付款金额的总和；
            </div>
          </div>
          <div class="rule-item bbn">
            <div class="rule-left">商品服务费</div>
            <div class="rule-right">
              单个订单的【商品服务费】= 商品服务费率* 买家实付金额；<br />此处的【商品服务费】为该结算单内，所有订单的商品服务费的总和；
            </div>
          </div>
          <div class="rule-item bbn">
            <div class="rule-left">微信手续费</div>
            <div class="rule-right">
              <span class="text-important"
                >单个商品的微信手续费率，在发布商品时设置，此处的“微信手续费”，不是微信商户那边收取的提现手续费不是同一个。</span
              ><br />单个订单的【微信手续费】 = 微信手续费率*买家实付金额；<br />此处的【微信手续费】为该结算单内，所有订单的微信手续费的总和；
            </div>
          </div>
          <div class="rule-item bbn">
            <div class="rule-left">立减优惠</div>
            <div class="rule-right">
              单个订单的【立减优惠】= 商品的立减优惠金额*数量；<br />此处的【立减优惠】为该结算单内，所有订单的【立减优惠】金额的总和；
            </div>
          </div>
          <div class="rule-item">
            <div class="rule-left">优惠卷金额</div>
            <div class="rule-right">
              单个订单的【优惠卷金额】为用户使用的各张优惠券的金额总和；<br />此处的【优惠卷金额】为该结算单内，所有订单的【优惠卷金额】的总和；
            </div>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDia">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["calculationRulesDia", "position"],
  data() {
    return {};
  },
  methods: {
    closeDia() {
      this.$emit("closeDia");
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .calculation-rules-dia .el-dialog {
  margin-top: 4vh !important;
}
.rule-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .rule-item {
    display: flex;
    align-items: center;
    width: 90%;
    border: 1px solid #ccc;
    background-color: #f0f0f0;
    .rule-left {
      width: 110px;
      margin-left: 5px;
    }
    .rule-right {
      flex: 1;
      padding: 10px;
      line-height: 24px;
      border-left: 1px solid #ccc;
      background-color: #fff;
    }
  }
  .bbn {
    border-bottom: none;
  }
  .text-important {
    color: red;
  }
}
</style>
