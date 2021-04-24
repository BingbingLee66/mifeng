import { getList, save, updateStatus } from '@/api/content/columnsetup'

export default {
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!/^([1-9]\d*)$/.test(value)) {
        return callback(new Error('必须是大于0的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      visible: false,
      list: [],
      listLoading: false,
      formObj: {},
      activeName: '3',
      rules: {
        columnName: [
          { required: true, message: '栏目名称不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '排序不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'change' }
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
      let params = {
        'ckey': this.$store.getters.ckey,
        'contentModuleId': this.activeName
      }
      getList(params).then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    },
    openVisible (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        id: row.id,
        ckey: row.ckey,
        columnName: row.columnName,
        level: row.level
      }
      this.visible = true
    },
    updateStatus (e, row) {
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
            message: '栏目已冻结',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    add (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {}
      // this.formObj.level = null
      this.visible = true
    },
    save () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.formObj['ckey'] = this.$store.getters.ckey
          this.formObj['contentModuleId'] = this.activeName
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
