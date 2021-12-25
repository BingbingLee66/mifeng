import {
  add,
  detailList,
  excitataionTime,
  guideTable,
  list
} from '@/api/operate/operate'

export default {
  data() {
    return {
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      query: {
        id: '',
        name: '',
        queryDate: [],
        totalPrice: '',
        errMsg: ''
      },
      visible: false,
      listLoading: false,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 查询活动列表
    fetchData(e) {
      if (e !== undefined) {
        this.currentpage = 1
      }
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
      }
      list(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
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
    openDialog() {
      this.visible = true
    },
    detail(e, row) {
      window.localStorage.setItem('operateDetail', this.$route.path)
      console.log(row.id)
      this.$router.push({ name: '邀请有礼活动详情', params: { 'operateId': row.id }})
    },
    edit(e, row) {
      this.visible = true
      console.log(row.id)
      console.log(row.validDateStart)
      console.log(row.validDateEnd)
      console.log(row.totalAmount)
      this.query.id = row.id
      this.query.name = row.name
      // this.query.queryDate[0] = row.validDateStart
      // this.query.queryDate[1] = row.validDateEnd
      this.query.totalPrice = row.totalAmount
    },
    onSubmit() {
      let params = {
        'id': this.query.id,
        'name': this.query.name,
        'validDateStart': this.query.queryDate[0],
        'validDateEnd': this.query.queryDate[1],
        'totalAmount': this.query.totalPrice,
      }
      add(params).then(res => {
        if (res.state === 1) {
          this.visible = false
        } else {
          this.errMsg = res.msg
        }
      })
    }
  }
}
