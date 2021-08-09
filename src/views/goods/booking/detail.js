import {
  getBookingList,
  getChamberAllList
} from '@/api/goods/goods'
import moment from 'moment'
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      goodsName: '',
      query: {
        goodsId: null,
        uname: '',
        phone: '',
        status: -1,
        chamberId: -1
      },
      currentpage: 1,
      page: 1,
      pageSize: 10,
      total: 0,
      bookingList: [],
      listLoading: false,
      chamberOptions: []
    }
  },
  filters: {
    formatDate(val) {
      return moment(val).format('yyyy-MM-DD HH:mm')
    }
  },
  created() {
    this.getAllChamberList()
    if (this.$route.query.goodsId) {
      this.query.goodsId = this.$route.query.goodsId
      this.goodsName = this.$route.query.goodsName
      this.getBookingList()
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.page = val
      this.page = 1
      this.currentpage = 1
      this.getBookingList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.getBookingList()
    },
    getAllChamberList() {
      getChamberAllList().then(res => {
        console.log('所有商会列表', res)
        if (res.state === 1) {
          this.chamberOptions = res.data.data
          this.chamberOptions.unshift({ 'name': '全部', 'id': -1 })
          this.aLLChamberlist
          this.listLoading = false
        } else {
          console.log(res)
          this.listLoading = false
        }
      })
    },
    getBookingList(e) {
      this.listLoading = true
      let params = {
        'page': this.page,
        'pageSize': this.pageSize,
        'goodsId': this.query.goodsId,
        'uname': this.query.uname,
        'phone': this.query.phone,
        'chamberId': this.query.chamberId,
        'status': this.query.status,
      }
      getBookingList(params).then(res => {
        console.log('商品预约列表：', res)
        if (res.state === 1) {
          this.bookingList = res.data.list
          this.total = res.data.totalRows
          this.listLoading = false
        } else {
          console.log(res)
          this.listLoading = false
        }
      })
    },
    detail(e, row) {
      let rowObj = row
      rowObj['id'] = row.uid
      this.$router.push({
        name: '会员详情',
        params: { 'memberDetail': rowObj }
      })
    },
  }
}
