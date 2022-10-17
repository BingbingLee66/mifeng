import { getList, updateStatus, save, delRole } from '@/api/authority/manager'

export default {
  data() {
    const checkName = (rule, value, callback) => {
      if (!/^\S{1,15}$/.test(value)) {
        return callback(new Error('角色长度为1-15个字！'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      visible: false,
      formObj: {},
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      rules: {
        roleName: [
          { required: true, message: '角色不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    hasPermission(tabName, actionName) {
      this.$store.dispatch('permission/hasPermission', { tabName, actionName })
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
      const params = {
        pageSize: this.limit,
        page: this.currentpage,
        ckey: this.$store.getters.ckey === null ? '' : this.$store.getters.ckey
      }
      getList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    add(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        roleName: '',
        status: 1,
        ckey: this.$store.getters.ckey === null ? '' : this.$store.getters.ckey
      }
      this.visible = true
    },
    edit(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        id: row.id,
        roleName: row.roleName,
        status: row.status,
        ckey: row.ckey
      }
      this.visible = true
    },
    save() {
      save(this.formObj).then(res => {
        console.log(res, 'Res Res   Res   Res')
        if (res.state === 0) return this.$message({ message: res.msg, type: 'error' })
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.visible = false
        this.$refs['form'].resetFields()
        this.fetchData()
      })
    },
    updateStatus(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      const params = {
        id: row.id,
        action: row.status === 0 ? 'active' : 'notactive'
      }
      updateStatus(params).then(() => {
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
    delRole(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('', '确定删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const params = {
          id: row.id
        }
        delRole(params).then(() => {
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
    setup(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('authority-manager', this.$route.path)
      this.$router.push({ name: '权限设置', params: { roleId: row.id } })
    }
  }
}
