import {
  getList,
  save,
  updateStatus,
  updateColumnLevel,
  delColumn,
  updateSpecialCommittee,
  showSpecialCommittee
} from '@/api/content/columnsetup'
import kdDialog from '@/components/common/kdDialog'
export default {
  data() {
    /*  const checkNumber = (rule, value, callback) => {
      if (!/^([1-9]\d*)$/.test(value)) {
        return callback(new Error('必须是大于0的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    } */
    const checkLevel = (rule, value, callback) => {
      if (!/^([0-9]\d*)$/.test(value)) {
        return callback(new Error('权重范围：0-999'))
      } else if (value > 999) {
        return callback(new Error('权重范围：0-999'))
      } else {
        callback()
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
          {
            required: true,
            message: '栏目名称不能为空',
            trigger: 'blur'
          }
        ],
        level: [
          {
            required: true,
            message: '权重不能为空',
            trigger: 'blur'
          },
          {
            validator: checkLevel,
            trigger: 'blur'
          }
        ]
      },
      // 权重rule
      levelRules: {
        level: [
          {
            required: true,
            message: '权重不能为空',
            trigger: 'blur'
          },
          {
            validator: checkLevel,
            trigger: 'blur'
          }
        ]
      },
      // 是否展示权重对话会
      dialogVisible: false,
      // 权重
      levelForm: {
        level: 0
      },
      // current column  Id
      currentId: null,
      page: 1,
      pageSize: 10,
      totalRows: 1000,
      isSpecialCommitteeBolVisible: false,
      table3Ckey: ''
    }
  },
  components: {
    'kd-dialog': kdDialog
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({
        tabName,
        actionName
      })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({
        tabName,
        actionName
      })
    },
    handleClick() {
      this.page = 1
      this.list = []
      this.fetchData()
    },
    async init() {
      this.fetchData()
    },
    async fetchData() {
      this.listLoading = true
      // 是否展示是否给专委会使用列
      const res = await showSpecialCommittee(this.$store.getters.ckey)
      if (res && res.state === 1) {
        this.isSpecialCommitteeBolVisible = res.data
        this.table3Ckey = Math.random()
      }
      const params = {
        ckey: this.$store.getters.ckey,
        contentModuleId: this.activeName,
        page: this.page,
        pageSize: this.pageSize
      }
      getList(params).then(response => {
        response.data.data.list.forEach(item => {
          item.isSpecialCommitteeBol = item.isSpecialCommittee === 1
        })
        this.list = response.data.data.list

        this.totalRows = response.data.data.totalRows
        this.listLoading = false
      })
    },
    openVisible(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        id: row.id,
        ckey: row.ckey,
        columnName: row.columnName,
        level: row.level
      }
      this.visible = true
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
            message: '栏目已冻结',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    add(e) {
      this.dialogVisible = true
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {}
      // this.formObj.level = null
      this.visible = true
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.formObj['ckey'] = this.$store.getters.ckey
          this.formObj['contentModuleId'] = this.activeName
          this.formObj['columnName'] = this.formObj['columnName'].replace(/\s*/g, '')
          if (this.formObj['columnName'].length < 1) {
            this.$message({
              message: '栏目名称不能为空',
              type: 'error'
            })
            return
          }
          save(this.formObj).then(() => {
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
    // 设置权重
    setLevel(row) {
      this.currentId = row.id
      this.levelForm.level = row.level
      this.$refs['levelDialog'].show()
    },
    // 保存权重数据
    savePopupData() {
      this.$refs['levelForm'].validate(valid => {
        if (valid) {
          // 发请求
          updateColumnLevel({
            id: this.currentId,
            level: this.levelForm.level
          }).then(res => {
            if (res.state === 1) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.init()
            }
          })
          // 操作
          this.$refs['levelDialog'].hide()
          this.$refs['levelForm'].resetFields()
        } else {
          return false
        }
      })
    },
    // 当前页发生改变时触发
    currentChange(event) {
      this.page = event
      this.fetchData()
    },
    // 删除栏目
    delColumn(row) {
      this.$confirm('确认删除该栏目吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delColumn(row.id).then(response => {
            if (response.state === 1) {
              this.fetchData()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: response.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    /** 是否给专委会使用 */
    async handleSpecialCommitteeChange(e, row) {
      await updateSpecialCommittee({
        id: row.id,
        isSpecialCommittee: e ? 1 : 0
      })
    }
  }
}
