import { getList } from '@/api/mall/mall'

export default {
  data() {
    return {
      list: []
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'goodsName': this.query.goodsName,
        'status': this.query.status,
        'ckey': this.query.ckey
      }
      if (this.query.date) {
        params['startTime'] = this.query.date[0]
        params['endTime'] = this.query.date[1]
      }
      getList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    }
  }
}
