<template>
  <div>
    <!-- 切换频率 -->
    <el-dialog :visible.sync="rateVisible" title="切换频率" width="500px" @closed="closeRate">
      <el-form ref="rateForm" :model="rateForm" :rules="rateRules" label-width="100px">
        <el-form-item label="切换开关：" prop="switch">
          <el-switch v-model="rateForm.switch" />
        </el-form-item>
        <el-form-item v-if="rateForm.switch" label="切换频率：" prop="rate">
          <el-input v-model="rateForm.rate" style="width: 200px" placeholder="">
            <template slot="append">毫秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <div class="mt-20">
            <el-button class="mr-20" @click="closeRate">取消</el-button>
            <el-button type="primary" @click="submitRate">发布</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { validateInt } from '@/utils/validate'
export default {
  data() {
    return {
      rateVisible: false,
      rateForm: {
        switch: true,
        rate: '3000'
      },
      rateRules: {
        switch: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
        rate: [
          { required: true, message: '请输入切换频率' },
          { validator: validateInt, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$on('rate', () => {
        this.rateVisible = true
      })
    })
  },
  methods: {
    closeRate() {
      this.rateVisible = false
    },

    submitRate() {
      this.$refs['rateForm'].validate(async valid => {
        if (valid) {
          alert('submit!')
        }
      })
    }
  }
}
</script>

<style>
</style>
