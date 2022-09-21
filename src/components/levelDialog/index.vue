
<template>
  <!-- 修改权重组件 -->
  <div>
    <el-dialog
      title="权重"
      :visible.sync="levelVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="70px"
      >
        <el-form-item label="权重：" prop="level">
          <el-input v-model.number="ruleForm.level" maxlength="3" />
        </el-form-item>
        <p style="color: #999; margin: 0 70px">
          请控制在0-999，权重为0不在前台展示；
        </p>
        <slot />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">确定</el-button>
        <el-button @click="levelVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 权重检测数字
    var checkSNum = (rule, value, callback) => {
      if (value === '' && value !== 0) {
        return callback(new Error(`权重请控制在0-999，权重为0不在前台展示`))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('权重请控制在0-999，权重为0不在前台展示'))
      } else {
        if (value < 0 || value > 999) {
          callback(new Error(`权重请控制在0-999，权重为0不在前台展示`))
        } else {
          callback()
        }
      }
    }
    return {
      levelVisible: false,
      rowData: null,
      ruleForm: {
        id: '',
        level: '',
      },
      rules: {
        level: [
          { required: true, message: '请输入权重值', trigger: 'blur' },
          { validator: checkSNum, trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    show(data, id, row) {
      this.ruleForm.id = id
      this.ruleForm.level = data
      this.rowData = row
      this.levelVisible = true
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$emit('levelCallback', this.ruleForm, this.rowData)
          this.levelVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>
