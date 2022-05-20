<template>
  <el-form style="margin-top:10px;" inline>
    <el-form-item label="数据维度：">
      <el-select
        v-model="ckey"
        placeholder="搜索/选择"
        filterable
        clearable
        no-match-text="暂无数据"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <el-option v-for="item in chamberOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import { getChamberOptions } from '@/api/finance/finance'

export default {
  components: {},
  inheritAttrs: false,
  data() {
    return {
      ckey: '',
      chamberOptions: []
    }
  },
  created() {
    this.getChamberOptions()
  },
  methods: {
    async getChamberOptions() {
      const { data } = await getChamberOptions()
      this.chamberOptions = data.data
      this.chamberOptions.unshift({ 'label': '全部商会', 'value': '' })
    },
  },
}
</script>
