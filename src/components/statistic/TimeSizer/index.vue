<template>
  <div class="block">
    <span class="time">时间</span>
    <template v-for="item in layoutList">
      <el-radio-group v-if="item === 'days'" :key="item" v-model="query.days" size="mini">
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
        @change="onTimeChange"
      />
      <el-radio-group v-if="item === 'type'" :key="item" v-model="query.type" size="mini" @change="onChangeQueryType">
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
    layout: {
      type: String,
      default: 'days, date, type'
    }
  },
  data() {
    return {
      query: {
        days: 7,
        type: 1,
        date: [],
      }
    }
  },
  computed: {
    layoutList() {
      return this.layout.split(',').map(v => v.trim())
    }
  },
  watch: {
    'query.days': {
      handler() {
        this.initDatePicker()
      },
      immediate: true
    }
  },
  methods: {
    initDatePicker() {
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - 3600 * 1000 * 24 * this.query.days)
      this.query.date = [formatDate(startDate, 'yyyy-MM-dd'), formatDate(endDate, 'yyyy-MM-dd')]
      this.onTimeChange()
    },

    onChangeQueryType(val) {
      this.query.type = val
      this.onTimeChange()
    },

    onTimeChange() {
      const query = {}
      this.layoutList.forEach(v => {
        query[v] = this.query[v]
      })
      this.$emit('change', query)
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
