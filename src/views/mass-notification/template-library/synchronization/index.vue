<template>
  <div class="app-container">
    <!-- 短信 -->
    <Note v-if="activeName == 1" @close="close" />
    <!-- 消息订阅 -->
    <Subscribe v-if="activeName == 2" @close="close" />
    <!-- APP通知 -->
    <AppInform v-if="activeName == 3" @close="close" />
  </div>
</template>

<script>
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
      activeName: '' //  1:短信 2：消息订阅  3：app
    }
  },

  mounted() {
    this.activeName = this.$route.query.activeName || '1'
  },
  methods: {
    // 回退模板库
    close() {
      this.$router.push({
        path: '/dashboard',
        query: {
          activeName: this.activeName
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
