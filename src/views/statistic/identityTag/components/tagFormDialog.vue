<template>
  <el-dialog :title="`${labelText}标签`" v-bind="$attrs" width="40%" v-on="$listeners" @open="onDialogShow">
    <el-form ref="form" :model="formModel" label-width="120px">
      <el-form-item
        :label="`${labelText}标签位置`"
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
        v-if="formModel.labelPosition === 2"
        :label="`${labelText}标签`"
        prop="labelIdentity"
        :rules="{
          required: true, message: '标签身份不能为空', trigger: 'blur'
        }"
      >
        <el-select v-model="formModel.labelIdentity" filterable>
          <el-option
            v-for="item of youAreList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="formModel.labelPosition === 2 ? '' : `${labelText}标签`"
        prop="label"
        :rules="{
          required: true, message: '标签不能为空', trigger: 'blur'
        }"
      >
        <el-input v-if="mode === 'add'" v-model="formModel.label" maxlength="6" />
        <el-select v-else-if="mode === 'del'" v-model="formModel.label" filterable>
          <el-option
            v-for="item of newTagList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

    </el-form>

    <div slot="footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addTag, deleteTag } from '@/api/user-guide'

export default {
  name: 'TagFormDialog',
  props: {
    youAreList: {
      type: Array,
      default: () => []
    },
    tagList: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'add' | 'del'
    }
  },
  data() {
    return {
      formModel: {
        labelPosition: 1,
        labelIdentity: '',
        label: '',
      },
      labelPositionOpt: [
        { label: '你是？', value: 1 },
        { label: '你需要？', value: 2 },
        { label: '所处行业', value: 3 },
      ]
    }
  },
  computed: {
    labelText() {
      return this.mode === 'add' ? '添加' : '删除'
    },
    newTagList() {
      switch (this.formModel.labelPosition) {
        case 1:
          return this.youAreList
        case 2:
          return this.tagList.filter(v => v.relLabelId === +this.formModel.labelIdentity)
        case 3:
          return this.tagList.filter(v => v.labelName === 3)
        default:
          return this.youAreList
      }
    }
  },
  methods: {
    onDialogShow() {

    },

    onConfirm() {
      this.$refs.form.validate(async valid => {
        if (!valid) return false

        try {
          const { state, msg } = this.mode === 'add'
            ? await addTag({
              labelName: this.formModel.labelPosition,
              labelVal: this.formModel.label,
              relLabelId: this.formModel.labelIdentity
            })
            : await deleteTag(+this.formModel.label)
          if (!state) return
          this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
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
