<template>
  <div v-if="isShow" class="news-container">
    <div class="arrow" />
    <div class="news-top">
      <div>您收到一条平台消息</div>
      <i class="el-icon-close" @click="hide" />
    </div>
    <div class="news-bottom">
      <div class="news-characters">
        {{ info.title }}
      </div>
      <div class="news-btn" @click.stop="examine"><el-button size="mini" type="primary">查看</el-button></div>
    </div>
  </div>
</template>

<script>
import { readStationMail } from '@/api/mass-notification/index'
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    info: {
      type: Object,
      value: () => {},
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  watch: {
    'show'(v) {
      this.isShow = v
    }
  },

  methods: {
    hide() {
      this.isShow = false
    },
    // 点击查看跳转
    async examine() {
      await readStationMail({ id: this.info.id })
      this.$router.push({
        name: '站内信详情',
        params: {
          id: this.info.gsId,
        }
      })
      this.hide()
    }
  }
}
</script>

<style lang="scss" scoped>
.news-container{
  position: relative;
  color: #606266;
  background: #fff;
  width: 250px;
  min-height: 100px;
  font-size: 14px;
  word-break: break-all;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  z-index: 100;
  line-height: 1;
  box-shadow: 0px 2px 10px 0 rgba(0, 0, 0, .2);
  .news-top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    border-bottom: 1px solid #e9e9e9;
    padding: 0 10px;
    height: 34px;
    .el-icon-close{
      cursor: pointer;
      font-size: 17px;
    }
  }
  .news-bottom{
    padding: 10px;
    .news-characters{
      overflow: hidden;
      text-overflow: ellipsis;  /* 超出部分省略号 */
      word-break: break-all;  /* break-all(允许在单词内换行。) */
      display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
      -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
      -webkit-line-clamp: 4; /* 显示的行数 */
      margin-bottom: 10px;
      line-height: 17px;
    }
    .news-btn{
      width: 100%;
      text-align: right;
    }
  }
  .arrow{
    position: absolute;
    top: -11px;
    left: 99px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 13px solid #fff;
  }
}
</style>
