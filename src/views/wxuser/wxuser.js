import { getUserList, updateUserStatus } from '@/api/member/manager'
import { getChamberAllList } from '@/api/goods/goods'

export default {
  data() {
    return {
      chamberOptions: [],
      listLoading: false,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      typeOptions: [],
      query: {
        uname: '',
        mulValue: '',
        userType: -1,
        chamberId: -1,
        status: -1,
        date: ''
      }
    }
  },
  computed: {},
  created() {
    this.getAllChamberList()
    this.init()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
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
    init() {
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    getAllChamberList() {
      getChamberAllList().then(res => {
        console.log('所有商会列表：', res)
        if (res.state === 1) {
          this.chamberOptions = res.data.data
          this.chamberOptions.unshift({ 'name': '全部', 'id': -1 }, { 'name': '未加入商会', 'id': -2 })
          this.aLLChamberlist
          this.listLoading = false
        } else {
          console.log(res)
          this.listLoading = false
        }
      })
    },
    fetchData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
        this.currentpage = 1
      }
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'userType': this.query.userType,
        'status': this.query.status,
        'chamberId': this.query.chamberId
      }
      if (this.query.mulValue) {
        params['mulValue'] = this.query.mulValue
      }
      if (this.query.chamberName) {
        params['chamberName'] = this.query.chamberName
      }
      if (this.query.uname) {
        params['uname'] = this.query.uname
      }
      if (this.query.date) {
        params['startTs'] = this.query.date[0]
        params['endTs'] = this.query.date[1]
      }
      getUserList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '用户详情', params: { 'userDetail': row }})
    },
    updateStatus(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'userId': row.id,
        'action': row.status === 0 ? 'active' : 'notactive'
      }
      updateUserStatus(params).then(response => {
        if (row.status === 0) {
          this.$message({
            message: '解冻成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '冻结成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    }
  }
}
