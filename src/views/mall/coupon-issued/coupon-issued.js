import {
  getExplodeGoodsList
} from '@/api/mall/mall'
import {
  getActivitySource
} from '@/api/activity/hot-activity'

export default {
  data() {
    return {
      // 查询优惠劵列表
      query: {
        userName: '',
        phone: '',
        property: '',
        ckey: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      chamberOptions: []
    }
  },
  created() {
    this.getChamberOptions()
    this.fetchData()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    getChamberOptions() {
      getActivitySource().then(res => {
        this.chamberOptions = res.data
      })
    },
    // 查询优惠券列表
    fetchData() {
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'id': this.query.id,
        'status': this.query.status,
        'name': this.query.name
      }
      getExplodeGoodsList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    },
    // 查看优惠券详情
    goMemberDetail() {
      this.$router.push(`/member/detail`)
    },
    // 查看订单管理列表
    goOrderList() {
      this.$router.push(`/order/manager`)
    }
  }
}
