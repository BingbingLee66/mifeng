import { getList, updateStatus, save, delRole } from '@/api/authority/user'
import { getOptions } from '@/api/authority/manager'
import { mapState } from 'vuex'
export default {
  data() {
    var checkUserName = (rule, value, callback) => {
      if (!/(^[a-zA-Z]{1}[a-zA-Z0-9]{5,11}$)|(^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$)/.test(value)) {
        return callback(new Error('账号只能为字母和数字，且以字母开头，长度为6-12个字符！或为11位手机号码'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    var checkPassword = (rule, value, callback) => {
      if (!/^[a-zA-Z0-9]{6,20}$/.test(value)) {
        return callback(new Error('密码只能为字母和数字，长度为6-20个字符！'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    var checkName = (rule, value, callback) => {
      if (!/^\S{1,20}$/.test(value)) {
        return callback(new Error('名字长度为1-20个字符！'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    var checkCkey = (rule, value, callback) => {
      if (!/(^$)|(^[a-zA-Z0-9]{6}$)/.test(value)) {
        return callback(new Error('ckey长度为6个字符！'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      visible: false,
      formObj: {
        userName: '',
        password: '',
        remark: '',
        roleId: '',
        ckey: this.$store.getters.ckey === null ? '' : this.$store.getters.ckey
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      roleOptions: [],
      type: 'add',
      users: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { validator: checkUserName, trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: checkPassword, trigger: 'change' }
        ],
        remark: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'change' }
        ],
        roleId: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ],
        ckey: [
          { validator: checkCkey, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    roleName(row) {
      return function (row) {
        for (let v of this.roleOptions) {
          if (v.value === row.roleId) {
            return v.label
          }
        }
        return '未知角色'
      }
    },
    ...mapState({
      ckey: state => state.user.ckey
    })


  },
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
      this.getRoleOptions()
    },
    getRoleOptions() {
      let params = {
        'ckey': this.$store.getters.ckey === null ? '' : this.$store.getters.ckey
      }
      getOptions(params).then(response => {
        this.roleOptions = response.data.data
      })
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'ckey': this.$store.getters.ckey === null ? '' : this.$store.getters.ckey
      }
      getList(params).then(response => {
        this.list = response.data.data.list
        for (let obj of this.list) {
          obj.password = ''
        }
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    add(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.type = 'add'
      this.formObj = {
        'roleName': '',
        'status': 1,
        'userName': '',
        'password': '',
        'remark': '',
        'roleId': '',
        'ckey': this.$store.getters.ckey === null ? '' : this.$store.getters.ckey
      }
      this.visible = true
    },
    edit(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.type = 'edit'
      this.formObj = {
        'id': row.id,
        'userName': row.userName,
        'password': row.password,
        'remark': row.remark,
        'roleId': row.roleId,
        'ckey': row.ckey
      }
      if (!this.formObj.ckey) {
        this.formObj.ckey = ''
      }
      this.visible = true
    },
    save(row) {
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
    },
    updateStatus(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
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
    delRole(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('', '确定删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'id': row.id
        }
        delRole(params).then(response => {
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
    setup(row) {
      this.$router.push({ name: '权限设置', params: { 'roleId': row.id } })
    }
  }
}
