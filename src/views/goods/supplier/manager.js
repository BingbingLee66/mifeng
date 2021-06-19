import { getList, updateStatus, save } from '@/api/goods/supplier'
// import { mapGetters } from 'vuex'

export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value)) {
        return callback(new Error('号码格式不正确'))
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
        ckey: '',
        createdTs: 0,
        id: 0,
        operatorId: 0,
        status: 0,
        supplierName: '',
        supplierPhone: '',
        updatedTs: 0
      },
      rules: {
        supplierName: [
          { required: true, message: '供货商家名称不能为空', trigger: 'blur' }
        ],
        supplierPhone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { validator: checkPhone, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    // ...mapGetters(['has'])
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
        'page': this.currentpage,
        'ckey': this.$store.getters.ckey
      }
      getList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    updateStatus(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'supplierId': row.id,
        'status': row.status === 1 ? 2 : 1
      }
      updateStatus(params).then(response => {
        if (row.status === 1) {
          this.$message({
            message: '冻结成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '解冻成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    addSupplier (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        ckey: this.$store.getters.ckey,
        // createdTs: 1621914685000,
        // id: 1,
        // operatorId: 1,
        // status: 0,
        supplierName: '',
        supplierPhone: ''
        // updatedTs: 1622454694000
      }
      this.visible = true
    },
    edit (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        ckey: '1nVvgt',
        // createdTs: 1621914685000,
        id: row.id,
        // operatorId: row.operatorId,
        // status: 0,
        supplierName: row.supplierName,
        supplierPhone: row.supplierPhone
        // updatedTs: 1622454694000
      }
      this.visible = true
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
