import {
  getExplodeGoodsList
} from '@/api/mall/coupon'

import { nmberInput } from '@/utils/utils'

export default {
  data() {
    return {
      // 查询优惠劵列表
      query: {
        id: '',
        name: '',
        status: ''
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
    handleInput(e) {
      this.query.id = nmberInput(e)
    },
    // 查询优惠券列表
    fetchData() {
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'id': this.query.id,
        'status': this.query.status,
        'name': this.query.name
      }
      // getCouponList
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
    // 更新发行量
    showIssue() {
      this.showIssueDialog = true
    },
    updateIssue() {
      console.log('更新发行量')
    },
    // 停止发送
    stopSend() {
      console.log('停止发送')
      this.$confirm('确认停发吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 继续发送
    continueSend() {
      console.log('继续发送')
      this.$confirm('确认继续发吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 跳转创建优惠券
    create() {
      this.$router.push(`/mall/couponCreate`)
    },
    // 查看优惠券详情
    goCouponDetail() {
      this.$router.push(`/mall/couponDetail`)
    },
    // 查看商品劵商品
    goGoodsLsit() {
      this.$router.push(`/mall/couponDetail`)
    },
    // 查看订单管理列表
    goOrderList() {
      this.$router.push(`/order/manager`)
    },
    // 查看已发放列表
    goIssueList() {
      this.$router.push(`/mall/couponIssued`)
    }
  }
}
