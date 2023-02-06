<template>
  <a-form-item label="时间">
    <a-radio-group v-model:value="data.timeShortcuts" option-type="button" class="time-group">
      <a-radio-button :value="7">7天</a-radio-button>
      <a-radio-button :value="14">14天</a-radio-button>
      <a-radio-button :value="30">30天</a-radio-button>
    </a-radio-group>
    <a-range-picker v-model:value="data.time" format="YYYY-MM-DD" :allowClear="false" value-format="YYYY-MM-DD" />
  </a-form-item>
</template>

<script setup>
import { reactive, watch } from 'vue'
import dayjs from 'dayjs'

const emit = defineEmits(['change'])
const data = reactive({
  time: [],
  timeShortcuts: 7,
  nowTime: dayjs().format('YYYY-MM-DD')
})
watch(
  () => data.time,
  newV => {
    ;[formatDate.startTime, formatDate.endTime] = newV
    emit('change', newV)
  }
)

watch(
  () => data.timeShortcuts,
  newV => {
    formatDate.endTime = data.nowTime
    switch (newV) {
      case 7:
        formatDate.startTime = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
        break
      case 14:
        formatDate.startTime = dayjs().subtract(14, 'day').format('YYYY-MM-DD')
        break
      case 30:
        formatDate.startTime = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
    }
    data.time = [formatDate.startTime, formatDate.endTime]
  }
)
const formatDate = reactive({
  endTime: data.nowTime,
  startTime: dayjs().subtract(7, 'day').format('YYYY-MM-DD')
})
data.time = [formatDate.startTime, formatDate.endTime]
</script>

<style scoped>
.querySearch {
  display: flex;
  justify-content: space-between;
}
.time-group {
  margin-right: 10px;
}
</style>
