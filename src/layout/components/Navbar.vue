<template>
  <div class="navbar flex-x">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="login-name flex-x">
      <a class="help" href="https://www.yuque.com/yunshanghuisolink/help" target="_blank">
        帮助文档
      </a>
      <!-- 商会后台显示铃铛 -->
      <div v-if="ckey" class="inform">
        <span @click="goMail">
          <el-badge :value="count" :hidden="hidden" :max="99">
            <i class="el-icon-message-solid" />
          </el-badge>
        </span>

        <div class="inform-news">
          <News :show="isShow" :info="info" />
        </div>
      </div>

      <img src="../../../public/img/chamber-icon.png" alt="">
      <span class="info-name">{{ chamberName ? chamberName : '凯迪云商会总后台管理系统' }}</span>
      <img src="../../../public/img/manager-icon.png" alt="">
      <span class="info-name">{{ name }}</span>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="systemLogo ? systemLogo : imgUrl">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/account/profile">
            <el-dropdown-item>个人资料</el-dropdown-item>
          </router-link> -->
          <router-link to="/account/updatePwd">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display: block" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import imgUrl from '@/assets/img/avatar.gif'
import News from './News/index.vue'
import { newNoRead, stationMailDing } from '@/api/mass-notification/index'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    News
  },
  data() {
    return {
      user: {},
      imgUrl,
      isShow: false, // 显示最新消息
      timer: null, // 消息铃铛定时器
      info: {}, // 消息
      gsId: '', // 站内信最新数据id
      count: 0, // 消息通知数量
      hidden: true // count > 0  false =显示
      // systemLogo: !this.$store.getters.systemLogo ? imgUrl : this.$store.getters.systemLogo
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name', 'systemLogo', 'chamberName', 'roles', 'ckey'])
  },
  watch: {
    ckey() {
      this.onDing()
      this.gsId = ''
    }
  },
  // 页面销毁
  mounted() {
    this.onDing()
  },

  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // 退出时清除所有tab
      this.$store.dispatch('tagsView/delAllViews')
      this.$router.push('/login')
    },
    // 跳转站内信
    goMail() {
      this.$router.push('/sms/mail')
    },
    fetchData() {},
    // 显示铃铛数量
    async onDing() {
      clearInterval(this.timer)
      if (!this.ckey) return
      this.hidden = true // s是否展示铃铛数量  true = 不展示  false = 展示
      this.isShow = false
      const res = await stationMailDing()
      this.count = typeof(res.data) === 'number' ? res.data : 0
      this.timer = setTimeout(this.onDing, 30000)
      if (res.data && res.data > 0) {
        this.hidden = false
        this.onNewNoRead()
      }
    },
    // 站内信通知
    async onNewNoRead() {
      const res = await newNoRead()
      this.info = res.data || {}
      if (res.data && res.data.title && res.data.gsId !== this.gsId) {
        this.isShow = true
        this.gsId = res.data.gsId
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.inform {
  font-size: 20px;
  width: 20px;
  vertical-align: middle;
  color: #1890ff;
  margin-right: 40px;
  position: relative;
  flex-shrink: 0;
  /deep/ .el-badge__content.is-fixed {
    top: 10px;
  }
  .inform-news {
    position: absolute;
    // bottom: -43px;
    right: -128px;
  }
}

.login-name {
  flex: 1;
  margin-right: 20px;
  font-size: 16px;
  font-family: PingFangSC-Regular;
  color: #333333;
  justify-content: end;
  align-items: center;

  img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }

  .info-name {
    max-width: 80%;
    @include ellipsis(1);
    margin-right: 30px;

    &:last-child {
      margin-right: 0;
    }
  }
}

.help {
  flex-shrink: 0;
  color: #40A9FF;
  margin-right: 52px;
}

.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  overflow: hidden;

  .hamburger-container {
    padding: 0 10px;
    flex-shrink: 0;
  }

  .breadcrumb-container {
    flex-shrink: 0;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    flex-shrink: 0;
    height: 100%;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }

    .screenfull {
      height: 20px;
    }

    .international {
      vertical-align: top;
    }

    .theme-switch {
      vertical-align: 15px;
    }

    .avatar-container {
      height: 50px;
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
