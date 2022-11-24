<template>
  <div class="app-container identity-tag-wrap">
    <div class="block query-box">
      <div class="item">
        <span style="color: #bbb;margin-right: 20px;">时间</span>
        <el-radio-group v-model="query.days" style="margin-right: 12px;" size="mini" @change="initDatePicker">
          <el-radio-button :label="7">7天</el-radio-button>
          <el-radio-button :label="14">14天</el-radio-button>
          <el-radio-button :label="30">30天</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="query.date"
          style="margin-right: 15px;"
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
      </div>

      <el-button type="primary" size="mini" style="position: absolute;right: 0;top:10px" @click="showModal = true">添加标签</el-button>
    </div>

    <el-tabs v-model="activeName">
      <el-tab-pane label="会长" name="1" />
      <el-tab-pane label="执行会长" name="2" />
      <el-tab-pane label="秘书长" name="3" />
      <el-tab-pane label="会员" name="4" />
      <el-tab-pane label="其他" name="5" />
    </el-tabs>

    <div class="current-percent">占比：20%</div>

    <div class="flex-x-center-center tag-center">
      <v-chart :option="needBarOpt" class="chart-wrap chart-block" />
      <v-chart :option="youArePieOpt" class="chart-wrap chart-block" />
    </div>

    <div class="tag-footer">
      <v-chart :option="industryBarOpt" class="chart-wrap chart-block" />
    </div>

    <TagFormDialog :visible.sync="showModal" />
  </div>
</template>

<script>
import TagFormDialog from './components/tagFormDialog'

export default {
  name: 'IdentityTag',
  components: { TagFormDialog },
  data() {
    return {
      query: {
        days: 7,
        date: '',
      },
      activeName: '1',
      showModal: false,
      needBarOpt: {
        xAxis: {
          type: 'category',
          data: ['人脉交友', '寻找项目', '资源共享', '商会资讯']
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true
          },
          name: '你需要？'
        },
        series: [
          {
            data: [120, 200, 150, 80],
            type: 'bar'
          }
        ]
      },
      youArePieOpt: {
        title: {
          text: '你是？',
          left: '10px',
          top: '10px'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          top: 10,
          left: 'center',
          data: ['会长', '执行会长', '会员', '秘书长', '其他']
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [
              {
                value: 1548,
                name: 'CityE',
              },
              { value: 735, name: '会长' },
              { value: 510, name: '执行会长' },
              { value: 434, name: '会员' },
              { value: 335, name: '秘书长' },
              { value: 123, name: '其他' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      industryBarOpt: {
        xAxis: {
          type: 'category',
          data: ['IT/互联网', '新零售/电商', '传媒/文化', '能源环保', '医疗健康', '贸易物流', '教育培训', '化工机械', '金融']
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true
          },
          name: '所处行业？'
        },
        series: [
          {
            data: [120, 200, 150, 80, 120, 200, 150, 80, 10],
            type: 'bar'
          }
        ]
      }
    }
  },
  methods: {
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

    async fetchData() {}
  }
}
</script>

<style scoped lang="scss">
.identity-tag-wrap {
  .query-box{
    display: flex;
    flex-wrap: wrap;
    align-items:center;
    position: relative;
    width: calc(100% - 60px);
    .item{
      margin-bottom: 12px;
    }
    .flex-box{
      display: flex;
      align-items: center;
    }
  }

  .current-percent {
    padding: 10px 0 20px;
    font-size: 16px;
  }

  .tag-center {
    gap: 20px;
  }

  .chart-wrap {
    height: 354px;
  }

  .chart-block {
    background: #fff;
    border-radius: 6px;
    box-shadow: 2px 2px 4px #edecec;
  }

  .tag-footer {
    margin-top: 20px;
  }
}
</style>
