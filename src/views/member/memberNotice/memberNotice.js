import { getMemberFeeNoticeList, sendSms } from '@/api/member/memberFee'
import { getMemberOptions } from '@/api/member/post'
import { getSetting } from '@/api/system/setting'

export default {
  data() {
    return {
      memberPostOptions: [],
      query: {
        uname: '',
        memberName: '',
        phone: '',
        type: -1,
        memberPostId: -1
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      smsVisible: false,
      typeOptions: [
        {
          label: '所有',
          value: -1
        },
        {
          label: '已缴会费',
          value: 1
        },
        {
          label: '未缴会费',
          value: 2
        }
      ],
      formObj: {
        msg: ''
      },
      selectionDatas: [],
      rules: {
        msg: [
          { required: true, message: '短信内容不能为空', trigger: 'blur' },
          { max: 200, message: '短信内容最多200个字', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    this.getMemberType()
    this.init()
    this.getMemberFeeMsg()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
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
    getMemberType() {
      let params = {
        ckey: this.$store.getters.ckey
      }
      getMemberOptions(params).then(response => {
        this.memberPostOptions = response.data.data
        this.memberPostOptions.unshift({ 'label': '全部', 'value': -1 })
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
        this.limit = 10
        this.currentpage = 1
      }
      this.listLoading = true
      let params = {
        'uname': this.query.uname,
        'memberName': this.query.memberName,
        'phone': this.query.phone,
        'type': this.query.type,
        'memberPostId': this.query.memberPostId,
        'pageSize': this.limit,
        'page': this.currentpage
      }
      getMemberFeeNoticeList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    openSmsVisible(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.smsVisible = true
    },
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        this.selectionDatas.push(data)
      }
    },
    getMemberFeeMsg() {
      let params = {
        key: 'memberFeeMsg'
      }
      getSetting(params).then(response => {
        this.formObj.msg = response.data.value
      })
    },
    sendSms() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.selectionDatas.length === 0) {
            this.$message.error({
              message: '没有选择记录，操作失败'
            })
            return
          }
          let dto = []
          for (let data of this.selectionDatas) {
            dto.push(data.phone)
          }
          let param = {
            'mobiles': dto.join(','),
            'msg': this.formObj.msg,
            'type': 0, // 立即发送
            'sendTs': null
          }
          sendSms(param).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.selectionDatas = []
            this.$refs.membertable.clearSelection() // 取消多选
            this.smsVisible = false
          })
        } else {
          return false
        }
      })
    },
    closeVisible() {
      this.smsVisible = false
    },
    smsRecords(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '短信记录' })
    }
  }
}
