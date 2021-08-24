import { getSetting, updateSetting } from '@/api/system/setting'
import { editlevel } from "@/api/content/bannerImg";

export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (value.trim() === '') {
        return callback(new Error('请输入'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      showDeliveryConfig: false,
      showServiceConfig: false,
      deliveryConfigs: {},
      serviceConfigs: {},
      deliveryConfig: {
        deliveryConfig1: '',
        deliveryConfig2: '',
        deliveryConfig3: ''
      },
      serviceConfig: {
        serviceConfig1: '',
        serviceConfig2: '',
        serviceConfig3: ''
      },
      rules1: {
        deliveryConfig1: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        deliveryConfig2: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        deliveryConfig3: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
      },
      rules2: {
        serviceConfig1: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        serviceConfig2: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        serviceConfig3: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
      },
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
          const _deliveryConfig = JSON.parse(res.data.value)
          this.deliveryConfigs = _deliveryConfig
          console.log('_deliveryConfig', _deliveryConfig)
          this.deliveryConfig.deliveryConfig1 = _deliveryConfig['包邮']
          this.deliveryConfig.deliveryConfig2 = _deliveryConfig['发货时间']
          this.deliveryConfig.deliveryConfig3 = _deliveryConfig['发货说明']
        }
      })
    },
    getServiceConfig() {
      let params = {
        key: 'serviceConfig'
      }
      getSetting(params).then(res => {
        if (res.state === 1) {
          const _serviceConfig = JSON.parse(res.data.value)
          this.serviceConfigs = _serviceConfig
          this.serviceConfig.serviceConfig1 = _serviceConfig['商会企业供货']
          this.serviceConfig.serviceConfig2 = _serviceConfig['品质保证']
          this.serviceConfig.serviceConfig3 = _serviceConfig['坏了包赔']
        }
      })
    },
    updateDeliveryConfig(form1) {
      this.$refs[form1].validate((valid) => {
        if (valid) {
          let deliveryConfig = {
            '包邮': this.deliveryConfig.deliveryConfig1.trim(),
            '发货时间': this.deliveryConfig.deliveryConfig2.trim(),
            '发货说明': this.deliveryConfig.deliveryConfig3.trim(),
          }
          let params = {
            key: 'deliveryConfig',
            value: JSON.stringify(deliveryConfig)
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
        } else {
          return false
        }
      })
    },
    updateServiceConfig(form2) {
      this.$refs[form2].validate((valid) => {
        if (valid) {
          let serviceConfig = {
            '商会企业供货': this.serviceConfig.serviceConfig1.trim(),
            '品质保证': this.serviceConfig.serviceConfig2.trim(),
            '坏了包赔': this.serviceConfig.serviceConfig3.trim(),
          }
          let params = {
            key: 'serviceConfig',
            value: JSON.stringify(serviceConfig)
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
        } else {
          return false
        }
      })
    }
  }
}
