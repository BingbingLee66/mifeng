import { queryCouponIssued } from '@/api/mall/coupon'
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
    this.couponId = this.$route.query.couponId
    this.couponName = this.$route.query.couponName
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
      getChamberOptions().then(res => {
        this.chamberOptions = res.data.data
      })
    },
    // 查询优惠券列表
    fetchData(e) {
      if (e !== undefined) {
        this.currentpage = 1
      }
      this.listLoading = true
      let params = {
        'templateId': this.couponId,
        'pageSize': this.limit,
        'pageNum': this.currentpage,
        'id': this.query.id,
        'type': this.query.type,
        'phone': this.query.phone,
        'ckey': this.query.ckey
      }
      queryCouponIssued(params).then(res => {
        console.log('已发放列表：', res)
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
    // 查看优惠券详情
    goCouponDetail() {
      this.$router.push({
        path: '/mall/couponDetail',
        query: { couponId: this.couponId }
      })
    },
    // 查看订单管理列表
    goOrderList() {
      this.$router.push(`/order/manager`)
    }
  }
}
