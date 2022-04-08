import { list, updateStatus, transferPresident } from '@/api/member/manager'
import { getMemberOptions } from '@/api/member/post'
import { getTradeOptions } from '@/api/system/trade'
import { exportJson2Excel } from '@/utils/exportExcel'
import { sendSmsBatch } from '@/api/sms/sms.js'
import { getDepartmentList } from '@/api/org-structure/org'
// import { downLoad } from '@/directive/down-load-url'
import { getToken } from '@/utils/auth'
const baseUrl = process.env.VUE_APP_BASE_API
export default {
  name: '商/协会成员',
  // directives: { downLoad },
  directives: {
    downLoad: {
      inserted: (el, binding) => {
        el.style.cssText = 'cursor:pointer;'
        el.addEventListener('click', () => {
          console.log(binding.value)
          let link = document.createElement('a')
          let url = binding.value
          fetch(url).then(res => res.blob()).then(blob => {
            link.href = URL.createObjectURL(blob)
            console.log(link.href)
            link.download = '商会成员信息导入模板.xlsx'
            document.body.appendChild(link)
            link.click()
          })
        })
      }
    }
  },

  data() {
    var checkPass = (rule, value, callback) => {
      if (!/^\w*$/.test(value)) {
        return callback(new Error('密码只能由字母、数字和下划线"_"组成！'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      exportExcelModel: 'https://ysh-cdn.kaidicloud.com/prod/static/%E5%95%86%E4%BC%9A%E6%88%90%E5%91%98%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF%20%281%29.xlsx',
      departmentOptions: [],
      memberPostOptions: [],
      tradeOptions: [],
      tradeCas: -1,
      departmentCas: -1,
      query: {
        status: 1, // 状态
        sendStatus: -1,
        uname: '', // 用户名
        name: '', // 会员姓名
        phone: '', // 会员手机号
        contactName: '', // 联系人姓名
        contactPhone: '', // 联系人电话
        companyName: '', // 企业/团体名称
        memberPostType: -1, // 职位
        department: -1, // 部门
        type: -1, // 入会类型
        tradeType: -1, // 行业
        date: '', // 入会时间
        activatedState: 0 // 激活状态 -1未激活 0全部 1已激活
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      selectionIds: [],
      roleId: this.$store.state.user.profile.roleId,
      transferVisible: false,
      formObj: {},
      rules: {
        password: [
          { required: true, message: '账号密码不能为空', trigger: 'blur' },
          { validator: checkPass, trigger: 'change' }
        ]
      },
      visible: false,
      importUrl: '',
      execelDate: {},
      importQuery: {
        ckey: ''
      },
      uploadHeaders: {
        'access-token': ''
      },
    }
  },
  computed: {
    nativePlaceStr() {
      return function(str) {
        if (str === null) {
          return ''
        }
        return str.replace(new RegExp('-', 'gm'), '')
      }
    }
  },
  created() {
    this.getMemberType() // 获取商会职位数据
    this.getTradeType() // 获取行业数据
    this.getdepartmentType() // 获取部门数据
    this.init()
    this.importUrl = baseUrl + '/ec/member/import-excel'
    this.importQuery.ckey = this.$store.getters.ckey
    this.uploadHeaders['access-token'] = getToken() // 获取token
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    goEdit(e, row) {
      this.$router.push({
        name: '编辑会员',
        params: { 'memberId': row.id, 'querytype': 2 }
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    },

    getMemberType() {
      const params = {
        ckey: this.$store.getters.ckey
      }
      getMemberOptions(params).then(response => {
        this.memberPostOptions = response.data.data
        this.memberPostOptions.unshift({ 'label': '全部', 'value': -1 })
      })
    },

    getTradeType() {
      const params = {
        ckey: this.$store.getters.ckey
      }
      getTradeOptions(params).then(response => {
        this.tradeOptions = response.data.data
        this.tradeOptions.unshift({ 'label': '全部', 'value': -1 })
      })
    },

    getdepartmentType() {
      const params = {
        'ckey': this.$store.getters.ckey,
        'parentId': 0
      }
      getDepartmentList(params).then(res => {
        if (res.state === 1) {
          this.departmentOptions = res.data.data[0].departmentRespList
          this.departmentOptions.unshift({ 'departmentName': '全部', 'id': -1 })
        }
      })
    },

    init() {
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    fetchData(e) {
      if (e !== undefined) {
        this.currentpage = 1
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      // this.listLoading = true
      const params = {
        'status': this.query.status,
        'uname': this.query.uname,
        'ckey': this.$store.getters.ckey,
        'companyName': this.query.companyName,
        'contactName': this.query.contactName,
        'contactPhone': this.query.contactPhone,
        'name': this.query.name,
        'phone': this.query.phone,
        'memberPostType': this.query.memberPostType,
        'type': this.query.type,
        'tradeType': this.query.tradeType,
        'department': this.query.department,
        'activatedState': this.query.activatedState,
        'pageSize': this.limit,
        'page': this.currentpage
      }
      if (this.query.date) {
        params['startTs'] = this.query.date[0]
        params['endTs'] = this.query.date[1]
      }
      if (this.query.sendStatus !== -1) {
        params['sendStatus'] = this.query.sendStatus
      }
      list(params).then(response => {
        if (Object.keys(response.data).length > 0) {
          this.list = response.data.data.list
          this.total = response.data.data.totalRows
        } else {
          this.list = []
        }
        this.listLoading = false
      })
    },
    add(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('membereditor', this.$route.path)
      this.$router.push({ name: '编辑会员' })
    },
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('membereditor', this.$route.path)
      this.$router.push({
        name: '会员详情',
        params: { 'memberDetail': row, 'querytype': '0' }
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
    handlerChange(value) {
      this.query.tradeType = value[value.length - 1]
    },

    /*
    * 选择行业
    * */
    handlerDepartmentChange(val) {
      this.query.department = [...val].pop()
    },

    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      this.selectionIds = []
      for (let data of datas) {
        this.selectionIds.push(data.id)
        let new_data = {
          '用户名': data.uname,
          '入会类型': data.type === 0 ? '个人' : '企业',
          '联系信息': data.type === 0 ? '【会员姓名】' + data.name + '\n' + '【会员手机号】' + data.phone : '【企业/团体名称】' + data.companyName + '\n【联系人姓名】' + data.contactName + '\n【联系人手机号】' + data.contactPhone,
          '入会时间': '【入会时间】' + data.joinedTs + '\n【会内职位】' + data.postName + '\n【部门】' + data.departmentName,
          '账号状态': data.status === 1 ? '正常' : '已冻结',
          '激活状态': data.activatedState === 1 ? '已激活' : '未激活',
          '短信发送状态': data.activatedState === 1 ? '--' : data.sendStatus === 1 ? '已发送' : '未发送',
        }
        console.log('data.identityVOList', data.identityVOList)
        if (data.identityVOList.length > 0) {
          console.log('data.identityVOList', data.identityVOList)
          let str = ''
          data.identityVOList.forEach(element => {
            if (element.type === 1) {
              str = str + '【企业】' + element.unit
            } else {
              str = str + '【机构】' + element.unit
            }
            str = str + '【职务】' + element.post
          })
          new_data['身份信息'] = str
        }
        this.selectionDatas.push(new_data)
      }
    },
    successImport(response, file, fileList) {
      this.execelDate = response
    },
    exportExcel(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      exportJson2Excel('商会会员', this.selectionDatas)
    },

    openSmsTab() {
      console.log(this.selectionIds)
      if (this.selectionIds.length === 0) {
        this.$message.error({
          message: '请至少选择一位未激活的会员'
        })
        return
      }
      this.$confirm('确认发送短信?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sendSmsBatch(this.selectionIds).then(res => {
          console.log(res)
          if (res.state === 1) {
            this.$message({
              type: 'success',
              message: '短信发送成功!'
            })
            this.selectionIds = []
            this.selectionDatas = []
            this.handleSizeChange(this.limit)
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        }).catch(() => {})
      })
    },
    // 导入excel表格打开弹窗
    openVisible() {
      this.visible = true
    },
    closeVisible() {
      this.visible = false
      this.execelDate = {}
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
