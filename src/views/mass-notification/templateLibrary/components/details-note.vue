<template>
  <div>
    <!-- 短信 -->
    <div class="Present-img">
      <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-note.png" class="pic">
      <div class="Present-note" v-html="demonstrate" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    demonstrate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style scoped lang="scss">
.Present-img {
  width: 255px;
  height: 300px;
  margin: 0 auto;
  position: relative;
  .Present-note {
    position: absolute;
    top: 93px;
    left: 25px;
    width: 80%;
    background: #e9e9ea;
    color: #222222;
    padding: 10px;
    border-radius: 12px;
  }
}
img {
  width: 100%;
  height: 100%;
}
</style>
