<template>
  <div class="form-cell">
    <span class="cell-title">
      <span v-if="required" style="color: red;">*</span>
      <span class="title">{{ lable }}</span>
    </span>
    <slot />
  </div>
</template>

<script>

export default {
  props: {
    lable: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
.form-cell {
  margin-bottom: 20px;

  .cell-title {

    .title {
      font-weight: bold;
      padding-right: 20px;
    }
  }
}
</style>
