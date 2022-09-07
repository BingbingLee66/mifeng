<template>
  <el-dialog ref="form" :visible="visible" title="详情" width="60%" @close="close">
    <!-- 短信 -->
    <div v-if="type == 1" class="container">
      <div class="container-left">
        <div class="Present-img">
          <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-note.png" class="pic" />
          <div class="Present-note" v-html="infoDate.demonstrate"></div>
        </div>
      </div>
      <div class="container-right">
        <div class="offside">
          <div class="offside-stencil">模板类型</div>
          <div class="details">{{ infoDate.type == 1 ? '短信通知' : infoDate.type == 2 ? '订阅消息' : 'APP通知' }}</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">模板名称</div>
          <div class="details">{{ infoDate.templateName }}</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">模板CODE</div>
          <div class="details">{{ infoDate.templateCode }}</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">模板内容</div>
          <div class="details">{{ infoDate.content }}</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">变量属性</div>
          <div v-if="infoDate.smsNoticeTemplateVo" class="details">
            <div
              v-for="(item, index) in infoDate.smsNoticeTemplateVo.variableAttributes"
              :key="index"
              class="details-box"
            >
              <div>{{ item.key }}</div>
              <div v-if="item.value">- {{ item.value }}</div>
            </div>
          </div>
        </div>
        <div class="offside">
          <div class="offside-stencil">场景链接</div>
          <div v-if="infoDate.smsNoticeTemplateVo" class="details">{{ infoDate.smsNoticeTemplateVo.link }}</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">场景说明</div>
          <div v-if="infoDate.smsNoticeTemplateVo" class="details">
            {{ infoDate.smsNoticeTemplateVo.sceneDescription }}
          </div>
        </div>
        <div class="offside">
          <div class="offside-stencil">创建时间</div>
          <div class="details">{{ infoDate.createdTs | dateFormat }}</div>
        </div>
        <div v-if="active == 2" class="offside">
          <div class="offside-stencil">模板备注</div>
          <div class="details">{{ infoDate.templateRemark }}</div>
        </div>
      </div>
    </div>
    <!-- 订阅 -->
    <div v-if="type == 2" class="container">
      <div class="container-left">
        <div class="Present-img">
          <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-subscribe.png" />
          <div class="subscribe-wire"></div>
          <div class="Present-subscribe">
            <div class="subscribe-top">
              <div class="commerce">
                <div class="subscribe-img">
                  <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-icon.png" alt="" />
                </div>
                <div style="margin-top: 3px">云商会 Solink</div>
              </div>
              <div class="dot"><img src="https://ysh-cdn.kaidicloud.com/prod/png/library-more.png" alt="" /></div>
            </div>

            <!-- 内容 -->
            <div v-if="infoDate.subscriptionNoticeTemplateVo" class="subscribe-middle">
              <div class="subscribe-prosperity">报名成功通知</div>
              <div
                v-for="(item, index) in infoDate.subscriptionNoticeTemplateVo.variableAttributes"
                :key="index"
                class="subscribe-circularize"
              >
                <div class="circularize-matter">{{ item.key }}</div>
                <div class="circularize-designation">
                  <div class="designation-variable">【{{ item.value2 }}】</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-right">
        <div class="offside">
          <div class="offside-stencil">模板ID</div>
          <div class="details">{{ infoDate.templateCode }}</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">模板编号</div>
          <div class="details">{{ infoDate.id }}</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">标题</div>
          <div class="details">{{ infoDate.templateName }}</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">类目</div>
          <div v-if="infoDate.subscriptionNoticeTemplateVo" class="details">
            {{ infoDate.subscriptionNoticeTemplateVo.category }}
          </div>
        </div>
        <div class="offside">
          <div class="offside-stencil">操作人</div>
          <div class="details">{{ infoDate.creator }}</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">详细内容</div>
          <div v-if="infoDate.subscriptionNoticeTemplateVo" class="details">
            <div
              v-for="(item, index) in infoDate.subscriptionNoticeTemplateVo.variableAttributes"
              :key="index"
              class="details-box"
            >
              <div>{{ item.key }}</div>
              <div v-if="item.value">- {{ item.value }}</div>
            </div>
          </div>
        </div>
        <div class="offside">
          <div class="offside-stencil">场景说明</div>
          <div v-if="infoDate.subscriptionNoticeTemplateVo" class="details">
            {{ infoDate.subscriptionNoticeTemplateVo.sceneDescription }}
          </div>
        </div>
        <div v-if="active == 2" class="offside">
          <div class="offside-stencil">模板备注</div>
          <div class="details">{{ infoDate.templateRemark }}</div>
        </div>
      </div>
    </div>
    <!-- app -->
    <div v-if="type == 3" style="height: 320px" class="container">
      <div class="container-left">
        <div class="Present-img">
          <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-app.png" class="pic" />
          <div class="Present-app">
            <div class="subscribe-top">
              <div class="commerce">
                <div class="subscribe-img">
                  <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-icon.png" alt="" />
                </div>
                <div style="margin-top: 3px">云商会 Solink</div>
              </div>
              <div class="dot">now</div>
            </div>
            <!-- 内容 -->
            <div>通知</div>
            <div class="characters stencil-onhiden" v-html="infoDate.demonstrate"></div>
          </div>
        </div>
      </div>
      <div class="container-right">
        <div class="offside">
          <div class="offside-stencil">标题</div>
          <div class="details">{{ infoDate.templateName }}</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">模板内容</div>
          <div class="details">{{ infoDate.content }}</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">链接</div>
          <div v-if="infoDate.appNoticeTemplateVo" class="details">{{ infoDate.appNoticeTemplateVo.link }}</div>
        </div>
        <div v-if="active == 2" class="offside">
          <div class="offside-stencil">变量属性</div>
          <div v-if="infoDate.appNoticeTemplateVo" class="details">
            <div
              v-for="(item, index) in infoDate.appNoticeTemplateVo.variableAttributes"
              :key="index"
              class="details-box"
            >
              <div>{{ item.key }}</div>
              <div v-if="item.value">- {{ item.value }}</div>
            </div>
          </div>
        </div>
        <div v-if="active == 2" class="offside">
          <div class="offside-stencil">所属类型</div>
          <div class="details">{{ noticeTypeId[infoDate.noticeTypeId] }}</div>
        </div>
        <div class="offside">
          <div class="offside-stencil">创建时间</div>
          <div class="details">{{ infoDate.createdTs | dateFormat }}</div>
        </div>
        <div v-if="active == 2" class="offside">
          <div class="offside-stencil">模板备注</div>
          <div class="details">{{ infoDate.templateRemark }}</div>
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
    type: {
      type: String,
      default: ''
    }, // type   1:短信 2：消息订阅  3：app
    active: {
      type: Number,
      default: null
    } // 1:模板库 2：模板设置
  },
  data() {
    return {
      visible: false,
      infoDate: {
        demonstrate: '',
        subscriptionNoticeTemplateVo: {},
        smsNoticeTemplateVo: {},
        appNoticeTemplateVo: {},
        keyValueNoticeTemplateSetVo: {}
      },
      noticeTypeId: ['', '缴费通知', '活动通知', '招商活动', '邀请入会', '自定义通知']
    }
  },

  methods: {
    // 显示
    async show(res) {
      this.visible = true
      this.infoDate = res.data
      //   短信和app
      if (this.type !== '2' && res.data.content) {
        let a = res.data.content.indexOf('${')
        if (a >= 0) this.infoDate.demonstrate = this.analysis(res.data.content)
        else this.infoDate.demonstrate = res.data.content
      }
      //  订阅消息
      if (res.data && this.type === '2' && res.data.subscriptionNoticeTemplateVo) {
        res.data.subscriptionNoticeTemplateVo.variableAttributes.forEach(v => {
          v.value2 = v.value
          if (v.value2.length >= 17) {
            v.value2 = v.value2.substring(0, 17) + '...'
          }
        })
      }
    },
    // 把字符串里面特殊符号${}  加上红色标识
    analysis(vlue) {
      const regx = /\$.*?\}/g
      const arr = vlue.match(regx)

      arr.forEach(item => {
        if (this.active === 1) vlue = vlue.replace(item, `<span style="color:red">${item}</span>`)
        else {
          item = item.replace('${', '').replace('}', '')
          this.infoDate.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList.forEach(j => {
            if (item === j.key) {
              vlue = vlue
                .replace(item, `<span style="color:red">【${j.value.value}】</span>`)
                .replace('${', '')
                .replace('}', '')
            }
          })
        }
      })
      return vlue
    },
    // 关闭
    close() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  .container-left {
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
  }
  .container-right {
    width: 55%;
    .offside {
      display: flex;
      align-content: center;
      margin-bottom: 20px;
      .offside-stencil {
        width: 14%;
        font-weight: bold;
      }
      .details {
        width: 85%;
        .details-box {
          display: flex;
          align-items: center;
          margin-bottom: 7px;
        }
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
