<template>
  <div class="activity-detail-wrap">
    <el-row :gutter="20">
      <el-col :span="15" style="max-width: 530px">
        <el-card class="activity-card" shadow="never">
          <div class="board flex-x-between-center">
            <div class="board-left">
              <div class="board-title">{{ activity.activityName }}</div>
              <div v-if="activity.activitySignUpStartTime" class="board-item">
                <span class="mr10">报名时间</span> {{ formatDate(activity.activitySignUpStartTime) }} ～
                {{ formatDate(activity.activitySignUpEndTime) }}
              </div>
              <div class="board-item">
                <span class="mr10">活动时间</span> {{ formatDate(activity.activityStartTime) }} ～
                {{ formatDate(activity.activityEndTime) }}
              </div>
              <div class="board-item"><span class="mr10">举办地点</span> {{ activity.addressInfo }}</div>
              <div v-if="activity.limit" class="board-item">
                <span class="mr10">参加限制</span> {{ activity.numberOfApplicants }}/{{ activity.participants }}
              </div>
            </div>
            <div class="board-right flex-y-center-center">
              <img class="qr-code" :src="activity.qrCode" @click="activityQrCodeShow = true">
              <div class="qr-code-desc">活动二维码 <el-button type="text" @click="downLoadCode">下载</el-button></div>
              <SaveImgDialog ref="activityDialog" v-model="activityQrCodeShow" :show-save-btn="false" title="活动二维码">
                <div class="code">
                  <div class="code-title">活动二维码</div>
                  <img class="code-body" :src="activity.qrCode">
                </div>
                <!-- <ActivityCode :id="id" slot-scope="{ id }" :activity="activity" /> -->
              </SaveImgDialog>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="activity.extraSeat" :span="9" style="max-width: 390px">
        <el-card class="activity-card" shadow="never">
          <div class="board flex-x-between-center">
            <div class="board-left">
              <div class="board-title" style="margin-bottom: 5px">座位表</div>
              <div class="flex-x-center-center">
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
                    :style="{ backgroundImage: `url(${activity.seating})` }"
                  >
                    <i class="el-icon-circle-close" @click.stop="delSeating" />
                    <div class="image-preview" @click.stop="previewSeatDialogShow = true">预览</div>
                  </div>
                  <div v-else v-loading="imgLoading" class="upload-description">
                    <i class="el-icon-plus" />
                    <span>上传座位表</span>
                    <span>（0 / 1）</span>
                  </div>
                </el-upload>
                <div>会员可在小程序看到座位排序情况</div>
              </div>
            </div>
            <el-dialog :visible.sync="previewSeatDialogShow" width="40%">
              <img :src="activity.seating" style="width: 100%">
            </el-dialog>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-if="activity.extraSignin || activity.extraSignout">
      <el-col :span="24" style="max-width: 900px">
        <el-card class="activity-card" shadow="never">
          <div class="board flex-x-between-center">
            <div class="board-left">
              <div class="board-title">签到/签退码</div>
              <div class="flex-x-between-center">
                <div v-for="(item, i) of codeList" :key="i" class="qr-code-wrap flex-y-center-center">
                  <img
                    class="qr-code"
                    :src="activity[item.codeKey]"
                    @click="onQrCodePreview({ url: activity[item.codeKey], title: item.title })"
                  >
                  <el-button
                    type="text"
                    @click="onQrCodeDownload({ url: activity[item.codeKey], title: item.title })"
                  >下载{{ item.title }}</el-button>
                </div>
              </div>
              <SaveImgDialog
                ref="codeDialog"
                v-model="qrCodeDialog.show"
                :title="qrCodeDialog.title"
                :show-save-btn="false"
              >
                <div class="code">
                  <div class="code-title">{{ qrCodeDialog.title }}</div>
                  <img class="code-body" :src="qrCodeDialog.url">
                </div>
                <!-- <SignInCode :id="id" slot-scope="{ id }" :title="qrCodeDialog.title" :url="qrCodeDialog.url" /> -->
              </SaveImgDialog>
            </div>
            <div class="board-right flex-y-center-center">
              <div class="desc">
                <div class="desc-title">使用说明</div>
                <div class="desc-item">保存图片打印在活动海报、易拉宝等场合</div>
                <div class="desc-item">用户使用微信扫码即签到成功，并显示会场座位号。</div>
                <div class="desc-item">临时报名签到码用于临时到场会员，未报名无法签到情况，扫码后自动通过并签到。</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="activity-info">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content">
            <div class="label">活动状态：</div>
            <div class="value">{{ activity.status == 1 ? '未开始' : activity.status == 2 ? '进行中' : '已结束' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="label">报名审核：</div>
            <div class="value">{{ activity.auditStatus === 1 ? '需审核' : '不需审核' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="label">活动地址：</div>
            <div class="value">{{ activity.addressInfo }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content">
            <div class="label">已报名人数：</div>
            <div class="value">{{ activity.registeredCount }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="label">拓展功能：</div>
            <div class="value">
              {{ activity.extraSignin === 1 ? '签到 ' : '' }}
              {{ activity.extraSignout === 1 ? '签退 ' : '' }}
              {{ activity.extraSeat === 1 ? '座位表' : '' }}
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="label">报名时间：</div>
            <div class="value">
              {{ activity.applyStartTime | dateFormat }} ~ {{ activity.applyEndTime | dateFormat }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content">
            <div class="label">参加人数：</div>
            <div class="value">{{ activity.isLimit == 0 ? '不限' : activity.activityCount }}</div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="grid-content">
            <div class="label">类型摘要：</div>
            <div class="value">
              <div v-if="activity.labels" class="tags">
                <div v-for="(item, index) in activity.labels" :key="index" class="tags-block">
                  #{{ item.label }} <span v-if="activity.labels.length - 1 != index">,</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="label">活动时间：</div>
            <div class="value">
              {{ activity.activityStartTime | dateFormat }} ~ {{ activity.activityEndTime | dateFormat }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content">
            <div class="label">报名对象：</div>
            <div class="value">{{ applyObject }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="label">图片直播关联权限：</div>
            <div class="value">{{ activity.zhiboAddressType == 1 ? '云会播小程序' : 'H5链接' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="label">直播间链接：</div>
            <div class="value">{{ activity.zhiboAddress || '--' }}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="grid-content">
      <div class="label" style="line-height: 47px">活动简介：</div>
      <div class="value" v-html="activity.introduce" />
    </div>

    <div class="grid-content">
      <div class="label">活动头图：</div>
      <div class="value"><img :src="activity.headImage" alt=""></div>
    </div>

    <div class="grid-content">
      <div class="label">活动分享图：</div>
      <div class="value"><img :src="activity.listImage" alt=""></div>
    </div>

    <div class="grid-content">
      <div class="label" style="margin-top: 10px">招商附件：</div>
      <div class="value">
        <div v-for="(item, index) in activity.attachment" :key="index">
          <el-button type="text" @click="downLoad(item)">{{ item.fileName }}</el-button>
        </div>
      </div>
    </div>
    <div v-if="activity.activityGuestsVOS && activity.activityGuestsVOS.length > 0" class="grid-content guests-content">
      <div class="label">嘉宾信息：</div>
      <div class="value guests">
        <el-card v-for="item in activity.activityGuestsVOS" :key="item.id" class="box-card">
          <div>
            <div class="user">
              <div class="user-msg">
                <span class="name">{{ item.name }}</span>
                <span class="unit">{{ item.unit }}</span>
                <span>职位：
                  {{ item.post }}
                </span>
              </div>
              <img class="portrait" :src="item.portrait">
            </div>
            <div style="margin-bottom: 5px">嘉宾介绍：</div>
            <div style="display: inline-block">{{ item.showContent }}</div>
            <span v-if="item.showMore" style="color: #2878ff" @click="showDialog(item)">查看更多</span>
          </div>
        </el-card>
      </div>
    </div>
    <introduction :content="content" :introduction-visible.sync="showIntroduction" />
  </div>
</template>

<script>
import SaveImgDialog from '@/views/zhaoshang/activity/verify-detail/components/SaveImgDialog'
// import ActivityCode from '@/views/zhaoshang/activity/verify-detail/components/SaveImgDialog'
// import SignInCode from '@/views/zhaoshang/activity/verify-detail/components/SaveImgDialog'
import { getEcActivity } from '@/api/attract'
import { deleteInvesSeating } from '@/api/zhaoshang/activity/activity-verify-new'
import { activityDetail, uploadSeating } from '@/api/activity/activity'
import { formatDate, filetype } from '../verify-detail/util'
import { downloadByBlob } from '../util'
import introduction from './components/introduction'
export default {
  name: 'ActivityDetail',
  components: {
    SaveImgDialog,
    // ActivityCode,
    // SignInCode,
    introduction
  },
  data() {
    return {
      activity: {
        seating: '',
        id: +this.$route.query.activityId
      },
      infoList: {},
      activityQrCodeShow: false,
      qrCodeDialog: {
        show: false,
        title: '',
        url: ''
      },
      codeList: [
        { title: '签到码', codeKey: 'signInCode' },
        { title: '临时报名签到码', codeKey: 'temporaryCheckInCode' },
        { title: '签退码', codeKey: 'checkoutCode' }
      ],
      previewSeatDialogShow: false,
      imgLoading: false,
      showIntroduction: false,
      content: ''
    }
  },
  computed: {
    activityId() {
      // 活动ID
      return this.$route.query.activityId || ''
    },
    applyObject() {
      const { applyObject } = this.activity
      return applyObject === 0
        ? '全部'
        : applyObject === 1
          ? '商会会员'
          : applyObject === 2
            ? '商会指定职位'
            : '商会指定部门'
    }
  },
  created() {
    // this.fetchData()
    this.getActivityInfo()
  },
  methods: {
    async getActivityInfo() {
      const { data } = await activityDetail({ id: this.activityId })
      // data.id = this.activityId
      this.activity = data
      this.handelActivityGuests()
      console.log(this.activity, 'this.activity')
    },
    formatDate,
    handelActivityGuests() {
      const { activityGuestsVOS } = this.activity
      if (!activityGuestsVOS?.length > 0) return
      activityGuestsVOS.forEach(i => {
        console.log('i.introduction.length', i.introduction.length)
        if (i.introduction.length > 5000) {
          i.showMore = true
          i.showContent = i.introduction.slice(0, 5000)
        } else {
          i.showMore = false
        }
      })
      this.activity.activityGuestsVOS = activityGuestsVOS
    },
    async fetchData() {
      const params = {
        id: this.activityId
      }
      const res = await getEcActivity(params)
      if (res.state === 1) {
        this.infoList = res.data
      } else {
        this.$message({
          message: res.msg,
          type: 'success'
        })
      }
    },

    // 上传前校验
    beforeUpload(file) {
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

      const formData = new FormData()
      formData.append('activityId', this.activityId)
      formData.append('multipartFile', content.file)

      try {
        const { data } = await uploadSeating(formData)
        this.activity.seating = data
      } catch (error) {
        /*  */
      }
      this.imgLoading = false
    },
    async delSeating() {
      const { state, msg } = await deleteInvesSeating(this.activityId)
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) this.activity.seating = ''
    },
    onQrCodePreview(e) {
      this.qrCodeDialog = { show: true, ...e }
    },
    onQrCodeDownload(e) {
      downloadByBlob(e.url, e.title)
      // this.qrCodeDialog = { ...this.qrCodeDialog, ...e }
      // this.$refs.codeDialog.saveImage()
    },
    // 下载
    downLoad(item) {
      const arr = item.attachment.split('.')
      const type = arr[arr.length - 1]
      if (!type) return
      if (filetype.indexOf(type) !== -1) {
        window.open(item.attachment)
      } else {
        downloadByBlob(item.attachment, item.fileName)
      }
    },
    showDialog(row) {
      this.showIntroduction = true
      this.content = row.introduction
    },
    downLoadCode() {
      downloadByBlob(this.activity.qrCode, '活动二维码')
    }
  }
}
</script>

<style lang="scss">
.activity-detail-wrap {
  padding: 40px;

  .title {
    margin: -20px 0 0 -20px;
  }

  .title,
  .sub-title {
    padding: 10px 0;
  }

  .grid-content {
    padding: 10px 0;
    display: flex;

    .value {
      flex: 1;
    }
  }
  .tags {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #000;
    padding: 10px;
    .tags-block {
      margin: 0 8px 0px 0;
    }
  }

  img {
    width: 200px;
  }

  /deep/ .el-button {
    padding: 0;
  }
}
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
    margin-bottom: 25px;
    @include ellipsis(2);
  }

  .board-item {
    margin-bottom: 10px;
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
    margin-bottom: 5px;
    &::before {
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

.activity-card {
  height: 210px;
}

.image-upload {
  margin-right: 10px;
  /deep/ .el-upload--picture-card {
    width: 80px;
    height: 80px;
  }
}

/deep/ .el-upload .el-upload--picture-card {
  width: 121px;
  height: 121px;
}

.qr-code-desc {
  width: 110px;
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
    font-size: 16px;
    font-weight: 700;
    color: red;
    z-index: 10;
    border-radius: 50%;
  }

  .image-preview {
    display: none;
    position: absolute;
    height: 24px;
    line-height: 24px;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    background-color: rgba($color: #000000, $alpha: 0.5);
    color: #fff;
    z-index: 10;
  }

  &:hover {
    .el-icon-circle-close,
    .image-preview {
      display: block;
    }
  }
}
.guests {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
.guests-content {
  .portrait {
    width: 100px;
    height: 100px;
    flex-shrink: 0;
  }
  .name,
  .unit {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
.box-card {
  width: 30%;
  margin: 0px 15px 10px 0px;
}
.user {
  display: flex;
  justify-content: space-between;
}
.user-msg {
  display: flex;
  flex-direction: column;
}
.code {
  width: 306px;
  height: 340px;
  padding-top: 40px;
  background-color: #fff;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .code-title {
    font-size: 18px;
    font-weight: 700;
    color: #222;
    text-align: center;
    margin-bottom: 16px;
  }
  .code-body {
    text-align: center;
    width: 166px;
    height: 166px;
  }
}
</style>
