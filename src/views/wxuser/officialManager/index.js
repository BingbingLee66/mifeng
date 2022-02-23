import { getUserList, updateUserStatus } from '@/api/member/manager'
import { getChamberAllList } from '@/api/goods/goods'
import { officialUserList } from '@/api/user'
import officialComponent from './components/index'
export default {
  data() {
    return {
      chamberOptions: [],
      listLoading: false,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      typeOptions: [],
      query: {
        uname: '',
        mulValue: '',
        userType: -1,
        chamberId: '',
        status: -1,
        date: ''
      }
    }
  },
  components:{
    officialComponent
  },
  computed: {},
  created() {
    this.getAllChamberList()
    this.init()
  },
  methods: {
  
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
    init() {
        //this.fetchData();
        let params={
          'pageSize': 1000,
        'page': 1,
        'status': this.query.status,
        'chamberId': '',
        // 'phone':this.query.phone,
        'phone':'',
       // 'uName':this.query.uName,
        'uName':'',
        wxUserId:''
        }
        this.officialUserListFunc(params)
    },
    getAllChamberList() {
      getChamberAllList().then(res => {
        console.log('所有商会列表：', res)
        if (res.state === 1) {
          this.chamberOptions = res.data.data
          this.chamberOptions.unshift({ 'name': '全部', 'id': -1 }, { 'name': '未加入商会', 'id': -2 })
          this.aLLChamberlist
          this.listLoading = false
        } else {
          console.log(res)
          this.listLoading = false
        }
      })
    },
    fetchData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
        this.currentpage = 1
      }
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'status': this.query.status,
        'chamberId': this.query.chamberId,
        'phone':this.query.phone,
        'uName':this.query.uName
      }
      if (this.query.mulValue) {
        params['mulValue'] = this.query.mulValue
      }
      if (this.query.chamberName) {
        params['chamberName'] = this.query.chamberName
      }
      if (this.query.uname) {
        params['uname'] = this.query.uname
      }
      if (this.query.date) {
        params['startTs'] = this.query.date[0]
        params['endTs'] = this.query.date[1]
      }
      getUserList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    /**请求方法类 */
    async officialUserListFunc(params){
     await officialUserList(params).then(res=>{
       if(res.state===1){
         this.list=res.data.list

       }

      })

    },
    /** 行为操作类 */
    showOfficialDialog(){
      this.$refs["officialDialog"].show(this.chamberOptions).then(()=>{
        this.fetchData()
      });
    },
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '用户详情', params: { 'userDetail': row }})
    },
    updateStatus(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'userId': row.id,
        'action': row.status === 0 ? 'active' : 'notactive'
      }
      updateUserStatus(params).then(response => {
        if (row.status === 0) {
          this.$message({
            message: '解冻成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '冻结成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    }
  }
}
