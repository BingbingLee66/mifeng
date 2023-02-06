<template>
  <div class="panel-wrap">
    <div class="panel" :class="{ 'panel-padding': hasPadding }"><slot /></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Panel',
  props: {
    hasPadding: {
      type: Boolean,
      default: true
    }
  }
})
</script>

<style lang="scss" scoped>
.panel-wrap {
  padding: 20px 24px 0;
  box-sizing: border-box;
}
.panel {
  height: 100%;
  width: 100%;
  background: #fff;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  /*overflow-x: hidden;*/
  box-sizing: border-box;

  &.panel-padding {
    padding: 20px;
  }

  .panel-tabs {
    margin: -20px -20px 0;
  }
}
</style>
