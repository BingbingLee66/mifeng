<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="展示方式">
        <el-radio-group v-model="form.type">
          <el-radio :label="0">文字</el-radio>
          <el-radio :label="1">图片</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="form.path" />
      </el-form-item>
      <el-form-item v-show="form.type === 0" label="文字内容">
        <el-input v-model="form.content" />
      </el-form-item>
      <el-form-item v-show="form.type === 1" label="图片">
        <RichUpload @upload="onUpload" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="finish">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import RichUpload from './upload'
export default {
  name: 'Link',
  components: { RichUpload },
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
        type: 0,
        path: '',
        content: '',
        src: ''
      }
    }
  },
  methods: {
    onUpload(src) {
      this.form.src = src
    },
    finish() {
      if (this.form.type === 0) {
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
</style>
