<template>
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
          <img class="action" src="@/assets/img/5g/text-btn.png" @click="templateModel.list.push({value:'',type:'text'})">
          <el-upload
            action="#"
            :show-file-list="false"
            accept="image/jpg,image/png,image/gif"
            :before-upload="beforeImageUpload"
            :http-request="e => handleUpload('image', e)"
          >
            <img class="action" src="@/assets/img/5g/img-btn.png">
          </el-upload>
          <el-upload
            action="#"
            :show-file-list="false"
            accept="audio/mp3,audio/wav"
            :before-upload="beforeAudioUpload"
            :http-request="e => handleUpload('audio', e)"
          >
            <img class="action" src="@/assets/img/5g/audio-btn.png">
          </el-upload>
          <el-upload
            action="#"
            :show-file-list="false"
            accept="video/mp4,video/3gp"
            :before-upload="beforeVideoUpload"
            :http-request="e => handleUpload('video', e)"
          >
            <img class="action" src="@/assets/img/5g/video-btn.png">
          </el-upload>

          <img class="action" src="@/assets/img/5g/activity-btn.png" @click="openActivitySelector">
          <ActivityDialog ref="activitySelector" @addActivity="onAddActivity" />
          <img class="action" src="@/assets/img/5g/article-btn.png" @click="articleVisible = true">
          <ArticleSelector :visible.sync="articleVisible" @add="onAddArticle" />
        </div>
        <el-button class="submit" type="primary" @click="onSubmit">提交审核</el-button>
      </div>
    </div>
    <div class="card preview shrink-0">
      <div class="card-title flex-x-between-center">
        预览效果
        <el-button :type="isEditing?'success':'primary'" size="small" @click="isEditing = !isEditing">
          {{ isEditing?'完成':'编辑' }}
        </el-button>
      </div>
      <SimulatePhone>

        <el-input v-model="templateModel.title" class="template-input" style="margin-bottom:23px;" placeholder="请输入标题" size="small" maxlength="15" />

        <div v-for="(item,index) in templateModel.list" :key="item.id" class="template-item">
          <el-input v-if="item.type === 'text'" v-model="item.value" type="textarea" autosize class="template-input" placeholder="请输入文字内容" resize="none" />
          <img v-else-if="item.type === 'image'" class="template-image" :src="item.value">
          <video v-else-if="item.type === 'video'" controls class="template-video" :src="item.value" />
          <AudioPlayBar v-else-if="item.type === 'audio'" controls :src="item.value" />
          <el-link v-else-if="item.type === 'activity' || item.type === 'article'" type="primary" @click="$copyText(item.value.url).then(() => $message.success('复制成功'))">
            {{ item.value.url }}
          </el-link>

          <template v-if="isEditing">
            <img class="close" src="@/assets/img/5g/close.png" @click="templateModel.list.splice(index,1)">
            <div class="sort">
              <img v-if="index !== 0" src="@/assets/img/5g/up.png" @click="onSort(index,index-1)">
              <img v-if="index !== templateModel.list.length-1" src="@/assets/img/5g/down.png" @click="onSort(index,index+1)">
            </div>
          </template>
        </div>
        <div slot="footer" style="margin-top:9px;">
          模板总大小：<span :class="['high-light',{red:totalSize>1.9*1024*1024}]">{{ formatSize(totalSize,1) }}</span>
        </div>
      </SimulatePhone>
    </div>
  </div>
</template>

<script>
import { uploadFile, add5GTemplate, generateH5SkipUrl } from '@/api/mass-notification'
import { formatSize } from '@/utils'
export default {
  components: {
    AudioPlayBar: () => import('./components/AudioPlayBar'),
    SimulatePhone: () => import('./components/SimulatePhone'),
    ArticleSelector: () => import('./components/ArticleSelector'),
    ActivityDialog: () => import('../create/components/activityDialog')
  },
  props: {},
  data() {
    return {
      templateModel: {
        title: '',
        list: []
      },
      uid: 0,
      isEditing: false,
      articleVisible: false
    }
  },
  computed: {
    totalSize() {
      return this.templateModel.list.reduce((total, cur) => {
        const { type, size, value } = cur
        if (type === 'text') {
          return total + this.getStrSize(value)
        } else if (type === 'activity' || type === 'article') {
          return total + this.getStrSize(value.url)
        } else {
          return total + (size || 0)
        }
      }, 0)
    }
  },
  // /ec/notice-template-set/add-5G-sms-template
  methods: {
    formatSize,
    onTextChange(item, e) {
      this.$set(item, 'value', e.target.innerText)
    },
    beforeImageUpload(file) {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
        this.$message.error('上传图片只能是 JPG 或 PNG 或 GIF 格式!')
        return false
      }
      return this.beforeUpload('image', file)
    },
    beforeAudioUpload(file) {
      if (!['audio/mpeg', 'audio/wav'].includes(file.type)) {
        this.$message.error('上传音频只能是 MP3 或 WAV 格式!')
        return false
      }
      return this.beforeUpload('audio', file)
    },
    beforeVideoUpload(file) {
      if (!['video/mp4', 'video/3gp'].includes(file.type)) {
        this.$message.error('上传视频只能是 MP4 或 3GP 格式!')
        return false
      }
      return this.beforeUpload('video', file)
    },
    beforeUpload(accept, file) {
      const fileTypeDesc = ({ image: '图片', video: '视频', audio: '音频' })[accept]
      if (this.templateModel.list.some(v => v.type === accept)) {
        this.$message.error(`${fileTypeDesc}只能上传一个`)
        return false
      }

      if (file.size + this.totalSize > 1.9 * 1024 * 1024) {
        this.$message.error('模板内容不能大于1.9M')
        return false
      }
    },
    async handleUpload(accept, { file }) {
      const formData = new FormData()
      formData.append('file', file)
      console.log(file)
      const { data, state, msg } = await uploadFile({ folder: '5g' }, formData)
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        this.templateModel.list.push({ type: accept, value: data.url, size: file.size, id: ++this.uid })
      }
    },
    openActivitySelector() {
      const { activitySelector } = this.$refs
      activitySelector.open()
      activitySelector.$refs['table']?.cancelSelect()
    },
    async onAddActivity(e) {
      const { state, msg, data } = await generateH5SkipUrl({
        code: 'detailActivity',
        query: `id=${e[0].id}&ckey=${e[0].ckey || ''}`,
        skipType: 1
      })
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        this.templateModel.list.push({
          type: 'activity',
          value: { id: e.id, url: data }
        })
      }
    },
    async onAddArticle(e) {
      const { state, msg, data } = await generateH5SkipUrl({
        code: 'detailArticle',
        query: `id=${e.id}&ckey=${e.ckey || ''}`,
        skipType: 1
      })
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        this.articleVisible = false
        this.templateModel.list.push({
          type: 'article',
          value: { id: e.id, url: data }
        })
      }
    },
    onSort(index, targetIndex) {
      const { list } = this.templateModel
      if (targetIndex < 0 || targetIndex >= list.length) return
      const current = list[index]
      const target = list[targetIndex]
      this.$set(list, index, target)
      this.$set(list, targetIndex, current)
    },
    getStrSize(str) {
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
    },
    async onSubmit() {
      const { title } = this.templateModel
      const list = this.templateModel.list.filter(v => v.value)
      if (!title) return this.$message.warning('模板标题不能为空')
      if (!list.length) return this.$message.warning('模板内容不能为空')
      if (list.every(v => !['text', 'article', 'activity'].includes(v.type))) return this.$message.warning('短信内容中必须有文字')
      if (this.totalSize > 1.9 * 1024 * 1024) return this.$message.warning('短信内容不得大于1.9M')

      await this.$confirm('提交审核后，预计工信部与运营商在3-5天内完成审核。若视频或链接中包含较复杂逻辑或其他特殊情况，可能会导致审核时间延长。', '提示')

      const { state, msg } = await add5GTemplate({
        extend: {
          size: this.totalSize,
          params: list.map(({ type, value }) => ({ type, value }))
        },
        templateName: title
      })
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) this.$router.push('/mass-notification/5g/list')
    }
  },
}
</script>

<style lang="scss" scoped>

.app-container {
  height: 100%;
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
    border-bottom: 1px solid #E9E9E9;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0,0,0,0.85);
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
      color: rgba(0,0,0,0.85);
      margin-bottom: 16px;
    }

    .tip {
      font-size: 14px;
      color: rgba(0,0,0,0.65);
      line-height: 22px;
    }
  }

  .high-light {
    color: #1890FF;

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
      background: #F6FFED;
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
    height: 109px;
    object-fit: cover;
  }

  .template-video {
    width: 100%;
    height: 131px;
    object-fit: cover;
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
