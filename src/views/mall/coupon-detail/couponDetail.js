import { getGoodsDetail } from '@/api/goods/goodsSku'

export default {
  data() {
    return {
      couponId: '',
      couponDetail: {}
    }
  },
  created() {
    if (this.$route.params.couponId) {
      this.couponId = this.$route.params.couponId
      this.fetchData()
    }
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    fetchData() {
      const res = getGoodsDetail({ 'id': this.couponId })
      console.log(res)
    }
  }
}
