import { getGoodsDetail } from '@/api/goods/goodsSku'
import { getChamberAllList } from '@/api/goods/goods'
import { getAllGoodsList } from '@/api/mall/mall'

export default {
  data() {
    return {
      couponId: '',
      couponDetail: {},
      showCouponListDialog: false,
      query: {
        ckey: '',
        goodsId: '',
        goodsName: '',
        status: ''
      },
      listLoading: false,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      chamberOptions: []
    }
  },
  created() {
    this.getChamberList()
    if (this.$route.params.couponId) {
      this.couponId = this.$route.params.couponId
      this.fetchData()
    }
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    fetchData() {
      const res = getGoodsDetail({ 'id': this.couponId })
      console.log(res)
    },
    showCouponList() {
      this.showCouponListDialog = true
    },
    getChamberList() {
      getChamberAllList().then(res => {
        if (res.state === 1) {
          this.chamberOptions = res.data.data
          this.chamberOptions.unshift({ 'name': '全部', 'id': -1 }, { 'name': '未加入商会', 'id': -2 })
        }
      })
    },
    getCouponList() {
      // this.listLoading = true
      /* let params = {
        'page': this.page,
        'pageSize': this.pageSize,
        'goodsName': this.query.goodsName,
        'goodsId': this.query.goodsId,
        'status': this.query.status,
        'ckey': this.query.ckey
      } */
      /* let res = getAllGoodsList(params)
      if (res.state === 1 ) {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      } */
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentpage = 1
      this.getCouponList()
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.getCouponList()
    },
  }
}
