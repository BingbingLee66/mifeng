<template>
  <div class="app-container">
    <el-form :inline="true" :model="query" class="demo-form-inline">
      <el-form-item label="关注来源">
        <el-select v-model="query.type">
          <el-option v-for="item in ORIGIN_OPTION" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>
    <KdTable :columns="columns" :rows="tableData" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="pageChange" />
  </div>
</template>
<script>
import { formatDateTime } from '@/utils/date'
import { getFollowList } from '@/api/dashboard'
import { ORIGIN_OPTION, ORIGIN_MAP } from './conast.js'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination')
  },
  data() {
    return {
      query: { type: 0, pageNum: 1, pageSize: 10 },
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
        {
          label: '已加入的商协会',
          prop: 'chamberList',
          render: ({ row }) => {
            return row.chamberList ? row.chamberList.map(i => {
              return <div>{i}</div>
            }) : '--'
          }
        },
        {
          label: '关注来源',
          prop: 'type',
          render: ({ row }) => {
            return <div>{row.type !== 0 ? ORIGIN_MAP.get(row.type) : '--'}</div>
          }
        },
        { label: '引发关注的内容', prop: 'notice' },
        {
          label: '关注日期 ',
          prop: 'createdTs',
          render: ({ row }) => {
            return <div>{formatDateTime(new Date(+row.createdTs), 'yyyy-MM-dd hh:mm:ss')}</div>
          }
        }
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
      const {
        query: { type, pageNum: page, pageSize },
        ckey
      } = this
      const {
        data: { list, totalRows }
      } = await getFollowList({ type, page, pageSize, ckey })
      this.tableData = list
      this.total = totalRows
    },
    pageChange(p) {
      this.query = { ...this.query, ...p }
      this.fetchData()
    },
    onSubmit() {}
  }
}
</script>
