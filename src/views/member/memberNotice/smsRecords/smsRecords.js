import { getSmsList, getSmsDetails } from '@/api/member/memberFee'

export default {
  data() {
    return {
      visible: false,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      detailObj: {
        bid: '',
        msg: '',
        sendTs: '',
        operator: '',
        mobileTotal: 0
      },
      pageSizes2: [10, 20, 50, 100, 500],
      total2: 0,
      detailList: [],
      currentpage2: 1,
      limit2: 10,
      listLoading2: false
    }
  },
  computed: {
  },
  created() {
    this.init()
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
    handleSizeChange2(val) {
      console.log(`每页 ${val} 条`)
      this.limit2 = val
      this.currentpage2 = 1
      this.fetchData2()
    },
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`)
      this.currentpage2 = val
      this.fetchData2()
    },
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage
      }
      getSmsList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    detail (row) {
      this.detailObj = {
        'bid': row.bid,
        'msg': row.msg,
        'sendTs': row.sendTs,
        'operator': row.operator,
        'mobileTotal': row.mobileTotal
      }
      this.visible = true
      this.fetchData2()
    },
    fetchData2 () {
      this.listLoading2 = true
      let params = {
        'bid': this.detailObj.bid,
        'pageSize': this.limit2,
        'page': this.currentpage2
      }
      getSmsDetails(params).then(response => {
        this.detailList = response.data.data.list
        this.total2 = response.data.data.totalRows
        this.listLoading2 = false
      })
    },
    memberDetail (detail) {
      const row = {
        'id': detail.memberId
      }
      this.$router.push({ name: '会员详情', params: { 'memberDetail': row, 'querytype': '0' } })
    }
  }
}
