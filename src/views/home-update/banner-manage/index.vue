<template>
  <div class="container">
    <el-tabs v-model="clientType" type="border-card">
      <el-tab-pane label="小程序" name="wechat">
        <we-chat-tab v-if="clientType === 'wechat'" client-type="0" />
      </el-tab-pane>
      <el-tab-pane label="APP" name="app">
        <app-tab v-if="clientType === 'app'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import WeChatTab from './wechat/TabContent/index'
import AppTab from './app/TabContent/index.vue'
export default {
  components: {
    WeChatTab,
    AppTab
  },
  data() {
    return {
      clientType: 'wechat'
    }
  }
}
</script>
