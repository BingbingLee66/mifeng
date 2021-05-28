import {
  memberMe,
  // memberAuditMe,
  uploadCompanyLogo,
  add,
  update
} from '@/api/member/manager'

export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value)) {
        return callback(new Error('手机号码格式不正确'))
      } else {
        return callback()
      }
    }
    var checkTel = (rule, value, callback) => {
      if (!/^$|^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(value)) {
        return callback(new Error('电话号码格式不正确'))
      } else {
        return callback()
      }
    }
    return {
      memberId: '',
      formObj: {
        type: 1,
        name: '',
        phone: '',
        companyName: '',
        companyPhone: '',
        companyLogo: ''
      },
      type: 'add',
      rules: {
        companyName: [
          {required: true, message: '企业名称不能为空', trigger: 'blur'}
        ],
        companyLogo: [
          {required: true, message: '公司logo必须上传', trigger: 'blur'}
        ],
        companyPhone: [
          {required: true, message: '联系方式不能为空', trigger: 'blur'},
          {validator: checkTel, tigger: 'change'}
        ],
        name: [
          {required: true, message: '姓名不能为空', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '手机号码不能为空', trigger: 'blur'},
          {validator: checkPhone, trigger: 'change'}
        ]
      },
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }]
      }]
    }
  },

  created() {
  },

  mounted() {
    if (this.$route.params.memberId) {
      this.memberId = this.$route.params.memberId
      this.type = 'edit'
      this.fetchData()
    }
    if (this.$route.params.querytype) {
      this.querytype = this.$route.params.querytype
      window.localStorage.setItem('detail-type', this.type)
    }
    if (this.querytype === '') {
      this.querytype = window.localStorage.getItem('detail-type')
    }
  },

  methods: {
    closeTab() {
      // 退出当前tab, 打开指定tab
      const openPath = window.localStorage.getItem('membereditor')
      const tagsViews = this.$store.state.tagsView.visitedViews
      // let selectView = null
      for (const view of tagsViews) {
        if (view.path === this.$route.path) {
          this.$store.dispatch('tagsView/delView', view).then(() => {
            this.$router.push({path: openPath})
          })
          break
        }
      }
    },
    // 根据会员id查询会员信息
    fetchData() {
      const params = {
        'memberId': this.memberId
      }
      memberMe(params).then(response => {
        this.formObj = response.data.data
        if (this.formObj.companyPhone === null) {
          this.formObj.companyPhone = ''
        }
      })
    },

    beforeAvatarUpload(file) {
      if (file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png') {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },

    uploadLogo(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      uploadCompanyLogo(formData).then(response => {
        this.formObj['companyLogo'] = response.data.filePath
      })
    },

    save() {
      this.$refs['form'].validate((valid) => {
        if (this.formObj.type === 1) {
          this.formObj.phone = this.formObj.companyPhone
        }
        if (valid) {
          if (this.type === 'add') {
            this.formObj['ckey'] = this.$store.getters.ckey
            add(this.formObj).then(response => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.closeTab()
            })
          } else if (this.type === 'edit') {
            update(this.formObj).then(response => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.closeTab()
            })
          }
        } else {
          return false
        }
      })
    }
  },

  watch: {
    formObj: {
      handler(val) {
        if (val.type === 1) {
          this.$refs['form'].clearValidate(['name'])
          this.$refs['form'].clearValidate(['phone'])
        } else {
          this.$refs['form'].clearValidate(['companyName'])
          this.$refs['form'].clearValidate(['companyLogo'])
          this.$refs['form'].clearValidate(['companyPhone'])
        }
      },
      deep: true
    }
  }

}
