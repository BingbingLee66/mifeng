import { getList } from '@/api/mall/mall'
import { getSetting, updateSetting } from '@/api/system/setting'

export default {
  data() {
    return {
      showDeliveryConfig: false,
      showServiceConfig: false,
      deliveryConfig: {},
      serviceConfig: {}
    }
  },
  created() {
    this.getDeliveryConfig()
    this.getServiceConfig()
  },
  methods: {
    getDeliveryConfig() {
      let params = {
        key: 'deliveryConfig'
      }
      getSetting(params).then(res => {
        if (res.state === 1) {
          this.deliveryConfig = JSON.parse(res.data.value)
        }
      })
    },
    getServiceConfig() {
      let params = {
        key: 'serviceConfig'
      }
      getSetting(params).then(res => {
        if (res.state === 1) {
          this.serviceConfig = JSON.parse(res.data.value)
        }
      })
    },
    updateDeliveryConfig() {
      let params = {
        key: 'deliveryConfig',
        value: JSON.stringify(this.deliveryConfig)
      }
      updateSetting(params).then(res => {
        if (res.state === 1) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.showDeliveryConfig = false
          this.getDeliveryConfig()
        }
      })
    },
    updateServiceConfig() {
      let params = {
        key: 'serviceConfig',
        value: JSON.stringify(this.serviceConfig)
      }
      updateSetting(params).then(res => {
        if (res.state === 1) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.showServiceConfig = false
          this.getServiceConfig()
        }
      })
    }
  }
}
