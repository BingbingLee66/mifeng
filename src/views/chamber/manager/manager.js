import {
  getList,
  getDetail,
  save,
  updateStatus,
  upload
} from '@/api/chamber/manager'
// import { mapGetters } from 'vuex'
import levelDialog from './component/levelDialog.vue'
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value)) {
        return callback(new Error('号码格式不正确'))
      } else {
        return callback()
      }
    }
    var checkPass = (rule, value, callback) => {
      if (!/^\w*$/.test(value)) {
        return callback(new Error('密码只能由字母、数字和下划线"_"组成！'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    var confirmPass = (rule, value, callback) => {
      if (!/^\w*$/.test(value)) {
        return callback(new Error('密码只能由字母、数字和下划线"_"组成！'))
      }
      if (value !== this.formObj.password) {
        return callback(new Error('两次输入密码不一致!'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    // var checkNumber = (rule, value, callback) => {
    //   if (!/(^[1-9]\d*$)/.test(value)) {
    //     return callback(new Error('必须是大于0的整数'))
    //   } else {
    //     callback() // 必须加上这个，不然一直塞在验证状态
    //   }
    // }
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
        ckey: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      detailObj: {},
      type: 'add',
      // 搜索表单
      query: {
        name: null,
        userName: null,
        status: null,
        date: null
      },
      rules: {
        name: [{
          required: true,
          message: '商/协会名称不能为空',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 50,
          message: '商/协会名称1-50个字',
          trigger: 'change'
        }
        ],
        systemLogo: [{
          required: true,
          message: '请上传商/协会logo',
          trigger: 'change'
        }],
        president: [{
          required: true,
          message: '联系人姓名不能为空',
          trigger: 'blur'
        }],
        address: [{
          required: true,
          message: '办公地址不能为空',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '联系人手机号不能为空',
          trigger: 'blur'
        },
        {
          validator: checkPhone,
          trigger: 'change'
        }
        ],
        license: [{
          required: true,
          message: '营业执照必须上传',
          trigger: 'change'
        }],
        password: [{
          required: true,
          message: '账号密码不能为空',
          trigger: 'blur'
        },
        {
          validator: checkPass,
          trigger: 'change'
        }
        ],
        confirmPassword: [{
          required: true,
          message: '确认密码不能为空',
          trigger: 'blur'
        },
        {
          validator: confirmPass,
          trigger: 'blur'
        }
        ]
        /* level: [
          {required: true, message: '排序不能为空', trigger: 'blur'},
          {validator: checkNumber, trigger: 'change'}
        ]*/
      }
    }
  },
  components: {
    levelDialog
  },
  computed: {
    // ...mapGetters(['has'])
  },
  created() {
    this.init()
  },
  methods: {
    a() {
      console.log('aa')
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
    fetchData() {
      this.listLoading = true
      let {
        name,
        status,
        userName,
        date
      } = this.query
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        name,
        status,
        userName,
        startTime: date ? date[0] : '',
        endTime: date ? date[1] : ''
      }
      console.log('query', this.query)
      getList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
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
        'chamberId': row.id
      }
      const ckey = row.ckey
      getDetail(params).then(response => {
        this.formObj = response.data.dtl
        this.formObj.password = ''
        this.formObj.ckey = ckey
        this.editorVisible = true
      })
    },
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'chamberId': row.id
      }
      getDetail(params).then(response => {
        this.detailObj = response.data.dtl
        this.detailVisible = true
      })
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('this.formObj', this.formObj)
          save(this.formObj).then(response => {
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
      let self = this
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
        }).then(action => {

        })
      } else {
        this.updateStatusFunc(row)
      }
    },
    updateStatusFunc(row) {
      // window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'chamberId': row.id,
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
    enlarge(path) {
      var newwin = window.open()
      newwin.document.write('<img src="' + path + '"/>')
    },
    // 修改权重
    updateLevel(row) {
      console.log('row', row)
      this.$refs['levelDialog'].open(row.id).then(data => {
        this.fetchData()
      })
    }
  }
}
