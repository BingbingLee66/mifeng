import { isvalidUsername } from '@/utils/validate'
import { getAreaTree, uploadLogo } from '@/api/user'

export default {
  name: 'login',
  components: {},
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入5到32位的数字和字母'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码至少位5位'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value)) {
        return callback(new Error('号码格式不正确'))
      }
      callback()
    }
    const validatePassword2 = (rule, value, callback) => {
      if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)) return callback(new Error('6-16位，英文字母和数字的组合，英文字母区分大小写'))
      callback() // 必须加上这个，不然一直塞在验证状态
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      pwdType: 'password',
      redirect: '/',
      // todo
      active: 1,
      formObj: {
        socialCode: '',
        chamberName: '',
        chamberLogo: '',
        area: [],
        inviteCode: '',
        contactPhone: '',
        contactName: '',
        password2: '',
        confirmPassword: '',
      },
      registerRules: {
        // socialCode: [{ required: true, message: '统一社会信用代码不能为空', trigger: 'blur' },
        // { pattern: /^[A-Za-z0-9]{2}[0-9]{6}[A-Za-z0-9]{10}$/, message: '统一社会信用代码格式有误', trigger: 'blur' }],
        chamberName: [
          { required: true, message: '商/协会名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '商/协会名称1-50个字', trigger: 'change' }
        ],
        chamberLogo: [{ required: true, message: '请上传商/协会logo', trigger: 'change' }],
        contactName: [{ required: true, message: '联系人姓名不能为空', trigger: 'blur' }],
        inviteCode: [
          { required: true, message: '邀请码不能为空', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]{8}$/, message: '邀请码格式有误', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '联系人手机号不能为空', trigger: 'blur' },
          {
            validator: validatePhone, trigger: 'blur'
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
        password2: [
          { required: true, message: '账号密码不能为空', trigger: 'blur' },
          {
            validator: validatePassword2,
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)) return callback(new Error('6-16位，英文字母和数字的组合，英文字母区分大小写'))
              if (value !== this.formObj.password2) return callback(new Error('两次输入密码不一致!'))
              callback() // 必须加上这个，不然一直塞在验证状态
            },
            trigger: 'blur'
          }
        ],
      },
      areaOptions: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { redirect } = this.$route.query
      if (redirect) {
        this.redirect = redirect
      }
      this.getAreaList()
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push(this.redirect)
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // async checkCode() {
    //   if (!this.formObj.socialCode) return
    //   const pattern = /^[A-Za-z0-9]{2}[0-9]{6}[A-Za-z0-9]{10}$/
    //   if (!pattern.test(this.formObj.socialCode)) return
    //   const res = await getSocialOrg({ socialCode: this.formObj.socialCode })
    //   if (res.state && res.data) {
    //     const { chamberName, provinceCode, cityCode } = res.data
    //     this.formObj.chamberName = chamberName
    //     this.formObj.area = [provinceCode || '0', cityCode || '0']
    //   }
    // },
    async getAreaList() {
      const { data } = await getAreaTree()
      if (data.length) {
        data.forEach(p => {
          p.children.forEach(c => {
            c.children = undefined
          })
        })
        this.areaOptions = data
      }
    },
    uploadChamberLogo(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      uploadLogo(formData).then(response => {
        this.formObj.chamberLogo = response.data.filePath
      })
    },
    beforeChamberLogoUpload(file) {
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
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.formObj.province = this.formObj.area[0]
          this.formObj.city = this.formObj.area[1]
          this.formObj.password = this.formObj.password2
          this.$store.dispatch('user/register', this.formObj).then(() => {
            this.loading = false
            this.$router.push(this.redirect)
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // handleLogin() {
    //   this.$refs.loginForm.validate(valid => {
    //     if (valid) {
    //       this.loading = true
    //       login(this.loginForm).then((response) => {
    //         if (response.data.list.length === 1) { // 只有一个后台用户
    //           this.$store.dispatch('user/login', response).then(() => {
    //             this.loading = false
    //             this.$router.push(this.redirect)

    //           }).catch((err) => {

    //             this.loading = false
    //           })
    //         } else { // 匹配到多个用户

    //         }
    //       }).catch((err) => {

    //         this.loading = false
    //       })
    //     } else {
    //       return false
    //     }
    //   })
    // }
  }
}
