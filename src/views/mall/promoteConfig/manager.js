import {
  getList,
  getChannelPromoteList,
  delChannelPromote,
  addChannelPromote,
  getChannelPromoteCode,
  getChannelPromoteLink,
  getChamberOptions
} from '@/api/mall/channel'
import {
  adminUdateGoodsStatus,
  batchAdminUpdateGoodsStatus,
  getGoodsQrcode
} from '@/api/goods/goods'
import {
  getGoodsDetail
} from '@/api/goods/goodsSku'
import domtoimage from 'dom-to-image'

// import { mapGetters } from 'vuex'

export default {
  data() {
    var checkId = (rule, value, callback) => {
      if (!/^$|^([1-9]\d*)$/.test(value)) {
        return callback(new Error('必须是大于0的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      isLoading: false,
      channelList: [], // 关联渠道列表
      goodsDetail: {}, // 商品详情
      channelLink: '',
      channelCode: '',
      promoteChannelDialog: false,
      channelLinkDialog: false,
      channelCodeDialog: false,
      showGoodIdsDetail: false,
      delDialog: false,
      rowIds: [],
      rowData: [],
      promoteForm: {
        channelId: '',
        goodsId: '',
        relType: '0',
        relTypeChild: '1',
        relCkey: '',
      },
      chamberOptions: [], // 商会列表
      previewImgVisible: false,
      previewUrl: '',
      query: {
        ckey: '',
        goodsName: '',
        status: '',
        date: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      promoteRules: {
        channelId: [{
          required: true,
          message: '请选择渠道',
          trigger: 'blur'
        }],
        relCkey: [{
          required: true,
          message: '请选择商会',
          trigger: 'change'
        }],
        goodsId: [{
            required: true,
            message: '请输入商品ID',
            trigger: 'blur'
          },
          {
            validator: checkId,
            trigger: 'blur'
          }
        ]
      },
    }
  },
  computed: {
    // ...mapGetters(['has'])
    chamberName() {
      return function (ckey) {
        let chamberName = ''
        for (let chamber of this.chamberOptions) {
          if (ckey === chamber.value) {
            chamberName = chamber.label
            break
          }
        }
        return chamberName
      }
    },
    submitDisable() {
      let bol = true
      if (this.promoteForm.relType == 0) {
        bol = !this.goodsDetail.name
      } else if (this.promoteForm.relType == 'list' && this.promoteForm.relTypeChild == 1) {
        bol = false
      } else if (this.promoteForm.relType == 'list' && this.promoteForm.relTypeChild == 2 && !this.promoteForm.relCkey) {
        bol = true
      } else {
        bol = false
      }
      return bol
    },
    relType(){
      return this.promoteForm.relType
    }
  },
  filters: {
    filterRelCkey(val, options) {
      let relName = ""
      options.map(item => {
        if (item.value == val) relName = item.label
      })
      return relName
    },
  },
  created() {
    this.getChamberOptions()
    this.getChannelList()
    this.getChannelPromoteLists()
  },
  watch:{
    relType(val){
      if(val == 0){
        this.promoteForm.goodsId = ''
      }else if(val == 'list'){
        this.promoteForm.relTypeChild = '1'
        this.promoteForm.relCkey = ''
      }
    },
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({
        tabName,
        actionName
      })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({
        tabName,
        actionName
      })
    },
    // 获取商会options
    async getChamberOptions() {
      let {
        data: res
      } = await getChamberOptions()
      this.chamberOptions = res.data
    },
    // 获取商品推广配置列表
    getChannelPromoteLists() {
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
      }
      getChannelPromoteList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentpage = 1
      this.getChannelPromoteLists()
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.getChannelPromoteLists()
    },

    // 获取关联渠道列表
    getChannelList() {
      getList().then(res => {
        this.channelList = res.data.list
      })
    },

    // 创建推广信息
    addPromoteChannel(e) {
      this.promoteChannelDialog = true
      this.promoteForm.goodsId = ''
      this.promoteForm.channelId = ''
      this.goodsDetail = {}
    },

    handleInput(e) {
      if (!this.promoteForm.goodsId) this.showGoodIdsDetail = false
      // 查询商品详情
      if (this.promoteForm.goodsId.trim() !== '' && /^$|^([1-9]\d*)$/.test(this.promoteForm.goodsId)) {
        getGoodsDetail({
          id: this.promoteForm.goodsId
        }).then(res => {
          if (res.state === 1) {
            this.goodsDetail = res.data.goodsDetail
            this.showGoodIdsDetail = true
          }
        }).catch(() => {
          this.showGoodIdsDetail = false
        })
      }
    },

    // 提交创建推广信息
    submitPromote(promoteForm) {
      this.$refs[promoteForm].validate((valid) => {
        if (valid) {
          this.promoteForm.goodsId = parseInt(this.promoteForm.goodsId)
          let params = {
            ...this.promoteForm
          }
          if (params.relType == 'list') {
            delete params.goodsId
            params.relType = this.promoteForm.relTypeChild * 1
            if (params.relType != 2) {
              delete params.relCkey
            }
            delete params.relTypeChild
          } else if (params.relType == 0) {
            delete params.relCkey
            delete params.relTypeChild
          }
          addChannelPromote(params).then(res => {
            if (res.state === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.currentpage = 1
              this.getChannelPromoteLists()
              this.promoteChannelDialog = false
            }
          })
        } else {
          return false
        }
      })
    },

    // 生成渠道码
    createCode(e, row) {
      this.channelCodeDialog = true
      this.rowData = row
      getChannelPromoteCode({
        id: row.id
      }).then(res => {
        if (res.state === 1) {
          this.channelCode = res.data
          /* let imgUrl = res.data.qrCode
          let alink = document.createElement('a')
          alink.href = imgUrl
          alink.target = '_blank'
          alink.click()*/
        } else {
          console.log(res)
        }
      })
    },

    downloadCode() {
      const _this = this
      this.isLoading = true
      const node = document.getElementById('postdiv')
      domtoimage.toPng(node)
        .then((dataUrl) => {
          var a = document.createElement('a')
          a.download = '渠道码'
          a.href = dataUrl
          a.click()
          _this.isLoading = false
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error)
          _this.isLoading = false
        })
    },

    // 生成短连接
    createLink(e, row) {
      this.channelLinkDialog = true
      getChannelPromoteLink({
        id: row.id
      }).then(res => {
        if (res.state === 1) {
          this.channelLink = res.data
        } else {
          console.log(res)
        }
      })
    },

    copyUrl() {
      let url = this.channelLink
      let oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select() // 选择对象
      document.execCommand('Copy')
      oInput.className = 'oInput'
      oInput.style.display = 'none'
      this.$message.success('链接已复制')
    },

    delChannels(e, row) {
      let ids = []
      ids.push(row.id)
      this.rowIds = ids
      this.delDialog = true
    },

    comfirmDel() {
      delChannelPromote(this.rowIds).then(res => {
        if (res.state === 1) {
          this.getChannelPromoteLists()
          this.delDialog = false
        }
      })
    },
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({
        name: '商品详情',
        params: {
          goodsId: row.goodsId
        }
      })
    },
    openPreviewModal(url) {
      this.previewImgVisible = true
      this.previewUrl = url
    }
  }
}
