import {
  getIssuedListByOrderId
} from '@/api/mall/issued'
import { getChamberAllList } from '@/api/goods/goods'
import { intInput, spaceInput } from '@/utils/utils'

export default {
  data() {
    return {
      orderId: '',
      query: {
        uname: '',
        phone: '',
        userType: '',
        chamberId: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      listLoading: false,
      limit: 10,
      chamberOptions: []
    }
  },
  created() {
    this.orderId = this.$route.query.orderid
    console.log(this.orderId)
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
    // 限制输入空格
    handleSpace(e, str) {
      this.query[str] = spaceInput(e)
    },
    // 限制输入正整数
    handleNumber(e) {
      this.query.phone = intInput(e)
    },
    getChamberOptions() {
      getChamberAllList().then(res => {
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
        'pageSize': this.limit,
        'pageNum': this.currentpage,
        'name': this.query.uname,
        'phone': this.query.phone,
        'type': this.query.userType,
        'id': this.query.chamberId
      }
      getIssuedListByOrderId(this.orderId, params).then(res => {
        console.log('已发送列表：', res)
        if (res.state === 1) {
          this.list = res.data.list
          this.total = res.data.totalRows
          this.listLoading = false
        } else {
          this.listLoading = false
          console.log(res)
        }
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
    // 查看优用户详情
    goMemberDetail(row) {
      this.$router.push({ name: '用户详情', params: { 'userDetail': row }})
    },
    // 查看已使用订单列表
    goCouponDetail(couponId) {
      this.$router.push({
        path: '/mall/couponDetail',
        query: { couponId }
      })
    },
    // 查看订单管理列表
    goOrderList() {
      this.$router.push(`/order/manager`)
    }
  }
}
