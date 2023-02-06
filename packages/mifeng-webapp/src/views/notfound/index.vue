<template>
  <div class="notfound_container">
    <div class="desc">
      <p class="p1">页面丢失了</p>
      <p class="p2">你所寻找的页面不存在</p>
      <p class="p2">你可以点击下面按钮返回秘锋</p>
      <a-button
        type="primary"
        size="large"
        @click="
          () => {
            $router.push('/')
          }
        "
        >返回秘锋</a-button
      >
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useImgUrl } from '@/hooks/useImgUrl'
export default defineComponent({
  setup() {
    const bgImg = `url(${useImgUrl('commons/Artwork.png')})`
    return { bgImg }
  }
})
</script>

<style lang="scss" scoped>
.notfound_container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: v-bind(bgImg);
  background-repeat: no-repeat;
  background-attachment: cover;
  background-position: center;
}
.desc {
  position: fixed;
  top: 40%;
  right: 30%;
  .p1 {
    font-size: 64px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #302c48;
    line-height: 90px;
  }
  .p2 {
    font-size: 22px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #62616b;
    line-height: 53px;
  }
}
</style>
