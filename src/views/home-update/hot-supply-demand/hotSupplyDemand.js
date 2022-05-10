import {
  hotSupplyDemandList,
  deleteHotSupplyDemand,
  weightSupplyDemand,
  addHotSupplyDemand,
} from '@/api/home/hotSupplyDemand'
import {
  statusList,
  publishStatusList,
  publishTimeList
} from './utils/utilsData'
import addSupplyDemandDialog from './components/addSupplyDemandDialog'
import {getChamberOptions} from '@/api/mall/channel'
export default {
  data() {
    return {
      //查询表单对象
      query: {
        title: null,
        ckey: null,
        //0-全部 1-生效中 2-已关闭(过期关闭) 3-已关闭(成功合作) 4-已关闭(终止对接)
        status: '0',
        //冻结状态  0-全部 1-正常 2-平台冻结 3-商会冻结,
        publishStatus: '0',
        id: null,
        //发布时间 1-24小时,2-3天,3-7天,4-本月,0-所有
        publishTime: '0'
      },
      //表格数据
      tableData: [],
      statusList,
      publishStatusList,
      publishTimeList,
      //商会数据
      chamberOptions: [],

      /**分页相关 */
      //当前页
      currentPage: 1,
      //当前size
      pageSize: 10,
      //可选size数组
      pageSizes: [10, 50, 100, 200],
      //总数
      total: 0,

      //当前选中删除的ids
      deleteIds: []
    }
  },
  components:{addSupplyDemandDialog},
  created() {

    this.fetchData()
  },
  methods: {
    fetchData() {
      this.hotSupplyDemandListFunc();
      this.getChamberOptionsFunc()
    },
    /**
     * 请求类
     */
    //拉取商会
    getChamberOptionsFunc() {
      getChamberOptions().then(res => {
        this.chamberOptions = res.data.data

      })
    },
    //拉取热门供需
    hotSupplyDemandListFunc() {
      let params = {
        ...this.query
      };
      params.pageNum = this.currentPage;
      params.pageSize = this.pageSize;
      hotSupplyDemandList(params).then(res => {
        if (res.state === 1) {
          this.tableData = res.data.list;
          this.total = res.data.totalRows
        }
      })
    },
    //批量删除供需
    deleteHotSupplyDemandFunc(ids) {
      deleteHotSupplyDemand(ids).then(res => {
        if (res.state === 1) {
          this.$message({
            message: "已成功移除",
            type: "success",
          });
          this.hotSupplyDemandListFunc()
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      })
    },
    /**行为操作类 */
    //表格复选框改变
    handleSelectionChange(val) {
      const map1 = val.map(item => item.id);
      this.deleteIds = map1
    },
    //分页大小改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.hotSupplyDemandListFunc()
    },
    //当前页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.hotSupplyDemandListFunc()
    },
    //点击移除按钮，type===1:批量操作 type===2单行删除
    deleteIdsFunc(value, type = 1) {
      if (type === 1 && this.deleteIds.length === 0) {
        this.$message('您还没有选择要移除的供需项');
        return;
      }
      this.$confirm('移除后，该供需将不再展示在热门供需板块，不影响在其他页面展示', '确认将供需从热门供需中移除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 1) {
          this.deleteHotSupplyDemandFunc(this.deleteIds);
        } else {
          this.deleteHotSupplyDemandFunc([value]);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消移除'
        });
      })



    },
    //点击添加供需按钮
    addSupplyDemand(){
      this.$refs['addSupplyDemandDialogRef'].open()
    },
    //点击表单查询
    queryFunc(){
      this.currentPage = 1;
      this.pageSize = 10;
      this.hotSupplyDemandListFunc()
    },

    /**工具类 */
  }
}
