import {
  memberMe,
  memberAuditMe,
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
          { required: true, message: '企业名称不能为空', trigger: 'blur' }
        ],
        companyLogo: [
          { required: true, message: '公司logo必须上传', trigger: 'blur' }
        ],
        companyPhone: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' },
          { validator: checkTel, tigger: 'change' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: checkPhone, trigger: 'change' }
        ]
      }
    }
  },

  created() { },

  mounted() {
    if (this.$route.params.memberId) {
      console.log('this.$route.params.memberId:' + this.$route.params.memberId);
      this.memberId = this.$route.params.memberId
      this.type = 'edit'
      this.fetchData()
    }
    if (this.$route.params.querytype) {
      console.log('this.$route.params.querytype:' + this.$route.params.querytype);
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
      let openPath = window.localStorage.getItem('membereditor')
      let tagsViews = this.$store.state.tagsView.visitedViews
      let selectView = null
      for (let view of tagsViews) {
        if (view.path === this.$route.path) {
          this.$store.dispatch('tagsView/delView', view).then(() => {
            this.$router.push({ path: openPath })
          })
          break
        }
      }
    },
    // 根据会员id查询会员信息
    fetchData() {
      let params = {
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
      let formData = new FormData()
      formData.append('file', content.file)
      uploadCompanyLogo(formData).then(response => {
        console.log(response.data.filePath)
        this.formObj['companyLogo'] = response.data.filePath
      })
      console.log(this.formObj.companyLogo)
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
    formObj: {//深度监听，可监听到对象、数组的变化
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
