import {
  getUserList,
  updateUserStatus
} from '@/api/member/manager'
import {
  getChamberAllList
} from '@/api/goods/goods'
import {
  officialUserList,
  deleteOfficial
} from '@/api/user'
import officialComponent from './components/index'
export default {
  data() {
    return {
      chamberOptions: [],
      listLoading: false,
      pageSizes: [10, 20, 50, 100, 500],
      //总条数
      total: 0,
      //数据源
      list: [],
      //当前页
      currentpage: 1,
      limit: 10,
      typeOptions: [],
      //表单参数
      query: {
        chamberId: '',
        status: -1,
        phone: '',
        uName: '',
        wxUserId: ''
      }
    }
  },
  components: {
    officialComponent
  },
  computed: {},
  created() {
    this.getAllChamberList()
    this.fetchData()
  },
  methods: {

    handleSizeChange(val) {
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    },
    fetchData() {
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'status': this.query.status,
        'chamberId': this.query.chamberId,
        'phone': this.query.phone,
        'uName': this.query.uName,
        'wxUserId': this.query.wxUserId,
      }
      this.officialUserListFunc(params)
    },
    getAllChamberList() {
      getChamberAllList().then(res => {
        if (res.state === 1) {
          this.chamberOptions = res.data.data
          this.chamberOptions.unshift({
            'name': '全部',
            'id': -1
          }, {
            'name': '未加入商会',
            'id': -2
          })
          this.aLLChamberlist
          this.listLoading = false
        } else {
          console.log(res)
          this.listLoading = false
        }
      })
    },
    // fetchData(e) {
    //   if (e !== undefined) {
    //     window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
    //     this.currentpage = 1
    //   }
    //   this.listLoading = true
    //   let params = {
    //     'pageSize': this.limit,
    //     'page': this.currentpage,
    //     'status': this.query.status,
    //     'chamberId': this.query.chamberId,
    //     'phone':this.query.phone,
    //     'uName':this.query.uName
    //   }
    //   if (this.query.mulValue) {
    //     params['mulValue'] = this.query.mulValue
    //   }
    //   if (this.query.chamberName) {
    //     params['chamberName'] = this.query.chamberName
    //   }
    //   if (this.query.uname) {
    //     params['uname'] = this.query.uname
    //   }
    //   if (this.query.date) {
    //     params['startTs'] = this.query.date[0]
    //     params['endTs'] = this.query.date[1]
    //   }
    //   getUserList(params).then(response => {
    //     this.list = response.data.data.list
    //     this.total = response.data.data.totalRows
    //     this.listLoading = false
    //   })
    // },
    /**请求方法类 */
    async officialUserListFunc(params) {
      await officialUserList(params).then(res => {
        if (res.state === 1) {
          this.list = res.data.list;
          this.total = res.data.totalRows
        }
      })
    },
    //删除官方号
    deleteOfficialFunc(id) {
      deleteOfficial(id).then(res => {
        if (res.state === 1) {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.fetchData();
        }
      })
    },
    /** 行为操作类 */
    showOfficialDialog() {
      this.$refs["officialDialog"].show(this.chamberOptions).then(() => {
        this.fetchData()
      });
    },
    detail(e, row) {
      console.log('row', row);
      const h = this.$createElement;
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '确认移除所选官方账号吗？ '),
          h('p', null, [h('span', null, '1.移除后，编辑台动态列表也将隐藏  '), , h('span', {
            style: 'color: #FF0000'
          }, '（非删除）'), h('span', null, '该用户所有动态，仅支持在小程序个人主页中查看所有动态数据')]),
          h('p', null, '2.被移除用户无法被选为发布者'),
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
        //点确定
          if (action === 'confirm') {
            this.deleteOfficialFunc(row.id)
          } else {  
          }
          console.log('beforeClose',action)
          done();
        }
      })
    },
  
  }
}
