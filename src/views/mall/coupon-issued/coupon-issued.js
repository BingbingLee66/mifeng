import { getExplodeGoodsList, queryCouponIssued } from '@/api/mall/coupon'
import { getChamberOptions } from '@/api/finance/finance'

export default {
  data() {
    return {
      couponId: '100036',
      couponName: '10元福利券',
      query: {
        name: '',
        phone: '',
        type: '',
        ckey: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      chamberOptions: []
    }
  },
  created() {
    // this.couponId = this.$route.params.couponId
    // this.couponName = this.$route.params.couponName
    this.getChamberOptions()
    // this.fetchData()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    getChamberOptions() {
      getChamberOptions().then(res => {
        this.chamberOptions = res.data.data
      })
    },
    // 查询优惠券列表
    fetchData() {
      if (e !== undefined) {
        this.currentpage = 1
      }
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'id': this.query.id,
        'type': this.query.type,
        'phone': this.query.phone,
        'ckey': this.query.ckey
      }
      queryCouponIssued(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.fetchData(1)
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    },
    // 查看用户详情详情
    goMemberDetail(userId) {
      let memberDetail = {
        id: userId
      }
      // /member/detail/
      this.$router.push({
        name: '会员详情',
        params: { memberDetail, querytype: 0 }
      })
    },
    // 查看已发放优惠券列表
    goCouponDetail() {
      // /member/detail/
      this.$router.push({
        name: '查看优惠券',
        params: {
          couponId: this.couponId
        }
      })
    },
    // 查看订单管理列表
    goOrderList() {
      this.$router.push(`/order/manager`)
    }
  }
}
