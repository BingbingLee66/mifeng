<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <!-- app -->
    <div class="Present-img" v-if="type === SYNC_CHANNELS_ID.APP">
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
        <div class="characters stencil-onhiden" v-html="demonstrate" />
      </div>
    </div>
    <!-- 短信 -->
    <div v-else-if="type === SYNC_CHANNELS_ID.NOTE" class="Present-img">
      <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-note.png" class="pic" @load="imgLoad" />
      <div class="Present-note" v-html="demonstrate" />
    </div>
    <!-- 订阅 -->
    <div v-else class="Present-img">
      <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-subscribe.png" />
      <div class="subscribe-wire" />
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
        <div class="subscribe-middle">
          <div class="subscribe-prosperity">报名成功通知</div>
          <div
            v-for="(item, index) in infoData &&
            infoData.keyValueNoticeTemplateSetVo &&
            infoData.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList"
            :key="index"
            class="subscribe-circularize"
          >
            <div class="circularize-matter">{{ item.key }}</div>
            <div class="circularize-designation">
              <div v-if="active == 1" class="designation-variable">【{{ item.value }}】</div>
              <div v-else class="designation-variable">【{{ item.value.value }}】</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { SYNC_CHANNELS_ID } from '@/constant/mass-notification'
const props = defineProps({
  infoData: {
    type: Object
  },
  /** 1:模板库 2：模板设置 */
  active: {
    type: Number,
    default: 2
  },
  /** app or note or subscibe */
  type: {
    type: String,
    required: true
  },
  /** 订阅预览内容 */
  variableAttributes: {
    type: Array,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: []
  }
})
const demonstrate = ref('')
/** 把字符串里面特殊符号${}  加上红色标识 */
const analysis = vlue => {
  const regx = /\$.*?\}/g
  const arr = vlue.match(regx)
  arr.forEach(item => {
    // eslint-disable-next-line no-param-reassign
    if (props.active === 1) vlue = vlue.replace(item, `<span style="color:red">${item}</span>`)
    else {
      // eslint-disable-next-line no-param-reassign
      item = item.replace('${', '').replace('}', '')
      props.infoData.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList.forEach(j => {
        if (item === j.key) {
          // eslint-disable-next-line no-param-reassign
          vlue = vlue
            .replace(item, `<span style="color:red">【${j.value.value}】</span>`)
            .replace('${', '')
            .replace('}', '')
        }
      })
    }
  })
  return vlue
}
watch(
  () => props.infoData,
  n => {
    if (!n) return
    const a = n.content.indexOf('${')
    demonstrate.value = a >= 0 ? analysis(n.content) : n.content
  },
  {
    immediate: true,
    deep: true
  }
)
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
