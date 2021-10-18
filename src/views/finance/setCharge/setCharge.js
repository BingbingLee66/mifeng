import { getSetting, updateSetting } from '@/api/system/setting'

export default {
  data() {
    var checkRatio = (rule, value, callback) => {
      if (!/^(([1-9]\d|\d)(\.\d{1,3})?|100)$/.test(value)) {
        return callback(new Error('可以为0-100，最多3位小数的数'))
      } else {
        return callback()
      }
    }
    return {
      formObj1: {
        wechatFeeRatio: 0
      },
      formObj2: {
        mallFeeRatio: 0
      },
      formObj3: {
        memberFeeRatio: 0
      },
      rules1: {
        wechatFeeRatio: [
          { required: true, message: '微信手续费', trigger: 'blur' },
          { validator: checkRatio, trigger: 'change' }
        ]
      },
      rules2: {
        mallFeeRatio: [
          { required: true, message: '商城服务费', trigger: 'blur' },
          { validator: checkRatio, trigger: 'change' }
        ]
      },
      rules3: {
        memberFeeRatio: [
          { required: true, message: '会费服务费', trigger: 'blur' },
          { validator: checkRatio, trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    init () {
      this.getWechatFeeRatio()
      this.getMallFeeRatio()
      this.getMemberFeeRatio()
    },
    getWechatFeeRatio () {
      let params = {
        key: 'wechatFeeRatio'
      }
      getSetting(params).then(response => {
        const wechatFeeRatio = response.data.value
        this.formObj1.wechatFeeRatio = wechatFeeRatio * 100
      })
    },
    getMallFeeRatio () {
      let params = {
        key: 'mallFeeRatio'
      }
      getSetting(params).then(response => {
        const mallFeeRatio = response.data.value
        this.formObj2.mallFeeRatio = mallFeeRatio * 100
      })
    },
    getMemberFeeRatio () {
      let params = {
        key: 'memberFeeRatio'
      }
      getSetting(params).then(response => {
        const memberFeeRatio = response.data.value
        this.formObj3.memberFeeRatio = memberFeeRatio * 100
      })
    },
    update1 (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('确定修改微信手续费为' + this.formObj1.wechatFeeRatio + '%?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          key: 'wechatFeeRatio',
          value: Math.floor(this.formObj1.wechatFeeRatio * 100) / 10000
        }
        updateSetting(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getWechatFeeRatio()
        })
      })
    },
    update2 (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('确定修改商城服务费为' + this.formObj2.mallFeeRatio + '%?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          key: 'mallFeeRatio',
          value: Math.floor(this.formObj2.mallFeeRatio * 100) / 10000
        }
        updateSetting(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getMallFeeRatio()
        })
      })
    },
    update3 (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('确定修改会费服务费为' + this.formObj3.memberFeeRatio + '%?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          key: 'memberFeeRatio',
          value: Math.floor(this.formObj3.memberFeeRatio * 100) / 10000
        }
        updateSetting(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getMemberFeeRatio()
        })
      })
    }
  }
}
