<template>
  <div class="page">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="never">
          <div class="board flex-x-between-center">
            <div class="board-left">
              <div class="board-title">{{ activity.activityName }}</div>
              <div class="board-item mt20"><span class="mr10">报名时间</span> {{ formatDate(activity.activitySignUpStartTime) }} ～ {{ formatDate(activity.activitySignUpEndTime) }}</div>
              <div class="board-item"><span class="mr10">活动时间</span> {{ formatDate(activity.activityStartTime) }} ～ {{ formatDate(activity.activityEndTime) }}</div>
              <div class="board-item"><span class="mr10">举办地点</span> {{ activity.hostPlace }} </div>
              <div v-if="activity.limit" class="board-item"><span class="mr10">参加限制</span> {{ activity.numberOfApplicants }}/{{ activity.participants }}</div>
            </div>
            <div class="board-right flex-y-center-center">
              <img class="qr-code" :src="activity.qrCode" @click="activityQrCodeShow=true">
              <div> 活动二维码 <el-button type="text" @click="$refs.activityDialog.saveImage()">下载</el-button> </div>
              <SaveImgDialog ref="activityDialog" v-model="activityQrCodeShow">
                <ActivityCode :id="id" slot-scope="{id}" :activity="activity" />
              </SaveImgDialog>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never">
          <div class="board flex-x-between-center">
            <div class="board-left">
              <div class="board-title">签到/签退码</div>
              <div class="flex-x-between-center">
                <div v-for="(item,i) of codeList" :key="i" class="qr-code-wrap flex-y-center-center">
                  <img class="qr-code" :src="activity[item.codeKey]" @click="onQrCodePreview({url:activity[item.codeKey],title:item.title})">
                  <el-button type="text" @click="onQrCodeDownload({url:activity[item.codeKey],title:item.title})">下载{{ item.title }}</el-button>
                </div>
              </div>
              <SaveImgDialog ref="codeDialog" v-model="qrCodeDialog.show">
                <SignInCode :id="id" slot-scope="{id}" :title="qrCodeDialog.title" :url="qrCodeDialog.url" />
              </SaveImgDialog>
            </div>
            <div class="board-right flex-y-center-center">
              <div class="desc">
                <div class="desc-title">使用说明</div>
                <div class="desc-item">保存图片打印在活动海报、易拉宝等场合 </div>
                <div class="desc-item">用户使用微信扫码即签到成功，并显示会场座位号。</div>
                <div class="desc-item">临时报名签到码用于临时到场会员，未报名无法签到情况，扫码后自动通过并签到。</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="5">
        <el-card shadow="never">
          <div class="board flex-x-between-center">
            <div class="board-left">
              <div class="board-title">座位表</div>
              <el-upload
                action="#"
                class="image-upload"
                list-type="picture-card"
                :http-request="upload"
                :show-file-list="false"
                :before-upload="beforeUpload"
              >
                <div
                  v-if="activity.seating"
                  class="image-item"
                  :style="{backgroundImage: `url(${activity.seating})`}"
                >
                  <!-- <i class="el-icon-circle-close" @click.stop="activity.seating=''" /> -->
                  <div class="image-preview" @click.stop="previewSeatDialogShow=true">预览</div>
                </div>
                <div v-else v-loading="imgLoading" class="upload-description">
                  <i class="el-icon-plus" />
                  <span>上传座位表</span>
                  <span>（0 / 1）</span>
                </div>
              </el-upload>
              <div class="mt5">会员可在小程序看到座位排序情况</div>
              <el-dialog :visible.sync="previewSeatDialogShow" width="40%">
                <img :src="activity.seating" style="width:100%">
              </el-dialog>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <SingInTable
      :activity="activity"
      :init-status="$route.query.status"
    />

  </div>
</template>

<script>
import SaveImgDialog from './components/SaveImgDialog'
import ActivityCode from './components/ActivityCode'
import SignInCode from './components/SignInCode'
import { formatDate } from './util'
import { getChamberActivityInfoById, uploadSeating } from '@/api/activity/activity-verify-new'

export default {
  components: {
    SaveImgDialog,
    ActivityCode,
    SignInCode,
    SingInTable: () => import('./components/SingInTable'),
  },
  props: {},
  data() {
    return {
      activity: {
        seating: '',
        id: +this.$route.query.activityId
      },
      activityQrCodeShow: false,
      codeList: [
        { title: '签到码', codeKey: 'signInCode' },
        { title: '临时报名签到码', codeKey: 'temporaryCheckInCode' },
        { title: '签退码', codeKey: 'checkoutCode' }
      ],
      qrCodeDialog: {
        show: false,
        title: '',
        url: ''
      },
      previewSeatDialogShow: false,
      imgLoading: false,
    }
  },
  computed: {
    activityId() {
      return +this.$route.query.activityId
    }
  },
  created() {
    this.getActivityInfo()
  },
  methods: {
    async getActivityInfo() {
      const { data } = await getChamberActivityInfoById(this.activityId)
      data.id = this.activityId
      this.activity = data
    },
    formatDate,
    // 上传前校验
    beforeUpload(file, index) {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
        this.$message.error('上传图片只能是 JPG 或 PNG 或 GIF格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },
    // 上传逻辑
    async upload(content) {
      this.imgLoading = true

      let formData = new FormData()
      formData.append('activityId', this.activityId)
      formData.append('multipartFile', content.file)

      try {
        const { data } = await uploadSeating(formData)
        this.activity.seating = data
      } catch (error) { /*  */ }
      this.imgLoading = false
    },
    onQrCodePreview(e) {
      this.qrCodeDialog = { show: true, ...e }
    },
    onQrCodeDownload(e) {
      this.qrCodeDialog = { ... this.qrCodeDialog, ...e }
      this.$refs.codeDialog.saveImage()
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  padding: 20px;
}
.mt20 {
  margin-top: 20px;
}
.mt5 {
  margin-top: 5px;
}
.mr10 {
  margin-right: 10px;
}
.board {
  font-size: 14px;

  .board-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 5px;
  }

  .board-item {
    margin-bottom: 4px;
  }

  .qr-code {
    width: 75px;
    height: 75px;
  }

  .qr-code-wrap {
    margin-right: 15px;
  }

  /deep/ .el-button {
    padding-top: 5px;
    padding-bottom: 0;
  }

  .desc-title {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .desc-item {
    position: relative;
    padding-left: 15px;
    &::before{
      content: '';
      position: absolute;
      left: 0;
      top: 6px;
      display: block;
      width: 4px;
      height: 4px;
      background-color: #000;
      border-radius: 50%;
    }
  }

}

.upload-description {
  line-height: 16px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

  .image-item {
    width: 100%;
    height: 100%;
    position: relative;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 220px;
    cursor: pointer;

    .el-icon-circle-close {
      display: none;
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 20px;
      color: #fd5d5d;
      z-index: 10;
    }

    .image-preview {
      display: none;
      position: absolute;
      height: 30px;
      line-height: 30px;
      left: 0;
      bottom: 0;
      width: 100%;
      text-align: center;
      background-color: rgba($color: #000000, $alpha: 0.5);
      color: #fff;
      z-index: 10;
    }

    &:hover {
      .el-icon-circle-close,.image-preview {
        display: block;
      }
    }
  }

</style>
