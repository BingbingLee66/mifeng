<template>
  <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="110px">
    <el-row>
      <el-col :span="15">
        <el-form-item label="模板CODE：" prop="code">
          <el-input v-model.trim="formObj.code" maxlength="20" clearable show-word-limit />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15">
        <el-form-item label="模板类型：" prop="type">
          <el-radio v-model="formObj.type" label="1">通知短信</el-radio>
          <el-radio v-model="formObj.type" label="2">推广短信</el-radio>
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
        <el-form-item label="模板内容：" prop="content">
          <el-input
            v-model.trim="formObj.content"
            type="textarea"
            maxlength="500"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 7 }"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15">
        <el-form-item label="变量属性：" :required="true">
          <div class="property">
            <div>name：</div>
            <el-select v-model="formObj.variable" clearable filterable placeholder="请选择" style="width: 330px">
              <el-option v-for="item in originOpt" :key="item.invesKey" :label="item.name" :value="item.id" />
            </el-select>
          </div>
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
  name: 'Note',
  data() {
    return {
      formObj: {
        code: '',
        type: '1',
        name: '',
        content: '',
        variable: ''
      },
      originOpt: []
    }
  },
  computed: {
    rules() {
      return {
        code: [
          { required: true, message: '模板CODE不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log('value', value)
              if (
                !/(^[a-zA-Z]{1}[a-zA-Z0-9]{5,11}$)|(^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$)/.test(
                  value
                )
              ) {
                return callback(new Error('账号只能为字母和数字，且以字母开头，长度为6-12个字符！或为11位手机号码'))
              } else {
                callback() // 必须加上这个，不然一直塞在验证状态
              }
            },
            trigger: 'blur'
          }
        ],
        type: [{ required: true, message: '模板类型不能为空', trigger: 'change' }],
        name: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '模板内容不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {},
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) return
      })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.property {
  display: flex;
  align-items: center;
}
</style>
