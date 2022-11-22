<template>
  <div>
    <!-- 切换频率 -->
    <el-dialog :visible.sync="dialogVisible" title="切换频率" width="500px" @closed="close">
      <el-form ref="formRef" :model="formObj" :rules="rules" label-width="100px">
        <el-form-item label="切换开关：" prop="status">
          <el-switch v-model="formObj.status" />
        </el-form-item>
        <el-form-item v-if="formObj.status" label="切换频率：" prop="time">
          <el-input v-model.trim="formObj.time" style="width: 250px" placeholder="">
            <template slot="append">毫秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <div class="mt-20">
            <el-button class="mr-20" @click="close">取消</el-button>
            <el-button type="primary" @click="submit">发布</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { validateInt } from '@/utils/validate'
import Home from '@/api/home-config/Home'

export default {
  data() {
    return {
      dialogVisible: false,
      formObj: {
        status: true,
        time: '3000'
      },
      rules: {
        status: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
        time: [
          { required: true, message: '请输入切换频率' },
          { validator: validateInt, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$on('rate', data => {
        this.formObj.time = data || '3000'
        this.dialogVisible = true
      })
    })
  },
  methods: {
    close() {
      this.formObj = { status: true, time: '' }
      this.$refs['formRef'].clearValidate()
      this.dialogVisible = false
    },

    submit() {
      this.$refs['formRef'].validate(async valid => {
        if (valid) {
          const res = await Home.changeBannerRate({
            status: this.formObj.status ? '1' : '0',
            time: this.formObj.time
          })
          if (res.state === 1) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.$emit('refresh')
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    }
  }
}
</script>

<style></style>
