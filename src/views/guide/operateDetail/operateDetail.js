import {
    getListByRank
} from '@/api/guide/guide' 
export default {
    components: {
    
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
        isweight:false, // 开启权重弹框

        eightNum:null, 
        pageSizes: [10, 20, 50, 100, 500],
        total: 0,
        limit: 10,
        currentpage: 1,

        // 浏览人数数组
        isVisit:false, // 浏览记录
        visitList:[],
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
    },
    methods: {
        // 获取一级菜单 
        ongetListByRank(){
            getListByRank({rank: 1}).then(response => {
                this.menu1List = response.data || []
                console.log('this.menu1List',this.menu1List)
            })
        },
        // 选择一级菜单
        onselectMenu(e){
            console.log('e',e)
        },
        // 查询
        queryData(e){

        },
        handleSelectionChange(value) {
            console.log(value)
        },
        // 点击权重
        onweight(row){
            console.log('row',row)
            this.eightNum = row.weight
            this.isweight = true
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`)
            this.limit = val
            this.currentpage = 1
          },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`)
            this.currentpage = val
        },
        // 冻结
        onFreeze(){
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
              console.log(1111)
            }).catch(action => {})
        },
        // 解冻
        onUnfreeze(){
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
              console.log(1111)
            }).catch(action => {})
        },
        // 删除
        onDelete(){
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
              console.log(1111)
            }).catch(action => {})
        },


        // 点击浏览人数 ----------------------
        onvisit(row){
            this.isVisit = true
        },
        handleSizeChangevisit(val) {
            console.log(`每页 ${val} 条`)
            this.visitlimit = val
            this.visitcurrentpage = 1
          },
          handleCurrentChangevisit(val) {
            console.log(`当前页: ${val}`)
            this.visitcurrentpage = val
        },
    },
  };
  