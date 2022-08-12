<template>
  <div class="card-box-wrap">
    <div v-for="card in cardList" :key="card.label" class="card-box">
      <div class="title">{{ card.label }}</div>
      <div class="value">
        {{ card.value }}
        <span v-if="card.unit" class="unit">{{ card.unit }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardBox',
  props: {
    cardList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped lang="scss">
.card-box-wrap {
  display: flex;
  align-items: center;

  .card-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    height: 160px;
    border: 1px solid #6e6e6e;
    margin-right: 20px;

    .title {
      font-size: 30px;
    }

    .value {
      font-size: 40px;
      font-weight: bold;
    }

  }
}
</style>
