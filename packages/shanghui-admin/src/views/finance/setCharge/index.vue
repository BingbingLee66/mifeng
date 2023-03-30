<template>
  <Panel>
    <a-card title="微信手续费设置">
      <a-form :model="formState" name="basic" autocomplete="off" @finish="update('wechatFeeRatio')">
        <a-row justify="space-between">
          <a-col :span="14">
            <a-form-item
              label="微信手续费"
              name="wechatFeeRatio"
              :rules="[{ required: true, message: '请输入微信手续费', trigger: 'blur' }]"
            >
              <a-input-number
                v-model:value="formState.wechatFeeRatio"
                :min="0"
                :max="1"
                string-mode
                addon-after="%"
                :precision="2"
                :controls="false"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item>
              <a-button type="primary" html-type="submit" v-dbClick>修改</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </Panel>
  <Panel>
    <a-card title="平台服务费设置">
      <a-form :model="formState" name="basic" autocomplete="off" @finish="update('mallFeeRatio')">
        <a-row justify="space-between">
          <a-col :span="14">
            <a-form-item
              label="商品服务费"
              name="mallFeeRatio"
              :rules="[{ required: true, message: '请输入商品服务费', trigger: 'blur' }]"
            >
              <a-input-number
                v-model:value="formState.mallFeeRatio"
                :min="0"
                :max="99"
                string-mode
                addon-after="%"
                :precision="2"
                :controls="false"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item>
              <a-button type="primary" html-type="submit" v-dbClick>修改</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-form :model="formState" name="basic" autocomplete="off" @finish="update('memberFeeRatio')">
        <a-row justify="space-between">
          <a-col :span="14">
            <a-form-item
              label="会员服务费"
              name="memberFeeRatio"
              :rules="[{ required: true, message: '请输入会员服务费', trigger: 'blur' }]"
            >
              <a-input-number
                v-model:value="formState.memberFeeRatio"
                :min="0"
                :max="100"
                :precision="2"
                string-mode
                addon-after="%"
                :controls="false"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item>
              <a-button type="primary" html-type="submit" v-dbClick>修改</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </Panel>
</template>
<script setup>
import { reactive } from 'vue'
import { getSetting, updateSetting } from '@business/common/src/system/setting'
import { Modal } from 'ant-design-vue'
const formState = reactive({
  wechatFeeRatio: 1,
  memberFeeRatio: 1,
  mallFeeRatio: 1
})
const typeMap = new Map([
  ['wechatFeeRatio', '微信手续费'],
  ['mallFeeRatio', '商品服务费'],
  ['memberFeeRatio', '会员服务费']
])
const getData = async key => {
  const {
    data: { value }
  } = await getSetting({ key })
  return value * 100
}
const init = async () => {
  formState.wechatFeeRatio = await getData('wechatFeeRatio')
  formState.memberFeeRatio = await getData('memberFeeRatio')
  formState.mallFeeRatio = await getData('mallFeeRatio')
}
init()
const update = key => {
  const content = `确定修改${typeMap.get(key)}为${formState[key]}%?`
  Modal.confirm({
    title: '提示',
    content,
    async onOk() {
      await updateSetting({ key, value: Math.floor(formState[key] * 100) / 10000 })
      init()
    }
  })
}
</script>
