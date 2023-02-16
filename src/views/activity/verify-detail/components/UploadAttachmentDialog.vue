<template>
  <el-dialog :visible.sync="visible" title="上传附件" width="600px" :before-close="close">
    <el-form
      ref="form"
      :model="form"
      label-position="top"
    >
      <el-form-item
        v-for="(item, index) in formList"
        :key="item.signKeyId"
        :label="item.title"
        :rules="[{ required: item.checked }]"
      >
        <div class="tips">(支持图片类型：bmp、jpg、png、jpeg)</div>
        <div class="tips">(支持文件类型：PDF、Word、Excel、PPT)</div>
        <el-upload
          action="#"
          drag
          :before-upload="beforeUpload"
          :http-request="content => uploadFile(content, `list${index}`)"
          :on-remove="() => (form[`list${index}`] = [])"
        >
          <div class="import-upload">
            <i class="el-icon-plus" />
          </div>
        </el-upload>
      </el-form-item>
    </el-form>

    <div slot="footer" class="flex-x-center-center">
      <el-button type="default" class="mr-20" @click="close">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">{{ loading ? '导入中' : '确定' }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { uploadFileRandomName } from '@/api/content/article'
import { getActivityForm, submitApplyInfo } from '@/api/activity/activity-verify-new'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    activityId: {
      type: Number || String,
      default: ''
    },
    applyId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      form: {},
      formList: [],
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.form = {}
        this.initForm()
      }
    }
  },
  methods: {

    async onSubmit() {
      if (!this.validateForm()) return

      const { state, msg } = await submitApplyInfo({
        applyId: this.applyId,
        attachmentInfo: this.formList.map((v, i) => {
          return {
            signKeyId: v.signKeyId,
            attachmentValue: JSON.stringify(this.form[`list${i}`].map(v => ({ url: v.url, filename: v.name })))
          }
        })
      })

      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (!state) return

      this.close()
      this.$emit('fetchData')
    },

    validateForm() {
      return this.formList.every((v, i) => {
        if (v.checked) {
          const res = Boolean(this.form[`list${i}`])
          if (!res) this.$message.error('请完善表单')
          return res
        }
        return true
      })
    },

    async initForm() {
      const { data } = await getActivityForm(this.activityId, {})
      this.formList = data
    },

    beforeUpload(file) {
      if (
        !['image/bmp', 'image/jpeg', 'image/jpg', 'image/png', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(
          file.type
        )
      ) {
        this.$message.error('格式不符合要求')
        return false
      }

      if (file.size > 1024 * 1024 * 30) {
        this.$message.error('请控制在30M以内')
        return false
      }
    },

    // 上传文件
    uploadFile(content, field) {
      const formData = new FormData()
      formData.append('file', content.file)

      uploadFileRandomName(formData, 'activityApply').then(response => {
        if (!this.form[field]) this.form[field] = []
        this.form[field].push({ url: response.data, name: content.file.name })
      })
    },

    close() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
    },

  }
}
</script>
<style lang="scss" scoped>
>>> .el-form-item__label {
  line-height: 0;
}

>>> .el-upload-dragger {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tips {
  color: #ccc;
  line-height: 24px;
}

.import-upload {

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
