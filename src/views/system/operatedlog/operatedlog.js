import { getOperatedType, getLogList } from '@/api/system/operatedlog'

export default {
  data () {
    return {
      listLoading: false,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      typeOptions: [],
      query: {
        actionName: '',
        operator: '',
        date: ''
      }
    }
  },
  computed: {},
  created () {
    this.getOperatedType()
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
    getOperatedType () {
      getOperatedType().then(response => {
        this.typeOptions = response.data.data
      })
    },
    init () {
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    fetchData (e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage
      }
      if (this.query.actionName) {
        params['actionName'] = this.query.actionName
      }
      if (this.query.operator) {
        params['operator'] = this.query.operator
      }
      if (this.query.date) {
        params['startTs'] = this.query.date[0]
        params['endTs'] = this.query.date[1]
      }
      getLogList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    }
  }
}
