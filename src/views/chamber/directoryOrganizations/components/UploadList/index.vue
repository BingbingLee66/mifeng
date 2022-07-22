<template>
  <el-dialog :visible.sync="visible" title="导入" width="400px" center>
    <el-upload
      action="#"
      class="import-upload"
      drag
      :file-list="fileList"
      :before-upload="beforeUploadFile"
      :http-request="uploadFile"
      :on-remove="() => (fileList = [])">
      <div class="import-upload-content">
        <i class="el-icon-plus" />
        <div class="import-upload-text">立即导入</div>
      </div>
    </el-upload>
    <span slot="footer">
      <el-button type="primary" @click="onUploadSignin"> 确认导入 </el-button>
    </span>
  </el-dialog>
</template>
<script>
import { uploadOrganizationsData } from '@/api/chamber/directoryOrganizations'
export default {
  data() {
    return {
      visible: false,
      fileList: [],
    }
  },
  methods: {
    init() {
      this.visible = true
      this.fileList = []
    },
    beforeUploadFile(file) {
      if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(file.type)) {
        this.$message.error('上传文件只能是 XLSX 或 XLS 格式!')
        return false
      }
    },
    uploadFile(e) {
      this.fileList = [e.file]
    },
    async onUploadSignin() {
      if (!this.fileList.length) return this.$message({ message: '请选择上传文件', type: 'warning' })
      const formData = new FormData()
      formData.append('file', this.fileList[0])
      uploadOrganizationsData(this.formData).then((res) => {
        console.log(res)
      })
      // const { state, msg } = await uploadOrganizationsData(formData)
      // this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      // if (state === 1) {
      //   this.visible = false
      //   this.emit('refresh')
      // }
    },
  }
}
</script>
<style lang="scss" scoped>
.import-upload-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .el-icon-plus {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .import-upload-text {
    font-size: 20px;
    color: 999;
  }
}

</style>
