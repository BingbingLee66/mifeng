<template>
  <div>
    <!-- v-model:visible="saveVisible" -->
    <a-modal :visible="saveVisible" title="已保存" width="30%" @cancel="close">
      <div>
        <div class="save-msg">
          当前问卷处于草稿状态，您可以扫码或者复制链接到微信预览。 问卷发布后，参与者可提交答卷，是否立即发布？
        </div>
        <a-card class="save-content">
          <div class="link flex-x-0-center">
            链接: {{ link }} <a-button class="link-btn" type="link" @click="copyText(link)">复制</a-button>
          </div>
          <div class="flex-x-0-center">
            二维码:<img :src="code" class="code" /><a-button type="link" class="link-btn" @click="download"
              >下载</a-button
            >
          </div>
        </a-card>
      </div>
      <template #footer>
        <a-button @click="router.push({ path: '/quest-survey/manager' })">暂时不用</a-button>
        <a-button type="primary" @click="updateStateFunc">立即发布</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { message, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { downloadByBlob } from '@/views/activity/util'
import { updateState, getQrCodeByMiF } from '@/api/quest-survey/index'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  props: {
    saveVisible: {
      type: Boolean,
      default: false
    },
    questionId: {
      type: String,
      default: ''
    },
    questionnaireTitle: {
      type: String,
      default: ''
    },
    ckey: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const link = ref()
    const code = ref()
    const close = () => {
      emit('update:saveVisible', false)
    }
    const router = useRouter()
    const copyText = copyText => {
      const text = document.createElement('textarea') // 创建节点
      text.setAttribute('readonly', 'readonly')
      text.value = copyText // 赋值
      document.body.appendChild(text) // 插入节点
      text.setSelectionRange(0, text.value.length)
      text.select() // 选中节点
      document.execCommand('copy') // 执行浏览器复制方法
      if (document.body.removeChild(text)) {
        message.success('复制成功')
      } else {
        message.error('复制失败')
      }
    }
    const download = () => {
      downloadByBlob(code.value, '二维码')
    } // 请求类
    // 获取分享链接和二维码
    const getQrCodeFunc = async questionId => {
      const {
        data: { questionnaireCode, questionnaireUrl }
      } = await getQrCodeByMiF({ questionnaireId: questionId })
      link.value = questionnaireUrl
      code.value = questionnaireCode
    }
    // 问卷发布
    const updateStateFunc = async () => {
      const params = {
        operateType: 2,
        questionnaireId: props.questionId,
        state: 1
      }
      const { data } = await updateState(params)

      Modal.confirm({
        title: () => '已发布',
        content: () => '问卷已发布，您可以立即发短信通知会员填写问卷',
        okText: () => '短信通知',
        cancelText: () => '暂时不用',
        centered: 'true',
        onOk() {
          // 去到《创建群发通知》页面
          router.push({
            path: '/mass-notification/create',
            query: {
              type: 9,
              questionnaireId: props.questionId || data,
              questionnaireTitle: props.questionnaireTitle
            }
          })
        },
        onCancel() {
          // 去到问卷管理页面
          router.push({ path: '/quest-survey/manager' })
        }
      })
    }
    return {
      router,
      link,
      code,
      copyText,
      download,
      updateStateFunc,
      getQrCodeFunc,
      close
    }
  }
})
</script>
<style lang="scss" scoped>
.save-msg {
  padding-bottom: 10px;
}
.link {
  margin-bottom: 25px;
}
.link-btn {
  margin-left: 10px;
}
.code {
  width: 100px;
  height: 100px;
}
</style>
