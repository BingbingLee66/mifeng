<template>
  <div class="wrap">
    <el-tabs :value="activeName" @tab-click="onTabClick">
      <el-tab-pane v-for="item in tabList" :key="item.n" :label="item.l" :name="item.n" />
    </el-tabs>
    <div v-if="activeName==='statistic'">
      <el-button type="primary" class="statistic-btn" @click="showStatisticDialog=true">数据定义</el-button>
      <div class="board flex-x">
        <div v-for="(item,index) in defineList" :key="index" :style="{'border-right':(index+1)%3===0 ? '' :'1px solid #E8E8E8FF'}" class="board-item">
          <div class="title">{{ item.title }}</div>
          <div>{{ num(item.val) }}</div>
        </div>
      </div>

    </div>
    <div class="chart" :hidden="activeName==='quest'">
      <div class="screen-date">
        <span>日期：  </span>
        <span v-for="item in dateList" :key="item" :class="['date-item',item===activeDay && dateValue.length < 1 ? 'active-date' :'']" @click="clickDateItem(item)">{{ item }}天</span>
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      <div class="indicator flex-x">
        <span>指标筛选：</span>
        <div v-for="item in statisticsList" :key="item.id">
          <div v-if="item.id!==7 &&item.id!=8" :class="[item.id===indicator ? 'indicator-active':'','indicator-item']" @click="checkIndicator(item.id)">{{ item.id===4 ?'覆盖人次':item.title }}</div>
        </div>

      </div>
      <div ref="chart" style="width: 1000px; height: 400px" />
    </div>

    <tableComponent v-if="activeName==='quest'" />
    <statisticDialog :dialog-visible.sync="showStatisticDialog" />
  </div>
</template>

<script>
import * as eCharts from 'echarts'
import { statisticsList } from './constant'
import { getOverviewData, getTimelineOverviewData } from '@/api/statistics/questSurvey'
import dayjs from 'dayjs'
export default {
  components: { tableComponent: () => import('./components/tableComponent.vue'),
    statisticDialog: () => import('./components/statisticDialog.vue'), },
  props: {},
  data() {
    return {
      // 数据定义列表
      defineList: {
        questionnaireSum: { title: '累计发布问卷', name: 'questionnaireSum', val: 0 },
        platformQuestionnaireSum: { title: '平台发布问卷', name: 'platformQuestionnaireSum', val: 0 },
        chamberQuestionnaireSum: { title: '商协会发布问卷', name: 'questionnaireSum', val: 0 },
        recycleAnswerSum: { title: '累计回收答卷', name: 'recycleAnswerSum', val: 0 },
        platformRecycleAnswerSum: { title: '平台回收答卷', name: 'platformRecycleAnswerSum', val: 0 },
        chamberRecycleAnswerSum: { title: '商协会回收答卷', name: 'chamberRecycleAnswerSum', val: 0 },
        overrideUserSum: { title: '覆盖人数', name: 'overrideUserSum', val: 0 },
        covererAssociationSum: { title: '覆盖商协会', name: 'covererAssociationSum', val: 0 },

      },
      tabList: [
        { l: '总览', n: 'statistic' },
        { l: '问卷', n: 'quest' }
      ],
      dateList: [7, 14, 30],
      activeDay: 7,
      // tab切换值
      activeName: 'statistic',
      // 图表实例
      chart: null,
      // 显示数据定义对话框
      showStatisticDialog: false,
      statisticsList,
      // 当前活跃的筛选项
      indicator: 1,
      // 自定义时间
      dateValue: [],
      xData: [],
      yData: []
    }
  },
  computed: {
    num() {
      return function (val) {
        return val > 9999 ? (val / 10000).toFixed(2) + '万' : val
      }
    }
  },
  watch: {
    indicator() {
      this.init()
    },
    dateValue() {
      this.getTimelineOverview()
    }
  },
  created() { this.getOverviewDataFunc() },
  mounted() { this.getTimelineOverview() },
  methods: {
    init() {
      const index = this.yData.findIndex(i => i.key === this.indicator)
      // 2.初始化
      this.chart = eCharts.init(this.$refs.chart)

      // 3.配置数据
      const option = {
        title: {
          text: ''
        },
        tooltip: {},
        // legend: {
        //   data: ['销量'],
        //   orient: 'horizontal',

        //   x: 'right',
        //   y: ' center',
        //   padding: [0, 100, 0, 0]
        // },
        xAxis: {
          data: this.xData,
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
            name: '销量',
            data: index > -1 ? this.yData[index].data : [],
            // data: [],
            type: 'line',
            smooth: true,
            lineStyle: {
              // 设置线条的style等
              normal: {
                color: '#5C7AE5FF', // 折线线条颜色:红色
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
      this.chart.setOption(option)
    },
    // tab-切换
    onTabClick({ name }) {
      this.activeName = name
    },
    // 指标筛选改变
    checkIndicator(id) {
      this.indicator = id
    },
    // 拉取总览数据
    async getOverviewDataFunc() {
      const res = await getOverviewData()
      for (const i in this.defineList) {
        this.defineList[i].val = res.data?.[i] || 0
      }
    },
    // 日期帅选改下
    clickDateItem(item) {
      this.activeDay = item
      this.dateValue = []
    },
    // 拉取时间轴数据
    async getTimelineOverview() {
      if (this.dateValue === null) {
        this.dateValue = []
      }
      // 有自定义时间就按自定义，没有就取activeDay
      const startTime = this.dateValue.length > 0 ? dayjs(this.dateValue[0]).format('YYYY-MM-DD') : dayjs().subtract(this.activeDay, 'day').format('YYYY-MM-DD')
      const endTime = this.dateValue.length > 0 ? dayjs(this.dateValue[1]).format('YYYY-MM-DD') : dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      const {
        data: { xaxis, series }
      } = await getTimelineOverviewData({ startTime, endTime })
      this.xData = xaxis
      this.yData = series
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 0 20px;
  .statistic-btn{
    color: #000;
    margin-bottom: 24px;
  }
}
.indicator{
  font-size: 14px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: rgba(0,0,0,0.65);
margin-bottom: 40px;
padding: 0px 0px 0px 20px;
.indicator-item{
  margin-right: 32px;
  padding: 1px 8px;

}
.indicator-item:hover{
  cursor:pointer;
}
.indicator-active{
  background: #F4C820;
border-radius: 2px;
}
}
.indicator span:first-child{
  margin-right: 16px;
}
.screen-date{
  font-size: 14px;
font-family: PingFangSC-Medium, PingFang SC;
font-weight: 500;
color: rgba(0,0,0,0.85);
margin-bottom: 24px;
padding: 20px 0px 0px 20px;
.date-item{
  font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: rgba(0,0,0,0.65);
margin-right: 42px;
}
.date-item:hover{
  cursor: pointer;
}
.active-date{
  font-weight: 500;
color: #F4C820;
}
}
.board {
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  background: #ffffff;
  border-radius: 2px;
  flex-wrap: wrap;
  .board-item {
    padding: 24px 0px;
    width: 33%;
    text-align: center;
    border-bottom: 1px solid #E8E8E8FF;
    .title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
}
.chart{
  background: #fff;
  margin-top: 30px;
}
</style>
