<template>
  <div>
    <el-dialog :visible.sync="visible" title="批量报名" width="400px" :before-close="close">
      <div>1. 请先下载《<el-button type="text" @click="onDownLoadApply">批量报名表模版</el-button>》</div>
      <div class="mb-20">2. 填写好报名信息后上传</div>
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
          <div class="import-upload-text">支持格式：xls、xlsx</div>
          <div class="import-upload-text">大小限制：10M</div>
        </div>
      </el-upload>

      <div slot="footer" class="flex-x-center-center">
        <el-button type="default" class="mr-20" @click="close">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onImportApply">{{ loading ? '导入中' : '确定' }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="resultVisible" title="上传结果" width="400px" :before-close="resultClose">
      <div>共{{ successNum + failNum }}条报名信息，成功报名{{ successNum }}条，失败{{ failNum }}条；</div>
      <el-button type="text" @click="onDownloadFail">下载失败名单</el-button>

      <div slot="footer" class="flex-x-center-center">
        <el-button type="primary" @click="resultClose">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getApplyExcel, importApplyExcel } from '@/api/activity/activity-verify-new'
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
      successNum: 0,
      failNum: 0,
      failCauseFile: '',
      loading: false,
      resultVisible: false,
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal && this.fileList.length) this.fileList = []
    }
  },
  methods: {
    async onDownLoadApply() {
      const { activityId } = this
      try {
        const blob = await getApplyExcel(activityId, {})
        downloadFile({
          title: '批量报名表模版.xlsx',
          url: window.URL.createObjectURL(blob)
        })
      } catch (e) {
        console.error(e)
      }
    },

    async onImportApply() {
      if (!this.fileList.length) return this.$message({ message: '请上传报名表', type: 'warning' })
      const formData = new FormData()
      formData.append('activityId', String(this.activityId))
      formData.append('file', this.fileList[0])
      const { state, msg, data } = await importApplyExcel(this.activityId, formData)
      if (!state) return this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })

      this.close()
      this.$emit('fetchData')

      if (data.failNum) {
        this.successNum = data.successNum
        this.failNum = data.failNum
        this.failCauseFile = data.failCauseFile
        this.resultVisible = true
      } else {
        this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      }
    },

    onDownloadFail() {
      downloadFile({
        title: '批量报名表模版.xlsx',
        url: this.failCauseFile
      })
    },

    beforeUploadFile(file) {
      if (
        !['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(
          file.type
        )
      ) {
        this.$message.error('请上传xls、xlsx格式的文件')
        return false
      }

      if (file.size > 1024 * 1024 * 10) {
        this.$message.error('文件过大，请控制在10M以内')
        return false
      }
    },

    uploadFile(e) {
      this.fileList = [e.file]
    },

    close() {
      this.$emit('update:visible', false)
    },

    resultClose() {
      this.resultVisible = false
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
