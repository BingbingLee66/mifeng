<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="功能开关" width="400px" @closed="close">
      <div class="text-center">
        <el-radio-group v-model="radio">
          <el-radio :label="0">使用该功能</el-radio>
          <el-radio :label="1">关闭改功能</el-radio>
        </el-radio-group>
      </div>
      <div class="text-center mt-40">
        <el-button class="mr-20" @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Home from '@/api/home-config/Home'
export default {
  data() {
    return {
      dialogVisible: false,
      radio: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$on('use', () => {
        this.dialogVisible = true
      })
    })
  },
  methods: {
    close() {
      this.dialogVisible = false
    },

    async submit() {
      const res = await Home.saveKingkong()
      if (res.state !== 1) {
        this.$message.error(res.msg)
      } else {
        this.$message.success(res.msg)
        this.close()
        // this.$emit('Refresh')
      }
    }
  }
}
</script>

<style>
</style>
