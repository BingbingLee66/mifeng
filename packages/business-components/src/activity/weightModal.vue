<template>
  <InputModal
    v-model:visible="visible"
    title="编辑权重"
    label="权重"
    :defaultValue="defaultValue"
    :confirmLoading="confirmLoading"
    :rules="inputModalRules"
    @ok="handleOk"
  >
    <template v-slot:desc>
      <div>权重请控制在0-999，权重为0不在前台展示</div>
    </template>
  </InputModal>
</template>
<script setup>
import { useInputModal } from "@business/components/src/input-modal/hook";
import InputModal from "@business/components/src/input-modal/index.vue";

const props = defineProps({
  API: {
    type: Function,
    required: true,
  },
});
defineExpose({
  openWeightModal: (row) => {
    openInputModal({ defaultValue: row.sort, payload: row });
  },
});
const {
  openInputModal,
  handleOk,
  visible,
  defaultValue,
  confirmLoading,
  inputModalRules,
} = {
  ...useInputModal({
    async handleOk(sort, payload) {
      const { state, msg } = await props.API({ id: payload.id, sort });
      if (state !== 1) throw msg;
      payload.sort = sort;
    },
    inputModalRules: [
      { required: true, message: "请输入权重", trigger: "blur" },
      {
        pattern: /^[\d]{0,3}$/,
        message: "请输入0-999数字",
        trigger: ["blur", "change"],
      },
    ],
  }),
};
</script>
<style lang="scss" scoped></style>
