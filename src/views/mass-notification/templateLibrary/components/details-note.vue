<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <!-- 短信 -->
    <div class="Present-img">
      <img src="https://ysh-cdn.kaidicloud.com/prod/png/library-note.png" class="pic" />
      <div class="Present-note" v-html="demonstrate" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    infoDate: {
      type: Object
    },
    active: {
      type: Number,
      default: 2
    } // 1:模板库 2：模板设置
  },
  data() {
    return {
      demonstrate: ''
    }
  },
  watch: {
    infoDate: {
      handler(n) {
        if (!n) return

        const a = n.content.indexOf('${')
        if (a >= 0) this.demonstrate = this.analysis(n.content)
        else this.demonstrate = n.content
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 把字符串里面特殊符号${}  加上红色标识
    analysis(vlue) {
      const regx = /\$.*?\}/g
      const arr = vlue.match(regx)

      arr.forEach(item => {
        // eslint-disable-next-line no-param-reassign
        if (this.active === 1) vlue = vlue.replace(item, `<span style="color:red">${item}</span>`)
        else {
          // eslint-disable-next-line no-param-reassign
          item = item.replace('${', '').replace('}', '')
          this.infoDate.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList.forEach(j => {
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
  }
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
}
img {
  width: 100%;
  height: 100%;
}
</style>
