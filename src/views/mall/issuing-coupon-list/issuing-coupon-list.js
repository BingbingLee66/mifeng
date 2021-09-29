import {
  getExplodeGoodsList, sendCoupon
} from '@/api/mall/issued'
import { spaceInput, intInput } from '@/utils/utils'

export default {
  data() {
    return {
      query: {
        id: '',
        name: '',
        create: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      // 发行量
      issue: '',
      // 控制变量
      listLoading: false,
      showIssueDialog: false
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
    handleSpace(e) {
      this.query.name = spaceInput(e)
    },
    // 限制输入正整数
    handleNumber(e, str) {
      this.query.id = intInput(e)
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
        'id': this.query.id,
        'create': this.query.create,
        'name': this.query.name
      }
      getExplodeGoodsList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentpage = 1
      this.fetchData()
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
        sendCoupon(id).then(res => {
          this.list = res.data.list
          this.total = res.data.totalRows
          this.listLoading = false
          this.$message.success('发送成功!')
        })
      }).catch(() => {
      })
    },
    // 跳转发送优惠券页面
    create() {
      this.$router.push(`/mall/issuing-coupon-send`)
    },
    // 查看优惠券详情
    goCouponDetail() {
      this.$router.push(`/mall/couponDetail`)
    },
    // 查看已发放列表
    goIssueList() {
      this.$router.push(`/mall/couponIssued`)
    }
  }
}
