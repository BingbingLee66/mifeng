<template>
  <div class="block">
    <span class="time">时间</span>
    <template v-for="item in layoutList">
      <el-radio-group v-if="item === 'days'" :key="item" v-model="query.days" size="mini" @change="onDaysChange">
        <el-radio-button :label="7">7天</el-radio-button>
        <el-radio-button :label="14">14天</el-radio-button>
        <el-radio-button :label="30">30天</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-if="item === 'date'"
        :key="item"
        v-model="query.date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        type="daterange"
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="mini"
        @change="onDateChange"
      />
      <el-radio-group v-if="item === 'type'" :key="item" v-model="query.type" size="mini" @change="onTypeChange">
        <el-radio-button :label="1">日</el-radio-button>
        <el-radio-button :label="2">周</el-radio-button>
        <el-radio-button :label="3">月</el-radio-button>
      </el-radio-group>
    </template>
  </div>
</template>

<script>
import { formatDate } from '@/utils/date'

export default {
  components: {},
  props: {
    query: {
      type: Object,
      required: true
    },
    layout: {
      type: String,
      default: 'days, date, type'
    }
  },
  computed: {
    layoutList() {
      return this.layout.split(',').map(v => v.trim())
    }
  },
  created() {
    this.reset()
    this.onChange()
  },
  methods: {

    reset() {
      const defaultQuery = { days: 7, type: 1, date: this.initDatePicker(7), }
      this.layoutList.forEach(key => {
        this.query[key] = defaultQuery[key]
      })
    },

    initDatePicker(days) {
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - 3600 * 1000 * 24 * days)
      return [formatDate(startDate, 'yyyy-MM-dd'), formatDate(endDate, 'yyyy-MM-dd')]
    },

    onChange() {
      this.$emit('change', this.query)
    },

    onDaysChange(val) {
      if (this.layoutList.includes('date')) this.query.date = this.initDatePicker(val)
      this.onChange()
    },

    onTypeChange(val) {
      this.onChange()
    },

    onDateChange(val) {
      this.onChange()
    }
  },
}
</script>

<style lang="scss" scoped>
.time {
  color: #bbb;
  margin-right: 20px;
}

</style>
