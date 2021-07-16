import { getSetting, updateSetting } from '@/api/system/setting'
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      day: 7
    }
  },
  computed: {
    // ...mapGetters(['has'])
  },
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
    init() {
      this.fetchData()
    },
    fetchData () {
      let params = {
        key: 'autoReceipt'
      }
      getSetting(params).then(response => {
        this.day = response.data.value
      })
    },
    update (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$prompt('发货后自动确认收货时间：', '设置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.day,
        inputPattern: /^([12][0-9]|30|[7-9])$/,
        inputErrorMessage: '只能输入7-30的数字'
      }).then(({ value }) => {
        let params = {
          key: 'autoReceipt',
          value: value
        }
        updateSetting(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '取消修改'
        })
      })
    }
  }
}
