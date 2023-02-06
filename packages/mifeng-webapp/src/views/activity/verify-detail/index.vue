<template>
  <ActivityMsg @activityInfo="setActivity" />
  <SignInTable :activity="activity" :init-status="initStatus" />
</template>
<script>
import ActivityMsg from './components/ActivityMsg.vue'
import SignInTable from './components/SignInTable.vue'
// import { getChamberActivityInfoById } from '@/api/activity/activity-verify-new'
import { useRoute } from 'vue-router'
import { reactive } from 'vue'
export default {
  components: {
    ActivityMsg,
    SignInTable
  },
  setup() {
    const route = useRoute()
    const activity = reactive({
      seating: '',
      id: route.query.activityId
    })
    const setActivity = value => {
      Object.assign(activity, value)
    }
    return {
      activity,
      setActivity,
      initStatus: route.query.status + ''
    }
  }
}
</script>
