<template>
  <a-modal
    v-model:visible="detailVisible"
    okText="我知道了"
    title="提现详情"
    @ok="detailVisible = false"
  >
    <a-form :model="detailObj">
      <a-row>
        <a-col :span="12">
          <a-form-item label="申请方："
            >{{ detailObj.chamberName }}
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="微信手续费：">
            {{ detailObj.wechatPrice }}
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-form-item label="提现日期：">
          {{ $filters.dateFormat(+detailObj.createTime) }}
        </a-form-item>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="提现类型：">
            {{ WITHDRAWALS_TYPE_MAP.get(detailObj.type) }}
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="应打款金额：">
            {{ detailObj.realPrice }}
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-form-item label="申请提现金额：">
          {{ detailObj.applyPrice }}
        </a-form-item>
      </a-row>
      <a-divider />
      <a-row>
        <a-form-item label="账户名：">
          {{ detailObj.accountName }}
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="开户行：">
          {{ detailObj.accountBank }}
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="账号：">
          {{ detailObj.account }}
        </a-form-item>
      </a-row>
      <a-divider />
      <a-row>
        <a-form-item label="状态：">
          {{ WITHDRAWALS_STATUS_MAP.get(detailObj.status) }}
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="处理时间：">
          {{ $filters.dateFormat(+detailObj.processTime) }}
        </a-form-item>
      </a-row>
      <a-row v-if="detailObj.status == 2">
        <a-form-item label="驳回理由：">
          {{ detailObj.rejectRemark }}
        </a-form-item>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import { computed, defineComponent } from "vue";
import {
  WITHDRAWALS_STATUS_MAP,
  WITHDRAWALS_TYPE_MAP,
} from "@business/common/src/finance/constant";
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detailObj: {
      type: Object,
    },
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const detailVisible = computed({
      get() {
        return props.visible;
      },
      set(value) {
        console.log(value);
        emit("update:visible", value);
      },
    });
    return { detailVisible, WITHDRAWALS_STATUS_MAP, WITHDRAWALS_TYPE_MAP };
  },
});
</script>
