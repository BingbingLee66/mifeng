import {
    getListByRank,
    getlistLog,
    getguideList,
    getguideDetail,
    getguideUpdate,
    getexportLog
} from '@/api/guide/guide' 
import videoComponent from '@/components/video/index'
export default {
    components:{
      videoComponent
    },
    data() {
      return {
        query:{
            title:'', // 标题
            id:'',
            menu1Id:'', // 一级菜单
            menu2Id:'', // 二级菜单
            creator:'', //创建人
            date: [], // 发布时间
        },
        menu1List:[],
        menu2List:[],
        ogidList:[],  // 选中表格 
        list:[
            {
                id:1,
                title:'滴滴滴滴',
                menu1Name:'组织架构',
                menu2Name:'部门管理',
                sort:'999', 
                visitorNum:'25',
                visitCount:'344',
                publishTs:'',
                status:1,
            }
        ], //表格数据
        listLoading: false,
        issort:false, // 开启权重弹框
        isweightid:'', // 选中表格id
        sortNum:null, 
        pageSizes: [10, 20, 50, 100, 500],
        total: 0,
        limit: 10,
        currentpage: 1,
        visible:false, // 详情
        detailObj:{}, // 详情数据
        // 浏览人数数组
        isVisit:false, // 浏览记录
        visitList:[],
        visitorID:'', // 浏览人数id
        visitLoading:false,
        visittotal: 0,
        visitlimit: 10,
        visitcurrentpage: 1,
      };
    },
    computed: {

    },
    created() {

    },
    mounted() {
        this.ongetListByRank()
        this.fetchData()
    },
    methods: {
        // 添加操作指引
        add() {
          window.localStorage.setItem('articleeditor', this.$route.path)
          this.$router.push({
            name: '添加和编辑操作指引'
          })
        },
        // 编辑操作指引
        edit(row) {
          window.localStorage.setItem('articleeditor', this.$route.path)
          this.$router.push({
            name: '添加和编辑操作指引',
            params: {
              'detailsId': row.id
            }
          })
        },
  
        // 获取表格数据
        fetchData(){
            let query  = this.query;
            this.listLoading = true;
            let params = {
                title: query.title,
                id: query.id,
                menu1Id: query.menu1Id,
                menu2Id: query.menu2Id,
                creator: query.creator,
                publishTsEnd: '',
                publishTsStart:'',
                pageSize: this.limit,
                pageNum: this.currentpage,
            }
            if (this.query.date) {
              params.publishTsEnd = query.date[0]
              params.publishTsStart = query.date[1]
            }
            getguideList(params).then(res => {
                this.list = res.data.list || []
                this.sortNum = ''
                this.isweightid = ''
                this.total = res.data.totalRows
                this.listLoading = false;
            })
        },
        // 获取一级菜单 
        ongetListByRank(){
            getListByRank({rank: 1}).then(response => {
                this.menu1List = response.data || []
                this.menu2List = []
            })
        },
        // 选择二级级菜单
        onselectMenu(e){
          this.query.menu2Id = ''
            getListByRank({rank: 2,menuId:e}).then(response => {
                this.menu2List = response.data || []
            })
        },
        // 查询
        queryData(){
            this.currentpage = 1
            this.fetchData()
        },
        // 重置
        reset(){
          this.query = {
            title:'', // 标题
            id:'',
            menu1Id:'', // 一级菜单
            menu2Id:'', // 二级菜单
            creator:'', //创建人
            date: [], // 发布时间
          }
        },
        handleSelectionChange(value) {
            this.ogidList = value
        },
        // 点击权重
        onweight(row){
            this.sortNum = row.sort
            this.isweightid = row.id
            this.issort = true
        },
        onCancel(){
          this.issort = false
          this.sortNum = ''
          this.isweightid = ''
        },
        handleSizeChange(val) {
            this.limit = val
            this.currentpage = 1
            this.fetchData()
          },
        handleCurrentChange(val) {
            this.currentpage = val
            this.fetchData()
        },
        // 冻结
        onFreeze(row,status){
            const confirmText = ['确定冻结该数据吗？',  '冻结后，商会后台不再展示该数据'] 
            const newDatas = []
            const h = this.$createElement
            for (const i in confirmText) {
              newDatas.push(h('p', null, confirmText[i]))
            }
            this.$confirm(
              '提示',
              {
                title: '提示',
                message: h('div', null, newDatas),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }
            ).then(() => {
              this.ongetguideUpdate(row.id,status)
            }).catch(action => {})
        },
        // 解冻
        onUnfreeze(row,status){
            const confirmText = ['确定解冻该数据吗？',  '解冻后，商会后台恢复展示该数据'] 
            const newDatas = []
            const h = this.$createElement
            for (const i in confirmText) {
              newDatas.push(h('p', null, confirmText[i]))
            }
            this.$confirm(
              '提示',
              {
                title: '提示',
                message: h('div', null, newDatas),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }
            ).then(() => {
              this.ongetguideUpdate(row.id,status)
            }).catch(action => {})
        },
        // 删除
        onDelete(row,status){
            const confirmText = ['确定删除该数据吗？',  '删除后，该数据将无法恢复，请慎重操作'] 
            const newDatas = []
            const h = this.$createElement
            for (const i in confirmText) {
              newDatas.push(h('p', null, confirmText[i]))
            }
            this.$confirm(
              '提示',
              {
                title: '提示',
                message: h('div', null, newDatas),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }
            ).then(() => {
              this.ongetguideUpdate(row.id,status)
            }).catch(action => {})
        },
        // 修改表格类型
        ongetguideUpdate(id,status){
          // 状态,0冻结,1发布,2删除,3平台冻结,4定时发布
          let  params = {}
          if(id || status) {
            params.id = id,
            params.status = status
          }
          //  设置权重可以不传status
          if(this.sortNum && this.isweightid) {
            params.id = this.isweightid
            params.sort = this.sortNum
            this.issort = false
          }
          getguideUpdate(params).then(res=>{
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.fetchData()
          })
        },
        // 详情
        detail(row){
          let params = {
            id: row.id
          }
          getguideDetail(params).then(res =>{
            this.detailObj = res.data
            this.visible = true
            if (this.detailObj.vid) {
              this.$nextTick(() => {
               this.$refs['videoRef'].show(this.detailObj.vid)
             })
           }
          })
        },


        // 点击浏览人数 ----------------------
        onvisit(row){
            console.log('浏览人数',row)
            this.visitorID = row.id
            this.visitList = []
            this.ongetlistLog()
            this.isVisit = true
        },
        ongetlistLog(){
          this.visitLoading = true
          let params = {
            ogid: this.visitorID,
            pageSize: this.visitlimit,
            pageNum: this.visitcurrentpage,
          }
          getlistLog(params).then(response => {
            this.visitList = response.data.list || []
            this.visittotal = response.data.totalRows
            this.visitLoading = false
          
          })
        },
        handleSizeChangevisit(val) {
            console.log(`每页 ${val} 条`)
            this.visitlimit = val
            this.visitcurrentpage = 1
            this.ongetlistLog()
          },
          handleCurrentChangevisit(val) {
            console.log(`当前页: ${val}`)
            this.visitcurrentpage = val
            this.ongetlistLog()
        },
        // 导出表格
        exportExcel(){
          if(this.ogidList.length <= 0) return this.$message.error('请选择数据')
          let ogid = []
          this.ogidList.forEach((v)=>{
            ogid.push(v.id)
          })
          getexportLog(ogid).then(res=>{
            window.location.href = res.data
            this.$refs.multipleTable.clearSelection();
            this.ogidList = []
          })

        }
    },
  };
  