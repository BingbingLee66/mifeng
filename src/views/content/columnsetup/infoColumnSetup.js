import { getInfoColumnList, save, updateStatus, updateColumnLevel } from '@/api/content/columnsetup'
import
kdDialog
  from '@/components/common/kdDialog'
export default {
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!/^([0-9]\d*)$/.test(value)) {
        return callback(new Error('必须是大于0的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    };
    var checkLevel = (rule, value, callback) => {
      if (!/^([0-9]\d*)$/.test(value)) {
        return callback(new Error('权重范围：0-999'))
      } else if (value > 999) {
        return callback(new Error('权重范围：0-999'))
      } else {
        callback()
      }
    }
    return {
      checkList: [],
      //展示路径
      typeUrl: [],
      visible: false,
      list: [],
      listLoading: false,
      formObj: {
        typeUrl: ['1']
      },

      rules: {
        columnName: [
          { required: true, message: '栏目名称不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '排序不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ]
      },
      //权重rule
      levelRules: {
        level: [{
          required: true,
          message: '权重不能为空',
          trigger: 'blur'
        },
        {
          validator: checkLevel,
          trigger: 'blur'
        }
        ],
      },
      //权重对象
      levelForm: {
        level: ""
      },
      currentpage: 1,
      limit: 10,
      total: 0,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 500],
    }
  },
  computed: {
  },
  components: {
    'kd-dialog': kdDialog
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
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true;
      let params = {
        page: this.currentpage,
        pageSize: this.pageSize
      }
      getInfoColumnList(params).then(response => {
        this.list = response.data.data.list
        this.listLoading = false;
        this.total = response.data.data.totalRows
      })
    },
    openVisible(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        'id': row.id,
        'columnName': row.columnName,
        'level': row.level,
        'typeUrl': row.typeUrl
      }
      row.typeUrl == '3' ? this.typeUrl = ['1', '2'] : (this.formObj.typeUrl == '2' ? this.typeUrl = ['2'] : this.typeUrl = ['1'])
      this.visible = true
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
            message: '栏目已冻结',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    add(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {}
      this.typeUrl = []
      this.visible = true
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('formObj', this.formObj);
          if (this.typeUrl.length < 1) {
            this.$message({
              message: '请填写展示路径',
              type: 'error'
            })
            return;
          }
          let obj = {
            ...this.formObj,
            typeUrl: this.typeUrl.length > 1 ? 3 : this.typeUrl[0]
          }
          console.log(obj)
          save(obj).then(response => {
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
    //设置权重
    setLevel(row) {
      this.currentId = row.id;
      this.$refs['levelDialog'].show()
    },
    //保存权重数据
    savePopupData() {
      this.$refs['levelForm'].validate((valid) => {
        if (valid) {
          //发请求
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
          //操作
          this.$refs['levelDialog'].hide();
          this.$refs['levelForm'].resetFields();
        } else {
          return false;
        }
      });
    },
    //size改变
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1;
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
  }
}
