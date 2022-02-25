import {
  getGlobalContentList,
  save,
  updateStatusPlatform,
  dynamicPagedList
} from '@/api/content/article'
import officialComponent from '../../wxuser/officialManager/components/index'
export default {
  components: {officialComponent},
  data() {
    return {
      //动态类型 1 图文 2 视频
     type:1,
     //新增 or 编辑
     mode:'add',
     //已选发布者
     tableData:[]
    }

  },
  mounted() {},
  computed: {},
  created() {
  
  },
  methods: {
    showOfficialComponent(){
      this.$refs['OfficialComponent'].show().then(res=>{
        console.log('res',res)
      })
    }
    
  }
}
