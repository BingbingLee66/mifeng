<template>
  <Panel>
    <div class="block">
      <div class="os-content1">
        发货后自动确认收货时间：发货后<span class="os-hightlight">{{ day }}</span
        >天，自动确认收货
        <a-button style="margin-left: 40px" type="primary" @click="update" v-action="'修改'">修改</a-button>
      </div>
      <div class="os-content2">
        修改后将对新产生的订单立即生效，已产生的订单自动确认收货时间将在以发货时的设置为准。
      </div>
    </div>
  </Panel>
  <InputModel
    v-model:visible="upDayVisiable"
    label="发货后自动确认收货时间"
    title="设置"
    :rules="modelRules.day"
    :defaultValue="day"
    @ok="handleDayOK"
  />
</template>
<script setup>
import InputModel from '@business/components/src/input-modal/index.vue'
import { getSetting, updateSetting } from '@business/common/src/system/setting'
import { onMounted, ref, getCurrentInstance } from 'vue'
const day = ref(7)
const { proxy } = getCurrentInstance()
const fetchData = async () => {
  const params = {
    key: 'autoReceipt'
  }
  const {
    data: { value }
  } = await getSetting(params)
  day.value = value
}
const upDayVisiable = ref(false)
const update = () => {
  upDayVisiable.value = true
}
const handleDayOK = async value => {
  const params = {
    key: 'autoReceipt',
    value
  }
  await updateSetting(params)
  proxy.$message.success('修复权重成功')
  fetchData()
  upDayVisiable.value = false
}
const checkLevel = (rule, value) => {
  if (!/^([12][0-9]|30|[7-9])$/.test(value) && value !== '' && value !== null) {
    return Promise.reject(new Error('只能输入7-30的数字'))
  } else {
    return Promise.resolve()
  }
}
// 权重rule
const modelRules = {
  day: [
    { required: true, message: '日期不能为空', trigger: ['blur', 'change'] },
    {
      validator: checkLevel,
      trigger: ['blur', 'change']
    }
  ]
}
onMounted(() => {
  fetchData()
})
</script>
<style>
.os-content1 {
  margin-left: 30px;
  color: #333;
}
.os-hightlight {
  margin: 0 20px;
  font-weight: 600;
  font-size: 24px;
  color: red;
}
.os-content2 {
  margin-left: 30px;
  margin-top: 30px;
  font-size: 14px;
  color: #666;
}
</style>
