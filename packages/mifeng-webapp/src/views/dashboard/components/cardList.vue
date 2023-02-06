<template>
  <div class="card-list">
    <div class="swiper-wrapper">
      <div v-for="(card, index) in CardList" :key="index" class="card-box swiper-slide">
        <div class="title">
          <div>{{ card.label }}</div>
          <ATooltip :overlayStyle="{ maxWidth: 800 + 'px' }" placement="topRight">
            <template #title>
              <p style="white-space: pre-wrap; line-height: 25px; font-size: 12px">{{ card.tips }}</p>
            </template>
            <info-circle-outlined />
          </ATooltip>
        </div>
        <div class="value-warp">
          <div class="value-box">
            <div class="value">{{ formatValue(card.value) }}</div>
            <div class="value-unit">{{ card.unit }}</div>
          </div>
          <div v-if="card.label === '关注人数'" class="follow" @click="clickItem">立即查看 ></div>
        </div>
        <div class="card-warp">
          <div class="content">
            <div>{{ card.contentLabelFirst }}</div>
            <div v-if="card.contentValFirst !== null" class="content-value">
              {{ card.contentValFirst }}{{ card.unitFirst }}
            </div>
          </div>
          <div class="content">
            <div>{{ card.contentLabelSecond }}</div>
            <div v-if="card.contentValFirst !== null" class="content-value">
              {{ card.contentValSecond }}{{ card.unitSecond }}
            </div>
          </div>
        </div>
        <div v-if="card.progress === 1" class="progress">
          <div :style="{ left: card.contentValSecond + '%' }" class="progressLabelUp" />
          <a-progress
            :stroke-color="{
              from: '#5878e4',
              to: '#c1aff8'
            }"
            :percent="card.contentValSecond"
            :showInfo="false"
          />
          <div :style="{ left: card.contentValSecond + '%' }" class="progressLabelLow" />
        </div>
        <div v-if="card.progress === 2" class="progress">
          <div :style="{ left: card.value + '%' }" class="progressLabelUp" />
          <AProgress
            :stroke-color="{
              from: '#ffd429',
              to: '#ffaf04'
            }"
            :percent="card.value"
            :showInfo="false"
          />
          <div :style="{ left: card.value + '%' }" class="progressLabelLow" />
        </div>
        <div class="line mt10" />
        <div class="day-collect">
          <div class="bottom-label">{{ card.bottomLabel }}</div>
          <div class="bottom-value">{{ formatValue(card.bottomValue) }}{{ card.unitBottom }}</div>
          <div v-if="card.showTriangle" :class="upOrLow(card.bottomValue) ? 'triangleUp' : 'triangleLow'" />
        </div>
      </div>
    </div>

    <img class="swiper-next" :src="nextIcon" />
    <img class="swiper-prev" :src="preIcon" />
  </div>
</template>

<script>
import { formatValue } from '@/utils/formate-num'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
import { useImgUrl } from '@/hooks/useImgUrl'

export default {
  name: 'CardList',
  props: {
    cardList: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:cardList'],
  setup(props, { emit }) {
    const preIcon = `${useImgUrl('commons/prev-icon.png')}`
    const nextIcon = `${useImgUrl('commons/next-icon.png')}`
    const router = useRouter()
    const CardList = ref(props.cardList)
    let swiper = null
    const upOrLow = value => {
      if (value === '--') {
        emit('update:cardList', CardList)
        return (CardList.value[3].showTriangle = false)
      } else return (value + '').split('')[0] !== '-'
    }
    const clickItem = () => {
      router.push({ path: '/dashboard/follow-list' })
    }

    onMounted(() => {
      swiper = new Swiper('.card-list', {
        slidesPerView: 'auto',
        centeredSlidesBounds: true,
        spaceBetween: 23,
        navigation: {
          nextEl: '.swiper-next',
          prevEl: '.swiper-prev'
        }
      })
    })

    onBeforeUnmount(() => {
      swiper.destroy()
      swiper = null
    })

    return {
      upOrLow,
      props,
      CardList,
      clickItem,
      formatValue,
      preIcon,
      nextIcon
    }
  }
}
</script>

<style scoped lang="scss">
.card-list {
  width: 100%;
  padding: 26px 25px 0 25px;
  position: relative;
  overflow: hidden;

  .card-box {
    padding: 24px 23px 9px;
    border-radius: 2px;
    width: 266px !important;
    height: 188px;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      line-height: 22px;
    }
    .value-warp {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .value-box {
      margin-top: 4px;
      display: flex;
      align-items: baseline;
    }
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
    .triangleLow {
      margin-left: 4px;
      height: 0;
      width: 0;
      border-top: 6px solid #52c41a;
      border-right: 4px solid transparent;
      border-left: 4px solid transparent;
    }
    .triangleUp {
      margin-left: 4px;
      height: 0;
      width: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 6px solid #52c41a;
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
      margin-bottom: 10px;
      .progressLabelUp {
        width: 2px;
        height: 4px;
        border-radius: 100px;
        position: absolute;
        top: 4px;
        background-color: #fdbe04;
      }
      .progressLabelLow {
        width: 2px;
        height: 4px;
        border-radius: 100px;
        top: 18px;
        position: absolute;
        background-color: #fdbe04;
      }
    }
    .line {
      height: 1px;
      background: rgba(255, 255, 255, 0.3);
    }
    .day-collect {
      display: flex;
      align-items: center;
      margin: 9px 0;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;

      .bottom-label {
        color: rgba(255, 255, 255, 0.85);
      }

      .bottom-value {
        color: #ffffff;
        margin-left: 11px;
      }
    }
  }
  .card-box:nth-of-type(1) {
    background-image: url('https://ysh-cdn.kaidicloud.com/prod/bee/dashboard-cardlist-bg-3.png');
    background-repeat: no-repeat;
    background-size: cover;
    .title {
      color: rgba(255, 255, 255, 0.85);
    }
    .card-warp {
      display: flex;
      justify-content: space-between;
    }
    .progressLabelUp {
      background-color: #c1aff8;
    }
    .progressLabelLow {
      background-color: #c1aff8;
    }
    ::v-deep .el-progress-bar__inner {
      border-radius: 1px;
      background-image: linear-gradient(360deg, #5878e4 0%, #c1aff8 100%);
    }
  }
  .card-box:nth-of-type(2) {
    background: linear-gradient(180deg, #6fcffa 0%, #44abf0 100%);
    .title {
      color: rgba(255, 255, 255, 0.85);
    }
  }
  .card-box:nth-of-type(3) {
    background-image: url('https://ysh-cdn.kaidicloud.com/prod/bee/dashboard-cardlist-bg-1.png');
    background-repeat: no-repeat;
    background-size: cover;
    .title {
      color: rgba(0, 0, 0, 0.45);
    }
    .value,
    .bottom-value {
      color: rgba(0, 0, 0, 0.85);
    }
    .value-unit {
      color: rgba(0, 0, 0, 0.65);
    }
    .card-warp {
      color: rgba(0, 0, 0, 0.65);
    }
    .label,
    .bottom-label {
      color: rgba(0, 0, 0, 0.65);
    }
    .content:nth-of-type(2) {
      margin: 5px 0 6px 0;
    }
  }
  .card-box:nth-of-type(4) {
    background-image: url('https://ysh-cdn.kaidicloud.com/prod/bee/dashboard-cardlist-bg-2.png');
    background-repeat: no-repeat;
    background-size: cover;
    .title {
      color: rgba(0, 0, 0, 0.45);
    }
    .value,
    .bottom-value {
      color: rgba(0, 0, 0, 0.85);
    }
    .value-unit {
      color: rgba(0, 0, 0, 0.65);
    }
    .card-warp {
      color: rgba(0, 0, 0, 0.65);
    }
    .label,
    .bottom-label {
      color: rgba(0, 0, 0, 0.65);
    }
    .content:nth-of-type(2) {
      margin: 5px 0 6px 0;
    }
  }
  .card-box:nth-of-type(5) {
    background-image: url('https://ysh-cdn.kaidicloud.com/prod/bee/dashboard-cardlist-bg-4.png');
    background-repeat: no-repeat;
    background-size: cover;
    .title {
      color: rgba(255, 255, 255, 0.85);
    }
    .progress {
      margin: 20px 0 10px 0;
    }
  }

  .swiper-next,
  .swiper-prev {
    width: 41px;
    height: 41px;
    position: absolute;
    top: calc(50% + 13px);
    transform: translate(0, -50%);
    z-index: 9;
    cursor: pointer;
    &.swiper-button-disabled {
      opacity: 0;
    }
  }
  .swiper-prev {
    left: 25px;
  }
  .swiper-next {
    right: 25px;
  }
  .follow {
    color: white;
    margin-bottom: 36px;
    white-space: nowrap;
    cursor: pointer;
  }
}
</style>
