<template>
  <div class="statistics-wrap">
    <div class="title">广州南沙自贸区</div>
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
        @change="fetchData"
      />
      <el-radio-group v-model="query.type" size="mini" @change="typeDatePicker">
        <el-radio-button :label="1">日</el-radio-button>
        <el-radio-button :label="2">周</el-radio-button>
        <el-radio-button :label="3">月</el-radio-button>
      </el-radio-group>
    </div>
    <v-chart :options="chartOpt" style="width: 100%;" />

  </div>
</template>

<script>
import 'echarts/lib/chart/line'
import CardBox from '@/views/zhaoshang/information-publish/components/card-box'
// import { getDataStatistics } from '@/api/zhaoshang/statistics/activity-statistics'
export default {
  name: 'Statistics',
  components: { CardBox },
  data() {
    return {
      cardList: [
        { label: '曝光量', value: 20000 },
        { label: '累计阅读次数', value: 20000 },
        { label: '累计阅读人数', value: 20000 },
      ],
      query: {
        days: 7,
        date: '',
        type: 1
      },
      chartOpt: {
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月'],
          boundaryGap: false,
          name: '时间'
        },
        yAxis: {
          type: 'value',
          name: '阅读量'
        },
        series: [
          {
            data: [150, 230, 224, 218, 135],
            type: 'line',
            areaStyle: {}
          },
        ]
      },
      // chamberId: ''
    }
  },
  computed: {
    chamberId() {
      return this.$route.params.chamberId || ''
    }
  },
  mounted() {
    console.log('chamberId', this.chamberId)
    // getDataStatistics()
    this.fetchData()
  },
  methods: {
    async fetchData() {
      // TODO 待完善
      // const res = await getDataStatistics({ contentId: this.chamberId })
      // console.log(res)
      console.log(this.query.type)
    },
    initDatePicker() {
      const endDateNs = new Date()
      const startDateNs = new Date()
      startDateNs.setTime(startDateNs.getTime() - 3600 * 1000 * 24 * this.query.days)
      // 月、日 不够10补0
      const defaultStartTime = startDateNs.getFullYear() + '-' + ((startDateNs.getMonth() + 1) >= 10 ? (startDateNs.getMonth() + 1) : '0' + (startDateNs.getMonth() + 1)) + '-' + (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate())
      const defaultEndTime = endDateNs.getFullYear() + '-' + ((endDateNs.getMonth() + 1) >= 10 ? (endDateNs.getMonth() + 1) : '0' + (endDateNs.getMonth() + 1)) + '-' + (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate())
      this.query.date = [defaultStartTime, defaultEndTime]
      this.fetchData()
    },

    typeDatePicker(val) {
      this.query.type = val
      console.log(val)
      this.fetchData()
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
