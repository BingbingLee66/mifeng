import { querySpreeIssued, querySpreeDetail } from '@/api/mall/spree'
import { getChamberOptions } from '@/api/finance/finance'

export default {
  data() {
    return {
      giftId: '100012',
      giftName: '10元福利礼包',
      query: {
        uname: '',
        phone: '',
        attribute: '',
        ckey: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      chamberOptions: [],
      giftObj: {}
    }
  },
  created() {
    // this.gifDetail()
    // this.giftName = this.$route.params.giftName
    // this.giftId = this.$route.params.giftId
    // this.giftId && this.fetchData()
    this.getChamberOptions()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    // gifDetail() {
    //   querySpreeDetail({ giftId: this.giftId }).then(res => {
    //     this.giftObj = res.data
    //   })
    // },
    getChamberOptions() {
      getChamberOptions().then(res => {
        this.chamberOptions = res.data.data
      })
    },
    // 查询优惠券列表
    fetchData(e) {
      this.listLoading = true
      let params = [...this.query]
      params['pageSize'] = this.limit
      params['page'] = e === 1 ? this.currentpage = 1 : this.currentpage
      querySpreeIssued(params).then(res => {
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
    // 查看用户详情详情
    goMemberDetail(userId) {
      let memberDetail = {
        id: userId
      }
      this.$router.push({
        name: '会员详情',
        params: { memberDetail, querytype: 0 }
      })
    },
    // 查看大礼包详情
    goSpreeDetail() {
      // /mall/spreeDetail
      this.$router.push({
        name: '查看大礼包',
        params: { giftId: this.giftId }
      })
    },
  }
}
