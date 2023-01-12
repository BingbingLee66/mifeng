<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="链接" name="link"><Link /></el-tab-pane>
      <el-tab-pane label="云会甄选小程序" name="miniprogram"><Miniprogram /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Link from './link'
import Miniprogram from './miniprogram'

export default {
  name: 'LinkModal',
  components: {
    Link,
    Miniprogram,
  },
  data() {
    return {
      activeName: 'link',

    }
  }
}
</script>

<style scoped lang="scss">

</style>
