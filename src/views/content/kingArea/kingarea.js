import {
  kingKongAreaList,
  deleteKingKongList,
  saveKingKong,
  saveKingKongWeight
} from '@/api/home/kingkong'
import kdDialog from '@/components/common/kdDialog'
import addKingKongDialog from './components/addKingKongDialog'
import {validateWeight} from './utils/utilRules'
export default {
  components: {
    kdDialog,
    addKingKongDialog
  },
  data() {
    return {
      //表单对象
      formKingKong: {
        //金刚区名称
        name: null,
        //创建人
        creatorName: null,
        //创建时间
        createdTime: []
        // createdTsBegin:null,
        // createdTsEnd:null
      },
      //权重对话框表单对象
      formWeight: {
        weight: null
      },
      //当前编辑的权重id
      currentId: null,
      weightRules: {
        weight: [{
          required: true,
          message: "请输入权重",
          trigger: "blur"
        },
        { 
          validator: validateWeight, trigger: 'blur'
        }]
      },
      //金刚区列表数组
      tableData: [],

      /**分页相关 */
      //当前页
      currentPage: 1,
      //当前size
      pageSize: 10,
      //可选size数组
      pageSizes: [10, 50, 100, 200],
      //总数
      total: 0
    }
    
  },

  mounted() {},
  computed: {
    srcList(){
      return function(url) {
        return[url]
    }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     * 状态类
     */
    hide() {
      this.$refs["weightKdDialog"].hide();
      this.$refs['formWeightKdDialog'].clearValidate();
    },
    /** 
      请求类函数
    */
    fetchData() {
      this.kingKongAreaListFunc()

    },
    //拉取金刚区列表
    kingKongAreaListFunc() {
     let params=this.formatRequestData()
      kingKongAreaList(params).then(res => {
        if (res.state === 1) {
          this.tableData = res.data.list;
          this.total = res.data.totalRows
        }
      })
    },
    //删除金刚区
    deleteKingKongListFunc(ids) {
      deleteKingKongList(ids).then(res => {
        if (res.state === 1) {
          this.$message({
            message: "已成功移除",
            type: "success",
          });
          this.kingKongAreaListFunc()
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      })
    },
    //保存权重
    saveKingKongWeightFunc(params) {
      saveKingKongWeight(params).then(res => {
        if (res.state === 1) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          this.hide();
          this.kingKongAreaListFunc()
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      })
    },
    /** 
     * 行为操作
     */
    //点击表单查询
    queryData(){
      this.currentPage=1;
      this.pageSize=10;
      this.kingKongAreaListFunc()
    },
    //点击添加金刚区
    showAddDialog() {
      this.$refs['addDialog'].open()
        .then(() => {
          this.fetchData()
        })
    },
    //点击删除金刚区
    deleteKingKong(row) {
      if (!row.id) {
        return
      };
      let ids = [row.id];
      this.$confirm('确认移除该金刚区吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteKingKongListFunc(ids)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消移除'
        });
      });
    },
    //点击编辑金刚区按钮
    update(row) {
      this.$refs['addDialog'].edit(row)
        .then(() => {
          this.fetchData()
        })
    },
    //点击权重编辑
    updateWeight(row) {
      this.currentId = row.id;
      this.formWeight.weight = row.weight;
      this.$refs['weightKdDialog'].show()
    },
    //点击保存权重
    submitWeight() {
      this.$refs['formWeightKdDialog'].validate((valid) => {
        if (valid) {
          let params = {
            id: this.currentId,
            value: this.formWeight.weight
          }
          this.saveKingKongWeightFunc(params)
        } else {
          return false;
        }
      });
    },
    //点击重置表单
    reset() {
      this.$refs['formKingKong'].resetFields();
      this.formKingKong.createdTime=[];
      this.kingKongAreaListFunc()
    },
    //分页大小改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.kingKongAreaListFunc()
    },
    //当前页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.kingKongAreaListFunc()
    },
    /** 
     * 工具类
     */
    //format请求参数
    formatRequestData(){
      let params = JSON.parse(JSON.stringify(this.formKingKong)) ;
      if (this.formKingKong.createdTime ) {
        //解决日期选择器，只能选到某天凌晨    
          //eg:如果选5号到6号，组件库给的是5号凌晨到6号凌晨，所以结束时间手动加上23.59.59
          params.createdTsEnd = this.formKingKong.createdTime[1]+24*60*60*1000-1;
        params.createdTsBegin = this.formKingKong.createdTime[0];
      }
      params.pageNum = this.currentPage;
      params.pageSize = this.pageSize;
      return params;
    }


  }
}
