import {
  sendCoupon, getIssuedCouponList
} from '@/api/mall/issued'
import { spaceInput, intInput } from '@/utils/utils'

export default {
  data() {
    return {
      query: {
        couponId: '',
        couponName: '',
        creator: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      issue: '',
      listLoading: false,
      phoneList: [],
      sendResultVisible: false
    }
  },
  created() {
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
    handleNumber(e, str) {
      this.query.couponId = intInput(e)
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
        'creator': this.query.creator,
        'couponName': this.query.couponName,
        'couponId': this.query.couponId
      }
      getIssuedCouponList(params).then(res => {
        if (res.state === 1) {
          this.list = res.data.list
          this.total = res.data.totalRows
          this.listLoading = false
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
    // 发送
    send(id) {
      this.$confirm('确认发送吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        sendCoupon({ id }).then(res => {
          this.fetchData()
          this.$message.success('发送成功!')
        })
      }).catch(() => {
      })
    },
    // 查看发送结果
    showResultDialog(phone) {
      console.log(phone)
      this.phoneList = phone
      this.sendResultVisible = true
    },
    // 跳转发送优惠券页面
    create() {
      this.$router.push(`/mall/issuing-coupon-send`)
    },
    // 查看优惠券详情
    goCouponDetail(couponId) {
      this.$router.push({
        path: '/mall/couponDetail',
        query: { couponId }
      })
    },
    // 查看已发放列表
    goIssueList(couponId) {
      this.$router.push({
        path: '/mall/issuing-coupon-receiver',
        query: {
          orderid: couponId
        }
      })
    }
  }
}
