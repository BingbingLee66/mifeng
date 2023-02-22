<template>
  <el-dialog :visible.sync="visible" title="导入" width="400px" :before-close="close">
    <el-upload
      action="#"
      class="import-upload"
      drag
      :file-list="fileList"
      :before-upload="beforeUploadFile"
      :http-request="uploadFile"
      :on-remove="() => (fileList = [])"
    >
      <div class="import-upload-content">
        <i class="el-icon-plus" />
        <div class="import-upload-text">上传批量导入表</div>
      </div>
    </el-upload>
    <div slot="footer" class="flex-x-between-center">
      <el-button type="text" @click="onDownLoadSignin"> 下载导入表 </el-button>
      <el-button type="primary" @click="onUploadSignin"> 确认导入 </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { uploadSigninData } from '@/api/activity/activity-verify-new'
import { downloadFile } from '@/utils'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    activityId: {
      type: Number || String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [],
      loading: false,
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal && this.fileList.length) this.fileList = []
    }
  },
  methods: {

    async onUploadSignin() {
      if (!this.fileList.length) return this.$message({ message: '请选择上传文件', type: 'warning' })
      const formData = new FormData()
      formData.append('activityId', this.activityId)
      formData.append('file', this.fileList[0])
      const { state, msg } = await uploadSigninData(formData)
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        this.close()
        this.$emit('fetchData')
      }
    },

    beforeUploadFile(file) {
      if (
        !['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(
          file.type
        )
      ) {
        this.$message.error('上传文件只能是 XLSX 或 XLS 格式!')
        return false
      }
    },

    uploadFile(e) {
      this.fileList = [e.file]
    },

    onDownLoadSignin() {
      downloadFile({
        title: '报名信息模板表.xlsx',
        url: `${process.env.VUE_APP_BASE_API}/api/ec/singin/download/dynamicTemplate/${this.activityId}`
      })
    },

    close() {
      this.$emit('update:visible', false)
    }
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
    color: #999;
  }
}
</style>
