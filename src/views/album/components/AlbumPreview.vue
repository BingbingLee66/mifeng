<template>
  <div v-show="visible" class="overlay" @click="$emit('change', false)">
    <div class="preview" @click.stop>
      <div class="title">相册详情</div>
    </div>
  </div>
</template>

<script>

export default {
  components: {},
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() { return {} },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  z-index: 9;

  .preview {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 400px;
    height: 798px;
    background: url('../../../assets/img/phone.png') no-repeat center / contain;
  }

  .title {
    position: absolute;
    width: 100px;
    height: 30px;
    top: 75px;
    left: 50%;
    transform: translate(-50%,0);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    background-color: #fff;
  }
}

</style>
