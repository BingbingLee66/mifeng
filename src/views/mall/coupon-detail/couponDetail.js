import { queryCouponDetailById, queryCouponGoods } from '@/api/mall/coupon'

export default {
  data() {
    return {
      couponId: '',
      couponObj: {},
      couponVisible: false,
      list: []
    }
  },
  created() {
    this.couponId = this.$route.query.couponId
    if (this.couponId) {
      this.fetchData()
    }
  },
  methods: {
    fetchData() {
      queryCouponDetailById(this.couponId).then(res => {
        this.couponObj = res.data
      })
      queryCouponGoods(this.couponId).then(res => {
        this.list = res.data.respList
      })
    },
    showCoupon() {
      this.couponVisible = true
    }
  }
}
