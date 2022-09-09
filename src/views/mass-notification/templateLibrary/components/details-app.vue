<template>
  <div>
    <!-- app -->
    <div class="Present-img">
      <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-app.png" class="pic">
      <div class="Present-app">
        <div class="subscribe-top">
          <div class="commerce">
            <div class="subscribe-img">
              <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-icon.png" alt="">
            </div>
            <div style="margin-top: 3px">云商会 Solink</div>
          </div>
          <div class="dot">now</div>
        </div>
        <!-- 内容 -->
        <div>通知</div>
        <div class="characters stencil-onhiden" v-html="demonstrate" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    demonstrate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style scoped lang="scss">
.Present-img {
  width: 255px;
  height: 300px;
  margin: 0 auto;
  position: relative;
  .Present-note {
    position: absolute;
    top: 93px;
    left: 25px;
    width: 80%;
    background: #e9e9ea;
    color: #222222;
    padding: 10px;
    border-radius: 12px;
  }
  .subscribe-wire {
    position: absolute;
    top: 73px;
    left: 18px;
    width: 83%;
    height: 1px;
    border: 1px solid #f0eded;
    z-index: 10;
  }
  .Present-subscribe {
    position: absolute;
    top: 35px;
    left: 25px;
    width: 80%;
    background: #ffffff;
    padding: 10px;
    .subscribe-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .commerce {
        font-size: 12px;
        font-weight: 600;
        width: 80%;
        display: flex;
        .subscribe-img {
          width: 17px;
          height: 17px;
          margin-right: 5px;
        }
      }
      .dot {
        width: 13px;
        height: 3px;
        margin-top: -19px;
      }
    }
    .subscribe-middle {
      font-size: 11px;
      margin-top: 30px;
      color: #222222;
      .subscribe-prosperity {
        margin-bottom: 15px;
      }
      .subscribe-circularize {
        display: flex;
        align-content: center;
        margin-bottom: 5px;
        .circularize-matter {
          color: #999999;
          width: 29%;
        }
        .circularize-designation {
          color: #d01a33;
          width: 70%;
          display: flex;
          flex-wrap: wrap;
        }
      }
    }
  }
  .Present-app {
    position: absolute;
    top: 147px;
    left: 25px;
    width: 80%;
    background-image: url(https://ysh-cdn.kaidicloud.com/prod/png/library-inform.png);
    background-size: 100% 100%;
    color: #fff;
    font-size: 12px;
    padding: 10px;
    .subscribe-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      .commerce {
        font-size: 12px;
        font-weight: 600;
        width: 80%;
        display: flex;
        .subscribe-img {
          width: 17px;
          height: 17px;
          margin-right: 5px;
        }
      }
      .dot {
        width: 20%;
      }
    }
    .characters {
      margin-top: 5px;
    }
    .stencil-onhiden {
      overflow: hidden;
      text-overflow: ellipsis; /* 超出部分省略号 */
      word-break: break-all; /* break-all(允许在单词内换行。) */
      display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
      -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
      -webkit-line-clamp: 5; /* 显示的行数 */
    }
  }
}
img {
  width: 100%;
  height: 100%;
}
</style>
