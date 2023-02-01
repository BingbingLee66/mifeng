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
          <div>{{ item.val }}</div>
        </div>
      </div>

    </div>
    <div class="chart">
      <div class="screen-date">
        <span>日期：  </span>
        <span v-for="item in dateList" :key="item" :class="['date-item',item===activeDay ? 'active-date' :'']">{{ item }}天</span>
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
        <div v-for="item in statisticsList" :key="item.id" :class="[item.id===indicator ? 'indicator-active':'','indicator-item']" @click="checkIndicator(item.id)">{{ item.title }}</div>
      </div>
      <div ref="chart" style="width: 100%; height: 100%" />
    </div>

    <tableComponent v-if="activeName==='quest'" />
    <statisticDialog :dialog-visible.sync="showStatisticDialog" />
  </div>
</template>

<script>
import * as eCharts from 'echarts'
import { statisticsList } from './constant'
export default {
  components: { tableComponent: () => import('./components/tableComponent.vue'),
    statisticDialog: () => import('./components/statisticDialog.vue'), },
  props: {},
  data() {
    return {
      // 数据定义列表
      defineList: [
        { title: '累计发布问卷', name: 'questionnaireSum', val: 12 },
        { title: '累计回收答卷', name: 'recycleAnswerSum', val: 12 },
        { title: '覆盖人数', name: 'overrideUserSum', val: 12 },
        { title: '覆盖人数', name: 'overrideUserSum2', val: 12 }
      ],
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
      indicator: statisticsList[0].id,
      dateValue: []
    }
  },

  created() {},
  mounted() { this.init() },
  methods: {
    init() {
      // 2.初始化
      this.chart = eCharts.init(this.$refs.chart)
      // 3.配置数据
      const option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        // 配置项
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
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
</style>
