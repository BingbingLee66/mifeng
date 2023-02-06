<template>
  <panel>
    <v-chart ref="barChart" :option="ageBarData" class="chart section" />
    <v-chart ref="barChart" :option="genderBarData" class="chart section" />
    <v-chart ref="barChart" :option="yearsBarData" class="chart section" />
  </panel>
</template>
<script>
import { getAgeBar, getGenderBar, getYearsBar } from '@/api/statistic/memberStatistics'
import { ref } from 'vue'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
use([BarChart])
export default {
  setup() {
    const { ageBarData } = useAgeBar()
    const { genderBarData } = useGenderBar()
    const { yearsBarData } = useYearsBar()
    return {
      ageBarData,
      genderBarData,
      yearsBarData
    }
  }
}

function useAgeBar() {
  const ageBarData = ref({
    title: {
      text: ''
    },
    xAxis: {
      data: []
    },
    yAxis: {},
    series: [{ type: 'bar', areaStyle: {}, data: [] }],
    tooltip: {
      trigger: 'axis'
    }
  })
  async function getAgeBarData() {
    const { data } = await getAgeBar()
    ageBarData.value.title.text = data.text
    ageBarData.value.xAxis.data = data.xAxisData
    ageBarData.value.series[0].data = data.seriesData
  }
  getAgeBarData()
  return { ageBarData }
}
function useGenderBar() {
  const genderBarData = ref({
    title: {
      text: ''
    },
    xAxis: {
      data: []
    },
    yAxis: {},
    series: [{ type: 'bar', areaStyle: {}, data: [] }],
    tooltip: {
      trigger: 'axis'
    }
  })
  async function getgenderBarData() {
    const { data } = await getGenderBar()
    genderBarData.value.title.text = data.text
    genderBarData.value.xAxis.data = data.xAxisData
    genderBarData.value.series[0].data = data.seriesData
  }
  getgenderBarData()
  return { genderBarData }
}
function useYearsBar() {
  const yearsBarData = ref({
    title: {
      text: ''
    },
    xAxis: {
      data: []
    },
    yAxis: {},
    series: [{ type: 'bar', areaStyle: {}, data: [] }],
    tooltip: {
      trigger: 'axis'
    }
  })
  async function getyearsBarData() {
    const { data } = await getYearsBar()
    yearsBarData.value.title.text = data.text
    yearsBarData.value.xAxis.data = data.xAxisData
    yearsBarData.value.series[0].data = data.seriesData
  }
  getyearsBarData()
  return { yearsBarData }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.chart {
  width: 50vw;
  height: 40vh;
}
</style>
