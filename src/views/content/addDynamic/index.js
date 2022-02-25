import {
  getGlobalContentList,
  save,
  updateStatusPlatform,
  dynamicPagedList
} from '@/api/content/article'
import {
  getPromulgator
} from "@/api/user";
import router from '../../../router';
import officialComponent from '../../wxuser/officialManager/components/index'
import editorElem from '@/components/wangEditor/index'
export default {
  components: {
    officialComponent,
    editorElem
  },
  data() {
    return {
      //动态类型 1 图文 2 视频
      type: 1,
      //新增 or 编辑
      mode: 'add',
      //已选发布者
      tableData: []
    }

  },
  mounted() {},
  computed: {},
  created() {

  },
  methods: {
    /**行为操作类 */
    async showOfficialComponent() {
      let re = await this.getPromulgatorFunc();
      if (re < 1) {
        this.$confirm(
          `无符合条件的用户`,
          "添加发布者", {
            confirmButtonText: "去添加",
            // cancelButtonText: "取消",
            showCancelButton: false,
            center:true
          }
        ).then(() => {
          router.push({name:'官方号管理'})
          console.log("then");

        });
        return;
      }
      this.$refs['OfficialComponent'].show().then(res => {
        this.tableData = res
        console.log('res', res)
      })
    },
    //移除发布者
    deleteUser(){
      console.log('delete')
      this.$confirm(
        `确认移除所选发布者吗？`,
        "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }
      ).then(() => {
        this.tableData=[]
      });
    },
    /**
     * 请求类
     */
    getPromulgatorFunc() {
      return new Promise((resolve, reject) => {
        getPromulgator({
          chamberId: "",
          page: 1,
          pageSize: 10,
          phone: "",
          uName: "",
          wxUserId: "",
        }).then(res => {
          if (res.state === 1) {
            resolve(res.data.totalRows)
          }
          resolve(0)
        })
      })

    },
    /**监听类
     * 
     */
    //富文本变化
     addParentHtml(event){
       console.log('event',event)
     }
  }
}
