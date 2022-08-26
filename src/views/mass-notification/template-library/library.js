import Details from './components/details'
export default {
  data() {
    return {
      activeName: '1',
      currentpage: 1,
      limit: 10,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      query: {
        title: '' // 标题
      },
      listLoading: false,
      random: 1 // 动态改变table试图
    }
  },
  components: {
    Details
  },
  created() {
    this.list.push({ title: '1' })
  },
  methods: {
    // 切换头部tabs
    handleClick() {
      this.query.title = ''
      this.listLoading = true
      this.fetchData(true)
    },
    // 表格数据
    fetchData(reset) {
      if (reset) this.currentPage = 1
      this.list = []
      this.list.push({
        uname: '1'
      })
      this.listLoading = false
      //   this.total = res.data.totalRows
      this.random = Math.random()
      console.log('list', this.list)
    },
    // 跳转添加模板
    onSynchronization() {
      //  activeName   1:短信 2：消息订阅  3：app
      this.$router.push({
        path: '/template-library/synchronization/index',
        query: {
          id: 1,
          activeName: this.activeName
        }
      })
    },
    // 详情
    particulars() {
      this.$refs.details.show()
    },

    handleSizeChange(val) {
      this.limit = val
      this.fetchData(true)
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    }
  }
}
