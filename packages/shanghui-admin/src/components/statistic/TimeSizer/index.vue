<template>
  <span style="color: #bbb; margin-right: 20px">时间</span>
  <!-- eslint-disable-next-line -->
  <template v-for="item in layoutList" :key="index">
    <a-radio-group v-if="item === 'days'" v-model:value="query.days" @change="initDatePicker">
      <a-radio-button :value="7">7天</a-radio-button>
      <a-radio-button :value="14">14天</a-radio-button>
      <a-radio-button :value="30">30天</a-radio-button>
    </a-radio-group>
    <a-range-picker
      v-if="item === 'date'"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      v-model:value="query.date"
      class="rangePicker"
    ></a-range-picker>
    <a-radio-group v-if="item === 'type'" v-model:value="query.type">
      <a-radio-button :value="1">日</a-radio-button>
      <a-radio-button :value="2">周</a-radio-button>
      <a-radio-button :value="3">月</a-radio-button>
    </a-radio-group>
  </template>
</template>
<script>
import { reactive, computed, watch } from 'vue'
import dayjs from 'dayjs'
export default {
  components: {},
  props: {
    layout: {
      type: String,
      default: 'days, date, type'
    }
  },
  setup(props, { emit }) {
    const query = reactive({
      days: 7,
      date: [dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
      type: 1
    })

    const layoutList = computed(() => {
      return props.layout.split(',').map(v => v.trim())
    })

    const initDatePicker = () => {
      query.date = [dayjs().subtract(query.days, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    }
    watch(
      () => [query.date, query.type],
      () => emit('fetchTableData', query),
      { immediate: true }
    )

    return {
      query,
      initDatePicker,
      layoutList
    }
  }
}
</script>
<style lang="scss" scoped>
.rangePicker {
  margin: 0 10px;
}
</style>
