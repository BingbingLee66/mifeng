<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="onTrial" class="countdown-wrapper">
      <div class="countdown-tip">
        <span><i class="el-icon-warning" style="color: #faad14" /> 已试用{{ str }}，将于{{
          endTime
        }}到期，如需延长期限，请与商务联系。</span>
        <span class="close-icon"><i class="el-icon-close" @click="closeTip" /> </span>
      </div>
    </div>

    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" :class="{ onTrial: onTrial }" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      str: '',
      timer: null,
      loading: true
    }
  },
  computed: {
    ...mapGetters(['expireTime', 'createTime', 'onTrial', 'trialTime']),
    endTime() {
      return dayjs(parseInt(this.expireTime)).format('YYYY年MM月DD日 HH:mm')
    },
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    needTagsView() {
      return this.$store.state.settings.tagsView
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  activated() {
    this.countdown()
  },
  deactivated() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    closeTip() {
      clearInterval(this.timer)
      this.$store.commit('user/SET_ONTRIAL', false)
    },
    countdown() {
      if (!this.onTrial) {
        return
      }
      let trialTime = parseInt(this.trialTime)
      this.timer = setInterval(() => {
        const now = new Date()
        const end = parseInt(this.expireTime)
        const time = trialTime
        if (end < now) {
          this.$store.commit('user/SET_ONTRIAL', false)
          clearInterval(this.timer)
          this.timer = null
        } else {
          const toDay = parseInt(time / 1000 / 60 / 60 / 24)
          const toHours = parseInt((time / 1000 / 60 / 60) % 24)
          const toMinutes = parseInt((time / 1000 / 60) % 60)
          const toSeconds = parseInt((time / 1000) % 60)
          this.str = `${toDay}天${toHours}时${toMinutes}分${toSeconds}秒`
          this.loading = false
          trialTime += 1000
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
.countdown-wrapper{
 height: 30px;
 position: relative;
}
.countdown-tip {
  width: 100%;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 30px;
  z-index: 100;
  text-align: center;
  position: fixed;
  .close-icon {
    position: absolute;
    right: 20px;
  }
}
.sidebar-container.onTrial {
  top: 30px !important;
}
</style>
