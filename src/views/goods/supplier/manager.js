import {
  getList,
  updateStatus,
  save,
  setUpSettlementPeriod
} from '@/api/goods/supplier'
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
    var checkBankCard = (rule, value, callback) => {
      if (!/^[0-9]*$/.test(value)) {
        return callback(new Error('请输入正确的银行卡号'))
      } else {
        return callback()
      }
    }

    return {
      settlementPeriodVisible: false,
      settlementPeriodObj: {
        id: 0,
        supplierName: '',
        settlementPeriod: '',
        settlementDay: null,
        settlementDayOne: null,
        settlementDayTwo: null,
        settlementDayThree: null,
      },
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
        updatedTs: 0,
        companyName: '', // 单位名称/账户名
        bankName: '', // 开户行
        bankCard: null, // 银行卡号
      },
      rules: {
        supplierName: [{
          required: true,
          message: '供货商家名称不能为空',
          trigger: 'blur'
        }],
        supplierPhone: [{
            required: true,
            message: '联系电话不能为空',
            trigger: 'blur'
          },
          {
            validator: checkPhone,
            trigger: 'change'
          }
        ],
        companyName: [{
          required: true,
          message: '请填写单位名/账户名称',
          trigger: 'blur'
        }],
        bankName: [{
          required: true,
          message: '请填写开户行',
          trigger: 'blur'
        }],
        bankCard: [{
          required: true,
          message: '请填写银行卡号',
          trigger: 'blur'
        }, {
          validator: checkBankCard,
          trigger: 'change'
        }]
      },
      settlementPeriodObjRules: {
        settlementPeriod: [{
          required: true,
          message: '请选择结算周期',
          trigger: 'change'
        }]
      },
      weekOptions: [{
          value: 1,
          label: '每周一'
        },
        {
          value: 2,
          label: '每周二'
        },
        {
          value: 3,
          label: '每周三'
        },
        {
          value: 4,
          label: '每周四'
        },
        {
          value: 5,
          label: '每周五'
        },
        {
          value: 6,
          label: '每周六'
        },
        {
          value: 7,
          label: '每周日'
        },
      ],
      halfMonthOptions: [{
        value: 1,
        label: '每月1号、16号'
      }, {
        value: 2,
        label: '每月2号、17号'
      }, {
        value: 3,
        label: '每月3号、18号'
      }, {
        value: 4,
        label: '每月4号、19号'
      }, {
        value: 5,
        label: '每月5号、20号'
      }, {
        value: 6,
        label: '每月6号、21号'
      }, {
        value: 7,
        label: '每月7号、22号'
      }, {
        value: 8,
        label: '每月8号、23号'
      }, {
        value: 9,
        label: '每月9号、24号'
      }, {
        value: 10,
        label: '每月10号、25号'
      }, {
        value: 11,
        label: '每月11号、26号'
      }, {
        value: 12,
        label: '每月12号、27号'
      }, {
        value: 13,
        label: '每月13号、28号'
      }],
      monthOptions: [{
        value: 1,
        label: '每月1号'
      }, {
        value: 2,
        label: '每月2号'
      }, {
        value: 3,
        label: '每月3号'
      }, {
        value: 4,
        label: '每月4号'
      }, {
        value: 5,
        label: '每月5号'
      }, {
        value: 6,
        label: '每月6号'
      }, {
        value: 7,
        label: '每月7号'
      }, {
        value: 8,
        label: '每月8号'
      }, {
        value: 9,
        label: '每月9号'
      }, {
        value: 10,
        label: '每月10号'
      }, {
        value: 11,
        label: '每月11号'
      }, {
        value: 12,
        label: '每月12号'
      }, {
        value: 13,
        label: '每月13号'
      }, {
        value: 14,
        label: '每月14号'
      }, {
        value: 15,
        label: '每月15号'
      }, {
        value: 16,
        label: '每月16号'
      }, {
        value: 17,
        label: '每月17号'
      }, {
        value: 18,
        label: '每月18号'
      }, {
        value: 19,
        label: '每月19号'
      }, {
        value: 20,
        label: '每月20号'
      }, {
        value: 21,
        label: '每月21号'
      }, {
        value: 22,
        label: '每月22号'
      }, {
        value: 23,
        label: '每月23号'
      }, {
        value: 24,
        label: '每月24号'
      }, {
        value: 25,
        label: '每月25号'
      }, {
        value: 26,
        label: '每月26号'
      }, {
        value: 27,
        label: '每月27号'
      }, {
        value: 28,
        label: '每月28号'
      }, ],
    }
  },
  computed: {
    // ...mapGetters(['has'])
  },
  created() {
    this.init()
  },
  filters: {
    filterSettlementPeriod(val, day, week, half, month) {
      let obj = {}
      if (day === 1) {
        obj = week.find(item => {
          return item.value == val
        })
      }else if(day === 2){
        obj = half.find(item => {
          return item.value == val
        })
      }else if(day === 3){
        obj = month.find(item => {
          return item.value == val
        })
      }else {
        obj = {}
      }
      return obj.label ? obj.label : '--'
    },
  },
  methods: {
    radioChange(val) {
      // if (val) {
      //   this.settlementPeriodObj.settlementDay = null
      // }
    },
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
    // 点击设置结算周期
    setUpSettlementPeriod(e, row) {
      this.settlementPeriodObj.supplierName = row.supplierName
      this.settlementPeriodObj.id = row.id
      this.settlementPeriodObj.settlementPeriod = row.settlementPeriod + ''
      if (this.settlementPeriodObj.settlementPeriod === '1') {
        this.settlementPeriodObj.settlementDayOne = row.settlementDay
      } else if (this.settlementPeriodObj.settlementPeriod === '2') {
        this.settlementPeriodObj.settlementDayTwo = row.settlementDay
      } else if (this.settlementPeriodObj.settlementPeriod === '3') {
        this.settlementPeriodObj.settlementDayThree = row.settlementDay
      } else {
        this.settlementPeriodObj.settlementDayThree = this.settlementPeriodObj.settlementDayTwo = this.settlementPeriodObj.settlementDayOne = ''
      }
      this.settlementPeriodVisible = true
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
        // console.log(response);
        // return
        this.list = response.data.list
        this.total = response.data.totalRows
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
    addSupplier(e) {
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
    edit(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        ckey: '1nVvgt',
        // createdTs: 1621914685000,
        id: row.id,
        // operatorId: row.operatorId,
        // status: 0,
        supplierName: row.supplierName,
        supplierPhone: row.supplierPhone,
        companyName: row.companyName,
        bankName: row.bankName,
        bankCard: row.bankCard,
        // updatedTs: 1622454694000
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
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          switch (this.settlementPeriodObj.settlementPeriod) {
            case '1':
              if (!this.settlementPeriodObj.settlementDayOne) {
                return this.$message.error('请选择结算周期')
              } else {
                this.settlementPeriodObj.settlementDay = this.settlementPeriodObj.settlementDayOne
                break
              }
              case '2':
                if (!this.settlementPeriodObj.settlementDayTwo) {
                  return this.$message.error('请选择结算周期')
                } else {
                  this.settlementPeriodObj.settlementDay = this.settlementPeriodObj.settlementDayTwo
                  break
                }
                case '3':
                  if (!this.settlementPeriodObj.settlementDayThree) {
                    return this.$message.error('请选择结算周期')
                  } else {
                    this.settlementPeriodObj.settlementDay = this.settlementPeriodObj.settlementDayThree
                    break
                  }
          }
          console.log(this.settlementPeriodObj);
          let params = {
            id: this.settlementPeriodObj.id,
            settlementPeriod: this.settlementPeriodObj.settlementPeriod,
            settlementDay: this.settlementPeriodObj.settlementDay
          }
          this.listLoading = true
          let res = await setUpSettlementPeriod(params)
          this.listLoading = true
          try {
            this.listLoading= false
            if(res.state !== 1) return this.$message.error(res.msg)
            this.$message.success('设置成功')
            this.settlementPeriodVisible = false
            this.fetchData()
          } catch (e) {
            this.listLoading = false
            console.log(e)
          }
        } else {
          return false
        }
      })
    },
  }
}
