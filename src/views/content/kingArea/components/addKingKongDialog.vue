
<template>
  <div>
    <kdDialog
      ref="kdDialog"
      :dialogTitle="dialogTitle"
      dialogWidth="50%"
      @savePopupData="submit"
      @hide="hide"
    >
      <div slot="content">
        <el-form
          ref="formKingKongDialogRef"
          :rules="rules"
          label-width="120px"
          :model="formKingKongDialog"
          label-position="right"
          class="demo-ruleForm"
        >
          <el-form-item label="金刚区名称：" prop="name">
            <el-input
              v-model="formKingKongDialog.name"
              placeholder="限5个字内"
            ></el-input>
          </el-form-item>
          <el-form-item label="金刚区图片：" prop="image" class="upload-style">
            <el-upload
              class="avatar-uploader"
              action="/"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="uploadHeadImage"
            >
              <img
                v-if="formKingKongDialog.image"
                :src="formKingKongDialog.image"
                class="avatar"
              />
              <i
                v-else
                class="el-icon-plus uploader-pic-icon avatar-uploader-icon"
              ></i>
            </el-upload>
            <div style="color: #999; line-height: 1.3; margin-top: 8px">
              建议尺寸 96*96，支持jpg、png、gif
            </div>
          </el-form-item>
          <el-form-item label="跳转链接：" prop="url">
            <el-input v-model="formKingKongDialog.url"></el-input>
          </el-form-item>
          <el-form-item label="权重：" prop="weight">
            <el-input v-model="formKingKongDialog.weight"></el-input>
          </el-form-item>
          <!-- <el-form-item>
        <el-button type="primary" @click="kingKongAreaListFunc">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item> -->
        </el-form>
      </div>
    </kdDialog>
  </div>
</template>

<script>
import kdDialog from "@/components/common/kdDialog";
import { uploadFile } from "@/api/content/article";
import { saveKingKong } from "@/api/content/kingkong";
export default {
  components: { kdDialog },
  name: "addKingKongDialog",
  data() {
    return {
      //状态
      resolve: null,
      reject: null,
      //表单对象 字段注释参考父组件
      formKingKongDialog: {
        name: null,
        image: null,
        url: null,
        weight: null,
        id: null,
      },
      //表单校验规则
      rules: {
        name: [
          { min: 1, max: 5, message: "只限5个字以内哦", trigger: "blur" },
          { required: true, message: "请输入金刚区名称", trigger: "blur" },
        ],
        url: [{ required: true, message: "请输入跳转地址", trigger: "blur" }],
        weight: [{ required: true, message: "请输入权重", trigger: "blur" }],
      },
      //可支持的图片格式
      imgType: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
      //对话框标题
      dialogTitle: "添加金刚区",
    };
  },
  props: {},
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
         this.dialogTitle = "新增金刚区";
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
        this.$nextTick(()=>{ this.formKingKongDialog = JSON.parse(JSON.stringify(row));})
        this.dialogTitle = "编辑金刚区";
      });
    },
    hide() {
      this.$refs["kdDialog"].hide();
      this.resolve = null;
      this.reject = null;
      this.$refs["formKingKongDialogRef"].resetFields();
      this.$refs["formKingKongDialogRef"].clearValidate();
      this.formKingKongDialog.id=null;
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
    // 上金刚区图片
    uploadHeadImage(content) {
      let formData = new FormData();
      formData.append("file", content.file);
      uploadFile(formData, "demand").then((response) => {
        this.formKingKongDialog.image = response.data;
      });
    },
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
/deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  // overflow: hidden;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 96px;
  height: 96px;
  line-height: 96px;
  text-align: center;
}
.avatar {
  width: 96px;
  height: 96px;
  display: block;
}
</style>

