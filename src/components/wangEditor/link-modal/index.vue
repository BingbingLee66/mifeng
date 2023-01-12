<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="链接" name="link">
        <Link />
      </el-tab-pane>
      <el-tab-pane label="云会甄选小程序" name="miniprogram">
        <Miniprogram @onClick="onClick" />
      </el-tab-pane>
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
  },
  methods: {
    onClick(data) {
      this.$emit('click', { ...data, linkType: this.activeName })
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">

</style>
