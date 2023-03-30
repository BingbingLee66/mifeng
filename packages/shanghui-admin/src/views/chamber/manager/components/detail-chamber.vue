<template>
  <a-modal title="认领入驻" :visible="props.detailVisible" width="600px" @cancel="close" :footer="null">
    <a-row>
      <a-col :offset="2" :span="6">商/协会名称：</a-col>
      <a-col :span="10">{{ detailObj.name }}</a-col>
    </a-row>
    <a-row>
      <a-col :offset="2" :span="6">商/协会logo：</a-col>
      <a-col :span="10"
        ><img
          :src="
            detailObj.systemLogo
              ? detailObj.systemLogo
              : 'https://ysh-sh.oss-cn-shanghai.aliyuncs.com/prod/png/default_avatar.png'
          "
          alt=""
          style="width: 88px; height: 88px; border-radius: 50%"
      /></a-col>
    </a-row>
    <a-row>
      <a-col :offset="2" :span="6">联系人姓名：</a-col>
      <a-col :span="10">{{ detailObj.president }}</a-col>
    </a-row>
    <a-row>
      <a-col :offset="2" :span="6">联系人手机号：</a-col>
      <a-col :span="10">{{ detailObj.phone }}</a-col>
    </a-row>
    <a-row>
      <a-col :offset="2" :span="6">地区：</a-col>
      <a-col :span="10">{{ detailObj.province + detailObj.city }}</a-col>
    </a-row>
    <a-row>
      <a-col :offset="2" :span="6">办公地址：</a-col>
      <a-col :span="10">{{ detailObj.address }}</a-col>
    </a-row>
    <a-row>
      <a-col :offset="2" :span="6">社会团体法人登记证：</a-col>
      <a-col :span="10">
        <div class="license-box">
          <a-image :src="detailObj.license" :width="220" @click="enlarge(detailObj.license)" />
        </div>
      </a-col>
    </a-row>
    <a-row>
      <a-col :offset="2" :span="6">推荐人：</a-col>
      <a-col v-if="detailObj.referrer" :span="10">{{ detailObj.referrer }}</a-col>
      <a-col v-if="!detailObj.referrer" :span="10">无</a-col>
    </a-row>
    <a-row>
      <hr />
    </a-row>
    <a-row>
      <a-col :offset="2" :span="6">创建时间：</a-col>
      <a-col :span="10">{{ detailObj.createdTs }}</a-col>
    </a-row>
    <a-row>
      <a-col :offset="2" :span="6">操作人：</a-col>
      <a-col :span="10">{{ detailObj.operator }}</a-col>
    </a-row>
    <a-row>
      <a-col :offset="20" :span="2">
        <a-button v-dbClick type="primary" @click="close">确定</a-button>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { getDetail } from '@/api/chamber/manager'

import { watch, reactive } from 'vue'
const props = defineProps({
  detailVisible: {
    type: Boolean,
    default: true
  },
  chamberId: {
    type: Number,
    default: NaN
  }
})
const detailObj = reactive({})
watch(
  () => props.chamberId,
  async newValue => {
    const hide = message.loading('加载中', 0)
    const { data } = await getDetail({ chamberId: newValue })
    await hide()
    Object.assign(detailObj, data.dtl)
  }
)
const emit = defineEmits(['closeDetail'])
const close = () => {
  emit('closeDetail')
}
</script>

<style scoped>
.license-box {
  width: 220px;
}
</style>
