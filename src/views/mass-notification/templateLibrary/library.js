import Details from './components/details'
import { noticeTemplateList, getNoticeTemplateDetailById } from '@/api/mass-notification'
export default {
  data() {
    return {
      currentpage: 1,
      limit: 10,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      query: {
        title: '', // 标题
        type: '1' // 模板类型 1短信通知、2订阅消息、3APP通知
      },
      listLoading: false,
      random: 1 // 动态改变table视图
    }
  },
  components: {
    Details
  },
  created() {
    this.query.type = this.$route.query.type || '1'
  },
  mounted() {
    this.fetchData(true)
  },
  methods: {
    // 切换头部tabs
    handleClick() {
      this.query.title = ''
      this.total = 0
      this.limit = 10
      this.fetchData(true)
    },
    // 表格数据
    async fetchData(reset) {
      if (reset) this.currentpage = 1
      this.listLoading = true
      this.list = []
      let { type, title } = this.query
      let parmas = {
        type,
        title,
        pageSize: this.limit,
        page: this.currentpage
      }
      const res = await noticeTemplateList(parmas)
      this.listLoading = false
      if (res.state === 1) {
        this.list = res.data.list || []
        this.total = res.data.totalRows || 0
        this.random = Math.random()
      }
    },
    // 跳转添加模板
    onSynchronization() {
      //  query.type   1:短信 2：消息订阅  3：app
      this.$router.push({
        path: '/template-library/synchronization/index',
        query: {
          type: this.query.type
        }
      })
    },
    // 详情
    async particulars(row) {
      const res = await getNoticeTemplateDetailById({ id: row.id })
      this.$refs.details.show(res)
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
