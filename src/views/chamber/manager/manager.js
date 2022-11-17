import {
  getList,
  getDetail,
  save,
  updateStatus,
  upload,
  registerCodeDownload,
  businessList,
  operatingLlist,
  updateDirector,
  addTryTime,
  unsignedData,
  exportUnSigned
} from '@/api/chamber/manager'
import { getAreaTree } from '@/api/area'
// import { mapGetters } from 'vuex'
import levelDialog from './component/levelDialog.vue'
import markSigned from './component/markSigned'
import { remarksRules, codeRules, beforeSystemLogoUploadUtil } from './util'
import { downloadFile } from '@/utils/index'
export default {
  data() {
    return {
      editorVisible: false,
      detailVisible: false,
      formObj: {
        name: '',
        president: '',
        address: '',
        phone: '',
        license: '',
        referrer: '',
        password: '',
        confirmPassword: '',
        level: 0,
        createdTs: '',
        operator: '',
        systemLogo: '',
        ckey: '',
        area: []
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      detailObj: {},
      type: 'add',
      areaOptions: [], // 地址选项
      // 搜索表单
      query: {
        name: '',
        userName: '',
        area: [],
        status: '',
        date: '',
        settledSource: '',
        contactPhone: null
      },
      rules: {
        name: [
          { required: true, message: '商/协会名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '商/协会名称1-50个字', trigger: 'change' }
        ],
        systemLogo: [{ required: true, message: '请上传商/协会logo', trigger: 'change' }],
        president: [{ required: true, message: '联系人姓名不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '办公地址不能为空', trigger: 'change' }],
        phone: [
          { required: true, message: '联系人手机号不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value)) {
                return callback(new Error('号码格式不正确'))
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        area: [
          {
            required: true, message: '地区不能为空', trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value[0]) return callback(new Error(rule.message))
              callback()
            }
          }
        ],
        license: [{ required: true, message: '营业执照必须上传', trigger: 'change' }],
        password: [
          { required: true, message: '账号密码不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^\w*$/.test(value)) return callback(new Error('密码只能由字母、数字和下划线"_"组成！'))
              callback() // 必须加上这个，不然一直塞在验证状态
            },
            trigger: 'change'
          }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^\w*$/.test(value)) return callback(new Error('密码只能由字母、数字和下划线"_"组成！'))
              if (value !== this.formObj.password) return callback(new Error('两次输入密码不一致!'))
              callback() // 必须加上这个，不然一直塞在验证状态
            },
            trigger: 'blur'
          }
        ],
        // level: [
        //   { required: true, message: '排序不能为空', trigger: 'blur' },
        //   { validator(rule, value, callback) {
        //     if (!/(^[1-9]\d*$)/.test(value)) {
        //       return callback(new Error('必须是大于0的整数'))
        //     } else {
        //       callback() // 必须加上这个，不然一直塞在验证状态
        //     }
        //   }, trigger: 'change' }
        // ]
      },
      activeName: 'signContract',
      codeRules,
      codeObj: {
        codeNum: ''
      },
      remarksRules,
      businessArr: [],
      operatingArr: [],
      // 当前操作的row
      row: {},
      remarksObj: {
        business: '',
        operating: ''
      },
      addDay: null
    }
  },
  components: {
    levelDialog, markSigned
  },
  computed: {
    // ...mapGetters(['has'])
  },
  async created() {
    this.init()
    this.getAreaList()
    const { businessArr, operatingArr } = await useList()
    this.businessArr = businessArr
    this.operatingArr = operatingArr
  },
  methods: {
    async getAreaList() {
      const { data } = await getAreaTree({ level: 2 })
      if (data) {
        data.forEach(p => {
          p.children.forEach(c => (c.children = undefined))
        })
        this.areaOptions = data
      }
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
    beforeSystemLogoUpload(file) {
      if (file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png') {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
    },
    uploadSystemLogo(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      upload(formData).then(response => {
        this.formObj.systemLogo = response.data.filePath
      })
    },
    // init() {
    //   this.fetchData()
    // },
    selectData() {
      this.currentpage = 1
      this.fetchData()
    },
    // fetchData() {
    //   this.listLoading = true
    //   let params = {
    //     'pageSize': this.limit,
    //     'page': this.currentpage
    //   }
    //   console.log('query', this.query)
    //   getList(params).then(response => {
    //     this.list = response.data.data.list
    //     this.total = response.data.data.totalRows
    //     this.listLoading = false
    //   })
    // },
    beforeAvatarUpload(file) {
      const flag = beforeSystemLogoUploadUtil(file)
      return flag
      // if (file.type !== 'image/jpeg' &&
      //   file.type !== 'image/jpg' &&
      //   file.type !== 'image/png') {
      //   this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
      //   return false
      // }
      // if (file.size > 1024 * 1024 * 2) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      //   return false
      // }
    },
    upload(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      upload(formData).then(response => {
        this.formObj.license = response.data.filePath
      })
    },
    init() {
      this.fetchData()
    },
    async fetchData() {
      this.listLoading = true
      // 已签约
      if (this.activeName === 'signContract') {
        const {
          name,
          status,
          userName,
          date,
          area,
          settledSource
        } = this.query
        const params = {
          pageSize: this.limit,
          page: this.currentpage,
          name,
          status,
          userName,
          startTime: date ? date[0] : '',
          endTime: date ? date[1] : '',
          // province: area.map(v => v[0]).join(','),
          city: area.map(v => v[1]).join(','),
          settledSource
        }
        getList(params).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.totalRows
          this.listLoading = false
        })
      } else {
        const { query, currentpage: page, limit: pageSize } = this
        const param = { ...query, page, pageSize }
        param.chamberName = query.name
        delete param.area
        this.unsignedDataFunc(param)
      }
    },
    // 拉取未签约商会查询接口
    async unsignedDataFunc(params) {
      const { data } = await unsignedData(params)
      this.list = data.list
      this.total = data.totalRows
      this.listLoading = false
    },
    add(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        name: '',
        president: '',
        address: '',
        phone: '',
        license: '',
        referrer: '',
        password: '',
        level: 0,
        createdTs: '',
        operator: '',
        systemLogo: ''
      }
      this.type = 'add'
      this.editorVisible = true
    },
    edit(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.type = 'edit'
      const params = {
        chamberId: row.id
      }
      const { ckey } = row
      getDetail(params).then(response => {
        const { dtl = {} } = response.data
        this.formObj = {
          ...dtl,
          password: '',
          ckey,
          area: [dtl.provinceCode, dtl.cityCode]
        }
        this.editorVisible = true
      })
    },
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      const params = {
        chamberId: row.id
      }
      getDetail(params).then(response => {
        this.detailObj = response.data.dtl
        this.detailVisible = true
      })
    },
    async save() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const { area: [province, city], ...formObj } = this.formObj
          save({ ...formObj, province, city }).then(response => {
            if (response.state === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.fetchData()
              this.editorVisible = false
            } else {
              this.$message({
                message: response.msg,
                type: 'success'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    updateStatus(e, row) {
      console.log('rew', row)
      const h = this.$createElement
      const self = this
      if (row.status === 1) {
        this.$msgbox({
          title: '冻结账号',
          message: h('p', null, [
            h('div', null, '是否确定冻结该商会的账号？'),
            h('div', null, '冻结后，该商会无法登录商会后台，但是不会影响商会在前台的显示'),
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              self.updateStatusFunc(row)
              done()
            } else {
              done()
            }
          }
        })
      } else {
        this.updateStatusFunc(row)
      }
    },
    updateStatusFunc(row) {
      // window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      const params = {
        chamberId: row.id,
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
            message: '冻结成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    enlarge(path) {
      const newwin = window.open()
      newwin.document.write('<img src="' + path + '"/>')
    },
    // 修改权重
    updateLevel(row) {
      this.$refs['levelDialog'].open(row.id, row.level).then(() => {
        this.fetchData()
      })
    },
    handleClick(_tag) {
      this.activeName = _tag.name
      this.limit = 10
      this.currentpage = 1
      this.fetchData()
    },
    openDialog(_name) {
      this.$refs[_name].show()
    },
    hideDialog(_name) {
      this.$refs[_name].hide()
      this.remarksObj = {}
    },
    // 打开备注负责人弹框
    openRemarks(row, _name) {
      this.row = row
      this.openDialog(_name)
    },
    // 打开标记已签约
    openMarkSigned(row) {
      this.$refs['markSignedRef'].open(row).then(() => { this.fetchData() })
    },
    // 延长试用天数
    async addTryTimed() {
      const { addDay, row: { ckey } } = this
      if (parseInt(addDay) > 0) {
        const res = await addTryTime({ addDay, ckey })
        if (res.state === 1) {
          this.$message({
            message: '延长成功',
            type: 'success'
          })
          this.hideDialog('addTryTimeRef')
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      } else if (!/^[0-9]\d*$/.test(addDay)) {
        this.$message.warning('只允许输入数字')
      } else {
        this.$message({
          message: '延长天数大于0',
          type: 'warning'
        })
      }
    },
    // 备注负责人
    saveRemarks() {
      // ckey name
      this.$refs['formRemarks'].validate(valid => {
        if (valid) {
          const { ckey } = this.row
          updateDirector({ ckey, ...this.remarksObj }).then(res => {
            if (res.state === 1) {
              this.$message({
                message: '备注成功',
                type: 'success'
              })
              this.hideDialog('remarksRef')
              this.fetchData()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    // openInvitationCode() {

    // },
    // hideInvitationCode() {
    //   this.$refs['invitationCodeRef'].hide()
    // },
    registerCode() {
      if (this.codeObj.codeNum > 999 || this.codeObj.codeNum < 1) {
        this.$message.warning('单次生成邀请码的数量需大于0小于等于999')
        return
      }
      this.$refs['formCode'].validate(valid => {
        if (valid) {
          // 生成码并且下载  type:1 生成码下载 2：导表
          this.exportExcelCode(1)
        }
      })
    },
    // 生成码并且下载
    async exportExcelCode(type = 1) {
      console.log('生成码并且下载')
      try {
        let blob = null
        if (type === 1) {
          blob = await registerCodeDownload({ codeNum: this.codeObj.codeNum })
        } else {
          // 后端同个字段 不同的接口不一样的叫法很坑的
          const params = { ...this.query }
          params.chamberName = this.query.name
          // const { name: chamberName, contactPhone, inviteCodePastDue = null, status, businessName = null, operatingName = null } = {...this.query}
          blob = await exportUnSigned(params)
        }
        console.log('blob', blob)
        downloadFile({
          title: `【${type === 1 ? '生成邀请码' : '未签约商会列表'}】.xlsx`,
          url: window.URL.createObjectURL(blob)
        })
        this.$message.success('成功')
        type === 1 && this.hideDialog('invitationCodeRef')
      } catch (error) {
        this.$message.success(error.msg)
        console.log('error', error)
      }
    },
  }
}
export const useList = async () => {
  let businessArr = []
  let operatingArr = []
  const fetchDataFunc = async () => {
    const { data: { business } } = await businessList()
    const { data: { operating } } = await operatingLlist()
    businessArr = business
    operatingArr = operating
  }
  await fetchDataFunc()
  return { businessArr, operatingArr }
}
