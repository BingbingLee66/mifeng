<template>
  <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="110px">
    <el-row>
      <el-col :span="15">
        <el-form-item label="模板ID：" prop="code">
          <el-input v-model.trim="formObj.code" maxlength="60" clearable show-word-limit />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15">
        <el-form-item label="模板名称：" prop="name">
          <el-input v-model.trim="formObj.name" maxlength="30" clearable show-word-limit />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15">
        <el-form-item label="关键词：" prop="crux">
          <div v-for="(item, index) in formObj.crux" :key="index" class="hinge">
            <el-input v-model="item.value1" placeholder="请输入模板名称" />
            <el-input v-model="item.value2" placeholder="请输入关键词" />
            <el-button type="danger" :disabled="index == 0" @click="onDelete(index)">删除</el-button>
          </div>
          <div><el-button type="primary" @click="onNewly">+新增</el-button></div>
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
  name: 'Subscribe',
  data() {
    return {
      formObj: {
        code: '',
        name: '',
        crux: [
          {
            value1: '',
            value2: ''
          }
        ]
      }
    }
  },
  computed: {
    rules() {
      return {
        code: [{ required: true, message: '模板ID不能为空', trigger: 'change' }],
        name: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
        crux: [{ required: true }]
      }
    }
  },
  mounted() {},
  methods: {
    // 确认
    save() {
      let pass = false // 判断关键词内容是否填写
      this.formObj.crux.forEach(v => {
        if (v.value1 === '' || v.value2 === '') pass = true
      })
      if (pass) return this.$message.error('请填写关键词')

      this.$refs.form.validate(valid => {
        if (!valid) return
      })
    },
    // 取消
    close() {
      this.$emit('close')
    },
    // 新增
    onNewly() {
      let obj = {
        value1: '',
        value2: ''
      }
      this.formObj.crux.push(obj)
    },
    // 删除
    onDelete(index) {
      console.log(index)
      this.formObj.crux.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="scss">
.hinge {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  .el-input {
    width: 250px;
    margin-right: 20px;
  }
}
</style>
