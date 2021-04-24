import { getTopList, cancelTop, countTop, setTop } from '@/api/content/article'

export default {
  data() {
    return {
      list: []
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
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getTopList().then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    },
    cancelTop (row) {
      let params = {
        'id': row.id
      }
      cancelTop(params).then(response => {
        this.$message({
          message: '取消置顶成功',
          type: 'success'
        })
        this.init()
      })
    },
    top (row) {
      this.$prompt('设置置顶位置', '置顶文章', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.typeName,
        inputPattern: /^[0-9]{1,2}$/,
        inputErrorMessage: '只能填数字'
      }).then(({ value }) => {
        let params = {
          'id': row.id,
          'level': value
        }
        setTop(params).then(response => {
          this.$message({
            message: '置顶成功',
            type: 'success'
          })
          this.init()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    }
  }
}
