<template>
  <div class="wrap">
    <el-tabs :value="activeName" @tab-click="onTabClick">
      <el-tab-pane v-for="item in tabList" :key="item.n" :label="item.l" :name="item.n" />
    </el-tabs>
    <div class="board flex-x">
      <div v-for="(item,index) in defineList" :key="index" :style="{'border-right':(index+1)%3===0 ? '' :'1px solid #E8E8E8FF'}" class="board-item">
        <div class="title">{{ item.title }}</div>
        <div>{{ item.val }}</div>
      </div>
    </div>
    <tableComponent />
    <div ref="chart" style="width: 100%; height: 100%" />
  </div>
</template>

<script>
import * as eCharts from 'echarts'
export default {
  components: { tableComponent: () => import('./components/tableComponent.vue'), },
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

      // tab切换值
      activeName: 'Platform',
      // 图表实例
      chart: null
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
      console.log('name', name)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 0 20px;
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
