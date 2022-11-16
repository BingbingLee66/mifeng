<template>
  <div class="card-list">
    <div v-for="(card, index) in cardList" :key="index" class="card-box">
      <div class="title">
        <div>{{ card.label }}</div>
        <el-tooltip effect="dark" placement="top">
          <p slot="content" style="white-space: pre-wrap; line-height: 25px">{{ card.tips }}</p>
          <div class="el-icon-warning-outline" />
        </el-tooltip>
      </div>
      <div class="value-box">
        <div class="value">{{ formatValue(card.value) }}</div>
        <div class="value-unit">{{ card.unit }}</div>
      </div>
      <div class="card-warp">
        <div class="content">
          <div>{{ card.contentLabelFirst }}</div>
          <div class="content-value">{{ card.contentValFirst }}{{ card.unitFirst }}</div>
        </div>
        <div class="content">
          <div>{{ card.contentLabelSecond }}</div>
          <div class="content-value">{{ card.contentValSecond }}{{ card.unitSecond }}</div>
        </div>
      </div>
      <div v-if="card.progress === 1" class="progress" progress>
        <div :style="{ left: card.contentValSecond + '%' }" class="progressLabelUp" />
        <el-progress stroke-width="8px" :show-text="false" :percentage="card.contentValSecond" />
        <div :style="{ left: card.contentValSecond + '%' }" class="progressLabelLow" />
      </div>
      <div v-if="card.progress === 2" class="progress" progress>
        <div :style="{ left: card.contentValSecond + '%' }" class="progressLabelUp" />
        <el-progress stroke-width="8px" :show-text="false" :percentage="card.value" />
        <div :style="{ left: card.contentValSecond + '%' }" class="progressLabelLow" />
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
  padding: 26px 25px 0 25px;
  display: grid;
  grid-template-columns: repeat(4, 24%);
  grid-gap: 23px;
  grid-template-rows: 188px;

  .card-box {
    padding: 24px 23px 9px;
    // height: 188px;
    // width: calc(95% / 4);
    border-radius: 2px;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      line-height: 22px;
    }
    .value-box {
      margin-top: 4px;
      display: flex;
      align-items: baseline;
      .value {
        font-size: 30px;
        color: #ffffff;
        line-height: 38px;
      }
      .value-unit {
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.85);
        line-height: 22px;
      }
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
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.85);
      line-height: 22px;
      margin: 5px 0;
      .content {
        display: flex;
        .content-value {
          margin-left: 4px;
        }
      }
    }
    .progress {
      position: relative;
      margin: 14px 0 13px 0;
      .progressLabelUp {
        width: 2px;
        height: 4px;
        border-radius: 100px;
        position: absolute;
        top: -5px;
        background-color: #fdbe04;
      }
      .progressLabelLow {
        width: 2px;
        height: 4px;
        border-radius: 100px;
        top: 9px;
        position: absolute;
        background-color: #fdbe04;
      }
      ::v-deep .el-progress-bar__inner {
        border-radius: 1px;
        background-image: linear-gradient(180deg, #ffd429 0%, #ffaf04 100%);
      }
      ::v-deep .el-progress-bar__outer {
        border-radius: 1px;
      }
    }
    .line {
      height: 1px;
      background: rgba(255, 255, 255, 0.3);
    }
    .day-collect {
      display: flex;
      align-content: baseline;
      margin: 9px 0;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;

      .label {
        color: rgba(255, 255, 255, 0.85);
      }

      .value {
        color: #ffffff;
        margin-left: 11px;
      }
    }
  }
  .card-box:nth-of-type(1) {
    box-shadow: 0px 1px 10px 0px rgba(229, 34, 34, 0.71);
    background: linear-gradient(180deg, #ff9479 0%, #f46572 100%);
    .title {
      color: rgba(255, 255, 255, 0.85);
    }
    .card-warp {
      display: flex;
      justify-content: space-between;
    }
  }
  .card-box:nth-of-type(2) {
    background: linear-gradient(180deg, #ffd15f 0%, #ffb12a 100%);
    .title {
      color: rgba(0, 0, 0, 0.45);
    }
    .value {
      color: rgba(0, 0, 0, 0.85);
    }
    .value-unit {
      color: rgba(0, 0, 0, 0.65);
    }
    .card-warp {
      color: rgba(0, 0, 0, 0.65);
    }
    .label {
      color: rgba(0, 0, 0, 0.65);
    }
    .content:nth-of-type(2) {
      margin: 5px 0 6px 0;
    }
  }
  .card-box:nth-of-type(3) {
    background: linear-gradient(180deg, #efefef 0%, #cacaca 100%);
    .title {
      color: rgba(0, 0, 0, 0.45);
    }
    .value {
      color: rgba(0, 0, 0, 0.85);
    }
    .value-unit {
      color: rgba(0, 0, 0, 0.65);
    }
    .card-warp {
      color: rgba(0, 0, 0, 0.65);
    }
    .label {
      color: rgba(0, 0, 0, 0.65);
    }
    .content:nth-of-type(2) {
      margin: 5px 0 6px 0;
    }
  }
  .card-box:nth-of-type(4) {
    background: linear-gradient(360deg, #5878e4 0%, #c1aff8 100%);
    .title {
      color: rgba(255, 255, 255, 0.85);
    }
    .progress {
      margin: 26px 0 23px 0;
    }
  }
}
</style>
