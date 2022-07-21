import { getMemberFeeList, getMemberList, memberFeePay } from '@/api/member/memberFee'
import { getList } from '@/api/member/post'

export default {
  data() {
    return {
      memberPostOptions: [],
      query: {
        uname: '',
        memberName: '',
        phone: '',
        date: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      visible: false,
      memberQuery: {
        uname: '',
        memberPostType: { id: 0 },
        memberName: '',
        phone: ''
      },
      pageSizes1: [10, 20, 50, 100, 500],
      total1: 0,
      list1: [],
      currentpage1: 1,
      limit1: 10,
      listLoading1: false,
      yearsOptions: [
        {
          label: '1年',
          value: 1
        },
        {
          label: '2年',
          value: 2
        },
        {
          label: '3年',
          value: 3
        },
        {
          label: '4年',
          value: 4
        },
        {
          label: '5年',
          value: 5
        }
      ],
      formObj: {
        date: '',
        years: 1
      },
      memberFee: 0,
      selectionDatas: [],
      rules: {
        date: [
          { required: true, message: '缴费时间不能为空', trigger: 'blur' }
        ],
        years: [
          { required: true, message: '缴费年限不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  created() {
    this.getMemberType()
    this.initDateTimePicker()
    this.init()
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
    handleSizeChange1(val) {
      console.log(`每页 ${val} 条`)
      this.limit1 = val
      this.currentpage1 = 1
      this.getMember()
    },
    handleCurrentChange1(val) {
      console.log(`当前页: ${val}`)
      this.currentpage1 = val
      this.getMember()
    },
    getMemberType() {
      let params = {
        ckey: this.$store.getters.ckey
      }
      getList(params).then(response => {
        this.memberPostOptions = response.data.data
        if (this.memberPostOptions.length > 0) {
          this.memberQuery.memberPostType = this.memberPostOptions[0]
          this.memberFee = this.memberPostOptions[0].memberFee
        }
      })
    },
    init() {
      // if (this.has('', '查询')) {
        this.fetchData()
      // }
    },
    initDateTimePicker() {
      // 初始化1年
      // const end = new Date()
      // const start = new Date()
      // start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
      // this.$set(this.query, 'date', [start, end])
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
        'pageSize': this.limit,
        'page': this.currentpage
      }
      if (this.query.date) {
        params['startTime'] = this.query.date[0]
        params['endTime'] = this.query.date[1]
      }
      console.log('params', params)
      getMemberFeeList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
        console.log('list',this.list)
      })
    },
    openVisible(e) {
      this.currentpage1 = 1
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.visible = true
      this.getMember()
    },
    getMember() {
      this.listLoading1 = true
      let params = {
        'uname': this.memberQuery.uname,
        'memberPostId': this.memberQuery.memberPostType.id,
        'memberName': this.memberQuery.memberName,
        'phone': this.memberQuery.phone,
        'pageSize': this.limit1,
        'page': this.currentpage1
      }
      getMemberList(params).then(response => {
        this.list1 = response.data.data.list
        this.total1 = response.data.data.totalRows
        this.listLoading1 = false
        console.log('list1',this.list1)
      })
    },
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        this.selectionDatas.push(data)
      }
    },
    changeFee(post) {
      this.memberFee = post.memberFee
    },
    addMemberFee() {
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
            let obj = {
              'uname': data.uname,
              'chamberName': data.chamberName,
              'memberId': data.id,
              'memberName': data.type === 0 ? data.name : data.contactName,
              'memberPostId': this.memberQuery.memberPostType.id,
              'memberPostName': this.memberQuery.memberPostType.postName,
              'phone': data.type === 0 ? data.phone : data.contactPhone,
              'wxUserId': data.auditorId
            }
            dto.push(obj)
          }
          let param = {
            'date': this.formObj.date,
            'years': this.formObj.years,
            'memberFee': this.memberFee * this.formObj.years,
            'dto': dto
          }
          memberFeePay(param).then(response => {
            let memberNameResp = response.data.memberName
            if (memberNameResp.length === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            } else {
              this.$alert(memberNameResp, '以下会员的缴费记录添加失败', {
                confirmButtonText: '确定',
                callback: action => {
                }
              })
            }
            this.fetchData()
            this.visible = false
          })
        } else {
          return false
        }
      })
    },
    closeVisible() {
      this.memberQuery = {
        memberPostType: { id: 0 },
        memberName: '',
        phone: ''
      }
      this.total1 = 0
      this.list1 = []
      this.currentpage1 = 1
      this.limit1 = 10
      this.visible = false
      this.memberFee = 0
      this.formObj = {
        date: '',
        years: 1
      }
      this.selectionDatas = []
    }
  }
}
