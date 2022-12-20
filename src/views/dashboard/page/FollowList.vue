<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="关注来源">
          <el-select v-model="query.type">
            <el-option
              v-for="item in ORIGIN_OPTION"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <KdTable :columns="columns" :rows="tableData" />
      <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="pageChange" />
    </el-card>
  </div>
</template>
<script>
import { getFollowList } from '@/api/dashboard'
import { ORIGIN_OPTION, ORIGIN_MAP } from './conast.js'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination')
  },
  data() {
    return {
      query: { type: 1, pageNum: 1, pageSize: 10 },
      tableData: [],
      total: 0,
      ORIGIN_OPTION,
      ORIGIN_MAP
    }
  },
  computed: {
    columns() {
      return [
        {
          label: '头像',
          render: ({ row }) => (
            <div>
              <img src={row.uavatar} alt="" width="50" height="50" />
            </div>
          )
        },
        { label: '用户名', prop: 'uname' },
        { label: '已加入的商协会', prop: 'uname' },
        { label: '关注来源', prop: 'type' },
        { label: '引发关注的内容', prop: 'type' },
        { label: '关注日期 ', prop: 'createdTs' }
      ]
    },
    ckey() {
      return this.$store.getters.ckey || ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      console.log('fetchData')
      const {
        query: { type, pageNum: page, pageSize },
        ckey
      } = this
      const res = await getFollowList({ type, page, pageSize, ckey })
      console.log('value', res)
      // this.tableData = list
      // this.total = totalRows
    },
    pageChange(p) {
      this.query = { ...this.query, ...p }
      this.fetchData()
      console.log(p)
    },
    onSubmit() {}
  }
}
</script>
