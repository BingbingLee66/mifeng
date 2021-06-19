import { getSetting, updateSetting } from '@/api/system/setting'

export default {
  data() {
    var checkRatio = (rule, value, callback) => {
      if (!/^[0, 1]$|^[0]\.\d{1,3}$/.test(value)) {
        return callback(new Error('可以为0-1的最多3位小数'))
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
      // this.getMemberFeeRatio()
    },
    getWechatFeeRatio () {
      let params = {
        key: 'wechatFeeRatio'
      }
      getSetting(params).then(response => {
        this.formObj1.wechatFeeRatio = response.data.value
      })
    },
    getMallFeeRatio () {
      let params = {
        key: 'mallFeeRatio'
      }
      getSetting(params).then(response => {
        this.formObj2.mallFeeRatio = response.data.value
      })
    },
    getMemberFeeRatio () {
      let params = {
        key: 'memberFeeRatio'
      }
      getSetting(params).then(response => {
        this.formObj3.memberFeeRatio = response.data.value
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
          value: this.formObj1.wechatFeeRatio
        }
        updateSetting(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getWechatFeeRatio()
        })
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '取消删除'
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
          value: this.formObj2.mallFeeRatio
        }
        updateSetting(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getMallFeeRatio()
        })
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '取消删除'
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
          value: this.formObj3.memberFeeRatio
        }
        updateSetting(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getMemberFeeRatio()
        })
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    }
  }
}
