<template>
  <div class="container">
    <el-tabs v-model="clientType" type="border-card">
      <el-tab-pane label="小程序" name="wechat">
        <wechat-tab v-if="clientType === 'wechat'" :client-type="'0'" />
      </el-tab-pane>
      <el-tab-pane label="APP" name="app">
        <app-tab v-if="clientType === 'app'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AppTab from './app/index'
import WechatTab from './wechat/index'
export default {
  components: {
    AppTab,
    WechatTab
  },
  data() {
    return {
      clientType: 'app'
    }
  }
}
</script>
