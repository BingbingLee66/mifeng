<template>
  <Panel>
    <div id="dashboard" class="dashboard-container" style="background-color: #ffffff">
      <div class="dashboard-container-view">
        <div class="dashboard-text">欢迎光临:{{ name }}</div>
        <img class="dashboard-img" :src="`${BASE_CDN_URL2}/prod/ysh/home.png`" alt="" />
      </div>
    </div>
  </Panel>
</template>
<script>
import { useStore } from 'vuex'
import { defineComponent, computed } from 'vue'
import { BASE_CDN_URL2 } from '@business/common/src/config/index'
export default defineComponent({
  setup() {
    const store = useStore()
    const name = computed(() => store.state.user.name)
    return { name, BASE_CDN_URL2 }
  }
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  min-height: calc(100vh - 250px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.dashboard-container-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  .dashboard-text {
    font-size: 24px;
    color: #222222;
    margin-bottom: 39px;
  }
  .dashboard-img {
    width: 524px;
    height: 288px;
  }
}
</style>
