<template>
  <div class="content">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div class="box">
        <el-form ref="formName" label-position="right" label-width="110px" :model="formObj" :rules="rules">
          <el-form-item v-if="tabsIndex == 0 || tabsIndex == 1" label="使用场景：" prop="scene">
            <el-select v-model="formObj.scene">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="tabsIndex != 3" :label="tabsIndex == '0' ? '打招呼语言：' : tabsIndex == '1' ? '快捷回复语：' :'常用语：' " prop="textarea">
            <el-input v-model="formObj.textarea" :autosize="{ minRows: 4, maxRows: 6}" maxlength="200" type="textarea" />
          </el-form-item>
          <el-form-item v-if="tabsIndex == 2" label="权重：" prop="size">
            <el-input v-model="formObj.size" maxlength="3" type="number" />
          </el-form-item>
          <el-form-item v-if="tabsIndex == 3" label="场景名称：" prop="name">
            <el-input v-model="formObj.name" maxlength="6" />
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    tabsIndex: { // 0.打招呼  1.快捷回复 2.常用语  3.场景列表
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false, // 开启弹框
      options: [], // 使用场景
      formObj: {
        scene: '', // 使用场景
        textarea: '', // 内容
        size: '999', // 权重
        name: '', // 场景名称
      },
      rules: {
        scene: [{ required: true, message: '请选择场景', trigger: 'change' }],
        textarea: [{ required: true, message: '请填写内容', trigger: 'blur' }],
        size: [{ required: true, message: '请填写权重', trigger: 'blur' }],
        name: [{ required: true, message: '请填写场景名称', trigger: 'blur' }],
      }
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
    },
    // 关闭
    handleClose() {
      this.dialogVisible = false
      this.formObj = {
        scene: '', // 使用场景
        textarea: '', // 内容
        size: '999', // 权重
        name: '', // 场景名称
      }
      this.$refs.formName.clearValidate()
    },
    // 确定
    onConfirm() {
      this.$refs['formName'].validate(valid => {
        if (valid) {
          console.log(1111111111)
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.content{
  overflow: hidden;
}
.dialog-footer{
  display: flex;
  align-content: center;
  justify-content: center;
}
.box{
  width: 83%;
}
</style>
