<template>
  <div>
    <!-- 新增/编辑栏目名称 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @closed="close"
    >
      <ysh-form
        ref="formRef"
        :form-config="formConfig"
        :form-item="formItem"
        :form-obj="formObj"
        @submit="submit"
      >
        <template v-slot:customConetent>
          <div class="text-center mt-40">
            <el-button class="mr-20" @click="close">取消</el-button>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
          </div>
        </template>
      </ysh-form>
    </el-dialog>
  </div>
</template>

<script>
import Home from '@/api/home-config/Home'

export default {
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      formConfig: {
        type: 'custom',
        inline: false,
        labelWidth: '120px',
        size: 'medium'
      },
      formObj: {
        name: '' // 栏目名称
      },
      formItem: [
        {
          label: '栏目名称：',
          prop: 'name',
          type: 'input',
          width: '90%',
          showWordLimit: true,
          maxlength: 6,
          placeholder: '请输入栏目名称',
          clearable: true,
          value: '',
          rules: [
            { min: 1, max: 6, message: '只限6个字以内哦', trigger: 'blur' },
            { required: true, message: '请输入栏目名称', trigger: 'blur' }
          ]
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$on('add', () => {
        this.add()
      })
      this.$on('edit', data => {
        this.edit(data)
      })
    })
  },
  methods: {
    add() {
      this.dialogTitle = '新增栏目'
      this.dialogVisible = true
    },

    edit(data) {
      this.dialogTitle = '编辑栏目'
      const { name, id } = data
      this.formObj = { name, id }
      this.dialogVisible = true
    },

    close() {
      this.formObj = { name: '' }
      this.$refs.formRef.resetFileds()
      this.dialogVisible = false
    },

    handleSubmit() {
      this.$refs.formRef.submit()
    },

    async submit(data) {
      const res = await Home.updateTab(data)
      if (res.state !== 1) {
        this.$message.error(res.msg)
      } else {
        this.$message.success(res.msg)
        this.close()
        this.$emit('refresh')
      }
    }
  }
}
</script>

<style></style>
