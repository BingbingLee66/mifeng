<template>
  <el-dialog
    :visible="visible"
    title="新建标签组"
    width="50%"
    @close="close"
  >
    <el-form
      ref="ruleForm"
      :model="formObj"
      label-width="80px"
      label-position="left"
      size="small"
    >
      <el-form-item
        label="标签组"
        prop="tagGroup"
        :rules="[
          { required: true, message: '标签组不能为空', trigger: 'blur' }
        ]"
      >
        <div style="display: flex;">
          <el-input
            v-model.trim="formObj.tagGroup"
            clearable
            maxlength="15"
            placeholder="关键词"
            style="width: 300px;"
          />
          <div style="margin-left: 10px;">{{ formObj.tagGroup.length }}/15</div>
        </div>
      </el-form-item>

      <el-form-item
        v-for="(tag, index) in formObj.tagList"
        :key="index"
        :label="index === 0 ? '标签' : ''"
        :prop="'tagList[' + index + ']'"
        :rules="[
          { required: true, message: '标签不能为空', trigger: 'blur' }
        ]"
      >
        <div class="tag-list">
          <el-input
            v-model.trim="formObj.tagList[index]"
            clearable
            maxlength="15"
            placeholder="关键词"
            class="tag-input"
          />
          <div style="margin-left: 10px;">{{ tag.length }}/15</div>
          <el-button
            v-if="index === formObj.tagList.length - 1"
            icon="el-icon-plus"
            size="small"
            style="margin-left: 10px;"
            @click="addTag"
          >
            添加标签
          </el-button>
        </div>
      </el-form-item>

      <el-form-item label="">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" size="small" @click="confirm">确定</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>

export default {
  name: 'TagFormDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      formObj: {
        tagGroup: '',
        tagList: [''],
      }
    }
  },
  computed: {

  },
  methods: {

    confirm() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return

        this.$emit('confirm', this.formObj)
        this.close()
      })
    },

    close() {
      this.$emit('update:visible', false)
      this.formObj = {
        tagGroup: '',
        tagList: [''],
      }
    },

    addTag() {
      this.formObj.tagList.push('')
    }
  }
}
</script>

<style scoped lang="scss">
.tag-list {
  display: flex;

  .tag-input {
    width: 300px;
  }
}
</style>
