<template>
  <a-modal title="详情" :visible="detailVisible" width="800px" @cancel="onClose" :footer="null" @ok="onConfirm">
    <a-row>
      <a-col :offset="2" :span="8">商/协会名称</a-col>
      <a-col :span="10">{{ adoptDetail.name }}</a-col>
    </a-row>
    <a-row>
      <a-col :offset="2" :span="8">商/协会logo</a-col>
      <a-col :span="10"
        ><img style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover" :src="adoptDetail.systemLogo"
      /></a-col>
    </a-row>
    <a-row>
      <a-col :offset="2" :span="8">联系人姓名</a-col>
      <a-col :span="10">{{ adoptDetail.president }}</a-col>
    </a-row>
    <a-row>
      <a-col :offset="2" :span="8">联系人手机号</a-col>
      <a-col :span="10">{{ adoptDetail.phone }}</a-col>
    </a-row>
    <a-row>
      <a-col :offset="2" :span="8">办公地址</a-col>
      <a-col :span="10">{{ adoptDetail.address }}</a-col>
    </a-row>
    <a-row>
      <a-col :offset="2" :span="8">社会团体法人登记证</a-col>
      <a-col :span="10">
        <a class="license-box" target="_blank" :href="adoptDetail.license"> <img :src="adoptDetail.license" /></a>
      </a-col>
    </a-row>
    <a-row>
      <a-col :offset="2" :span="8">推荐人</a-col>
      <a-col v-if="adoptDetail.referrer" :span="10">{{ adoptDetail.referrer }}</a-col>
      <a-col v-if="!adoptDetail.referrer" :span="10">无</a-col>
    </a-row>
    <a-row>
      <hr />
    </a-row>

    <a-row v-if="adoptDetail.auditStatus != 0">
      <a-col :offset="2" :span="8">审核结果</a-col>
      <a-col :span="10">
        <div v-if="adoptDetail.auditStatus == 1">通过</div>
        <div v-if="adoptDetail.auditStatus == 2">驳回</div>
      </a-col>
    </a-row>
    <a-row v-if="adoptDetail.auditStatus == 2">
      <a-col :offset="2" :span="8">驳回理由</a-col>
      <a-col :span="10">{{ adoptDetail.rejectRemark }}</a-col>
    </a-row>
    <a-row v-if="adoptDetail.auditStatus != 0">
      <a-col :offset="2" :span="8">操作时间</a-col>
      <a-col :span="10">{{ adoptDetail.auditedTs }}</a-col>
    </a-row>
    <a-row v-if="adoptDetail.auditStatus != 0">
      <a-col :offset="2" :span="8">操作人</a-col>
      <a-col :span="10">{{ adoptDetail.auditor }}</a-col>
    </a-row>
    <br />
    <div class="button"><a-button @click="onConfirm">确认</a-button></div>
  </a-modal>
</template>

<script setup>
defineProps({
  detailVisible: {
    default: false,
    type: Boolean
  },
  adoptDetail: {
    default: () => {},
    type: Object
  }
})
const emit = defineEmits(['closeDetailModal'])
const onConfirm = () => {
  emit('closeDetailModal')
}
const onClose = () => {
  emit('closeDetailModal')
}
</script>

<style scoped>
.button {
  width: 100%;
  display: flex;
  justify-content: center;
}
.license-box {
  width: 180px;
  height: 100px;
  border-color: #409eff;
}
.license-box img {
  width: 100%;
  height: 100%;
}
</style>
