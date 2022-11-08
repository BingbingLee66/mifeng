<template>
  <div class="statistics-wrap">
    <div class="title">{{ investmentName }}</div>
    <CardBox :card-list="cardList" style="cursor: pointer;" @click.native="goToDetail" />
    <div class="block">
      <span style="color: #bbb;margin-right: 20px;">时间</span>
      <el-radio-group v-model="query.days" size="mini" @change="initDatePicker">
        <el-radio-button :label="7">7天</el-radio-button>
        <el-radio-button :label="14">14天</el-radio-button>
        <el-radio-button :label="30">30天</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-model="query.date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        type="daterange"
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="mini"
        :picker-options="pickerOptions"
        @change="fetchTrendChart"
      />
      <el-radio-group v-model="query.type" size="mini" @change="typeDatePicker">
        <el-radio-button :label="1">日</el-radio-button>
        <el-radio-button :label="2">周</el-radio-button>
        <el-radio-button :label="3">月</el-radio-button>
      </el-radio-group>
    </div>
    <div style="display:flex;width:80vw;height:30vh">
      <v-chart :option="chartOpt" />
    </div>

  </div>
</template>

<script>
// import 'echarts/lib/chart/line'
import { use } from 'echarts/core'
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent
])
import CardBox from '@/views/zhaoshang/information-publish/components/card-box'
import { getDataStatistics, getReadTrendChart } from '@/api/zhaoshang/statistics/activity-statistics'
export default {
  name: 'Statistics',
  components: { CardBox },
  data() {
    return {
      cardList: [
        { label: '曝光量', value: 0 },
        { label: '当天阅读量', value: 0 },
        { label: '累计阅读量', value: 0 },
      ],
      query: {
        days: 7,
        date: '',
        type: 1
      },
      chartOpt: {
        dataZoom: [
          // 滑动条
          {
            show: true, // 是否显示滑动条
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            startValue: 0, // 从头开始。
            endValue: 5, // 一次性展示6个。
          },
        ],
        enableScroll: true,
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月'],
          boundaryGap: false,
          name: '时间',

        },
        yAxis: {
          type: 'value',
          name: '阅读量'
        },
        series: [
          {
            data: [],
            type: 'line',
            areaStyle: {
              color: '#bdd2fd'
            },
            color: '#6395f9',
            smooth: true,
            label: {
              show: false,
              position: 'top',
              textStyle: {
                fontSize: 20
              }
            },
            emphasis: {
              label: {
                show: true
              }
            }
          },
        ],
      },
      investmentName: '',
      createdTs: '',
    }
  },
  computed: {
    chamberId() {
      return this.$route.params.chamberId || ''
    },
    pickerOptions() {
      const { createdTs } = this
      return {
        disabledDate(date) {
          return date.getTime() < createdTs
        }
      }
    }
  },
  mounted() {
    console.log('chamberId', this.chamberId)
    this.fetchData()
    this.DataPickStart()
    this.fetchTrendChart()
  },
  methods: {
    async fetchData() {
      // TODO 待完善
      const res = await getDataStatistics({ contentId: this.chamberId })
      if (res.state !== 1) return this.$message.error(res.msg)
      const arrResult = ['exposureNum', 'theDayReadNum', 'totalReadNum']
      this.cardList.forEach((item, index, arr) => {
        arr[index].value = res.data[arrResult[index]]
      })
      this.investmentName = res.data.investMentName
      this.createdTs = Number(res.data.dateTime)
      console.log(this.pickerOptions, 'pickerOptions')
      // console.log(res.data.investMentName, ' investMentName')
      // console.log(this.investmentName)
    },
    async fetchTrendChart() {
      const params = {
        contentId: Number(this.chamberId),
        startTime: this.query.date[0],
        endTime: this.query.date[1],
        type: this.query.type
      }
      const res = await getReadTrendChart(params)
      if (res.state !== 1) return this.$message.error(res.msg)
      const resultDate = res.data || []
      this.chartOpt.xAxis.data = []
      this.chartOpt.series[0].data = []
      resultDate.forEach(item => {
        this.chartOpt.xAxis.data.push(item.date)
        this.chartOpt.series[0].data.push(item.readNum)
      })
    },
    initDatePicker() {
      this.DataPickStart()
      console.log(this.query.date, 'querydate')
      this.fetchTrendChart()
    },
    DataPickStart() {
      const endDateNs = new Date()
      const startDateNs = new Date()
      startDateNs.setTime(startDateNs.getTime() - 3600 * 1000 * 24 * this.query.days)
      // 月、日 不够10补0
      const defaultStartTime = startDateNs.getFullYear() + '-' + ((startDateNs.getMonth() + 1) >= 10 ? (startDateNs.getMonth() + 1) : '0' + (startDateNs.getMonth() + 1)) + '-' + (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate())
      const defaultEndTime = endDateNs.getFullYear() + '-' + ((endDateNs.getMonth() + 1) >= 10 ? (endDateNs.getMonth() + 1) : '0' + (endDateNs.getMonth() + 1)) + '-' + (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate())
      this.query.date = [defaultStartTime, defaultEndTime]
    },
    typeDatePicker(val) {
      this.query.type = val
      console.log(val)
      this.fetchTrendChart()
    },
    goToDetail() {
      this.$router.push({
        path: `/zhaoshang/information-publish/${this.chamberId}/statisticsDetail`,
      })
    }
  }
}
</script>

<style scoped lang="scss">
.statistics-wrap {
  padding: 20px 0 20px 20px;

  .title {
    padding-bottom: 20px;
    font-size: 20px;
  }

  .block {
    margin-top: 20px;
  }
}
</style>
