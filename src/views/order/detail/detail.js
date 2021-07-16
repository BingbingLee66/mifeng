import { getOrder } from '@/api/order/order'
import { getChamberOptions } from '@/api/finance/finance'
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      chamberOptions: [],
      detailObj: {
        createTime: null,
        payTime: '',
        shippingTime: null,
        fightTime: null,
        confirmReceivingTime: null
      },
      isChamber: true,
      orderSn: ''
    }
  },
  computed: {
    // ...mapGetters(['has'])
    payType () {
      return function (payType) {
        if (payType === null) {
          return '未支付'
        } else {
          if (payType === 'wechat') {
            return '微信支付'
          } else {
            return '未知支付方式'
          }
        }
      }
    },
    status () {
      return function (status) {
        if (status == 2) {
          return '待发货'
        } else if (status == 5) {
          return '已发货'
        } else if (status == 6) {
          return '已完成'
        } else if (status == 4) {
          return '待成团'
        } else if (status == 1) {
          return '待支付'
        } else if (status == 0) {
          return '取消订单'
        } else {
          return '未知状态'
        }
      }
    },
    buyType () {
      return function (status) {
        if (status == 1) {
          return '拼单'
        } else if (status == 0) {
          return '单独购买'
        } else if (status == 2) {
          return '机器拼单'
        } else {
          return '未知方式'
        }
      }
    },
    chamberName () {
      return function(ckey) {
        let chamberName = ''
        for (let chamber of this.chamberOptions) {
          if (ckey === chamber.value) {
            chamberName = chamber.label
            break
          }
        }
        return chamberName
      }
    }
  },
  created() {
    if (this.$route.params.isChamber) {
      this.isChamber = this.$route.params.isChamber
    }
    if (this.$route.params.orderSn) {
      this.orderSn = this.$route.params.orderSn
      this.getChamberOptions()
      this.init()
    }
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    init() {
      this.fetchData()
    },
    getChamberOptions () {
      getChamberOptions().then(response => {
        this.chamberOptions = response.data.data
      })
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'orderSn': this.orderSn
      }
      getOrder(params).then(response => {
        this.detailObj = response.data.order
      })
    }
  }
}
