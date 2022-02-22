
<template>
  <div>
    <kdDialog @savePopupData="savePopupData" :dialogTitle="title" ref="kdDialog" dialogWidth="60%">
      <div slot="content">
        <div class="form">
          <el-form
            ref="query"
            label-width="auto"
            label-position="left"
            :model="query"
            :inline="true"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="用户ID：">
                  <el-input v-model="query.wxUserId" placeholder="请输入ID" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="用户名：">
                  <el-input v-model="query.uname" placeholder="请输入用户名" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属商会：">
                  <el-select
                    v-model="query.chamberId"
                    placeholder="请选择"
                    filterable
                  >
                    <el-option v-for="chamber in chamberOptions" :key="chamber.id" :label="chamber.name" :value="chamber.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="手机号：">
                  <el-input v-model="query.phone" placeholder="请输入手机号" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-button type="primary" @click="fetchData($event)"
                  >查询
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="tips">
          温馨提示：列表仅展示
          <span class="red-text">已加入商会 且 账号未被全部冻结</span> 的用户
        </div>
        <div>
          <el-table
          border
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="用户ID：" width="120">
              <template slot-scope="scope">{{ scope.row.wxUserId }}</template>
            </el-table-column>
            <el-table-column prop="uname" label="用户名：" >
            </el-table-column>
            <el-table-column prop="phone" label="手机号：" show-overflow-tooltip>
            </el-table-column>
          </el-table>
            <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query.page"
      :page-sizes="[10, 50, 100, 200,300]"
      :page-size="query.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
        </div>
      </div>
    </kdDialog>
  </div>
</template>
<script>
import { availableWxUser } from "@/api/user";
export default {
  name: "officialComponent",
  data() {
    return {
      title: "添加官方账号",
      //表单参数
      query: {
        chamberId: "",
        page:1,
        pageSize:10,
        phone:'',
        uName:'',
        wxUserId:'',
       
      },
       currentPage:1,
      tableData: [],
      //总条数
      total:0,
      //已选择表格行
      selectList:[]
    };
  },
  props: ["chamberOptions"], // 接收父组件的内容

  mounted() {
    
  },
  methods: {
  
    closeDia() {
      console.log("销毁");
      this.videoPlayer.dispose();
    },
    show() {
     this.$refs["kdDialog"].show();
    this.fetchData();
    },
    fetchData() {
      this.availableWxUserFunc();
    },
    availableWxUserFunc() {
      availableWxUser({...this.query}).then((res) => {
        if(res.state===1){
          const resData=res.data
          this.tableData=resData.list;
          this.total=resData.totalRows
        }
      });
    },
    /**行为操作类 */
    //pageSize 改变时会触发
    handleSizeChange(event){
      this.query.pageSize=event
     

    },
     // currentPage 改变时会触发
    handleCurrentChange(event){
       this.query.page=event

    },
    //表格选择触发
    handleSelectionChange(event){
      this.selectList=event
      
    },
    savePopupData(){
console.log('selectList',this.selectList);
if(this.selectList<1){
  this.$message({
            type: 'info',
            message: '您还没有选择'
          });
  return;
}
 this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
};
</script>
<style lang="scss" rel="stylesheet/scss">
.tips {
  color: #7f7f7f;
  font-family: "ArialMT", "Arial", sans-serif;
  font-weight: 400;
  .red-text {
    color: #ff0000;
  }
  margin-bottom: 20px;
}
</style>