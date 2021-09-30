import { queryCouponDetailById } from '@/api/mall/coupon'

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
    // this.fetchData()
  },
  methods: {
    fetchData() {
      queryCouponDetailById(params).then(res => {
        this.couponObj = res.data
      })
    },
    showCoupon() {
      this.couponVisible = true
    }
  }
}