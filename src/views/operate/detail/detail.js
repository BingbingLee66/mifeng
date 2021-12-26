import {
  detailList,
  guideTable
} from '@/api/operate/operate'

export default {
  data() {
    return {
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      operateId: '',
      beginTime: '',
      endTime: ''
    }
  },
  created() {
    if (this.$route.params.operateId) {
      this.operateId = this.$route.params.operateId
      this.beginTime = this.$route.params.beginTime
      this.endTime = this.$route.params.endTime
    }
    this.fetchData()
  },
  methods: {
    // 查询活动列表
    fetchData(e) {
      if (e !== undefined) {
        this.currentpage = 1
      }
      this.listLoading = true
      let params = {
        'id': this.operateId,
        'pageSize': this.limit,
        'page': this.currentpage,
      }
      detailList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
    exportList() {
      let params = {
        'id': this.operateId,
        'pageSize': this.limit,
        'page': this.currentpage,
      }
      guideTable(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    }
  }
}
