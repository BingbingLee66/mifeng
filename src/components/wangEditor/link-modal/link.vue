<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="展示方式">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">文字</el-radio>
          <el-radio :label="2">图片</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="form.path" />
      </el-form-item>
      <el-form-item v-show="form.type === 1" label="文字内容">
        <el-input v-model="form.content" />
      </el-form-item>
      <el-form-item v-show="form.type === 2" label="图片">
        <el-upload
          action="#"
          class="upload-demo"
          list-type="picture-card"
          :http-request="uploadListImage"
          :before-upload="beforeUpload"
          :limit="1"
          :show-file-list="true"
          :on-remove="handleRemove"
        >
          <el-button v-show="!form.src" type="primary">上传图片</el-button>
          <div slot="tip" style="color: #999">点击图片会打开指定链接</div>
        </el-upload>
      </el-form-item>
      <el-form-item label-width="40%">
        <el-button type="primary" @click="finish">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'LinkDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: 'link',
      form: {
        type: 1,
        path: '',
        content: '',
        src: ''
      }
    }
  }, // 接收父组件的内容
  mounted() {},
  methods: {
    // 上传图片
    uploadListImage(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      console.log(content.file)
      this.form.src = content.file
    },
    beforeUpload() {
      console.log('beforeUpload')
    },
    handleRemove() {
      // 上传按钮等移除完毕再回显
      setTimeout(() => {
        this.form.src = ''
      }, 1200)
    },
    finish() {
      if (this.form.type === 1) {
        if (!this.form.path || !this.form.content) {
          this.$message({
            message: '请输入链接或文字内容',
            type: 'error'
          })
          return false
        }
      } else {
        if (!this.form.path || !this.form.src) {
          this.$message({
            message: '请输入链接或图片',
            type: 'error'
          })
          return false
        }
      }
      this.$emit('onClick', this.form)
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss">
.el-dialog__body {
  padding: 0px 20px 30px;
}

.el-upload--picture-card {
  height: auto;
  line-height: 40px;
  width: auto;
  border: none;
}
.upload-image {
  width: 148px;
  height: 148px;
}
</style>
