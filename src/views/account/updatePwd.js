import { updatePass } from '@/api/authority/user'
import imgUrl from '@/assets/img/avatar.gif'

export default {
  data() {
    return {
      form: {
        oldPassword: '',
        password: '',
        rePassword: ''
      },
      activeName: 'updatePwd',
      chamberName: '',
      systemLogo: '@/assets/img/avatar.gif',
      user: {},
      rules: {
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 5, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.user = this.$store.state.user.profile
      this.chamberName = this.$store.getters.chamberName
      console.log(this.$store.getters.systemLogo)
      console.log(!this.$store.getters.systemLogo)
      this.systemLogo = !this.$store.getters.systemLogo ? imgUrl : this.$store.getters.systemLogo
    },
    handleClick(tab, event) {
      this.$router.push({ path: '/account/' + tab.name })
    },
    updatePwd() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.password !== this.form.rePassword) {
            this.$message({
              message: '两次输入密码不一致',
              type: 'error'
            })
            return false
          }
          updatePass({
            newPass: this.form.password
          }).then(response => {
            this.$message({
              message: '密码修改成功',
              type: 'success'
            })
            //退出登录，该操作是个异步操作，所以后面跳转到登录页面延迟1s再执行（如果有更好的方法再调整）
            this.$store.dispatch('user/logout')
            const self = this
            setTimeout(function() {
              self.$router.push(`/login`)
            }, 1000)
          }).catch((err) => {

          })
        }
      })
    }
  }
}

