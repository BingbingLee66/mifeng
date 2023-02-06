<template>
  <a-spin v-if="userInfo.ontrial" :spinning="loading">
    <a-alert
      v-if="userInfo.ontrial"
      :message="loading ? '' : `已试用${str} ，将于${endTime}到期，如需延长期限，请与商务联系。`"
      banner
      closable
      @close="closeTip"
  /></a-spin>
</template>

<script>
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
export default {
  setup() {
    const store = useStore()
    const userInfo = computed(() => store.state.user)
    const timer = ref(null)
    const str = ref('')
    const loading = ref(true)
    const countdown = () => {
      if (!userInfo.value.ontrial) {
        return
      }
      let trialTime = parseInt(userInfo.value.trialtime)
      timer.value = setInterval(() => {
        const now = new Date()
        const end = parseInt(userInfo.value.expiretime)
        if (end < now) {
          store.commit('user/SET_ONTRIAL', false)
          clearInterval(timer.value)
          timer.value = null
        } else {
          const toDay = parseInt(trialTime / 1000 / 60 / 60 / 24)
          const toHours = parseInt((trialTime / 1000 / 60 / 60) % 24)
          const toMinutes = parseInt((trialTime / 1000 / 60) % 60)
          const toSeconds = parseInt((trialTime / 1000) % 60)
          str.value = `${toDay}天${toHours}时${toMinutes}分${toSeconds}秒`
          loading.value = false
          trialTime += 1000
        }
      }, 1000)
    }
    const closeTip = () => {
      clearInterval(timer.value)
      timer.value = null
      store.commit('user/SET_ONTRIAL', false)
    }
    onMounted(() => {
      countdown()
    })
    onBeforeUnmount(() => {
      clearInterval(timer.value)
      timer.value = null
    })
    return {
      userInfo,
      str,
      loading,
      endTime: computed(() => dayjs(parseInt(userInfo.value.expiretime)).format('YYYY年MM月DD日 HH:mm')),
      closeTip,
      countdown
    }
  }
}
</script>

<style lang="scss" scoped></style>
