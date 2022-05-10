
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
          ref="formSupplyDemand"
          label-position="right"
          :inline="true"
          :model="query"
        >
          <el-form-item label="供需标题">
            <el-input clearable v-model="query.title" placeholder="关键词" />
          </el-form-item>
          <el-form-item label="来源商会">
            <el-select
              v-model="query.ckey"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="chamber in chamberOptions"
                :key="chamber.ckey"
                :label="chamber.name"
                :value="chamber.ckey"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="供需状态">
            <el-select v-model="query.status" placeholder="请选择状态">
              <el-option
                v-for="chamber in statusList"
                :key="chamber.value"
                :label="chamber.label"
                :value="chamber.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="冻结状态">
            <el-select v-model="query.publishStatus" placeholder="请选择状态">
              <el-option
                v-for="chamber in publishStatusList"
                :key="chamber.value"
                :label="chamber.label"
                :value="chamber.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="供需ID">
            <el-input v-model="query.id" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="fetchData($event)"
              >查询
            </el-button>
          </el-form-item>
        </el-form>
        <!-- 搜索表单end -->
      </div>
    </kdDialog>
  </div>
</template>

<script>
import kdDialog from "@/components/common/kdDialog";
import { uploadFile } from "@/api/content/article";
import { saveKingKong } from "@/api/home/kingkong";
export default {
  components: { kdDialog },
  name: "addSupplyDemandDialog",
  props:["statusList","publishStatusList"],
  data() {
    return {
      //状态
      resolve: null,
      reject: null,
      //表单对象 字段注释参考父组件
      query: {
       title: null,
        ckey: null,
        //0-全部 1-生效中 2-已关闭(过期关闭) 3-已关闭(成功合作) 4-已关闭(终止对接)
        status: '0',
        //冻结状态  0-全部 1-正常 2-平台冻结 3-商会冻结,
        publishStatus: '0',
        id: null,
      },
      //对话框标题
      dialogTitle: "添加供需",
      chamberOptions:[]
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
      this.$refs["formKingKongDialogRef"].resetFields();
      this.$refs["formKingKongDialogRef"].clearValidate();
      this.formKingKongDialog.id = null;
    },
    handleClose() {},

    /**
     * 行为类
     */
    // 上传图片校验
    beforeUpload(file) {
      if (!this.imgType.includes(file.type)) {
        this.$message.error("上传图片只能是 JPG 或 PNG 或gif格式!");
        return false;
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
    },
    //点击表单确定按钮
    submit() {
      this.$refs["formKingKongDialogRef"].validate((valid) => {
        if (valid) {
          this.saveKingKongFunc();
        } else {
          return false;
        }
      });
    },

    /**
     * 请求类
     */
    //保存或新增金刚区
    saveKingKongFunc() {
      let params = this.formKingKongDialog;
      saveKingKong(params).then((res) => {
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

