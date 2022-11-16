<template>
  <div class="card-list">
    <div v-for="card in cardList" :key="card.label" class="card-box">
      <div class="title">
        <div>{{ card.label }}</div>
        <el-tooltip effect="dark" placement="top">
          <p slot="content" style="white-space: pre-wrap; line-height: 25px">{{ card.tips }}</p>
          <div class="el-icon-warning-outline" />
        </el-tooltip>
      </div>
      <div class="value">
        {{ formatValue(card.value) }}
        <span>{{ card.unit }}</span>
      </div>
      <div class="card-warp">
        <div class="content">
          <div>{{ card.contentLabelFirst }}</div>
          <div>{{ card.contentValFirst }}{{ card.unitFirst }}</div>
        </div>
        <div class="content">
          <div>{{ card.contentLabelSecond }}</div>
          <div>{{ card.contentValSecond }}{{ card.unitSecond }}</div>
        </div>
        <el-progress v-if="card.progress" :percentage="card.contentValSecond" :stroke-width="13" />
      </div>
      <div class="line mt10" />
      <div class="day-collect">
        <div class="label">{{ card.bottomLabel }}</div>
        <div class="value">{{ formatValue(card.bottomValue) }}{{ card.unitBottom }}</div>
        <div v-if="card.showTriangle" :class="upOrLow(card.bottomValue) ? 'triangleLow' : 'triangleUp'" />
      </div>
    </div>
  </div>
</template>

<script>
import { formatValue } from '@/utils/formate-num'

export default {
  name: 'CardList',
  props: {
    cardList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formatValue
    }
  },
  methods: {
    upOrLow(value) {
      if (value === '--') {
        return (this.cardList[3].showTriangle = false)
      } else {
        return Number(value) > 0
      }
    }
  }
}
</script>

<style scoped lang="scss">
.card-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap; /* 换行 */
  // margin-left: 20px;
  padding: 20px 20px 0 20px;

  .card-box {
    padding: 27px 32px 13px;
    // flex: 1;
    margin: 5px 0.5% 5px 0.5%;
    width: calc(96% / 4);
    background: #fff;
    border-radius: 4px;

    &:last-child {
      margin-right: 0;
    }

    .title {
      display: flex;
      justify-content: space-between;
      font-size: 19px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 29px;
    }

    .value {
      margin-top: 5px;
      font-size: 40px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 51px;
    }
    .triangleLow {
      height: 0;
      width: 0;
      border-top: 6px solid skyblue;
      border-right: 4px solid transparent;
      border-left: 4px solid transparent;
    }
    .triangleUp {
      height: 0;
      width: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 8px solid skyblue;
    }
    .card-warp {
      color: #929292;
      margin: 5px 0;
      height: 75px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .content {
        width: 70%;
        display: flex;
        justify-content: space-between;
      }
    }

    .line {
      height: 1px;
      background: #e8e8e8;
    }

    .day-collect {
      display: flex;
      align-items: center;
      font-size: 19px;
      margin-top: 12px;
      line-height: 29px;

      .label {
        color: rgba(0, 0, 0, 0.65);
      }

      .value {
        color: rgba(0, 0, 0, 0.85);
        font-size: inherit;
        margin-left: 11px;
        line-height: inherit;
        margin-top: 0;
      }
    }
  }
}
</style>
