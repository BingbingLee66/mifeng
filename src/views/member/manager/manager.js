import {list, updateStatus, transferPresident} from '@/api/member/manager'
import {getMemberOptions} from '@/api/member/post'
import {getTradeOptions} from '@/api/system/trade'
import {exportJson2Excel} from '@/utils/exportExcel'

export default {
  data() {
    var checkPass = (rule, value, callback) => {
      if (!/^\w*$/.test(value)) {
        return callback(new Error('密码只能由字母、数字和下划线"_"组成！'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      memberPostOptions: [],
      tradeOptions: [],
      tradeCas: -1,
      query: {
        mulValue: '',
        memberPostType: -1,
        type: -1,
        tradeType: -1,
        date: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      roleId: this.$store.state.user.profile.roleId,
      transferVisible: false,
      formObj: {},
      rules: {
        password: [
          {required: true, message: '账号密码不能为空', trigger: 'blur'},
          {validator: checkPass, trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    nativePlaceStr() {
      return function (str) {
        if (str === null) {
          return ''
        }
        return str.replace(new RegExp('-', 'gm'), '')
      }
    }
  },
  created() {
    this.getMemberType()
    this.getTradeType()
    this.init()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({tabName, actionName})
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({tabName, actionName})
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
    getMemberType() {
      let params = {
        ckey: this.$store.getters.ckey
      }
      getMemberOptions(params).then(response => {
        this.memberPostOptions = response.data.data
        this.memberPostOptions.unshift({'label': '全部', 'value': -1})
      })
    },
    getTradeType() {
      let params = {
        ckey: this.$store.getters.ckey
      }
      getTradeOptions(params).then(response => {
        this.tradeOptions = response.data.data
        this.tradeOptions.unshift({'label': '全部', 'value': -1})
      })
    },
    init() {
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    fetchData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.listLoading = true
      const params = {
        'ckey': this.$store.getters.ckey,
        'memberPostType': this.query.memberPostType,
        'type': this.query.type,
        'tradeType': this.query.tradeType,
        'pageSize': this.limit,
        'page': this.currentpage,
        'department': -1
      }
      if (this.query.mulValue) {
        params['mulValue'] = this.query.mulValue
      }
      if (this.query.date) {
        params['startTs'] = this.query.date[0]
        params['endTs'] = this.query.date[1]
      }
      list(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    add(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('membereditor', this.$route.path)
      this.$router.push({ name: '添加会员' })
    },
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('membereditor', this.$route.path)
      this.$router.push({name: '会员详情', params: {'memberDetail': row, 'querytype': '0'}})
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
    handlerChange(value) {
      this.query.tradeType = value[value.length - 1]
    },
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        let new_data = {
          '姓名/企业名称': data.name ? data.name : data.companyName,
          '手机号/联系方式': data.phone ? data.phone : data.companyPhone,
          '会内职位': data.postName,
          '行业': data.tradeName,
          '入会类型': data.type == 0 ? '个人' : '企业',
          '入会时间': data.joinedTs,
          '状态': data.status == 1 ? '正常' : '已冻结'
        }
        this.selectionDatas.push(new_data)
      }
    },
    exportExcel(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      console.log(this.selectionDatas)
      exportJson2Excel(this.selectionDatas)
    },
    openTransfer(row) {
      this.formObj = row
      this.transferVisible = true
    },
    transferPresident() {
      this.$confirm('确认转换会长将会把平台所有权转换，请谨慎操作', '确定转换给该会员？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'memberId': this.formObj.id,
          'ckey': this.$store.getters.ckey,
          'phone': this.formObj.phone,
          'president': this.formObj.name,
          'password': this.formObj.password
        }
        transferPresident(params).then(response => {
          this.$message({
            message: '转换成功',
            type: 'success'
          })
          this.transferVisible = false
        })
      })
    }
  }
}
