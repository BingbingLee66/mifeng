import { 
  getSkuOptions,
  getGoodsDetail,
  uploadGoodsImg,
  add,
  update } from '@/api/goods/goodsSku'
import { getSupplierOptions } from '@/api/goods/supplier.js'
import { getSetting } from '@/api/system/setting'
import area from '@/utils/area'
import videoPreview from '@/assets/img/video-pre.jpg'

export default {
  data() {
    var checkFee = (rule, value, callback) => {
      if (!/^[0]$|^(([1-9]\d*)|[0]\.\d{1,2}|([1-9]\d*)\.\d{1,2})$/.test(value)) {
        return callback(new Error('可以为0或最多两位小数的正数'))
      } else {
        return callback()
      }
    }
    var checkNumber = (rule, value, callback) => {
      if (!/^([1-9]\d*)$/.test(value)) {
        return callback(new Error('必须是大于0的整数'))
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
    return {
      videoPreview: videoPreview,
      previewImgVisible: false,
      previewUrl: '',
      goodsId: '',
      type: 'add',
      galleryValid: true,
      descriptValid: true,
      detailValid: true,
      formObj: {
        'gallery': [''],
        'descript': '',
        'detail': [''],
        'name': '',
        'supplierId': '',
        'salesVolume': '',
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
            'supplyPrice': '',
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
        marketingPrice: [
          { required: true, message: '商品市场价不能为空', trigger: 'blur' },
          { validator: checkFee, trigger: 'change' }
        ],
        supplyPrice: [
          { required: true, message: '商品供货价不能为空', trigger: 'blur' },
          { validator: checkFee, trigger: 'change' }
        ],
        salesVolume: [
          { required: true, message: '虚拟销量不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'change' }
        ],
        limitTime: [
          { required: true, message: '请选择限时购买日期', trigger: 'change' }
        ],
        limitAmount: [
          { required: true, message: '单次限购不能为空', trigger: 'blur' },
          { validator: checkNumber2, trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    if (this.$route.params.goodsId) {
      this.goodsId = this.$route.params.goodsId
      this.init()
      this.type = 'edit'
    } else {
      this.type = 'add'
    }
    this.getSupplierOptions()
    this.getAttrOptions()
  },
  computed: {
  },
  created () {
  },
  methods: {
    closeTab () {
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
    init () {
      this.fetchData()
    },
    getSupplierOptions () {
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
    getAttrOptions () {
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
    fetchData () {
      let params = {
        'id': this.goodsId
      }
      getGoodsDetail(params).then(response => {
        const obj = response.data.goodsDetail
        this.formObj = obj
        this.formObj['gallery'] = obj.gallery.split(',')
        this.formObj['gallery'].push('')
        this.formObj['descript'] = obj.descript
        this.formObj['detail'] = obj.detail.split(',')
        this.formObj['detail'].push('')
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
        limitTime.push(obj.limitTimeStart)
        limitTime.push(obj.limitTimeEnd)
        this.formObj['limitTime'] = limitTime
      })
    },
    setSku () {
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
        console.log(this.formObj.attr1)
      } else if (this.formObj.specType === 0) { // 单品
        if (this.formObj.singleSku.length === 0) {
          let sku = {
            'code': '',
            'codeName': '',
            'price': '',
            'fightPrice': '',
            'supplyPrice': '',
            'marketingPrice': '',
            'stock': ''
          }
          this.formObj.singleSku.push(sku)
        }
      }
    },
    beforeAvatarUpload (file) {
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
    beforeAvatarUploadGallery (file) {
      let result = true
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
      } else if (file.type.indexOf('video/') !== -1) { // 图片
        if (file.type !== 'video/mp4' &&
              file.type !== 'video/rmvb' &&
              file.type !== 'video/avi') {
          this.$message.error('上传视频只能是 MP4 、 RMVB 、 或 AVI 格式!')
          result = false
        }
        if (file.size > 1024 * 1024 * 10) {
          this.$message.error('上传视频大小不能超过 10MB!')
          result = false
        }
      } 
      return result
    },
    uploadGallery (content, index) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadGoodsImg(formData).then(response => {
        this.formObj.gallery.splice(index, 1, response.data.filePath)
        if (this.formObj.gallery.length - 1 === index) {
          this.formObj.gallery.push('')
        }
        this.galleryValid = true
      })
    },
    uploadDescript (content) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadGoodsImg(formData).then(response => {
        this.formObj.descript = response.data.filePath
        this.descriptValid = true
      })
    },
    uploadDetail (content, index) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadGoodsImg(formData).then(response => {
        this.formObj.detail.splice(index, 1, response.data.filePath)
        if (this.formObj.detail.length - 1 === index) {
          this.formObj.detail.push('')
        }
        this.detailValid = true
      })
    },
    uploadAttr1 (content, index) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadGoodsImg(formData).then(response => {
        this.formObj.attr1.value[index].imgUrl = response.data.filePath
      })
    },
    uploadSku (content, index) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadGoodsImg(formData).then(response => {
        this.formObj.multiSku[index].skuImgUrl = response.data.filePath
      })
    },
    addAttrSku1 (val, index) {
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
    addAttrSku2 (val, index) {
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
    mulUpdate () {
      for (let sku of this.formObj.multiSku) {
        sku.price = this.uniSetting.price
        sku.fightPrice = this.uniSetting.fightPrice
        sku.marketingPrice = this.uniSetting.marketingPrice
        sku.supplyPrice = this.uniSetting.supplyPrice
        sku.stock = this.uniSetting.stock
      }
    },
    openPreviewModal (url) {
      this.previewImgVisible = true
      this.previewUrl = url
    },
    clearGalleryImg (index) {
      this.formObj.gallery.splice(index, 1, '')
    },
    clearDescriptImg () {
      this.formObj.descript = ''
    },
    clearDetailImg (index) {
      this.formObj.detail.splice(index, 1, '')
    },
    clearSkuImg (index) {
      this.formObj.attr1.value[index].imgUrl = ''
    },
    clearSkuImg1 (index) {
      this.formObj.multiSku[index].skuImgUrl = ''
    },
    delAttrVal1 (index) {
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
          // }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    delAttrVal2 (index) {
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
          // }
          this.formObj.attr2.value.splice(index, 1)
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    delAttr1 () {
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
          for (let sku of this.this.formObj.multiSku) {
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
    delAttr2 () {
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
          this.attrId2 = 0
          this.formObj.attr2 = null
          this.formObj.multiSku = []
        }).catch((err) => {
          console.log(err)
          return
        })
      }
    },
    addAttr2 () {
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
    addGoodsSku () {
      let attrValue1 = this.formObj.attr1.value[this.attrRatio1]
      let attrValue2 = this.attrRatio2 === -1 ? {} : this.formObj.attr2.value[this.attrRatio2]
      let code = ''
      let codeName = attrValue1.attrVal
      if (!!attrValue1.id) {
        code = code + attrValue1.id
      } else {
        code = code + attrValue1.fakeId
      }
      if (this.attrRatio2 > -1) {
        if (!!attrValue2.id) {
          code = code + ',' + attrValue2.id
          codeName = codeName + ',' + attrValue2.attrVal
        } else {
          code = code + ',' + attrValue2.fakeId
          codeName = codeName + ',' + attrValue2.attrVal
        }
      }
      let sku = {
        'code': code,
        'codeName': codeName,
        'price': '',
        'fightPrice': '',
        'supplyPrice': '',
        'marketingPrice': '',
        'stock': '',
        'skuImgUrl': ''
      }
      this.formObj.multiSku.push(sku)
    },
    delSku (index) {
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
    save () {
      this.$refs['form'].validate((valid) => {
        if (this.formObj.gallery.length === 1) {
          this.galleryValid = false
          valid = false
        }
        if (this.formObj.descript.length === 0) {
          this.descriptValid = false
          valid = false
        }
        if (this.formObj.detail.length === 1) {
          this.detailValid = false
          valid = false
        }
        if (valid) {
          let galleryArr = this.formObj.gallery
          galleryArr.pop()
          const gallery = galleryArr.join(',')
          let detailArr = this.formObj.detail
          detailArr.pop()
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
          let obj = {
            'id': this.formObj.id,
            'gallery': gallery,
            'descript': this.formObj.descript,
            'detail': detail,
            'name': this.formObj.name,
            'supplierId': this.formObj.supplierId,
            'salesVolume': this.formObj.salesVolume,
            'limitTimeStart': this.formObj.limitTime[0],
            'limitTimeEnd': this.formObj.limitTime[1],
            'limitAmount': this.formObj.limitAmount,
            'specType': this.formObj.specType,
            'attr1': attr1,
            'attr2': attr2,
            'sku': sku
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
    }
  }
}
