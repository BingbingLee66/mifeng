import {
  getIssuedCouponUserList
} from '@/api/mall/issued'
import { getChamberAllList } from '@/api/goods/goods'
import { intInput, spaceInput } from '@/utils/utils'

export default {
  data() {
    return {
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
        'page': this.currentpage,
        'uname': this.query.uname,
        'phone': this.query.phone,
        'userType': this.query.userType,
        'chamberId': this.query.chamberId
      }
      getIssuedCouponUserList(params).then(res => {
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
    // 查看优用户详情
    goMemberDetail() {
      this.$router.push(`/member/detail`)
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
