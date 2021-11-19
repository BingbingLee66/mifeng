import {
  getGoodsDetail,
  uploadGoodsImg,
  add,
  update
} from '@/api/goods/goodsSku'
import { getSupplierOptions } from '@/api/goods/supplier.js'
import { getSetting } from '@/api/system/setting'
import videoPreview from '@/assets/img/video-pre.jpg'
import moment from 'moment'
import draggable from 'vuedraggable' // 拖拽组件

export default {
  components: {
    draggable
  },
  data() {
    var checkFee = (rule, value, callback) => {
      if (!/^(([1-9]\d*)|[0]\.([1-9]|[0-9][1-9])|([1-9]\d*)\.([1-9]|[0-9][1-9]))$/.test(value)) {
        return callback(new Error('最多两位小数的正数'))
      } else {
        return callback()
      }
    }
    var checkFee2 = (rule, value, callback) => {
      if (!/^[0]$|^(([1-9]\d*)|[0]\.([1-9]|[0-9][1-9])|([1-9]\d*)\.([1-9]|[0-9][1-9]))$/.test(value)) {
        return callback(new Error('最多两位小数的正数'))
      } else {
        return callback()
      }
    }
    var checkName = (rule, value, callback) => {
      if (value.trim() === '') {
        return callback(new Error('请输入'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    var checkNumber2 = (rule, value, callback) => {
      if (!/^[0]$|^([1-9]\d*)$/.test(value)) {
        return callback(new Error('必须是0或大于0的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    var checkLimitAmount = (rule, value, callback) => {
      if (!/^$|^([1-9]\d*)$/.test(value)) {
        return callback(new Error('必须是大于0的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      showBooking: false,
      startDate: '',
      pickerOptions: {
        disabledDate: this.disabledGetTime,
        selectableRange: '00:00:00 - 23:59:59'
      },
      flag: true,
      videoPreview: videoPreview,
      previewImgVisible: false,
      previewUrl: '',
      goodsId: '',
      type: 'add',
      galleryLimit: 10,
      descriptLimit: 1,
      posterLimit: 1,
      detailLimit: 20,
      galleryValid: true,
      posterValid: true,
      descriptValid: true,
      detailValid: true,
      formObj: {
        'serviceConfig1': '', // 商会企业供货
        'serviceConfig2': '', // 品质保证
        'serviceConfig3': '', // 坏了包赔
        'deliveryConfig1': '', // 包邮
        'deliveryConfig2': '', // 发货时间
        'deliveryConfig3': '', // 发货说明
        'discount': '', // 立减优惠
        'serviceFee': 0, // 商品服务费率
        'wxServiceFee': 0, // 微信手续费率
        'bookingTimeStart': '',
        'isBooking': 0,
        'gallery': [''],
        'poster': '',
        'descript': '',
        'detail': [''],
        'name': '',
        'supplierId': '',
        'virtualSalesVolume': '',
        'limitTime': '',
        'limitTimeStart': '',
        'limitTimeEnd': '',
        'limitAmount': '',
        'specType': 0,
        'attr1': {
          'id': '',
          'attrName': '',
          'value': []
        },
        'attr2': null,
        'singleSku': [
          {
            'code': '',
            'codeName': '',
            'price': '',
            'fightPrice': '',
            'supplyPrice': 0,
            'marketingPrice': '',
            'stock': ''
          }
        ],
        'multiSku': []
      },
      uniSetting: {
        'price': '',
        'fightPrice': '',
        'marketingPrice': '',
        'supplyPrice': '',
        'stock': ''
      },
      supplierOptions: [],
      skuOptions: [],
      attrRatio1: -1,
      attrRatio2: -1,
      attrIds1: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      attrIds2: 'abcdefghijklmnopqrstuvwxyz',
      attrId1: 0,
      attrId2: 0,
      galleryDrag: false,
      detailDrag: false,
      priceVerify: true,
      rules: {
        name: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' },
          { max: 60, message: '商品名称最多60个字' }
        ],
        supplierId: [
          { required: true, message: '供货商家不能为空', trigger: 'blur' }
        ],
        specType: [
          { required: true, message: '请选择商品规格', trigger: 'change' }
        ],
        price: [
          { required: true, message: '单买价不能为空', trigger: 'blur' },
          { validator: checkFee, trigger: 'change' }
        ],
        fightPrice: [
          { required: true, message: '拼单价不能为空', trigger: 'blur' },
          { validator: checkFee, trigger: 'change' }
        ],
        stock: [
          { required: true, message: '库存不能为空', trigger: 'blur' },
          { validator: checkNumber2, trigger: 'change' }
        ],
        marketingPrice: [
          { required: true, message: '市场价不能为空', trigger: 'blur' },
          { validator: checkFee, trigger: 'change' }
        ],
        supplyPrice: [
          { required: true, message: '供货价不能为空', trigger: 'blur' },
          { validator: checkFee2, trigger: 'change' }
        ],
        virtualSalesVolume: [
          { required: true, message: '虚拟销量不能为空', trigger: 'blur' },
          { validator: checkNumber2, trigger: 'change' }
        ],
        limitTime: [
          { required: true, message: '请选择限时购买日期', trigger: 'change' }
        ],
        limitAmount: [
          // { required: true, message: '单次限购不能为空', trigger: 'blur' },
          { validator: checkLimitAmount, trigger: 'change' }
        ],
        attrName: [
          { required: true, message: '规格类型不能为空', trigger: 'change' }
        ],
        discount: [
          { required: true, message: '立减优惠不能为空，需输入大于等于0的数字', trigger: 'change' }
        ],
        deliveryConfig1: [
          { required: true, message: '包邮不能为空', trigger: 'blur' },
          // { validator: checkName, trigger: 'change' }
        ],
        deliveryConfig2: [
          { required: true, message: '发货时间不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        deliveryConfig3: [
          { required: true, message: '发货说明不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        serviceConfig1: [
          { required: true, message: '商会企业供货不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        serviceConfig2: [
          { required: true, message: '品质保证不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        serviceConfig3: [
          { required: true, message: '坏了包赔不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
      }
    }
  },
  mounted() {
    // 防止火狐浏览器拖拽的时候以新标签打开
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (this.$route.params.goodsId) {
      this.goodsId = this.$route.params.goodsId
      this.init()
      this.type = 'edit'
    } else {
      this.type = 'add'
      this.getWeChatFeeRatio()
      this.getMallFeeRatio()
      this.getDeliveryConfig()
      this.getServiceConfig()
    }
    this.getSupplierOptions()
    this.getAttrOptions()
  },
  computed: {
    effectiveLength() {
      return function(obj) {
        let length = 0
        obj.forEach((o) => {
          if (o !== '') {
            length++
          }
        })
        return length
      }
    },
    computedColor() {
      this.verifyPrice()
      return this.priceVerify ? '#999' : '#F56C6C'
    }
  },
  created() {
    // 监听刷新时间
    // window.addEventListener('beforeunload', e => this.refreshView(e))
  },
  destroyed() {
    // window.removeEventListener('beforeunload', e => this.refreshView(e))
  },
  methods: {
    handleSelectTime(e) {
      if (e) {
        this.showBooking = true
        let startDate = moment(e[0]).format('yyyy-MM-DD HH:mm:ss')
        this.startDate = startDate
      } else {
        this.formObj.isBooking = 0
        this.showBooking = false
        this.formObj.bookingTimeStart = ''
        this.startDate = ''
      }
    },
    handleSelectTimeB(e) {
      if (e) {
        this.formObj.isBooking = 1
      } else {
        this.formObj.isBooking = 0
      }
    },
    disabledGetTime(time) {
      if (this.formObj.limitTime.length > 0) {
        if (this.type === 'edit') {
          return time.getTime() > this.formObj.limitTime[0]
        } else {
          return time.getTime() > (this.formObj.limitTime[0]).getTime() // 选当前时间之前的时间
        }
      }
      // disableData: (time) => {
      //   return time.getTime() > (this.formObj.limitTime[0]).getTime() // 选当前时间之前的时间
      // },
    },
    closeTab() {
      // 退出当前tab, 打开指定tab
      let openPath = window.localStorage.getItem('goodsSku')
      let tagsViews = this.$store.state.tagsView.visitedViews
      let selectView = null
      for (let view of tagsViews) {
        if (view.path === this.$route.path) {
          this.$store.dispatch('tagsView/delView', view).then(() => {
            this.$router.push({ path: openPath })
          })
          break
        }
      }
    },
    init() {
      this.fetchData()
    },
    // 获取微信手续费
    getWeChatFeeRatio () {
      let params = {
        key: 'wechatFeeRatio'
      }
      getSetting(params).then(response => {
        this.formObj.wxServiceFee = response.data.value * 100
      })
    },
    // 获取商品服务费
    getMallFeeRatio () {
      let params = {
        key: 'mallFeeRatio'
      }
      getSetting(params).then(response => {
        this.formObj.serviceFee = response.data.value * 100
      })
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
    getAttrOptions() {
      let params = {
        key: 'skuKeyName'
      }
      getSetting(params).then(response => {
        let values = response.data.value.split(',')
        for (let obj of values) {
          let option = {
            'value': obj,
            'label': obj
          }
          this.skuOptions.push(option)
        }
      })
    },
    // 获取发货说明
    getDeliveryConfig() {
      let params = {
        key: 'deliveryConfig'
      }
      getSetting(params).then(res => {
        if (res.state === 1) {
          const resData = JSON.parse(res.data.value)
          this.formObj.deliveryConfig1 = resData['包邮']
          this.formObj.deliveryConfig2 = resData['发货时间']
          this.formObj.deliveryConfig3 = resData['发货说明']
        }
      })
    },
    // 获取服务保障
    getServiceConfig() {
      let params = {
        key: 'serviceConfig'
      }
      getSetting(params).then(res => {
        if (res.state === 1) {
          const resData = JSON.parse(res.data.value)
          this.formObj.serviceConfig1 = resData['商会企业供货']
          this.formObj.serviceConfig2 = resData['品质保证']
          this.formObj.serviceConfig3 = resData['坏了包赔']
        }
      })
    },
    fetchData() {
      let params = {
        'id': this.goodsId
      }
      getGoodsDetail(params).then(response => {
        const obj = response.data.goodsDetail
        this.formObj = obj
        // <-- 发货说明和服务保障
        if (obj.deliveryConfig) {
          const deliveryConfigData = JSON.parse(obj.deliveryConfig)
          this.$set(this.formObj, 'deliveryConfig1', deliveryConfigData['包邮'])
          this.$set(this.formObj, 'deliveryConfig2', deliveryConfigData['发货时间'])
          this.$set(this.formObj, 'deliveryConfig3', deliveryConfigData['发货说明'])
          // this.formObj.deliveryConfig1 = deliveryConfigData['包邮']
          // this.formObj.deliveryConfig2 = deliveryConfigData['发货时间']
          // this.formObj.deliveryConfig3 = deliveryConfigData['发货说明']
        }
        if (obj.serviceConfig) {
          const serviceConfigData = JSON.parse(obj.serviceConfig)
          this.$set(this.formObj, 'serviceConfig1', serviceConfigData['商会企业供货'])
          this.$set(this.formObj, 'serviceConfig2', serviceConfigData['品质保证'])
          this.$set(this.formObj, 'serviceConfig3', serviceConfigData['坏了包赔'])
          // this.formObj.serviceConfig1 = serviceConfigData['商会企业供货']
          // this.formObj.serviceConfig2 = serviceConfigData['品质保证']
          // this.formObj.serviceConfig3 = serviceConfigData['坏了包赔']
        }
        // 发货说明和服务保障 -->
        // 预约时间
        if (obj.isBooking) {
          this.showBooking = true
          this.startDate = obj.limitTimeStart
        } else {
          this.formObj.bookingTimeStart = ''
          this.startDate = ''
        }
        this.formObj['isBooking'] = obj.isBooking + ''
        this.$set(this.formObj, 'bookingTimeStart', obj.bookingTimeStart)
        // 预约时间
        this.formObj['gallery'] = obj.gallery.split(',')
        if (this.formObj.gallery.length !== this.galleryLimit) {
          this.formObj['gallery'].push('')
        }
        this.formObj['poster'] = obj.poster
        this.formObj['descript'] = obj.descript
        this.formObj['detail'] = obj.detail.split(',')
        if (this.formObj.detail.length !== this.detailLimit) {
          this.formObj['detail'].push('')
        }
        if (this.formObj.attr1 === null) {
          this.formObj.attr1 = {
            'id': '',
            'attrName': '',
            'value': []
          }
        }
        if (this.formObj.attr1.value.length > 0) {
          this.formObj.attr1.value.push({
            'id': '',
            'fakeId': this.attrIds1.charAt(this.attrId1),
            'attrVal': '',
            'imgUrl': ''
          })
          this.attrId1 = this.attrId1 + 1
        }
        if (this.formObj.attr2 !== null && this.formObj.attr2.value.length > 0) {
          this.formObj.attr2.value.push({
            'id': '',
            'fakeId': this.attrIds2.charAt(this.attrId2),
            'attrVal': '',
            'imgUrl': ''
          })
          this.attrId2 = this.attrId2 + 1
        }
        let limitTime = []
        if (!!obj.limitTimeStart && !!obj.limitTimeEnd) {
          limitTime.push(obj.limitTimeStart)
          limitTime.push(obj.limitTimeEnd)
          // this.formObj['limitTime'] = limitTime
        }
        this.$set(this.formObj, 'limitTime', limitTime)
        if (this.formObj.virtualSalesVolume === 0) {
          this.formObj.virtualSalesVolume = ''
        }
        if (this.formObj.limitAmount === 0) {
          this.formObj.limitAmount = ''
        }
        this.$set(this.formObj, 'serviceFee', serviceFee)
        this.$set(this.formObj, 'wxServiceFee', wxServiceFee)
      })
    },
    addSupplier(val) {
     //这里不能使用change事件，否则会开启无限套娃
      // if (val) {
        if (this.supplierOptions.length === 0) {
          this.$confirm('你还未添加供货商家，添加后才可发布商品哦！', '提示', {
            confirmButtonText: '立即添加',
            cancelButtonText: '取消'
          }).then(() => {
            console.log("then")
            this.$router.push({ name: '供货商家管理' })
          }).catch((err) => {
            console.log(err)
          })     
        // }
      }
    },
    setSku() {
      if (this.formObj.specType === 1) { // 多规格
        if (this.formObj.attr1.value.length === 0) {
          this.formObj.attr1.value.push({
            'id': '',
            'fakeId': this.attrIds1.charAt(this.attrId1),
            'attrVal': '',
            'imgUrl': ''
          })
          this.attrId1 = this.attrId1 + 1
        }
      } else if (this.formObj.specType === 0) { // 单品
        if (this.formObj.singleSku.length === 0) {
          let sku = {
            'code': '',
            'codeName': '',
            'price': '',
            'fightPrice': '',
            'supplyPrice': 0,
            'marketingPrice': '',
            'stock': ''
          }
          this.formObj.singleSku.push(sku)
        }
      }
    },
    beforeAvatarUpload(file) {
      const reg = new RegExp('^/.jpg|.jpeg|.png/$')
      if (reg.test(file.name)) {
        this.$message.error('不支持的文件格式!')
        return false
      }
      if (file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png') {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },
    beforeAvatarUploadGallery(file) {
      let result = true
      const reg = new RegExp('^/.jpg|.jpeg|.png/$')
      if (reg.test(file.name)) {
        result = false
        this.$message.error('不支持的文件格式!')
      } else {
        if (file.type.indexOf('image/') !== -1) { // 图片
          if (file.type !== 'image/jpeg' &&
            file.type !== 'image/jpg' &&
            file.type !== 'image/png') {
            this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
            result = false
          }
          if (file.size > 1024 * 1024 * 2) {
            this.$message.error('上传图片大小不能超过 2MB!')
            result = false
          }
        } else if (file.type.indexOf('video/') !== -1) { // 视频
          if (file.type !== 'video/mp4') {
            this.$message.error('上传视频只能是 MP4 格式!')
            result = false
          }
          if (file.size > 1024 * 1024 * 200) {
            this.$message.error('上传视频大小不能超过 200MB!')
            result = false
          }
        } else {
          result = false
          this.$message.error('不支持的文件格式!')
        }
      }
      return result
    },
    uploadGallery(content, index) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadGoodsImg(formData).then(response => {
        this.formObj.gallery.splice(index, 1, response.data.filePath)
        if (this.formObj.gallery.length === this.galleryLimit) {
          // 上传达到限制不添加
        } else {
          this.formObj.gallery.push('')
        }
        this.galleryValid = true
      })
    },
    uploadPoster(content) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadGoodsImg(formData).then(response => {
        this.$set(this.formObj, 'poster', response.data.filePath)
        // this.formObj.poster = response.data.filePath
        console.log('this.formObj.poster', this.formObj.poster)
        this.posterValid = true
      })
    },
    uploadDescript(content) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadGoodsImg(formData).then(response => {
        this.formObj.descript = response.data.filePath
        this.descriptValid = true
      })
    },
    uploadDetail(content, index) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadGoodsImg(formData).then(response => {
        this.formObj.detail.splice(index, 1, response.data.filePath)
        if (this.formObj.detail.length === this.detailLimit) {
          // 上传达到限制不添加
        } else if (this.formObj.detail.length - 1 === index) {
          this.formObj.detail.push('')
        }
        this.detailValid = true
      })
    },
    uploadAttr1(content, index) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadGoodsImg(formData).then(response => {
        this.formObj.attr1.value[index].imgUrl = response.data.filePath
      })
    },
    uploadSku(content, index) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadGoodsImg(formData).then(response => {
        this.formObj.multiSku[index].skuImgUrl = response.data.filePath
      })
    },
    addAttrSku1(val, index) {
      if (val === '') {
        this.attrRatio1 = -1
        this.$message({
          message: '规格名称不能为空',
          type: 'info'
        })
        val = '规格名称' + (index + 1)
        this.formObj.attr1.value[index].attrVal = val
      }
      let attr = this.formObj.attr1.value[index]
      for (let sku of this.formObj.multiSku) {
        let splitStr = sku.code.split(',')
        let splitName = sku.codeName.split(',')
        for (let i in splitStr) {
          if (splitStr[i] == attr.id || splitStr[i] == attr.fakeId) {
            splitName.splice(i, 1, val)
            sku.codeName = splitName.join(',')
            break
          }
        }
      }
      if (this.formObj.attr1.value.length - 1 === index) {
        const attVal = {
          'id': '',
          'fakeId': this.attrIds1.charAt(this.attrId1),
          'attrVal': '',
          'imgUrl': ''
        }
        this.attrId1 = this.attrId1 + 1
        this.formObj.attr1.value.push(attVal)
      }
    },
    addAttrSku2(val, index) {
      if (val === '') {
        this.attrRatio2 = -1
        this.$message({
          message: '规格名称不能为空',
          type: 'info'
        })
        val = '规格名称' + (index + 1)
        this.formObj.attr2.value[index].attrVal = val
      }
      let attr = this.formObj.attr2.value[index]
      for (let sku of this.formObj.multiSku) {
        let splitStr = sku.code.split(',')
        let splitName = sku.codeName.split(',')
        for (let i in splitStr) {
          if (splitStr[i] == attr.id || splitStr[i] == attr.fakeId) {
            splitName.splice(i, 1, val)
            sku.codeName = splitName.join(',')
            break
          }
        }
      }
      if (this.formObj.attr2.value.length - 1 === index) {
        const attVal = {
          'id': '',
          'fakeId': this.attrIds2.charAt(this.attrId2),
          'attrVal': '',
          'imgUrl': ''
        }
        this.attrId2 = this.attrId2 + 1
        this.formObj.attr2.value.push(attVal)
      }
    },
    mulUpdate() {
      for (let sku of this.formObj.multiSku) {
        sku.price = this.uniSetting.price
        sku.fightPrice = this.uniSetting.fightPrice
        sku.marketingPrice = this.uniSetting.marketingPrice
        sku.supplyPrice = this.uniSetting.supplyPrice
        sku.stock = this.uniSetting.stock
      }
    },
    openPreviewModal(url) {
      this.previewImgVisible = true
      this.previewUrl = url
    },
    clearGalleryImg(index) {
      this.formObj.gallery.splice(index, 1)
      if (this.formObj.gallery[this.formObj.gallery.length - 1] !== '') {
        this.formObj.gallery.push('')
      }
    },
    clearposterImg() {
      // this.formObj.poster = ''
      this.$set(this.formObj, 'poster', '')
    },
    clearDescriptImg() {
      this.formObj.descript = ''
    },
    clearDetailImg(index) {
      this.formObj.detail.splice(index, 1)
      if (this.formObj.detail[this.formObj.detail.length - 1] !== '') {
        this.formObj.detail.push('')
      }
    },
    clearSkuImg(index) {
      this.formObj.attr1.value[index].imgUrl = ''
    },
    clearSkuImg1(index) {
      this.formObj.multiSku[index].skuImgUrl = ''
    },
    delAttrVal1(index) {
      let flag = false
      let attr = this.formObj.attr1.value[index]
      for (let sku of this.formObj.multiSku) {
        let splitStr = sku.codeName.split(',')
        for (let str of splitStr) {
          if (str === attr.attrVal) {
            flag = true
            break
          }
        }
        if (flag) {
          break
        }
      }
      if (flag) {
        this.$alert('存在规格相关商品内容，请先删除相关内容后再删除规格！', '提示', {
          confirmButtonText: '确定'
        }).then(() => {
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.$confirm('确定删除规格？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // if (this.formObj.attr1.value.length - 1 === index) { // 最后一个
          //   this.formObj.attr1.value.splice(index, 1, {
          //     'id': '',
          //     'fakeId': this.attrIds1.charAt(this.attrId1),
          //     'attrVal': '',
          //     'imgUrl': ''
          //   })
          //   this.attrId1 = this.attrId1 + 1
          // } else {
          this.formObj.attr1.value.splice(index, 1)
          this.attrRatio1 = -1
          // }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    delAttrVal2(index) {
      let flag = false
      let attr = this.formObj.attr2.value[index]
      for (let sku of this.formObj.multiSku) {
        let splitStr = sku.codeName.split(',')
        for (let str of splitStr) {
          if (str === attr.attrVal) {
            flag = true
            break
          }
        }
        if (flag) {
          break
        }
      }
      if (flag) {
        this.$alert('存在规格相关商品内容，请先删除相关内容后再删除规格！', '提示', {
          confirmButtonText: '确定'
        }).then(() => {
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.$confirm('确定删除规格？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // if (this.formObj.attr2.value.length - 1 === index) { // 最后一个
          //   this.formObj.attr2.value.splice(index, 1, {
          //     'id': '',
          //     'fakeId': this.attrIds2.charAt(this.attrId2),
          //     'attrVal': '',
          //     'imgUrl': ''
          //   })
          //   this.attrId2 = this.attrId2 + 1
          // } else {
          this.formObj.attr2.value.splice(index, 1)
          this.attrRatio2 = -1
          // }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    delAttr1() {
      // 点击删除规格1，同时删除规格1和规格2
      let flag = false
      for (let attr of this.formObj.attr1.value) {
        for (let sku of this.formObj.multiSku) {
          let splitStr = sku.codeName.split(',')
          for (let str of splitStr) {
            if (str === attr.attrVal) {
              flag = true
              break
            }
          }
          if (flag) {
            break
          }
        }
        if (flag) {
          break
        }
      }
      if (flag) {
        this.$confirm('存在规格相关商品内容，请先删除相关内容后再删除规格！', '提示', {
          confirmButtonText: '确定'
        }).then(() => {
          return
        }).catch((err) => {
          console.log(err)
          return
        })
      }
      if (this.formObj.attr2 !== null) {
        for (let attr of this.formObj.attr2.value) {
          for (let sku of this.formObj.multiSku) {
            let splitStr = sku.codeName.split(',')
            for (let str of splitStr) {
              if (str === attr.attrVal) {
                flag = true
                break
              }
            }
            if (flag) {
              break
            }
          }
          if (flag) {
            break
          }
        }
      }
      if (flag) {
        this.$alert('存在规格相关商品内容，请先删除相关内容后再删除规格！', '提示', {
          confirmButtonText: '确定'
        }).then(() => {
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.$confirm('确定删除规格？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.attrRatio1 = -1
          this.attrRatio2 = -1
          this.attrId1 = 0
          this.attrId2 = 0
          this.formObj.attr1 = {
            'id': '',
            'attrName': '',
            'value': [
              {
                'id': '',
                'fakeId': this.attrIds1.charAt(this.attrId1),
                'attrVal': '',
                'imgUrl': ''
              }
            ]
          }
          this.attrId1 = this.attrId1 + 1
          this.formObj.attr2 = null
          this.formObj.multiSku = []
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    delAttr2() {
      // 点击删除规格2，只删除规格2
      let flag = false
      for (let attr of this.formObj.attr2.value) {
        for (let sku of this.formObj.multiSku) {
          let splitStr = sku.codeName.split(',')
          for (let str of splitStr) {
            if (str === attr.attrVal) {
              flag = true
              break
            }
          }
          if (flag) {
            break
          }
        }
        if (flag) {
          break
        }
      }
      if (flag) {
        this.$alert('存在规格相关商品内容，请先删除相关内容后再删除规格！', '提示', {
          confirmButtonText: '确定'
        }).then(() => {
          return
        }).catch((err) => {
          console.log(err)
          return
        })
      } else {
        this.$confirm('确定删除规格？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let ind in this.formObj.multiSku) {
            if (!!this.formObj.multiSku[ind].code && this.formObj.multiSku[ind].code.indexOf(',') === -1) {
              continue
            }
            this.formObj.multiSku.splice(ind, 1)
          }
          this.attrRatio2 = -1
          this.attrId2 = 0
          this.formObj.attr2 = null
          // this.formObj.multiSku = []
        }).catch((err) => {
          console.log(err)
          return
        })
      }
    },
    addAttr2() {
      this.formObj.attr2 = {
        'id': '',
        'attrName': '',
        'value': [
          {
            'id': '',
            'fakeId': this.attrIds2.charAt(this.attrId2),
            'attrVal': '',
            'imgUrl': ''
          }
        ]
      }
      this.attrId2 = this.attrId2 + 1
    },
    addGoodsSku() {
      let attrValue1 = this.formObj.attr1.value[this.attrRatio1]
      let attrValue2 = this.attrRatio2 === -1 ? {} : this.formObj.attr2.value[this.attrRatio2]
      let code = ''
      let codeName = attrValue1.attrVal
      let singleCode = ''
      if (attrValue1.id) {
        code = code + attrValue1.id
        singleCode = attrValue1.id
      } else {
        code = code + attrValue1.fakeId
        singleCode = attrValue1.fakeId
      }
      if (this.attrRatio2 > -1) {
        if (attrValue2.id) {
          code = code + ',' + attrValue2.id
          codeName = codeName + ',' + attrValue2.attrVal
        } else {
          code = code + ',' + attrValue2.fakeId
          codeName = codeName + ',' + attrValue2.attrVal
        }
      }
      this.attrRatio1 = -1
      this.attrRatio2 = -1
      let isSingle = false
      if (singleCode == code) {
        isSingle = true
      }
      for (let obj of this.formObj.multiSku) {
        if (obj.code === code) {
          this.$message({
            message: '不能重复添加',
            type: 'info'
          })
          return
        }
        if (isSingle && singleCode == obj.code.split(',')[0]) { // 单规格匹配多规格
          this.$message({
            message: '已存在多规格，请删除后再添加',
            type: 'info'
          })
          return
        }
        if (!isSingle && obj.code.split(',').length === 1 && singleCode == obj.code) { // 双规格匹配单规格
          this.$message({
            message: '已存在单规格，请删除后再添加',
            type: 'info'
          })
          return
        }
      }
      let sku = {
        'code': code,
        'codeName': codeName,
        'price': '',
        'fightPrice': '',
        'supplyPrice': 0,
        'marketingPrice': '',
        'stock': '',
        'skuImgUrl': ''
      }
      this.formObj.multiSku.push(sku)
    },
    delSku(index) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.formObj.multiSku.splice(index, 1)
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    verifyPrice() {
      // 供货价＜=拼单价＜单买价＜市场价
      let valid = true
      if (this.formObj.specType === 0) { // 单品
        if (parseFloat(this.formObj.singleSku[0].supplyPrice) <= parseFloat(this.formObj.singleSku[0].fightPrice) &&
          parseFloat(this.formObj.singleSku[0].fightPrice) < parseFloat(this.formObj.singleSku[0].price) &&
          parseFloat(this.formObj.singleSku[0].price) < parseFloat(this.formObj.singleSku[0].marketingPrice) &&
          parseFloat(this.formObj.singleSku[0].fightPrice) > parseFloat(this.formObj.discount)) {
          this.priceVerify = true
          valid = true
        } else {
          this.priceVerify = false
          valid = false
        }
      } else if (this.formObj.specType === 1) { // 多规格
        const that = this
        this.formObj.multiSku.forEach(obj => {
          if (parseFloat(obj.supplyPrice) <= parseFloat(obj.fightPrice) &&
            parseFloat(obj.fightPrice) < parseFloat(obj.price) &&
            parseFloat(obj.price) < parseFloat(obj.marketingPrice) &&
            parseFloat(obj.fightPrice) > parseFloat(that.formObj.discount)) {
            this.priceVerify = true
            valid = true
          } else {
            this.priceVerify = false
            valid = false
          }
        })
      }
      return valid
    },
    verifyDiscountPrice() {
      // 立减优惠＜拼单价
      let valid = true
      if (this.formObj.specType === 0) { // 单品
        if (parseFloat(this.formObj.singleSku[0].fightPrice) > parseFloat(this.formObj.discount)) {
          this.priceVerify = true
          valid = true
        } else {
          this.priceVerify = false
          valid = false
        }
      } else if (this.formObj.specType === 1) { // 多规格
        const that = this
        const falg = this.formObj.multiSku.every((item, index, array) => {
          return parseFloat(item.fightPrice) > parseFloat(that.formObj.discount)
        })
        if (falg) {
          this.priceVerify = true
          valid = true
        } else {
          this.priceVerify = false
          valid = false
        }
        /* this.formObj.multiSku.forEach(obj => {
          console.log('多规格多规格多规格：', obj)

          if (parseFloat(obj.fightPrice) > ) {
            this.priceVerify = true
            valid = true
          } else {
            this.priceVerify = false
            valid = false
          }
        }) */
      }
      return valid
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (this.formObj.gallery.length === 0) {
          this.galleryValid = false
          valid = false
          this.$message({
            type: 'info',
            message: '至少上传一张商品轮播图'
          })
        }
        if (!this.formObj.poster) {
          this.posterValid = false
          valid = false
          this.$message({
            type: 'info',
            message: '至少上传一张商品海报图'
          })
        }
        if (this.formObj.descript.length === 0) {
          this.descriptValid = false
          valid = false
          this.$message({
            type: 'info',
            message: '至少上传一张商品列表图'
          })
        }
        if (this.formObj.detail.length === 0) {
          this.detailValid = false
          valid = false
          this.$message({
            type: 'info',
            message: '至少上传一张商品详情图'
          })
        }
        if (!this.verifyPrice()) {
          valid = false
          this.$message({
            type: 'info',
            message: '请注意价格规则：供货价<=拼单价<单买价<市场价'
          })
        }
        if (!this.verifyDiscountPrice()) {
          valid = false
          this.$message({
            type: 'info',
            message: '请注意价格规则：立减优惠＜拼单价'
          })
        }
        if (!this.formObj.discount && this.formObj.discount !== 0) {
          valid = false
          this.$message.info('立减优惠不能为空，需输入大于等于0的数字')
        }
        if (this.formObj.bookingTimeStart && this.formObj.limitTime[0]) {
          if (this.formObj.bookingTimeStart >= this.formObj.limitTime[0]) {
            return this.$message.error('预约开始时间要小于限时购买开始时间')
          }
        }
        if (this.formObj.specType === 1) { // 多规格
          let attrTransf = this.formObj.attr1.value
          for (let i = 0; i < attrTransf.length - 1; i++) {
            if (!attrTransf[i].imgUrl) {
              this.$message({
                type: 'info',
                message: '规格一的图片必须上传'
              })
              valid = false
              break
            }
          }
        }
        if (valid) {
          let galleryArr = this.formObj.gallery
          for (let index in galleryArr) {
            if (galleryArr[index] === '') {
              galleryArr.splice(index, 1)
            }
          }
          const gallery = galleryArr.join(',')
          let detailArr = this.formObj.detail
          for (let index in detailArr) {
            if (detailArr[index] === '') {
              detailArr.splice(index, 1)
            }
          }
          const detail = detailArr.join(',')
          let attr1 = {}
          let attr2 = {}
          let sku = []
          if (this.formObj.specType === 0) { // 单品
            sku = this.formObj.singleSku
          } else if (this.formObj.specType === 1) { // 多规格
            sku = this.formObj.multiSku
            attr1 = this.formObj.attr1
            let attrTransf1 = this.formObj.attr1.value
            attrTransf1.pop()
            attr1.value = attrTransf1

            attr2 = this.formObj.attr2
            if (attr2 !== null) {
              let attrTransf2 = this.formObj.attr2.value
              attrTransf2.pop()
              attr2.value = attrTransf2
            }
          }
          sku.forEach(o => {
            if (o.supplyPrice === '') {
              o.supplyPrice = 0
            }
          })
          let _deliveryConfig = {
            '包邮': this.formObj.deliveryConfig1.trim(),
            '发货时间': this.formObj.deliveryConfig2.trim(),
            '发货说明': this.formObj.deliveryConfig3.trim(),
          }
          let _serviceConfig = {
            '商会企业供货': this.formObj.serviceConfig1.trim(),
            '品质保证': this.formObj.serviceConfig2.trim(),
            '坏了包赔': this.formObj.serviceConfig3.trim(),
          }
          let obj = {
            'deliveryConfig': JSON.stringify(_deliveryConfig),
            'serviceConfig': JSON.stringify(_serviceConfig),
            'discount': this.formObj.discount,
            'bookingTimeStart': this.formObj.bookingTimeStart,
            'isBooking': this.formObj.isBooking,
            'id': this.formObj.id,
            'gallery': gallery,
            'poster': this.formObj.poster,
            'descript': this.formObj.descript,
            'detail': detail,
            'name': this.formObj.name,
            'supplierId': this.formObj.supplierId,
            'virtualSalesVolume': this.formObj.virtualSalesVolume === '' ? 0 : this.formObj.virtualSalesVolume,
            'limitAmount': this.formObj.limitAmount === '' ? 0 : this.formObj.limitAmount,
            'specType': this.formObj.specType,
            'attr1': attr1,
            'attr2': attr2,
            'sku': sku,
            'serviceFee': this.formObj.serviceFee,
            'wxServiceFee': this.formObj.wxServiceFee
          }
          if (this.formObj.limitTime) {
            obj['limitTimeStart'] = this.formObj.limitTime[0]
            obj['limitTimeEnd'] = this.formObj.limitTime[1]
          }
          if (this.type === 'add') {
            add(obj).then(response => {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.closeTab()
            })
          } else if (this.type === 'edit') {
            update(obj).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.closeTab()
            })
          }
        } else {
          return false
        }
      })
    },
    galleryStart() {
      this.galleryDrag = true
    },
    galleryEnd(evt) {
      this.galleryDrag = false
      // evt.item; //可以知道拖动的本身
      // evt.to; // 可以知道拖动的目标列表
      // evt.from; // 可以知道之前的列表
      // evt.oldIndex; // 可以知道拖动前的位置
      // evt.newIndex; // 可以知道拖动后的位置
    },
    detailStart() {
      this.detailDrag = true
    },
    detailEnd(evt) {
      this.detailDrag = false
      // evt.item; //可以知道拖动的本身
      // evt.to; // 可以知道拖动的目标列表
      // evt.from; // 可以知道之前的列表
      // evt.oldIndex; // 可以知道拖动前的位置
      // evt.newIndex; // 可以知道拖动后的位置
    },
    refreshView(e) {
      e.returnValue = false
      // this.$confirm('系统可能不会保存您所做的修改', '重新加载此网站？', {
      //   confirmButtonText: '重新加载',
      //   cancelButtonText: '取消'
      // }).then(() => {
      //   if (this.$route.params.goodsId) {
      //     this.goodsId = this.$route.params.goodsId
      //     this.init()
      //     this.type = 'edit'
      //   } else {
      //     this.type = 'add'
      //   }
      // }).catch((err) => {
      //   console.log(err)
      // })
    }
  },
  /* watch: {
    'formObj.limitTime': {
      handler(newValue, oldValue) {
        if (newValue) {
          let date = new Date()
          let min = date.getMinutes()
          date.setMinutes(min + 1) // 这里加1分钟，是为了解决值改变后，系统秒数就过期限制了，无法点击“此刻”按钮， 如果监听 “系统时间”的改变，则会影响性能。
          let nowDate = moment(date).format('HH:mm:ss')
          let st = ''
          if (moment(date).format('yyyy-MM-DD') === moment(newValue).format('yyyy-MM-DD')) {
            let hh1 = moment(newValue).format('HH:mm:ss')
            if (hh1 > nowDate) {
              this.formObj.bookingTimeStart = new Date()
            }
            st = nowDate
          } else {
            st = '23:59:59'
          }
          this.pickerOptions.selectableRange = '00:00:00 - ' + st
          this.pickerOptions = this.pickerOptions
        }
      },
      deep: true,
      immediate: true,
    }
  }*/
}
