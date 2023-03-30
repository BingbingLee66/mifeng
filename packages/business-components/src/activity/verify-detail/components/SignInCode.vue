<template>
  <div class="code">
    <div class="code-title">{{ title }}</div>
    <div class="code-body">
      <img :src="url" class="code-img" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.code {
  width: 306px;
  height: 340px;
  padding-top: 34px;
  background-color: #fff;
  border-radius: 6px;
  .code-title {
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    color: #222;
    line-height: 25px;
    margin-bottom: 16px;
  }
  .code-body {
    width: 166px;
    height: 166px;
    margin: 0 auto;
    .code-img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
