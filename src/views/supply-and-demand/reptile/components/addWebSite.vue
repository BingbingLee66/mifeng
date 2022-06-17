
<template>
  <div>
    <kdDialog
      ref="addWebSite"
      :dialogTitle="dialogTitle"
      dialogWidth="50%"
      @savePopupData="submit"
      @hide="hide"
    >
      <div slot="content">
        <el-form
          ref="addWebSiteDialogRef"
          :rules="rules"
          label-width="120px"
          :model="website"
          label-position="right"
          class="demo-ruleForm"
        >
          <el-form-item label="采集网站名称：" prop="name">
            <el-input
              v-model="website.name"
              placeholder="限40个字内"
            ></el-input>
          </el-form-item>
          <el-form-item label="采集频道：" prop="chanel">
            <el-input
              v-model="website.chanel"
              placeholder="限40个字内"
            ></el-input>
          </el-form-item>
          <el-form-item label="采集网址：" prop="url">
            <el-input
              v-model="website.url"
              placeholder="请输入网址"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </kdDialog>
  </div>
</template>

<script>
import kdDialog from '@/components/common/kdDialog'
import { saveOrUpdate } from '@/api/content/crawler'
export default {
  name: 'AddWebSite',
  components: { kdDialog },
  data() {
    return {
      // 状态
      resolve: null,
      reject: null,
      // 表单对象 字段注释参考父组件
      website: {
        id: '',
        name: null,
        chanel: null,
        url: null,
        type: 2
      },
      // 表单校验规则
      rules: {
        name: [
          { min: 1, max: 40, message: '只限40个字以内哦', trigger: 'blur' },
          { required: true, message: '请输入采集网站名称', trigger: 'blur' },
        ],
        url: [{ required: true, message: '请输入采集网站地址', trigger: 'blur' }],
        chanel: [{ required: true, message: '请输入采集网站频道', trigger: 'blur' }],
      },
      dialogTitle: '编辑网站'
    }
  },
  props: {},
  methods: {
    open() {
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
        this.show()
        this.dialogTitle = '新增网站'
      })
    },
    // 显示对话框子组件
    show() {
      this.$refs['addWebSite'].show()
    },
    edit(row) {
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
        this.show()
        this.$nextTick(() => { this.website = JSON.parse(JSON.stringify(row)) })
        this.dialogTitle = '编辑网站'
      })
    },
    hide() {
      this.$refs['addWebSite'].hide()
      this.resolve = null
      this.reject = null
      this.$refs['addWebSiteDialogRef'].resetFields()
      this.$refs['addWebSiteDialogRef'].clearValidate()
      this.website.id = null
    },
    handleClose() {},
    // 点击表单确定按钮
    submit() {
      this.$refs['addWebSiteDialogRef'].validate((valid) => {
        if (valid) {
          this.save()
        } else {
          return false
        }
      })
    },
    save() {
      let params = this.website
      saveOrUpdate(params).then((res) => {
        if (res.state === 1) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.resolve()
          this.hide()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
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

