import { getList, save, updateStatus } from '@/api/content/articleSource'

export default {
  data() {
    return {
      visible: false,
      list: [],
      listLoading: false,
      formObj: {},
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
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    handleClick () {
      this.fetchData()
    },
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    },
    openVisible (row) {
      this.formObj = {
        'id': row.id,
        'source': row.source
      }
      this.visible = true
    },
    updateStatus (row) {
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
    add () {
      this.formObj = {}
      this.visible = true
    },
    save () {
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
