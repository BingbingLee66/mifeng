import { getList, save, updateStatus, del } from '@/api/member/post'
// import { mapGetters } from 'vuex'

export default {
  data () {
    var checkFee = (rule, value, callback) => {
      if (!/^[0]$|^(([1-9]\d*)|[0]\.\d{1,2}|([1-9]\d*)\.\d{1,2})$/.test(value)) {
        return callback(new Error('可以为0或最多两位小数的正数'))
      } else {
        return callback()
      }
    }
    var checkNumber = (rule, value, callback) => {
      if (!/^([1-9]\d*)$/.test(value)) {
        return callback(new Error('必须是大于0的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      visible: false,
      formObj: {
        id: 0,
        postName: '',
        memberFee: 0,
        level: ''
      },
      list: [],
      listLoading: false,
      type: 'add',
      rules: {
        postName: [
          { required: true, message: '职业名称不能为空', trigger: 'blur' }
        ],
        memberFee: [
          { validator: checkFee, trigger: 'change' }
        ],
        level: [
          { required: true, message: '排序不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    memberFeeCp () {
      return function (memberFee) {
        let result = '￥' + memberFee
        if (memberFee >= 100000000) {
          result = '￥' + (memberFee / 100000000) + '亿'
        } else if (memberFee >= 10000) {
          result = '￥' + (memberFee / 10000) + '万'
        }
        return result
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    init () {
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      let params = {
        ckey: this.$store.getters.ckey
      }
      getList(params).then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    },
    add (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        'ckey': this.$store.getters.ckey,
        'postName': '',
        'memberFee': 0,
        'level': ''
      }
      this.type = 'add'
      this.visible = true
    },
    edit (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.type = 'edit'
      this.formObj = {
        'id': row.id,
        'ckey': row.ckey,
        'postName': row.postName,
        'memberFee': row.memberFee,
        'level': row.level
      }
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
    },
    del (row) {
      this.$confirm('', '确定删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'id': row.id
        }
        del(params).then(response => {
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
    updateStatus (row) {
      let params = {
        'id': row.id,
        'action': row.status === 0 ? 'active' : 'notactive'
      }
      updateStatus(params).then(response => {
        if (row.status === 0) {
          this.$message({
            message: '启用成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '禁用成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    }
  }
}
