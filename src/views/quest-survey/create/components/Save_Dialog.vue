<template>
  <div>
    <el-dialog
      title="已保存"
      :visible.sync="saveVisible"
      width="30%"
      :before-close="close"
    >
      <div>
        <div class="save-msg">当前问卷处于草稿状态，您可以扫码或者复制链接到微信预览。
          问卷发布后，参与者可提交答卷，是否立即发布？</div>
        <el-card class="box-card save-content">
          <div class="link flex-x-0-center"> 链接: {{ link }}  <el-link class="link-btn" type="primary" @click="copyText(link)">复制</el-link></div>
          <div class="flex-x-0-center">二维码:<img :src="code" class="code"><el-link type="primary" class="link-btn" @click="download">下载</el-link></div>

        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$router.push({ path: '/quest-survey/manager' })">暂时不用</el-button>
        <el-button type="primary" @click="updateState">立即发布</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { downloadByBlob } from '@/views/activity/util'
import { updateState } from '@/api/quest-survey/index'
export default {
  props: {
    saveVisible: {
      type: Boolean,
      value: false,
    },
    questionId: {
      type: Number,
      value: 1
    }
  },
  data() {
    return { questionnaireId: null, link: 'xxxxxxxxxxxxxxxxxxsssss发发发发发', code: 'http://localhost:9528/static/img/logo@2x.7687838b.png' }
  },
  methods: {
    close() {
      this.$emit('update:showSaveDialog', false)
    },
    copyText(copyText) {
      const text = document.createElement('textarea') // 创建节点
      text.setAttribute('readonly', 'readonly')
      text.value = copyText // 赋值
      document.body.appendChild(text) // 插入节点
      text.setSelectionRange(0, text.value.length)
      text.select() // 选中节点
      document.execCommand('copy') // 执行浏览器复制方法
      if (document.body.removeChild(text)) {
        this.$message({ type: 'success', message: '复制成功' })
      } else {
        this.$message({ type: 'error', message: '复制失败' })
      }
    },
    download() { downloadByBlob(this.code, '二维码') },

    // 请求类
    // 问卷发布
    async updateState() {
      const { questionnaireId } = this
      const params = {
        operateType: 1,
        questionnaireId,
        state: 1
      }
      const self = this
      const res = await updateState(params)
      if (res.state === 1) {
        self.$confirm('问卷已发布，您可以立即发短信通知会员填写问卷', '', {
          confirmButtonText: '短信通知',
          cancelButtonText: '暂时不用',
          type: 'warning'
        }).then(() => {
        // 去到《创建群发通知》页面
          self.$router.push({ name: 'create' })
        }).catch(() => {
        // 去到问卷管理页面
          self.$router.push({ path: '/quest-survey/manager' })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.save-msg{
  padding-bottom: 10px;
}
.link{
 margin-bottom: 25px;
}
.link-btn{
  margin-left: 10px;
}
.code{
  width: 100px;
  height: 100px;
}
</style>
