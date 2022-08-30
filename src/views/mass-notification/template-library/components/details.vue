<template>
  <el-dialog ref="form" :visible="visible" title="通知详情" width="60%" @close="close">
    <!-- 短信 -->
    <div v-if="activeName == 1" class="content">
      <div class="content-left">
        <div class="Present-img">
          <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-note.png" class="pic" />
          <div class="Present-note">亲爱的【会员姓名】诚挚邀请您加入【商协会名称】,期待您于</div>
        </div>
      </div>
      <div class="content-right">
        <div class="offside">
          <div class="offside-stencil">模板ID</div>
          <div class="details">FJIhJ3AL8MXiuz4LoGSK5QkmZlbcnt7Bsl173JZnVIA</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">标题</div>
          <div class="details">活动开始通知</div>
        </div>
      </div>
    </div>
    <!-- 订阅 -->
    <div v-if="activeName == 2" class="content">
      <div class="content-left">
        <div class="Present-img">
          <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-subscribe.png" />
          <div class="subscribe-wire"></div>
          <div class="Present-subscribe">
            <div class="subscribe-top">
              <div class="commerce">
                <div class="subscribe-img">
                  <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-icon.png" alt="" />
                </div>
                <div style="margin-top:3px">云商会 Solink</div>
              </div>
              <div class="dot"><img src="https://ysh-cdn.kaidicloud.com/prod/png/library-more.png" alt="" /></div>
            </div>

            <!-- 内容 -->
            <div class="subscribe-middle">
              <div class="subscribe-prosperity">报名成功通知</div>
              <div class="subscribe-circularize">
                <div class="circularize-matter">活动内容</div>
                <div class="circularize-designation">【活动名称】</div>
              </div>
              <div class="subscribe-circularize">
                <div class="circularize-matter">活动</div>
                <div class="circularize-designation">【活动地址】</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="offside">
          <div class="offside-stencil">模板ID</div>
          <div class="details">FJIhJ3AL8MXiuz4LoGSK5QkmZlbcnt7Bsl173JZnVIA</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">标题</div>
          <div class="details">活动开始通知</div>
        </div>
      </div>
    </div>
    <!-- app -->
    <div v-if="activeName == 3" style="height:320px" class="content">
      <div class="content-left">
        <div class="Present-img">
          <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-app.png" class="pic" />
          <div class="Present-app">
            <div class="subscribe-top">
              <div class="commerce">
                <div class="subscribe-img">
                  <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-icon.png" alt="" />
                </div>
                <div style="margin-top:3px">云商会 Solink</div>
              </div>
              <div class="dot">now</div>
            </div>
            <!-- 内容 -->
            <div>邀请入会通知</div>
            <div class="characters">邀请入会通知邀请入会通知邀请入会通知邀请入会通知</div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="offside">
          <div class="offside-stencil">模板ID</div>
          <div class="details">FJIhJ3AL8MXiuz4LoGSK5QkmZlbcnt7Bsl173JZnVIA</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">标题</div>
          <div class="details">活动开始通知</div>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button type="primary" @click="close">我知道了</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Details',
  props: {
    activeName: {
      type: String,
      default: ''
    } // activeName   1:短信 2：消息订阅  3：app
  },
  data() {
    return {
      visible: false
    }
  },

  methods: {
    // 显示
    show() {
      this.visible = true
      console.log('activeName', this.activeName)
    },

    // 关闭
    close() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  .content-left {
    width: 45%;
    position: relative;
    .Present-img {
      width: 255px;
      height: 300px;
      margin: 0 auto;
      position: relative;
      .Present-note {
        position: absolute;
        top: 93px;
        left: 25px;
        width: 75%;
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
              overflow: hidden;
              text-overflow: ellipsis; /* 超出部分省略号 */
              word-break: break-all; /* break-all(允许在单词内换行。) */
              display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
              -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
              -webkit-line-clamp: 2; /* 显示的行数 */
              max-height: 80rpx; /* 设置最大高度，根据行高，要几行乘以几倍 */
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
      }
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .content-right {
    width: 55%;
    .offside {
      display: flex;
      align-content: center;
      margin-bottom: 20px;
      .offside-stencil {
        width: 12%;
        font-weight: bold;
      }
      .details {
        width: 85%;
      }
    }
  }
}
.dialog-footer {
  width: 100%;
  text-align: center;
  margin-top: 10px;
}
</style>
