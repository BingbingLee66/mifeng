<template>
  <div class="app-container">
    <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="110px">
      <el-row>
        <el-col :span="15">
          <el-form-item label="所属类型：" prop="type">
            <el-radio v-model="formObj.type" label="1">缴费通知</el-radio>
            <el-radio v-model="formObj.type" label="2">活动通知</el-radio>
            <el-radio v-model="formObj.type" label="3">招商活动</el-radio>
            <el-radio v-model="formObj.type" label="4">邀请入会</el-radio>
            <el-radio v-model="formObj.type" label="5">自定义通知</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="模板名称：" prop="invesId">
            <el-select v-model="formObj.invesId" clearable filterable placeholder="请选择">
              <el-option v-for="item in originOpt" :key="item.invesKey" :label="item.name" :value="item.id" />
            </el-select>
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
          <el-form-item label="模板备注：" prop="remark">
            <el-input v-model.trim="formObj.remark" clearable maxlength="30" show-word-limit />
            <div class="base">同个模板可以配置不同属性值，需添加模板备注作为区分</div>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      formObj: {
        type: '1',
        invesId: '',
        content: '',
        remark: ''
      },
      originOpt: []
    }
  },
  computed: {
    rules() {
      return {
        type: [{ required: true, message: '请选择所属类型', trigger: 'change' }],
        invesId: [{ required: true, message: '请选择模板名称', trigger: 'blur' }],
        content: [{ required: true, message: '模板内容不能为空', trigger: 'blur' }],
        remark: [{ required: true, message: '模板备注不能为空', trigger: 'blur' }]
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
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="scss">
.base {
  color: #aaaaaa;
}
</style>
