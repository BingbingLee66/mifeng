import { getGoodsDetail } from '@/api/goods/goodsSku'
import { getSupplierOptions } from '@/api/goods/supplier.js'
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      previewImgVisible: false,
      previewUrl: '',
      detailObj: {},
      goodsId: '',
      supplierOptions: [],
      deliveryConfig: {},
      serviceConfig: {}
    }
  },
  computed: {
    // ...mapGetters(['has'])
    supplier() {
      return function(supplierId) {
        let str = ''
        for (let obj of this.supplierOptions) {
          if (obj.value === supplierId) {
            str = obj.label
            break
          }
        }
        return str
      }
    }
  },
  created() {
    if (this.$route.params.goodsId) {
      this.goodsId = this.$route.params.goodsId
      this.init()
      this.getSupplierOptions()
    }
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    init() {
      this.fetchData()
    },
    getSupplierOptions() {
      getSupplierOptions().then(response => {
        let objArr = response.data.lst
        this.supplierOptions = []
        for (let obj of objArr) {
          let option = {
            'value': obj.id,
            'label': obj.supplierName
          }
          this.supplierOptions.push(option)
        }
      })
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'id': this.goodsId
      }
      getGoodsDetail(params).then(response => {
        this.detailObj = response.data.goodsDetail
        const deliveryConfig = JSON.parse(response.data.goodsDetail.deliveryConfig)
        const serviceConfig = JSON.parse(response.data.goodsDetail.serviceConfig)
        this.deliveryConfig = deliveryConfig
        this.serviceConfig = serviceConfig
      })
    },
    openPreviewModal(url) {
      this.previewImgVisible = true
      this.previewUrl = url
    }
  }
}
