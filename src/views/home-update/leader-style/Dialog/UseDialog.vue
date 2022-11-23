<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="功能开关" width="400px" @closed="close">
      <div class="text-center">
        <el-radio-group v-model="type">
          <el-radio :label="1">使用该功能</el-radio>
          <el-radio :label="0">关闭该功能</el-radio>
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
      type: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$on('use', () => {
        this.use()
      })
    })
  },
  methods: {
    async use() {
      const { ckey } = this.$store.getters
      const res = await Home.getSwitchLeader(ckey)
      this.type = res.data ? 1 : 0
      this.dialogVisible = true
    },

    close() {
      this.dialogVisible = false
    },

    async submit() {
      const res = await Home.switchLeader({
        ckey: this.$store.getters.ckey || '',
        type: this.type
      })
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

<style>
</style>
