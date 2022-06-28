
import {
    getguideList,
    getListByRank,
} from '@/api/guide/guide' 
export default {
    components:{

    },
    data() {
      return {
        query:{
          title:'', // 标题      
          menu1Id:'', // 一级菜单
          menu2Id:'', // 二级菜单
        },
        menu1List:[],
        menu2List:[],
        list:[],
        pageSizes: [8, 16, 24, 32],
        total: 0,
        limit: 8,
        currentpage: 1,
        listLoading:false,
      };
    },
    computed: {

    },
    created() {},
    mounted() {
      this.ongetListByRank()
      if(this.$route.query.menu1Id) {
        this.query.menu1Id = this.$route.query.menu1Id
        this.query.menu2Id = this.$route.query.menu2Id
        setTimeout(()=> {
          this.ongetListByTwin(this.query.menu1Id)
        }, 50);
        //  清除页面缓存路由参数
        delete this.$route.query.menu1Id;
        delete this.$route.query.menu2Id;
      }
      this.fetchData()
    },
    methods: {
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
        this.ongetListByTwin(e)
      },
      ongetListByTwin(e){
        getListByRank({rank: 2,menuId:e}).then(response => {
          this.menu2List = response.data
        })
     
      },
      // 获取数据
      fetchData(){
        let query  = this.query;
        this.listLoading = true;
        let params = {
            title: query.title,
            menu1Id: query.menu1Id,
            menu2Id: query.menu2Id,
            pageSize: this.limit,
            pageNum: this.currentpage,
        }
        getguideList(params).then(res => {
            this.list = res.data.list || []
            this.total = res.data.totalRows
            this.listLoading = false;
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
          menu1Id:'', // 一级菜单
          menu2Id:'', // 二级菜单
        }
        this.menu2List = []
      },
      // 点击视频
      ondetail(id){
        this.$router.push({
          name: '操作指引详情',
          params: {
            'detailsId':id 
          }
        })
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
    },
  };
  