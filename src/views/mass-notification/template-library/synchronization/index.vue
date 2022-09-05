<template>
  <div class="app-container">
    <!-- 短信 -->
    <Note v-if="type == 1" @close="close" @save="save" />
    <!-- 消息订阅 -->
    <Subscribe v-if="type == 2" @close="close" @save="save" />
    <!-- APP通知 -->
    <AppInform v-if="type == 3" @close="close" @save="save" />
  </div>
</template>

<script>
import { synchronizeAndApplyTemplate } from '@/api/mass-notification'
import Subscribe from './components/subscribe'
import AppInform from './components/app-inform'
import Note from './components/note'
export default {
  components: {
    Note,
    Subscribe,
    AppInform
  },
  data() {
    return {
      type: '' //  1:短信 2：消息订阅  3：app
    }
  },

  mounted() {
    this.type = this.$route.query.type || '1'
  },
  methods: {
    // 回退模板库
    close() {
      this.$router.push({
        path: '/dashboard',
        query: {
          type: this.type
        }
      })
    },
    // 保存
    async save(e) {
      const res = await synchronizeAndApplyTemplate(e)
      if (res.state === 1) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.close()
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
