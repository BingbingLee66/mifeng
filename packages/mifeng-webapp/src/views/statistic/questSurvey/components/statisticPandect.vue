<template>
  <div>
    <a-button type="primary" class="statistic-btn" @click="showStatisticDialog = true">数据定义</a-button>
    <div class="board flex-x">
      <div
        v-for="(value, key, index) in defineList"
        :key="index"
        :style="{ 'border-right': (index + 1) % 3 === 0 ? '' : '1px solid #E8E8E8FF' }"
        class="board-item"
      >
        <div class="title">{{ value.title }}</div>
        <div>{{ num(value.val) }}</div>
      </div>
    </div>

    <div style="background: #fff; width: 100%; height: 100%">
      <div class="indicator">
        <div class="screen-date">
          <span>日期： </span>
          <span
            @click="clickDateItem(item)"
            v-for="item in dateList"
            :key="item"
            :class="['date-item', item === activeDay && dateValue.length < 1 ? 'active-date' : '']"
            >{{ item }}天</span
          >
          <a-range-picker
            v-model:value="dateValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
        <div class="chart flex-x">
          指标筛选：
          <div v-for="item in indicatorList" :key="item.id">
            <div
              v-if="item.id !== 3"
              :class="[item.id === indicator ? 'indicator-active' : '', 'indicator-item', 'flex-y-center']"
              @click="checkIndicator(item.id)"
            >
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
      <div ref="chart" id="chart" :style="{ width: '1000px', height: '400px' }" />
    </div>
    <statisticDialog v-model:dialogVisible="showStatisticDialog"></statisticDialog>
  </div>
</template>

<script setup>
import * as eCharts from 'echarts'
import { ref, onMounted, watch, computed } from 'vue'
import statisticDialog from './statisticDialog.vue'
import { statisticsList, indicatorList } from '../constant'
import dayjs from 'dayjs'
import { getOverviewData, getTimelineOverviewData } from '@/api/statistic/questSurvey'
// 数据定义列表
const defineList = ref()
defineList.value = {
  questionnaireSum: { id: 1, title: '累计发布问卷', name: 'questionnaireSum', val: 0 },
  recycleAnswerSum: { id: 2, title: '累计回收答卷', name: 'recycleAnswerSum', val: 0 },
  overrideUserSum: { id: 3, title: '覆盖人数', name: 'overrideUserSum', val: 0 }
}
const dateList = [7, 14, 30]
const showStatisticDialog = ref(false)
// 日期活跃tab
const activeDay = ref(7)
// 筛选指标活跃tab
const indicator = ref(statisticsList[0].id)
// 自定义时间
const dateValue = ref([])
const xData = ref()
const yData = ref()
const chart = ref()

watch(indicator, () => {
  init()
})
watch(dateValue, () => {
  getTimelineOverview()
})
const num = computed(() => val => {
  return val > 9999 ? (val / 10000).toFixed(2) + '万' : val
})
// 指标筛选改变
const checkIndicator = id => {
  indicator.value = id
}
// 日期帅选改下
const clickDateItem = item => {
  activeDay.value = item
  dateValue.value = []
}
// 拉取总览数据
const getOverviewDataFunc = async () => {
  const res = await getOverviewData()
  for (const i in defineList.value) {
    defineList.value[i].val = res.data[i] ?? 0
  }
}
// 拉取时间轴数据
const getTimelineOverview = async () => {
  if (dateValue.value === null) {
    dateValue.value = []
  }
  // 有自定义时间就按自定义，没有就取activeDay
  const startTime =
    dateValue.value.length > 0
      ? dateValue.value[0].format('YYYY-MM-DD')
      : dayjs().subtract(activeDay.value, 'day').format('YYYY-MM-DD')

  const endTime =
    dateValue.value.length > 0
      ? dateValue.value[1].format('YYYY-MM-DD')
      : dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  const {
    data: { xaxis, series }
  } = await getTimelineOverviewData({ startTime, endTime })
  xData.value = xaxis
  yData.value = series
  init()
}
const init = () => {
  // 2.初始化
  chart.value = eCharts.init(document.getElementById('chart'))
  // 3.配置数据
  const option = {
    title: {
      text: ''
    },
    tooltip: {},
    legend: {
      data: ['人数'],
      orient: 'horizontal',
      x: 'right',
      y: ' center',
      padding: [0, 100, 0, 0]
    },
    xAxis: {
      data: xData.value,
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#3333331A'
        }
      },
      axisLabel: {
        fontSize: 11,
        textStyle: {
          color: '#666666FF' // X轴文字颜色
        },
        margin: 12
      }
    },
    yAxis: {},
    // 配置项
    series: [
      {
        name: '人数',
        data: yData.value[yData.value.findIndex(i => i.key === indicator.value)].data ?? [],
        type: 'line',
        smooth: true,
        lineStyle: {
          // 设置线条的style等
          normal: {
            color: '#5C7AE5FF',
            width: 0.5
          }
        },
        // 区域填充样式。设置后显示成区域面积图
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(234,239,255,1.000)'
              },
              {
                offset: 1,
                color: '#FFFFFF'
              }
            ],
            global: false
          }
        }
      }
    ]
  }

  // 4.传入数据
  chart.value.setOption(option)
  window.onresize = function () {
    // 自适应大小
    chart.value.resize()
  }
}
getOverviewDataFunc()
onMounted(() => {
  // init()
  getTimelineOverview()
})
</script>

<style lang="scss" scoped>
.statistic-btn {
  color: #000;
  margin: 24px 0px;
}
.board {
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  background: #ffffff;
  border-radius: 2px;
  flex-wrap: wrap;
  padding: 20px 0px;
  margin-bottom: 24px;
  .board-item {
    width: 33%;
    text-align: center;
    .title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
}

.screen-date {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 24px;
  .date-item {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    margin-right: 42px;
  }
  .date-item:hover {
    cursor: pointer;
  }
  .active-date {
    font-weight: 500;
    color: #f4c820;
  }
}
.indicator {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  padding: 20px 40px 0px 30px;
  .indicator-item {
    margin-right: 32px;
    padding: 1px 8px;
  }
  .indicator-item:hover {
    cursor: pointer;
  }
  .indicator-active {
    color: #f4c820;
    background: #f4c820;
    color: rgba(0, 0, 0, 0.65);
    border-radius: 2px;
  }
  .line {
    width: 48px;
    height: 2px;
    background: #f4c820;
    margin-top: 4px;
  }
}
.indicator span:first-child {
  margin-right: 16px;
}
</style>
