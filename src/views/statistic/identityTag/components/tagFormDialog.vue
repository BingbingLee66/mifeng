<template>
  <el-dialog title="添加标签" v-bind="$attrs" width="40%" v-on="$listeners" @open="onDialogShow">
    <el-form ref="form" :model="formModel" label-width="120px">
      <el-form-item
        label="添加标签位置"
        prop="labelPosition"
        :rules="{
          required: true, message: '标签位置不能为空', trigger: 'blur'
        }"
      >
        <el-select v-model="formModel.labelPosition" filterable>
          <el-option
            v-for="item of labelPositionOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="formModel.labelPosition === 'need?'"
        label="添加标签"
        prop="labelIdentity"
        :rules="{
          required: true, message: '标签身份不能为空', trigger: 'blur'
        }"
      >
        <el-select v-model="formModel.labelIdentity" filterable>
          <el-option
            v-for="item of labelPositionOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="formModel.labelPosition === 'need?' ? '' : '添加标签'"
        prop="label"
        :rules="{
          required: true, message: '标签不能为空', trigger: 'blur'
        }"
      >
        <el-input v-model="formModel.label" maxlength="6" />
      </el-form-item>

    </el-form>

    <div slot="footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'TagFormDialog',
  data() {
    return {
      formModel: {
        labelPosition: 'youAre?',
        labelIdentity: '',
        label: '',
      },
      labelPositionOpt: [
        { label: '你是？', value: 'youAre?' },
        { label: '你需要？', value: 'need?' },
        { label: '所处行业', value: 'industry' },
      ]
    }
  },
  methods: {
    onDialogShow() {

    },

    onConfirm() {
      this.$refs.form.validate(async valid => {
        if (!valid) return false

        try {
          // const { state, msg } = await addToolBar(params)
          // if (!state) return
          // this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
          this.onClose()
          this.$emit('success')
        } catch (e) {
          console.error(e)
        }
      })
    },

    onClose() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
