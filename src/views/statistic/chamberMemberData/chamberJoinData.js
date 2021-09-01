import { getPlatformChamberData } from '@/api/statistics/chamberJoinData'

export default {
  data() {
    return {
      currentpage: 1,
      limit: 10,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      chamberMemberList: [],
      listLoading: false,
      showMeaning: false
    }
  },
  created() {
    this.getChamberMemberList()
  },
  methods: {
    getChamberMemberList() {
      this.listLoading = true
      let params = {
        page: this.currentpage,
        pageSize: this.limit
      }
      getPlatformChamberData(params).then(res => {
        this.chamberMemberList = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentpage = 1
      this.getChamberMemberList()
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.getChamberMemberList()
    }
  }
}
