import { getPlatformFinanceChamber, getChamberOptions } from '@/api/finance/finance'
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      chamberOptions: []
    }
  },
  computed: {
    // ...mapGetters(['has'])
    chamberName () {
      return function(ckey) {
        let chamberName = ''
        for (let chamber of this.chamberOptions) {
          if (ckey === chamber.value) {
            chamberName = chamber.label
            break
          }
        }
        return chamberName
      }
    }
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
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
    init () {
      this.getChamberOptions()
      this.fetchData()
    },
    getChamberOptions () {
      getChamberOptions().then(response => {
        this.chamberOptions = response.data.data
      })
    },
    fetchData () {
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage
      }
      getPlatformFinanceChamber(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    detail (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '交易详情', params: { ckey: row.ckey } })
    }
  }
}
