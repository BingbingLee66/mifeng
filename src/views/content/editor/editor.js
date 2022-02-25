import {
  getGlobalContentList,
  save,
  updateStatusPlatform,
  dynamicPagedList
} from '@/api/content/article'
import {
  getContentColumnOptions
} from '@/api/content/columnsetup'
import {
  dynamicTypeList,
  statusList,
  publishTimeTypeList
} from '@/utils/commonData.js'
import {
  getChamberAllList
} from '@/api/goods/goods'
export default {
  components: {},
  data() {
    return {
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      query: {
        title: '',
        contentColumnId: -1,
        articleId: '',
        //发布状态
        status: '-1',
        creator: '',
        column: '',
        orderType: 0,
        date: '',
        //动态类型
        dynamicType: '0',
        //发布时间
        publishTimeType: '0',
        //来源商会
        ckey: ''
      },
      optionList: [
        '标签聚合页',
        '商会必参',
        '标签聚合页/商会必参'
      ],
      contentColumnOptions: [],
      formObj: {},
      //当前激活tab
      activeName: '1',
      //发布时间list
      publishTimeTypeList,
      //状态list
      statusList,
      //动态类型数组
      dynamicTypeList,
      //来源商会list
      chamberOptions: [],
      //动态列表
      dynamicList: []
    }

  },
  mounted() {},
  computed: {},
  created() {
    this.getContentColumnType()
    this.init()
  },
  methods: {

    // 选择指定列进行排序
    changeTableSort(column) {
      console.log(column)
      if (this.activeName == '1') {
        this.getGlobalContentListFunc(true, column)
      } else {
        this.dynamicPagedListFunc(true, column)
      }
      // 获取字段名称和排序类型
      // var fieldName = column.prop
      // var sortingType = column.order
      // this.query.column = column.prop
      // this.query.orderType = column.order === 'ascending' ? 1 : -1
      // this.listLoading = true;

      // let params = {
      //   'pageSize': this.limit,
      //   'page': this.currentpage,
      //   'title': this.query.title,
      //   'contentColumnId': this.query.contentColumnId,
      //   'creator': this.query.creator,
      //   'articleId': this.query.articleId,
      //   'column': this.query.column,
      //   'orderType': this.query.orderType,
      //   // 'orderType': sortingType === 'ascending' ? 1 : -1,
      //   'status': this.query.status
      // }
      // //为发布动态类型时
      // if(this.activeName==='2'){
      //  let _params= Object.assign({
      //   'ckey':this.query.ckey,
      //   'dynamicType':this.query.dynamicType,
      //   'publishTimeType':this.query.publishTimeType,
      //   'dynamicType':this.query.dynamicType,
      //   'order':column.order === 'ascending' ? 'desc' : 'asc',
      //   'pageNum':this.currentpage,
      //  }, ...params)
      //   console.log('_params',_params)
      //   this.dynamicPagedListFunc(_params);
      //   return;
      // }

      // if (this.query.date) {
      //   params['startTs'] = this.query.date[0]
      //   params['endTs'] = this.query.date[1]
      // }
      // getGlobalContentList(params).then(response => {
      //   this.list = response.data.data.list
      //   this.total = response.data.data.totalRows
      //   this.listLoading = false
      // })
      // console.log(this.tableData)
    },
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
    //切换tab
    handleClick(event) {
      console.log('activeName', this.activeName);
      this.currentpage=1
      this.query.orderType='';
      this.limit = this.pageSizes[0];
      this.query.column='';
     
    //  this.$refs['tableData'].clearSort();
      if (this.activeName == '1') {
        this.getGlobalContentListFunc()
      } else {
        this.dynamicPagedListFunc()
      }
      this.$nextTick(() =>{
        this.$refs['tableData'].clearSort(); 
       })
    },
    init() {
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    getContentColumnType() {
      getContentColumnOptions().then(response => {
        this.contentColumnOptions = response.data.data
        this.contentColumnOptions.unshift({
          'label': '全部',
          'value': -1
        })
      })
    },
    queryData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.currentpage = 1
      if (this.activeName == '1') {
        this.getGlobalContentListFunc()
      } else {
        this.dynamicPagedListFunc()
      }
    },
    /**请求类 */
    //拉取全部商会
    getAllChamberList() {
      getChamberAllList().then(res => {
        if (res.state === 1) {
          this.chamberOptions = res.data.data
          this.chamberOptions.unshift({
            'name': '全部',
            'ckey': ''
          })
        }
      })
    },
    //拉取动态列表
    dynamicPagedListFunc(sort = false, column) {
      let params = {
        'pageSize': this.limit,
        'ckey': this.query.ckey,
        'dynamicType': this.query.dynamicType,
        'publishTimeType': this.query.publishTimeType,
        'dynamicType': this.query.dynamicType,
        'order': '',
        'pageNum': this.currentpage,
        'status': this.query.status
      }
      if (sort) {
        let type='ascending' ? 'desc' : 'asc';
        params.order = column.prop +' '+type;
      }
      dynamicPagedList(params).then(res => {
        if (res.state === 1) {
          this.dynamicList = res.data.list
        }
      })
    },
    //拉取文章列表；
    getGlobalContentListFunc(sort = false, column) {
      console.log('getGlobalContentListFunc')
      this.listLoading = true;
      //为排序拉取数据时
      if (sort) {
        this.query.column = column.prop;
        this.query.orderType = column.order === 'ascending' ? 1:-1
      }
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'title': this.query.title,
        'contentColumnId': this.query.contentColumnId,
        'creator': this.query.creator,
        'articleId': this.query.articleId,
        'column': this.query.column,
        'orderType': this.query.orderType,
        'status': this.query.status
      }
      if (this.query.date) {
        params['startTs'] = this.query.date[0]
        params['endTs'] = this.query.date[1]
      }
      getGlobalContentList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    fetchData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.getAllChamberList()
      this.listLoading = true;
      console.log('fetchData')
      this.getGlobalContentListFunc()
      // let params = {
      //   'pageSize': this.limit,
      //   'page': this.currentpage,
      //   'title': this.query.title,
      //   'contentColumnId': this.query.contentColumnId,
      //   'creator': this.query.creator,
      //   'articleId': this.query.articleId,
      //   'column': this.query.column,
      //   'orderType': this.query.orderType,
      //   'status': this.query.status
      // }
      // if (this.query.date) {
      //   params['startTs'] = this.query.date[0]
      //   params['endTs'] = this.query.date[1]
      // }
      // getGlobalContentList(params).then(response => {
      //   this.list = response.data.data.list
      //   this.total = response.data.data.totalRows
      //   this.listLoading = false
      // })
    },
    openVisible(row) {
      this.formObj = row
    },
    updateStatus(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let ids = []
      ids.push(row.id)
      let params = {
        'articleIds': ids,
        'action': row.status === 3 ? 'active' : 'notactive'
      }
      updateStatusPlatform(params).then(response => {
        if (row.status === 3) {
          this.$message({
            message: '解冻成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '文章已冻结',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    addDynamic(){
      this.$router.push({
        name: '发布动态',
      })
    },
    add() {
      window.localStorage.setItem('articleeditor', this.$route.path)
      this.$router.push({
        name: '添加或编辑文章'
      })
    },
    edit(row) {
      window.localStorage.setItem('articleeditor', this.$route.path)
      this.$router.push({
        name: '添加或编辑文章',
        params: {
          'articleId': row.id
        }
      })
    },
    articleSourceManager(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({
        name: '文章来源管理'
      })
    },
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({
        name: '文章详情',
        params: {
          'articleId': row.id
        }
      })
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save(this.formObj).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.fetchData()
            this.visible = false
          })
        } else {
          return false
        }
      })
    }
  }
}
