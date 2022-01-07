import { getList, save, updateStatus } from '@/api/content/articleSource'

export default {
  data() {
    return {
      visible: false,
      pageSizes: [10, 20, 50, 100, 500],
      list: [],
      total: 0,
      limit: 10,
      currentpage: 1,
      listLoading: false,
      formObj: {},
      query: {
        source: '',
        creator: '',
        status: -1
      },
      rules: {
        source: [
          { required: true, message: '文章来源不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    this.init()
  },
  methods: {
    queryData() {
      this.currentpage = 1
      this.fetchData()
    },
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    handleClick() {
      this.fetchData()
    },
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'source': this.query.source,
        'status': this.query.status,
        'creator': this.query.creator
      }
      getList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
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
    openVisible(row) {
      this.formObj = {
        'id': row.id,
        'source': row.source
      }
      this.visible = true
    },
    updateStatus(row) {
      let params = {
        'id': row.id,
        'action': row.status === 0 ? 'active' : 'notactive'
      }
      updateStatus(params).then(response => {
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
    },
    add() {
      this.formObj = {}
      this.visible = true
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save(this.formObj).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.fetchData()
            this.visible = false
          })
        } else {
          return false
        }
      })
    }
  }
}
