import {
  getList,
  getChannelPromoteList,
  delChannelPromote,
  addChannelPromote,
  getChannelPromoteCode,
  getChannelPromoteLink
} from '@/api/mall/channel'
import { adminUdateGoodsStatus, batchAdminUpdateGoodsStatus, getGoodsQrcode } from '@/api/goods/goods'
import { getGoodsDetail } from '@/api/goods/goodsSku'
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
        goodsId: ''
      },
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
      chamberOptions: [],
      promoteRules: {
        channelId: [
          { required: true, message: '请选择渠道', trigger: 'blur' }
        ],
        goodsId: [
          { required: true, message: '请输入商品ID', trigger: 'blur' },
          { validator: checkId, trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    // ...mapGetters(['has'])
    chamberName() {
      return function(ckey) {
        let chamberName = ''
        for (let chamber of this.chamberOptions) {
          if (ckey === chamber.value) {
            chamberName = chamber.label
            break
          }
        }
        return chamberName
      }
    }
  },
  created() {
    this.getChannelList()
    this.getChannelPromoteLists()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
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
      // 查询商品详情
      if (this.promoteForm.goodsId.trim() !== '' && /^$|^([1-9]\d*)$/.test(this.promoteForm.goodsId)) {
        getGoodsDetail({ id: this.promoteForm.goodsId }).then(res => {
          if (res.state === 1) {
            console.log(res)
            this.goodsDetail = res.data.goodsDetail
            this.showGoodIdsDetail = true
          }
        })
      }
    },

    // 提交创建推广信息
    submitPromote(promoteForm) {
      this.$refs[promoteForm].validate((valid) => {
        if (valid) {
          this.promoteForm.goodsId = parseInt(this.promoteForm.goodsId)
          addChannelPromote(this.promoteForm).then(res => {
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
      getChannelPromoteCode({ id: row.id }).then(res => {
        if (res.state === 1) {
          console.log(res)
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
        .catch(function(error) {
          console.error('oops, something went wrong!', error)
          _this.isLoading = false
        })
    },

    // 生成短连接
    createLink(e, row) {
      this.channelLinkDialog = true
      getChannelPromoteLink({ id: row.id }).then(res => {
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
      this.$router.push({ name: '商品详情', params: { goodsId: row.goodsId } })
    },
    openPreviewModal(url) {
      this.previewImgVisible = true
      this.previewUrl = url
    }
  }
}
