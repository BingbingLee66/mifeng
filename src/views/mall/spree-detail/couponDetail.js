import { querySpreedInfo } from '@/api/mall/spree'

export default {
  data() {
    return {
      giftId: '',
      giftObj: {}
    }
  },
  created() {
    this.giftId = this.$route.query.giftId
    this.fetchData()
  },
  methods: {
    fetchData() {
      querySpreedInfo(this.giftId).then(res => {
        this.giftObj = res.data
      })
    },
    // 查看优惠券详情
    goCouponDetail(couponId) {
      this.$router.push({
        path: '/mall/couponDetail',
        query: { couponId }
      })
    },
  }
}
