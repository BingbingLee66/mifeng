<template>
  <Panel>
    <div class="o-contain">
      <a-row align="middle">
        <a-col :span="8"> 订单号：{{ detailObj.orderSn }} </a-col>
        <a-col :span="8">
          付款方式：{{
            detailObj.payType === null ? '未支付' : detailObj.payType === 'wechat' ? '微信支付' : '未知支付方式'
          }}
        </a-col>
        <a-col :span="8"> 买家：{{ detailObj.wxUserName }} </a-col>
      </a-row>
      <a-row>
        <a-col :span="8"> 下单时间：{{ detailObj.createTime || '--' }} </a-col>
        <a-col :span="8"> 微信订单号：{{ detailObj.wechatOrderNum || '--' }} </a-col>
        <a-col :span="8"> 订单状态：{{ ORDER_STATE_MAP.get(detailObj.status) || '未知状态' }} </a-col>
      </a-row>
      <a-row>
        <a-col :span="8"> 付款时间：{{ detailObj.payTime || '--' }} </a-col>
        <a-col :span="8"> 发货时间：{{ detailObj.shippingTime || '--' }} </a-col>
        <a-col :span="8">
          物流公司：{{ detailObj.shippingCompany || '--' }}
          <a-button type="link" @click="showSendOut">编辑</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          物流单号：{{ detailObj.shippingSn || '--' }}
          <a-button type="link" @click="showSendOut">编辑</a-button>
        </a-col>
        <a-col :span="8"> 购买方式：{{ ORDER_FIGHTSTATE_MAP.get(detailObj.fightStatus) || '未知方式' }} </a-col>
        <a-col :span="8"> 拼单成功时间：{{ detailObj.fightTime || '--' }} </a-col>
      </a-row>
      <a-row>
        <a-col :span="8"> 供货商家：{{ detailObj.supplierName }} </a-col>
        <a-col :span="8"> 收件人姓名：{{ detailObj.consignee }} </a-col>
        <a-col :span="8"> 收件人手机号：{{ detailObj.mobile }} </a-col>
      </a-row>
      <a-row>
        <a-col :span="8"> 收货时间：{{ detailObj.confirmReceivingTime || '--' }} </a-col>
        <a-col :span="8"> 推广渠道：{{ detailObj.channelName || '--' }} </a-col>
        <a-col :span="8"> 用户属性：{{ detailObj.isFirst }} </a-col>
      </a-row>
      <a-row>
        <a-col :span="8"> 收货地址：{{ detailObj.consigneeAddress }} </a-col>
        <a-col :span="8">
          大礼包：
          <a-button type="link" @click="goSpreeDetail(detailObj.giftId)">{{ detailObj.giftId }}</a-button
          >-
          <a-button type="link" @click="goSpreeDetail(detailObj.giftId)">{{ detailObj.giftName }}</a-button>
        </a-col>
        <a-col :span="8">
          优惠券：
          <a-button type="link" @click="goCouponDetail(detailObj.templateId)">{{ detailObj.templateId }}</a-button
          >-
          <a-button type="link" @click="goCouponDetail(detailObj.templateId)">{{ detailObj.couponName }}</a-button>
        </a-col>
      </a-row>
    </div>
    <div class="block o-table-box">
      <a-row class="o-table-th">
        <a-col :span="3" class="o-table-content">商品ID/商品名称</a-col>
        <a-col :span="1" class="o-table-content">规格</a-col>
        <a-col :span="3" class="o-table-content">商品单价（元）</a-col>
        <a-col :span="3" class="o-table-content">商品数量（件）</a-col>
        <a-col :span="3" class="o-table-content">商品总价（元）</a-col>
        <a-col :span="3" class="o-table-content">立减优惠（元）</a-col>
        <a-col :span="3" class="o-table-content">优惠券优惠（元）</a-col>
        <a-col :span="3" class="o-table-content">实收金额（元）</a-col>
        <a-col :span="2" class="o-table-content">结算状态</a-col>
      </a-row>
      <a-row class="o-table-td">
        <a-col :span="3" class="o-table-content o-table-input">
          <div>
            <div class="red-label">{{ detailObj.idGoods }}</div>
            <div>{{ detailObj.name }}</div>
          </div>
        </a-col>
        <a-col :span="1" class="o-table-content o-table-input o-table-style">
          {{ !detailObj.codeName ? '无' : detailObj.codeName }}
        </a-col>
        <a-col :span="3" class="o-table-content o-table-input o-table-style"> ¥{{ detailObj.price }} </a-col>
        <a-col :span="3" class="o-table-content o-table-input o-table-style">
          {{ detailObj.count }}
        </a-col>
        <a-col :span="3" class="o-table-content o-table-input o-table-style"> ¥{{ detailObj.totalPrice }} </a-col>
        <a-col :span="3" class="o-table-content o-table-input o-table-style"> ¥{{ detailObj.totalDiscount }} </a-col>
        <a-col :span="3" class="o-table-content o-table-input o-table-style">
          ¥{{ detailObj.couponPrice / 100 }}
        </a-col>
        <a-col :span="3" class="o-table-content o-table-input o-table-style"> ¥{{ detailObj.realPrice }} </a-col>
        <a-col :span="2" class="o-table-content o-table-input o-table-style">
          {{ detailObj.settlementStatus || '--' }}
        </a-col>
      </a-row>
    </div>
    <AModal
      v-model:visible="shippingVisible"
      :confirm-loading="shippingLoading"
      title="发货"
      @ok="handleOk"
      @cancel="cancelModel"
    >
      <AForm
        ref="formRef"
        :model="shipping"
        :rules="shippingRules"
        label-position="right"
        label-width="100px"
        autocomplete="off"
        :label-col="{ span: 4 }"
      >
        <AFormItem label="物流公司" name="shippingCompany" has-feedback>
          <ASelect v-model:value="shipping.shippingCompany" :placeholder="`请选择`" :options="selectOption"> </ASelect>
        </AFormItem>
        <AFormItem label="物流单号" name="shippingSn" has-feedback>
          <AInput autocomplete="off" allowClear v-model:value="shipping.shippingSn" placeholder="请输入" />
        </AFormItem>
      </AForm>
    </AModal>
  </Panel>
</template>

<script setup>
import { getOrder, updateShipping } from '@/api/order/index'
import { ORDER_STATE_MAP, ORDER_FIGHTSTATE_MAP } from '@/constant/order'
import { jumpOldYSH } from '@/utils/jumpOldYSH'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
const detailObj = reactive({})
const route = useRoute()
const orderSn = ref(route.query.orderSn)
const fetchData = async () => {
  const params = {
    orderSn: orderSn.value
  }
  const {
    data: { order }
  } = await getOrder(params)
  Object.assign(detailObj, order)
}
const shippingRules = {
  shippingSn: [{ required: true, message: '请输入物流单号', trigger: ['blur', 'change'] }],
  shippingCompany: [{ required: true, message: '请输入物流公司', trigger: ['blur', 'change'] }]
}
const selectOption = [
  { value: '顺丰速运', label: '顺丰速运' },
  { value: '京东快递', label: '京东快递' },
  { value: 'EMS', label: 'EMS' },
  { value: '申通快递', label: '申通快递' },
  { value: '圆通速递', label: '圆通速递' },
  { value: '中通快递', label: '中通快递' },
  { value: '韵达速递', label: '韵达速递' },
  { value: '天天快递', label: '天天快递' },
  { value: '百世快递', label: '百世快递' },
  { value: '宅急送', label: '宅急送' },
  { value: '其他', label: '其他' }
]
const formRef = ref(null)
const shipping = reactive({
  shippingCompany: null,
  shippingSn: null
})
const shippingVisible = ref(false)
const shippingLoading = ref(false)
const showSendOut = () => {
  shippingVisible.value = true
  shipping.shippingSn = detailObj.shippingSn
  shipping.shippingCompany = detailObj.shippingCompany
}
const handleOk = async () => {
  await formRef.value.validateFields()
  const params = {
    orderId: detailObj.id,
    shippingSn: shipping.shippingSn,
    shippingCompany: shipping.shippingCompany
  }
  await updateShipping(params)
  shippingVisible.value = false
  formRef.value.resetFields()
  fetchData()
}
const cancelModel = () => {
  shippingVisible.value = false
  formRef.value.resetFields()
}

const goSpreeDetail = giftId => {
  jumpOldYSH(`/mall/spreeDetail?giftId=${giftId}`)
}

const goCouponDetail = couponId => {
  jumpOldYSH(`/mall/spreeDetail?couponId=${couponId}`)
}
onMounted(() => {
  fetchData()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.o-contain {
  width: 100%;
  background-color: #eee;
  padding: 30px;
  line-height: 38px;
}

.o-table-box {
  margin-top: 20px;
  width: 100%;
  background: inherit;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  text-align: center;
}

.o-table-th {
  border: 1px solid #333;
  background-color: #b7f0ff;
  font-size: 14px;
  line-height: 40px;
}

.o-table-content:not(:first-of-type) {
  border-left: 1px solid #333;
}

.o-table-td {
  border-right: 1px solid #333;
  border-left: 1px solid #333;
  border-bottom: 1px solid #333;
  display: flex;
  display: -webkit-flex;
}

.o-table-input {
  display: flex;
  align-items: center;
  justify-content: center;
  display: -webkit-flex;
}
.o-table-style {
  line-height: 2;
}
</style>
