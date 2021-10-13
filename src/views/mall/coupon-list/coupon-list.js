import { getCouponList, updateIssue, updateIssueStatus } from '@/api/mall/coupon'
import { intInput, spaceInput } from '@/utils/utils'

export default {
  data() {
    return {
      // 查询优惠劵列表
      query: {
        id: '',
        name: '',
        gift: '',
        user: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      issue: '',
      rowData: '',
      listLoading: false,
      issueVisible: false
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
      if (str === 'id') {
        this.query.id = intInput(e)
      } else if (str === 'issue') {
        this.issue = intInput(e)
      }
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
        'id': this.query.id,
        'gift': this.query.gift,
        'name': this.query.name,
        'user': this.query.user
      }
      getCouponList(params).then(res => {
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
    // 更新发行量
    showIssue(row) {
      this.rowData = row
      this.issue = row.quota
      this.issueVisible = true
    },
    updateIssues() {
      if (!this.issue) return this.$message.error('请设置发行量')
      if (this.issue < this.rowData.quota) return this.$message.error('编辑发行量时，只能增加，不能减少')
      let params = {
        quota: this.issue,
        templateId: this.rowData.templateId
      }
      updateIssue(params).then(res => {
        this.fetchData()
        this.$message.success(res.msg)
        this.issueVisible = false
      })
    },
    // 继续/停止发送
    updateIssueType(e, type) {
      let msg = type === 0 ? '确认停发吗？' : '确认继续发吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          templateId: e.templateId,
          status: type
        }
        updateIssueStatus(params).then(res => {
          this.fetchData()
          this.$message.success('操作成功')
        })
      }).catch(() => {
      })
    },
    // 跳转创建优惠券
    create() {
      this.$router.push(`/mall/couponCreate`)
    },
    // 查看优惠券详情
    goCouponDetail(couponId) {
      this.$router.push({
        path: '/mall/couponDetail',
        query: { couponId }
      })
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
    goIssueList(row) {
      this.$router.push({
        path: '/mall/couponIssued',
        query: {
          couponId: row.templateId,
          couponName: row.name
        }
      })
    }
  }
}
