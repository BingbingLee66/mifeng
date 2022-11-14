<template>
  <Panel class="org-count-wrap">
    <div class="panel-header">
      <div class="panel-title-box">
        <div class="panel-title">快捷工具栏</div>
      </div>
    </div>
  </Panel>
</template>

<script>
import Panel from '../../../components/panel'
export default {
  name: 'ToolBar',
  components: {
    Panel
  }
}
</script>

<style lang="scss" scoped>
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
}
.panel-title-box {
  padding: 0 20px;
  display: flex;
  align-items: center;
  //   &:after {
  //     content: '';
  //     position: absolute;
  //     left: -20px;
  //     right: -20px;
  //     bottom: 0;
  //     height: 1px;
  //     background: #e8e8e8;
  //   }
}
</style>
