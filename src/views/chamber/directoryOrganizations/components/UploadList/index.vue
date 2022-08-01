<template>
  <el-dialog
    title="数据导入"
    :visible.sync="visible"
    width="500px"
    @close="close"
  >
    <div style="margin-left: 50px;margin-top: -25px;">
      <span class="excelSpan" style="font-size: 20px;margin-left: 100px">导入说明</span>
      <span class="excelSpan">1、请勿增加、删除、修改表格中的字段</span>
      <span class="excelSpan">2、其他字段多次导入数据会进行覆盖</span>
    </div>
    <div v-if="execelDate" style="margin-left: 50px;">
      <!-- <el-upload
        class="upload"
        drag
        action="/"
        :multiple="false"
        :file-list="fileList"
        :show-file-list="false"
        :before-upload="beforeUploadFile"
        :http-request="uploadFile"
      > -->
      <el-upload
        action="/"
        :multiple="false"
        :show-file-list="false"
        :before-upload="beforeUploadFile"
        :http-request="uploadFile"
      >
        <span>导入文件：</span>
        <el-button><i class="el-icon-upload" />点击上传</el-button>
        <span slot="tip" class="el-upload__tip">支持扩展名：xsl、xslx</span>
      </el-upload>
    </div>
    <div v-if="execelDate.state" class="tableTitle" />
    <div v-if="execelDate.state === 1" style="margin-left: 50px;">
      <div>导入结果：导入成功 <span style="color: red">{{ execelDate.data.successCount }}</span> 条记录,导入失败 <span style="color: red">{{ execelDate.data.failureCount }}</span> 条记录</div>
      <div style="margin-top: 10px;margin-bottom: 10px;">导入失败详情：</div>
      <el-table
        :data="execelDate.data.failureReasonList"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="row"
          label="行标(表头不算在内)"
        />
        <el-table-column
          prop="reason"
          label="失败原因"
        />
      </el-table>
    </div>
    <div v-else style="margin-left: 50px;">
      <div>{{ execelDate.msg }} </div>
    </div>
  </el-dialog>
</template>
<script>
import { uploadOrganizationsData } from '@/api/chamber/directoryOrganizations'
export default {
  data() {
    return {
      visible: false,
      fileList: [],
      execelDate: {}
    }
  },
  methods: {
    init() {
      console.log('q32424')
      this.visible = true
    },
    beforeUploadFile(file) {
      if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(file.type)) {
        this.$message.error('上传文件只能是 XLSX 或 XLS 格式!')
        return false
      }
    },
    uploadFile(e) {
      const formData = new FormData()
      formData.append('file', e.file)
      uploadOrganizationsData(formData).then((res) => {
        this.execelDate = res
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    close() {
      this.fileList = []
      this.execelDate = {}
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog__header{
  background-color: #cfbbbb38;
}
.excelSpan{
  margin-left: 300px;
  word-break:normal;
  width:auto;
  display:block;
  white-space:pre-wrap;
  word-wrap : break-word ;
  overflow: hidden ;
  font-size: 7px;
  margin: 12px;
}
.tableTitle {
  position: relative;
  margin: 17px auto;
  width: 100%;
  height: 1px;
  background-color: #d4d4d4;
  text-align: center;
  font-size: 16px;
  color: rgba(101, 101, 101, 1);
}
.midText {
  position: absolute;
  left: 50%;
  background-color: #ffffff;
  padding: 0 15px;
  transform: translateX(-50%) translateY(-50%);
}
.el-upload__tip{
  font-size: 7px;
  margin-left: 7px;
}
</style>
