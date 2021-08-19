import { getList } from '@/api/mall/mall'
import { getChamberOptions } from '@/api/finance/finance'
export default {
  data() {
    return {
      activeName: 'first',
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
      showWeightDialog: false,
      showAddDialog: false,
      numberValidateForm: {
        weight: 0
      }
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
    }
  },
  created() {
    this.getChamberOptions()
    this.fetchData()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
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
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    getChamberOptions() {
      getChamberOptions().then(response => {
        this.chamberOptions = response.data.data
      })
    },
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
    },
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        this.selectionDatas.push(data.id)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
  }
}
