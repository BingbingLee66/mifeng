import { sendSms } from '@/api/sms/sms'

export default {
  data() {
    var checkMobiles = (rule, value, callback) => {
      if (!/^((13|14|15|16|17|18|19)[0-9]{9},){0,20000}((13|14|15|16|17|18|19)[0-9]{9})$/.test(value)) {
        return callback(new Error('手机号码格式不正确'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      formObj: {
        mobiles: '',
        msg: ''
      },
      rules: {
        mobiles: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: checkMobiles, trigger: 'change' }
        ],
        msg: [
          { required: true, message: '对短信内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    send (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = {
            'mobiles': this.formObj.mobiles,
            'msg': this.formObj.msg,
            'type': 0,
            // 'sendTs': null
          }
          sendSms(params).then(response => {
            this.$message({
              message: '提交成功，系统安排发送中。',
              type: 'success'
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
