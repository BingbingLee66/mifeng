
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
        pageSizes: [8, 18, 24, 32],
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
        this.formObj.menu2Id = ''  
        this.ongetListByTwin(e)
      },
      ongetListByTwin(e){
        getListByRank({rank: 2,menuId:e}).then(response => {
          this.menu2List = response.data || []
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
            console.log('this.list',this.list)
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
  