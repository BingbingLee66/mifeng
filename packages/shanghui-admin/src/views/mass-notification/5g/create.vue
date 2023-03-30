<template>
  <Panel>
    <div class="app-container flex-x">
      <div class="card flex-1">
        <div class="card-title">新建5G彩信模版</div>
        <div class="tips">
          <div class="tip-title">温馨提示</div>
          <div class="tip">1、短信内容中必须有文字，不能只放视频、图片</div>
          <div class="tip">
            2、发布图片、视频各一个，模板总大小：
            <span class="high-light">1.9M内</span>
          </div>
          <div class="tip">3、标题字数不能超15个（标点、空格 都算1个字数）</div>
          <div class="tip">
            4、视频格式要求：视频格式：
            <span class="high-light"> MPEG-4、3GP</span>
            ，视频编码：
            <span class="high-light">H.264</span>
          </div>
          <div class="tip">
            5、提交审核后，预计在
            <span class="high-light">3-5天</span>
            内完成审核。若视频或者链接中包含较复杂逻辑或其他特殊情况，可能会导致审核时间延长。
          </div>
        </div>
        <div class="flex-y-center">
          <div class="actions flex-x">
            <img
              class="action"
              :src="useImgUrlAdmin('test/5g/text-btn.png')"
              @click="templateModel.list.push({ value: '', type: 'text' })"
            />
            <a-upload
              action="#"
              :showUploadList="false"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              :before-upload="beforeImageUpload"
              :customRequest="e => handleUpload('image', e)"
            >
              <img class="action" :src="useImgUrlAdmin('test/5g/img-btn.png')" />
            </a-upload>
            <a-upload
              action="#"
              :showUploadList="false"
              accept="audio/mp3,audio/wav"
              :before-upload="beforeAudioUpload"
              :customRequest="e => handleUpload('audio', e)"
            >
              <img class="action" :src="useImgUrlAdmin('test/5g/audio-btn.png')" />
            </a-upload>
            <a-upload
              action="#"
              :showUploadList="false"
              accept="video/mp4,video/3gp"
              :before-upload="beforeVideoUpload"
              :customRequest="e => handleUpload('video', e)"
            >
              <img class="action" :src="useImgUrlAdmin('test/5g/video-btn.png')" />
            </a-upload>

            <img class="action" :src="useImgUrlAdmin('test/5g/activity-btn.png')" @click="activityVisible = true" />
            <ActivitySelector v-model:visible="activityVisible" @addActivity="onAddActivity" />
            <img class="action" :src="useImgUrlAdmin('test/5g/article-btn.png')" @click="articleVisible = true" />
            <ArticleSelector v-model:visible="articleVisible" @add="onAddArticle" />
          </div>
          <a-button class="submit" type="primary" @click="onSubmit">提交审核</a-button>
        </div>
      </div>
      <div class="card preview shrink-0">
        <div class="card-title flex-x-between-center">
          预览效果
          <a-button type="primary" :class="isEditing ? 'success' : null" @click="isEditing = !isEditing">
            {{ isEditing ? '完成' : '编辑' }}
          </a-button>
        </div>
        <SimulatePhone>
          <a-input
            v-model:value="templateModel.title"
            class="template-input"
            style="margin-bottom: 23px"
            placeholder="请输入标题"
            size="small"
            :maxlength="15"
          />

          <div v-for="(item, index) in templateModel.list" :key="item.id" class="template-item">
            <a-textarea
              v-if="item.type === 'text'"
              v-model:value="item.value"
              :autoSize="true"
              class="template-input"
              placeholder="请输入文字内容"
            />
            <img v-else-if="item.type === 'image'" class="template-image" :src="item.value" />
            <video v-else-if="item.type === 'video'" controls class="template-video" :src="item.value" />
            <AudioPlayBar v-else-if="item.type === 'audio'" controls :src="item.value" @add="onAddArticle" />
            <a-button
              type="link"
              v-else-if="item.type === 'activity' || item.type === 'article'"
              @click="$copyText(item.value.url).then(() => $message.success('复制成功'))"
            >
              {{ item.value.url }}
            </a-button>

            <template v-if="isEditing">
              <img
                class="close"
                :src="useImgUrlAdmin('test/5g/close.png')"
                @click="templateModel.list.splice(index, 1)"
              />
              <div class="sort">
                <img v-if="index !== 0" :src="useImgUrlAdmin('test/5g/up.png')" @click="onSort(index, index - 1)" />
                <img
                  v-if="index !== templateModel.list.length - 1"
                  :src="useImgUrlAdmin('test/5g/down.png')"
                  @click="onSort(index, index + 1)"
                />
              </div>
            </template>
          </div>
          <template #footer>
            <div style="margin-top: 9px">
              模板总大小：
              <span :class="['high-light', { red: totalSize > 1.9 * 1024 * 1024 }]">
                {{ formatSize(totalSize, 1) }}
              </span>
            </div>
          </template>
        </SimulatePhone>
      </div>
    </div>
  </Panel>
</template>
<script setup>
import { useImgUrlAdmin } from '@business/common/src/utils/useImgUrl'
import { computed, getCurrentInstance, ref, defineAsyncComponent } from 'vue'
import { formatSize } from '@/utils/formate-num'
import { uploadFile, add5GTemplate, generateH5SkipUrl } from '@/api/mass-notification'
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue'
const SimulatePhone = defineAsyncComponent(() => import('./components/SimulatePhone.vue'))
const AudioPlayBar = defineAsyncComponent(() => import('./components/AudioPlayBar.vue'))
const ArticleSelector = defineAsyncComponent(() => import('./components/ArticleSelector.vue'))
const ActivitySelector = defineAsyncComponent(() => import('../components/ActivitySelector.vue'))
const templateModel = ref({
  title: '',
  list: []
})
const uid = ref(0)
const isEditing = ref(false)
const articleVisible = ref(false)
const activityVisible = ref(false)
const totalSize = computed(() => {
  return templateModel.value.list.reduce((total, cur) => {
    const { type, size, value } = cur
    if (type === 'text') {
      return total + getStrSize(value)
    } else if (type === 'activity' || type === 'article') {
      return total + getStrSize(value.url)
    } else {
      return total + (size || 0)
    }
  }, 0)
})
const getStrSize = str => {
  let total = 0
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i)
    if (charCode <= 0x007f) {
      total += 1
    } else if (charCode <= 0x07ff) {
      total += 2
    } else if (charCode <= 0xffff) {
      total += 3
    } else {
      total += 4
    }
  }
  return total * 8
}
const { proxy } = getCurrentInstance()
const beforeImageUpload = file => {
  if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
    proxy.$message.error('上传图片只能是 JPG 或 PNG 或 GIF 格式!')
    return false
  }
  return beforeUpload('image', file)
}
const beforeAudioUpload = file => {
  if (!['audio/mpeg', 'audio/wav'].includes(file.type)) {
    proxy.$message.error('上传音频只能是 MP3 或 WAV 格式!')
    return false
  }
  return beforeUpload('audio', file)
}
const beforeVideoUpload = file => {
  if (!['video/mp4', 'video/3gp'].includes(file.type)) {
    proxy.$message.error('上传视频只能是 MP4 或 3GP 格式!')
    return false
  }
  return beforeUpload('video', file)
}
const beforeUpload = (accept, file) => {
  const fileTypeDesc = { image: '图片', video: '视频', audio: '音频' }[accept]
  if (templateModel.value.list.some(v => v.type === accept)) {
    proxy.$message.error(`${fileTypeDesc}只能上传一个`)
    return false
  }

  if (file.size + totalSize.value > 1.9 * 1024 * 1024) {
    proxy.$message.error('模板内容不能大于1.9M')
    return false
  }
}
const handleUpload = async (accept, { file }) => {
  const formData = new FormData()
  formData.append('file', file)
  const { data, state } = await uploadFile({ folder: '5g' }, formData)
  if (state === 1) {
    templateModel.value.list.push({ type: accept, value: data.url, size: file.size, id: ++uid.value })
  }
}

const onAddArticle = async e => {
  const { data } = await generateH5SkipUrl({
    code: 'detailArticle',
    query: `id=${e.id}&ckey=${e.ckey || ''}`,
    skipType: 1
  })
  templateModel.value.list.push({
    type: 'article',
    value: { id: e.id, url: data }
  })
}
const onAddActivity = async e => {
  const { data } = await generateH5SkipUrl({
    code: 'detailActivity',
    query: `id=${e.id}&ckey=${e.ckey || ''}`,
    skipType: 1
  })
  templateModel.value.list.push({
    type: 'activity',
    value: { id: e.id, url: data }
  })
}

const onSort = (index, targetIndex) => {
  const { list } = templateModel.value
  if (targetIndex < 0 || targetIndex >= list.length) return
  const current = list[index]
  const target = list[targetIndex]
  list[index] = target
  list[targetIndex] = current
}
const router = useRouter()
const onSubmit = async () => {
  const { title } = templateModel.value
  const list = templateModel.value.list.filter(v => v.value)
  if (!title) return proxy.$message.warning('模板标题不能为空')
  if (!list.length) return proxy.$message.warning('模板内容不能为空')
  if (list.every(v => !['text', 'article', 'activity'].includes(v.type)))
    return proxy.$message.warning('短信内容中必须有文字')
  if (totalSize.value > 1.9 * 1024 * 1024) return proxy.$message.warning('短信内容不得大于1.9M')

  Modal.confirm({
    title: '提示',
    content:
      '提交审核后，预计工信部与运营商在3-5天内完成审核。若视频或链接中包含较复杂逻辑或其他特殊情况，可能会导致审核时间延长。',
    async onOk() {
      await add5GTemplate({
        extend: {
          size: totalSize.value,
          params: list.map(({ type, value }) => ({ type, value }))
        },
        templateName: title
      })
      router.push('/mass-notification/5g/list')
    }
  })
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  height: 100%;
}

.success {
  background-color: #67c23a;
  border-color: #67c23a;
}
.card {
  background-color: #fff;
  height: 100%;
  border-radius: 2px;
  margin-right: 28px;
  font-size: 14px;

  &:last-child {
    margin-right: 0;
  }

  .card-title {
    height: 56px;
    line-height: 56px;
    padding: 0 24px;
    border-bottom: 1px solid #e9e9e9;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }

  .tips {
    padding: 25px 16px 20px;
    margin: 16px 25px 35px;
    background-color: #fafafa;
    border-radius: 2px;

    .tip-title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 16px;
    }

    .tip {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
    }
  }

  .high-light {
    color: #1890ff;

    &.red {
      color: red;
    }
  }

  .actions {
    flex-wrap: wrap;
    padding-left: 35px;

    .action {
      width: 88px;
      height: 88px;
      background: #f6ffed;
      border-radius: 4px;
      margin-right: 32px;
      margin-bottom: 35px;
      cursor: pointer;
    }
  }

  .submit {
    margin-top: 45px;
  }
}

.preview {
  width: 364px;

  .template-item {
    position: relative;
    margin-bottom: 16px;
  }

  .template-image {
    width: 100%;
  }

  .template-video {
    width: 100%;
  }

  .close {
    position: absolute;
    width: 16px;
    height: 16px;
    right: -8px;
    top: -8px;
    z-index: 1;
    cursor: pointer;
  }

  .sort {
    position: absolute;
    top: 0;
    left: 7px;

    img {
      width: 28px;
      height: 28px;
      cursor: pointer;
      &:first {
        margin-right: 6px;
      }
    }
  }
}
</style>
