import { isvalidUsername } from '@/utils/validate'
import { login, logout, getInfo } from '@/api/user'

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
      redirect: '/'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let redirect = this.$route.query.redirect
      if (redirect) {
        this.redirect = redirect
      }
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

          }).catch((err) => {

            this.loading = false
          })
        } else {
          return false
        }
      })
    }
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
