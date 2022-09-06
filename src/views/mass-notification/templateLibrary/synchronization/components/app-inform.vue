<template>
  <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="110px">
    <el-row>
      <el-col :span="15">
        <el-form-item label="消息标题：" prop="templateName">
          <el-input v-model.trim="formObj.templateName" clearable maxlength="24" show-word-limit />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15">
        <el-form-item label="内容：" prop="content">
          <el-input
            v-model.trim="formObj.content"
            type="textarea"
            maxlength="72"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 7 }"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-col :span="8">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'AppInform',
  data() {
    return {
      formObj: {
        type: '3', //模板类型 1短信通知、2订阅消息、3APP通知
        templateName: '',
        content: ''
      }
    }
  },
  computed: {
    rules() {
      return {
        templateName: [{ required: true, message: '消息标题不能为空', trigger: 'change' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {},
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.$emit('save', this.formObj)
      })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss"></style>
