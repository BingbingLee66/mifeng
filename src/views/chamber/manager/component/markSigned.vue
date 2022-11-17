<template>
  <div>
    <el-dialog
      title="
标记已签约"
      :visible.sync="detailVisible"
      @close="close"
    >
      <el-form ref="formName" label-width="160px" :model="formObj" :rules="rules">
        <el-form-item label="商协会：" prop="level"> 名市公共体育服务研究会 </el-form-item>
        <el-form-item label-width="180px" label="社会团体法人登记证：" prop="license">
          <el-upload
            class="systemLogo_uploader"
            action="/"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadSystemLogo"
          >
            <img v-if="formObj.license" :src="formObj.license" class="system_logo">
            <i v-else class="el-icon-plus systemLogo_uploader_icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="办公地址：" prop="address">
          <el-input v-model.trim="formObj.address" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="detailVisible = false">取消</el-button>
        <el-button type="primary" @click="updateChamberSign">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { chamberSign, upload } from '@/api/chamber/manager'

import { beforeSystemLogoUploadUtil } from '../util'
export default {
  data() {
    return {
      // 状态
      reject: null,
      reslove: null,
      detailVisible: false,
      formObj: { name: null, license: null, address: null },
      rules: {
        address: [{ required: true, message: '不能为空', trigger: 'blur' }],
        license: [{ required: true, message: '不能为空', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 打开
    open(row) {
      return new Promise((reslove, reject) => {
        this.formObj.name = row.name
        this.formObj.ckey = row.ckey
        this.reslove = reslove
        this.reject = reject
        this.show()
      })
    },
    // 展示
    show() {
      this.detailVisible = true
    },
    // 关闭
    close() {
      this.$refs.formName.clearValidate()
      this.detailVisible = false
      this.reject = null
      this.reslove = null
      this.form = null
    },
    beforeAvatarUpload(file) {
      const flag = beforeSystemLogoUploadUtil(file)
      return flag
    },
    uploadSystemLogo(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      upload(formData).then(response => {
        this.formObj.license = response.data.filePath
      })
    },
    async chamberSignFunc() {
      const res = await chamberSign({ ...this.formObj })
      if (res.state === 1) {
        this.$message({
          message: '备注成功',
          type: 'success'
        })
        this.reslove()
        this.close()
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    // 标记已签约
    updateChamberSign() {
      this.$refs['formName'].validate(valid => {
        if (valid) {
          this.chamberSignFunc()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.msg-view {
  margin-left: 58px;
}
.audit-result-view {
  margin-left: 50px;

  .linemargin {
    margin-bottom: 5px;
  }
}

.th_title {
  width: 100px;
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  margin: 0 30px;
  padding: 20px 0 !important;
}

.header-title {
  .title-name {
    color: #4d82f3;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
  }
}

.updateImg {
  width: 50px;
  height: 50px;
  vertical-align: middle;
}
</style>
