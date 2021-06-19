import { getList, updateStatus, batchUpdateStatus } from '@/api/mall/mall'
import { updateGoodsStatus, batchUpdateGoodsStatus } from '@/api/goods/goods'
import { getChamberOptions } from '@/api/finance/finance'

// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
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
      chamberOptions: []
    }
  },
  computed: {
    // ...mapGetters(['has'])
    chamberName () {
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
  created () {
    this.getChamberOptions()
    this.init()
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
    getChamberOptions () {
      getChamberOptions().then(response => {
        this.chamberOptions = response.data.data
      })
    },
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'goodsName': this.query.goodsName,
        'status': this.query.status,
        'ckey': this.query.ckey,
        'startTime': this.query.date[0],
        'endTime': this.query.date[1]
      }
      // const objList = [{
      //   id: 2242,
      //   descript: 'https://std.17int.cn/ecfile/portrait/210325161549552-购物车.png',
      //   name: '电暖器家用桌面式小型暖手脚台式迷你暖风电暖器',
      //   price: '119.0-199.9',
      //   fightPrice: '109.5-185.9',
      //   supplyPrice: '99-169',
      //   stocks: 968,
      //   salesVolume: 787,
      //   chamberName: '广东省江西商会',
      //   createTime: '2021-03-27 14:57:00',
      //   isOnSale: '1'
      // }]
      // this.list = objList
      // this.total = 1
      // this.listLoading = false
      getList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    handleSelectionChange (value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        this.selectionDatas.push(data.id)
      }
    },
    updateStatus(e, id, status) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'goodId': id,
        'status': status
      }
      updateGoodsStatus(params).then(response => {
        if (status === 1) {
          this.$message({
            message: '上架成功',
            type: 'success'
          })
        } else if (status === 2) {
          this.$message({
            message: '下架成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    batchUpdateStatus(e, status) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'goodsIds': this.selectionDatas,
        'status': status
      }
      batchUpdateGoodsStatus(params).then(response => {
        if (status === 1) {
          this.$message({
            message: '上架成功',
            type: 'success'
          })
        } else if (status === 2) {
          this.$message({
            message: '下架成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    detail (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '商品详情', params: { goodsId: row.id } })
    },
    openPreviewModal (url) {
      this.previewImgVisible = true
      this.previewUrl = url
    }
  }
}
