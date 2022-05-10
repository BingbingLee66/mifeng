
<template>
  <div>
    <kdDialog
      ref="kdDialog"
      :dialogTitle="dialogTitle"
      dialogWidth="60%"
      @savePopupData="submit"
      @hide="hide"
    >
      <div slot="content">
        <!-- 搜索表单start -->
        <el-form
          ref="formHotSupplyDemand"
          label-position="right"
          :inline="true"
          :model="query"
        >
          <el-form-item label="来源商会" prop="ckey">
            <el-select
              v-model="query.ckey"
              placeholder="请选择"
              clearable
              filterable
            >
                      <el-option
            v-for="chamber in chamberOptions"
            :key="chamber.value"
            :label="chamber.label"
            :value="chamber.value"
          />
            </el-select>
          </el-form-item>
          <el-form-item label="供需ID" prop="id">
            <el-input v-model="query.id" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="供需标题" prop="title">
            <el-input clearable v-model="query.title" placeholder="关键词" />
          </el-form-item>
          <el-form-item label="供需状态" prop="status">
            <el-select v-model="query.status" placeholder="请选择状态">
              <el-option
                v-for="chamber in statusList"
                :key="chamber.value"
                :label="chamber.label"
                :value="chamber.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="冻结状态" prop="publishStatus">
            <el-select v-model="query.publishStatus" placeholder="请选择状态">
              <el-option
                v-for="chamber in publishStatusList"
                :key="chamber.value"
                :label="chamber.label"
                :value="chamber.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="可见性" prop="platform">
            <el-select v-model="query.platform" placeholder="请选择">
              <el-option
                v-for="chamber in platformList"
                :key="chamber.value"
                :label="chamber.label"
                :value="chamber.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-button type="primary" @click="fetchData($event)"
              >查询
            </el-button>
          </el-form-item>
        </el-form>
        <!-- 搜索表单end -->
         <!-- 供需列表start -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
       border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="供需ID/名称" width="220">
        <template slot-scope="scope">
          <div>{{ scope.row.id }}</div>
          <div>{{ scope.row.title }}</div>
        </template>
      </el-table-column>
      <el-table-column label="发布信息" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.publishName }}</div>
          <div>{{ scope.row.publishTime | dateFormat}}</div>
        </template>
      </el-table-column>
      <el-table-column label="可见性" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.platform === 1">全平台可见</div>
          <div v-else>部分商会可见</div>
        </template>
      </el-table-column>
      <el-table-column label="供需状态" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 1">生效中</div>
          <div v-else-if="scope.row.status === 2">已关闭(过期关闭)</div>
          <div v-else-if="scope.row.status === 3">已关闭(成功合作)</div>
          <div v-else-if="scope.row.status === 4">已关闭(终止对接)</div>
        </template>
      </el-table-column>
      <el-table-column label="冻结状态" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.publishStatus === 1">正常</div>
          <div v-else-if="scope.row.publishStatus === 2">平台冻结</div>
          <div v-else-if="scope.row.status === 3">商会冻结</div>
        </template>
      </el-table-column>

    </el-table>
    <!-- 供需列表end -->
      </div>
    </kdDialog>
  </div>
</template>

<script>
import kdDialog from "@/components/common/kdDialog";
import {addHotSupplyDemand} from '@/api/home/hotSupplyDemand'
export default {
  components: { kdDialog },
  name: "addSupplyDemandDialog",
  //供需状态字段 冻结状态 商会数组
  props: ["statusList", "publishStatusList","chamberOptions"],
  data() {
    return {
      //状态
      resolve: null,
      reject: null,
      //表单对象 字段注释参考父组件
      query: {
        title: null,
        ckey: null,
        status: "0",
        //冻结状态  0-全部 1-正常 2-平台冻结 3-商会冻结,
        publishStatus: "0",
        id: null,
        //平台性
        platform:"0"
      },
      //对话框标题
      dialogTitle: "添加供需",
      platformList: [
        {
          label: "全平台可见",
          value: "1",
        },
        {
          label: "部分商会可见",
          value: "0",
        },
      ],
      //当前选中需要添加的ids
      addIds:[],
      //表格数据源
      tableData:[]
    };
  },
  methods: {
    /**
     * 状态
     */
    //打开当前添加金刚区对话框
    open() {
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
        this.show();
      });
    },
    //显示对话框子组件
    show() {
      this.$refs["kdDialog"].show();
    },
    edit(row) {
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
        this.show();
        //为了解决form的mounted还没结束，导致关闭弹框置空时，表单的初始值为父组件传入对象
        this.$nextTick(() => {
          this.formKingKongDialog = JSON.parse(JSON.stringify(row));
        });
        this.dialogTitle = "编辑金刚区";
      });
    },
    hide() {
      this.$refs["kdDialog"].hide();
      this.resolve = null;
      this.reject = null;
      this.$refs["formHotSupplyDemand"].resetFields();

    },
    handleClose() {},

    /**
     * 行为类
     */
    //点击表单确定按钮
    submit() {
    },
    /**
     * 监听类
     */
    //表单选框变化
    handleSelectionChange(val){
      const map1 = val.map(item => item.id);
      this.addIds=map1
    },
    /**
     * 请求类
     */
    //批量添加供需到热门
    addHotSupplyDemandFunc() {
      let params = this.addIds;
      addHotSupplyDemand(params).then((res) => {
        if (res.state === 1) {
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.resolve();
          this.hide();
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
      //查询可添加的热门供需
    addHotSupplyDemandFunc() {
      let params = this.formKingKongDialog;
      addHotSupplyDemand(params).then((res) => {
        if (res.state === 1) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          this.resolve();
          this.hide();
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

