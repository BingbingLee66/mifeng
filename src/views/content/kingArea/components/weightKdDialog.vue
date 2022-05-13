
<template>
  <div>
    <!-- 编辑权重对话框 -->
    <kdDialog
      ref="weightKdDialog"
      :dialog-title="dialogTitle"
      dialog-width="40%"
      @savePopupData="submitWeight"
      @hide="hide"
    >
      <div slot="content">
        <el-form
          ref="formWeightKdDialog"
          :rules="weightRules"
          label-width="120px"
          :model="formWeight"
          label-position="right"
          class="demo-ruleForm"
        >
          <el-form-item label="权重：" prop="weight">
            <el-input
              v-model="formWeight.weight"
              onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"
            />
          </el-form-item>
        </el-form>
      </div>
    </kdDialog>
  </div>
</template>

<script>
import kdDialog from '@/components/common/kdDialog'
import { validateWeight } from '../utils/utilRules'
export default {
  name: 'WeightKdDialog',
  components: { kdDialog },
  props: {},
  data() {
    return {
      // 状态
      resolve: null,
      reject: null,
      // 权重对话框表单对象
      formWeight: {
        weight: null,
      },
      // 表单校验规则
      weightRules: {
        weight: [
          { required: true, message: '请输入权重', trigger: 'blur' },
          { validator: validateWeight, trigger: 'blur', },
        ],
      },
      // 对话框标题
      dialogTitle: '编辑权重',
      // 当前编辑的权重id
      currentId: null,
      // 需要执行的函数名称
      fn: null
    }
  },
  methods: {
    /**
     * 状态
     */
    // 打开当前添加金刚区对话框
    open(id, value, fn) {
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
        this.show()
        this.fn = fn
        this.formWeight.weight = value
        this.currentId = id
      })
    },
    // 显示对话框子组件
    show() {
      this.$refs['weightKdDialog'].show()
    },
    hide() {
      this.$refs['weightKdDialog'].hide()
      this.$refs['formWeightKdDialog'].clearValidate()
      this.resolve = null
      this.reject = null
    },
    /**
     * 行为类
     */
    // 点击保存权重
    submitWeight() {
      this.$refs['formWeightKdDialog'].validate((valid) => {
        if (valid) {
          let params = {
            id: this.currentId,
            value: this.formWeight.weight,
          }
          this.saveKingKongWeightFunc(params)
        } else {
          return false
        }
      })
    },

    /**
     * 请求类
     */
    // 保存权重 ,fn为传入需要执行的函数
    saveKingKongWeightFunc(params) {
      let api = this.fn
      console.log('params', params)
      api(params).then((res) => {
        if (res.state === 1) {
          this.$message({
            message: '保存成功',
            type: 'success',
          })
          this.resolve()
          this.hide()
        } else {
          this.$message({
            message: res.msg,
            type: 'error',
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  // overflow: hidden;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 96px;
  height: 96px;
  line-height: 96px;
  text-align: center;
}
.avatar {
  width: 96px;
  height: 96px;
  display: block;
}
</style>

