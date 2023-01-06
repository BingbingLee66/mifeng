<template>
  <el-dialog :visible="visible" title="分享" width="500px" v-bind="$attrs" v-on="$listeners">
    <div v-loading="loading">
      <div style="margin-bottom:20px;" class="flex-x">
        <div class="shrink-0 ml-10">链接</div>
        <div>{{ curShareInfo.link }}</div>
        <div class="shrink-0 ml-10 text-blue" @click="onCopy">复制</div>
      </div>
      <div class="flex-x">
        <div class="shrink-0 ml-10">二维码</div>
        <div>
          <img class="qrcode" :src="curShareInfo.qrcode">
        </div>
        <div class="shrink-0 ml-10 text-blue" @click="onDownload">下载</div>
      </div>
    </div>
    <el-button slot="footer" type="primary" @click.stop="$emit('update:visible',!visible)">关闭</el-button>
  </el-dialog>
</template>

<script>
import { getQrCode } from '@/api/quest-survey'
import { downloadFile } from '@/utils'
export default {
  components: {},
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    questionnaireId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      shareMap: {}
    }
  },
  computed: {
    curShareInfo() {
      const { shareMap, questionnaireId } = this
      return shareMap[questionnaireId] || {}
    }
  },
  watch: {
    questionnaireId: {
      handler() {
        this.getShareInfo()
      },
      immediate: true
    },
    visible: {
      handler() {
        this.getShareInfo()
      },
      immediate: true
    },
  },
  methods: {
    async getShareInfo() {
      const { questionnaireId, shareMap, visible } = this
      if (!visible || !questionnaireId || this.loading) return
      this.loading = true
      try {
        if (shareMap[questionnaireId]) return
        const { data: { questionnaireCode, questionnaireUrl } } = await getQrCode({ questionnaireId })
        this.$set(shareMap, questionnaireId, {
          link: questionnaireUrl,
          qrcode: questionnaireCode
        })
      } finally {
        this.loading = false
      }
    },
    async onCopy() {
      try {
        await this.$copyText(this.curShareInfo.link)
        this.$message.success('复制成功')
      } catch (error) {
        this.$message.error('复制失败')
      }
    },
    onDownload() {
      downloadFile({ url: this.curShareInfo.qrcode, title: '二维码' })
    }
  },
}
</script>

<style lang="scss" scoped>
.shrink-0 {
  flex-shrink: 0;
}

.text-blue {
  cursor: pointer;
}

.qrcode {
  width: 200px;
  height: 200px;
}
</style>
