<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="展示方式" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="0">文字</el-radio>
          <el-radio :label="1">图片</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="小程序路径" prop="path">
        <el-input v-model="form.path" />
      </el-form-item>

      <el-form-item v-if="form.type === 0" label="文字内容" prop="content">
        <el-input v-model="form.content" />
      </el-form-item>

      <el-form-item v-if="form.type === 1" label="图片" prop="src">
        <RichUpload @upload="onUpload" />
      </el-form-item>

      <el-form-item>
        <el-button @click="onClick">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import RichUpload from './upload'

export default {
  name: 'Miniprogram',
  components: { RichUpload },
  data() {
    return {
      form: {
        type: 0,
        path: '',
        content: '',
        src: '',
      },
      rules: {
        path: [{ required: true, message: '小程序路径不能为空', trigger: 'blur' }],
      }
    }
  },

  methods: {
    onClick() {
      this.$refs['form'].validate(valid => {
        if (!valid) return

        if (!this.form.path.split('?')[1]) {
          return this.$message.error('小程序路径格式错误')
        }

        this.$emit('onClick', this.form)
        this.$emit('close')
      })
    },

    onUpload(src) {
      this.form.src = src
    }
  }
}
</script>

<style scoped lang="scss">

</style>
