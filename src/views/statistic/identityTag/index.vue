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
          @change="fetchStatistics"
        />
      </div>

      <el-button type="primary" size="mini" style="position: absolute;right: 100px;top:10px" @click="showModal('add')">添加标签</el-button>
      <el-button type="danger" size="mini" style="position: absolute;right: 0;top:10px" @click="showModal('del')">删除标签</el-button>
    </div>

    <el-tabs v-model="activeName" @tab-click="fetchStatistics">
      <el-tab-pane v-for="tag in youAreTagList" :key="tag.value" :label="tag.label" :name="tag.value" />
    </el-tabs>

    <div class="current-percent">占比：{{ currentItem.proportion * 100 }}%</div>

    <div class="flex-x-center-center tag-center">
      <v-chart :option="needBarOpt" class="chart-wrap chart-block" />
      <v-chart :option="youArePieOpt" class="chart-wrap chart-block" />
    </div>

    <div class="tag-footer">
      <v-chart :option="industryBarOpt" class="chart-wrap chart-block" />
    </div>

    <TagFormDialog :visible.sync="visible" :mode="mode" :you-are-list="youAreTagList" :tag-list="tagList" @success="fetchData" />
  </div>
</template>

<script>
import TagFormDialog from './components/tagFormDialog'
import { getTag, statisticsTag } from '@/api/user-guide'

export default {
  name: 'IdentityTag',
  components: { TagFormDialog },
  data() {
    return {
      query: {
        days: 7,
        date: '',
      },
      activeName: null,
      youAreTagList: [],
      tagList: [],
      visible: false,
      mode: 'add',

      currentItem: {}
    }
  },
  computed: {
    needBarOpt() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: this.currentItem.needStats?.map(v => v.labelVal) || [],
          axisLabel: {
            interval: 0,
          }
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
            data: this.currentItem.needStats?.map(v => v.num) || [],
            type: 'bar'
          }
        ]
      }
    },

    youArePieOpt() {
      return {
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
          data: this.currentItem.whoStats?.map(tag => tag.labelVal) || []
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: this.currentItem.whoStats?.map(tag => {
              return {
                name: tag.labelVal,
                value: tag.num
              }
            }) || [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },

    industryBarOpt() {
      return {
        xAxis: {
          type: 'category',
          data: this.currentItem.industryStats?.map(v => v.labelVal) || [],
          axisLabel: {
            interval: 0,
          }
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
            data: this.currentItem.industryStats?.map(v => v.num) || [],
            type: 'bar'
          }
        ]
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      await this.fetchTagList()
      this.initDatePicker()
    },

    async fetchTagList() {
      const { data, state } = await getTag()
      if (state !== 1) return

      this.activeName = String(data[0].id)
      this.youAreTagList = data.filter(tag => tag.labelName === 1).map(tag => {
        return {
          ...tag,
          label: tag.labelVal,
          value: String(tag.id),
        }
      })
      this.tagList = data.map(tag => {
        return {
          ...tag,
          label: tag.labelVal,
          value: String(tag.id),
        }
      })
    },

    async fetchStatistics() {
      const params = { relLabelId: +this.activeName || 1 }
      if (this.query.date.length) {
        params.startTime = new Date(this.query.date[0]).getTime()
        params.endTime = new Date(this.query.date[1]).getTime()
      }

      const { data, state } = await statisticsTag(params)

      if (state !== 1) return
      this.currentItem = data
    },

    showModal(mode) {
      this.visible = true
      this.mode = mode
    },

    initDatePicker() {
      const endDateNs = new Date()
      const startDateNs = new Date()
      startDateNs.setTime(startDateNs.getTime() - 3600 * 1000 * 24 * this.query.days)
      // 月、日 不够10补0
      const defaultStartTime = startDateNs.getFullYear() + '-' + ((startDateNs.getMonth() + 1) >= 10 ? (startDateNs.getMonth() + 1) : '0' + (startDateNs.getMonth() + 1)) + '-' + (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate())
      const defaultEndTime = endDateNs.getFullYear() + '-' + ((endDateNs.getMonth() + 1) >= 10 ? (endDateNs.getMonth() + 1) : '0' + (endDateNs.getMonth() + 1)) + '-' + (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate())
      this.query.date = [defaultStartTime, defaultEndTime]
      this.fetchStatistics()
    },

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
