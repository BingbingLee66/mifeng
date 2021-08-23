import { getList,  save, delChannel } from '@/api/mall/channel'

export default {
  data() {
    var checkChannelName = (rule, value, callback) => {
      if (value.trim().length > 20) {
        return callback(new Error('渠道名称请控制在20字内'))
      } else {
        return callback()
      }
    }
    return {
      visible: false,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      formObj: {
        createdTs: 0,
        id: 0,
        operatorId: 0,
        channelName: '',
        operatorName: ''
      },
      rules: {
        channelName: [
          { required: true, message: '供货商家名称不能为空', trigger: 'blur' },
          { validator: checkChannelName, trigger: 'blur' }
        ],
      }
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
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage
      }
      getList(params).then(response => {
        this.list = response.data.list
        this.total = response.data.totalRows
        this.listLoading = false
      })
    },
    addSupplier (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        channelName: ''
      }
      this.visible = true
    },
    edit (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        id: row.id,
        channelName: row.channelName
      }
      this.visible = true
    },
    delChannel (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('', '确定删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'id': row.id
        }
        delChannel(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.init()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    save (row) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save(this.formObj).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.visible = false
            this.fetchData()
          })
        } else {
          return false
        }
      })
    }
  }
}
