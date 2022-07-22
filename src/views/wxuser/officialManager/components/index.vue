
<template>
  <div>
    <kdDialog
      @savePopupData="savePopupData"
      :dialogTitle="title"
      ref="kdDialog"
      dialogWidth="75%"
    >
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
                  <el-input v-model="query.uName" placeholder="请输入用户名" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属商会：">
                  <el-select
                    v-model="query.chamberId"
                    placeholder="请选择"
                    filterable
                  >
                    <el-option
                      v-for="chamber in chamberOptions"
                      :key="chamber.id"
                      :label="chamber.name"
                      :value="chamber.id"
                    />
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
                <el-button type="primary" @click="queryData($event)"
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
        <div class="table-view">
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
            <el-table-column prop="uname" label="用户名："> </el-table-column>
            <el-table-column
              prop="phone"
              label="手机号："
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="chamberName"
              label="所属商会"
            >
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="query.page"
              :page-sizes="[10, 50, 100, 200, 300]"
              :page-size="query.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </kdDialog>
  </div>
</template>
<script>
import {
  getChamberAllList
} from '@/api/goods/goods'
import { availableWxUser, addOfficial, getPromulgator } from "@/api/user";
export default {
  name: "officialComponent",
  data() {
    return {
      // title: "添加官方账号",
      //表单参数
      query: {
        chamberId: "",
        page: 1,
        pageSize: 10,
        phone: "",
        uName: "",
        wxUserId: "",
      },
      currentPage: 1,
      tableData: [],
      //总条数
      total: 0,
      //已选择表格行
      selectList: [],
      //状态
      resolve: null,
      reject: null,
      chamberOptions:[]
    };
  },
  props: {
    // chamberOptions: {
    //   type: Array,
    //   default: function () {
    //     return [];
    //   },
    // },
    title: {
      type: String,
      default: "添加官方账号",
    },
    //1.官方号管理处引入 2发布动态选择发布者引入
    type: {
      type: Number,
      value: 1,
    },
  }, // 接收父组件的内容

  mounted() {},
  methods: {
    close() {
      this.$refs["kdDialog"].hide();
    },
    show() {
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
        this.$refs["kdDialog"].show();
        this.fetchData();
        this.getAllChamberList()
      });
    },
    queryData(){
      this.currentPage=1;
      this.query.page=1
      this.fetchData()

    },
    fetchData() {
      this.availableWxUserFunc();
    },
    /**请求类 */
    availableWxUserFunc() {
      console.log("type", this.type);
      //拉取用户列表
      if (this.type === 1) {
        availableWxUser({ ...this.query }).then((res) => {
          if (res.state === 1) {
            const resData = res.data;
            this.tableData = resData.list;
            this.total = resData.totalRows;
          }
        });
      } else {
        //拉取发布者列表
        getPromulgator({ ...this.query }).then((res) => {
          if (res.state === 1) {
            const resData = res.data;
            this.tableData = resData.list;
            this.total = resData.totalRows;
          }
        });
      }
    },
    addOfficialFunc() {
      let arr = [];
      this.selectList.forEach((item) => {
        arr.push(item.wxUserId);
      });
      addOfficial(arr).then((res) => {
        if (res.state === 1) {
          this.$message({
            type: "success",
            message: "添加成功!",
          });
          this.resolve();
          this.close();
        }else{
            this.$message({
            type: "error",
            message: res.msg,
          });
          }
      });
    },
    getAllChamberList() {
      getChamberAllList().then(res => {
        if (res.state === 1) {
          this.chamberOptions = res.data.data
          this.chamberOptions.unshift({
            'name': '全部',
            'id': -1
          }
          )
        } 
      })
    },
    /**行为操作类 */
    //pageSize 改变时会触发
    handleSizeChange(event) {
      this.query.pageSize = event;
      this.availableWxUserFunc();
    },
    // currentPage 改变时会触发
    handleCurrentChange(event) {
      this.query.page = event;
      this.availableWxUserFunc();
    },
    //表格选择触发
    handleSelectionChange(event) {
      this.selectList = event;
    },
    savePopupData() {
      const self = this;
      console.log("selectList", this.selectList);
      if (this.selectList.length < 1) {
        this.$message({
          type: "info",
          message: "您还没有选择",
        });
        return;
      }

      if (this.type === 1) {
        this.$confirm(
          `确认添加这${this.selectList.length}个官方号吗？?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          console.log("then");
          self.addOfficialFunc();
        });
        //type为2时，需要把数组传递给父组件
      } else if (this.type === 2) {
        // return;
        if (this.selectList.length > 1) {
        this.$message({
          type: "error",
          message: "只能选择一位发布者",
        });
        return;
      }
        this.resolve(this.selectList);
        this.close();
      }
    },
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
.table-view {
  max-height: 500px;
  overflow-y: scroll;
}
</style>