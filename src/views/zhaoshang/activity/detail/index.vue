<template>
  <div class="activity-detail-wrap">
    <el-row :gutter="20">
      <el-col :span="15" style="max-width:530px">
        <el-card class="activity-card" shadow="never">
          <div class="board flex-x-between-center ">
            <div class="board-left">
              <div class="board-title">{{ activity.activityName }}</div>
              <div v-if="activity.activitySignUpStartTime" class="board-item"><span class="mr10">报名时间</span> {{ formatDate(activity.activitySignUpStartTime) }} ～ {{ formatDate(activity.activitySignUpEndTime) }}</div>
              <div class="board-item"><span class="mr10">活动时间</span> {{ formatDate(activity.activityStartTime) }} ～ {{ formatDate(activity.activityEndTime) }}</div>
              <div class="board-item"><span class="mr10">举办地点</span> {{ activity.hostPlace }} </div>
              <div v-if="activity.limit" class="board-item"><span class="mr10">参加限制</span> {{ activity.numberOfApplicants }}/{{ activity.participants }}</div>
            </div>
            <div class="board-right flex-y-center-center">
              <img class="qr-code" :src="activity.qrCode" @click="activityQrCodeShow=true">
              <div class="qr-code-desc"> 活动二维码 <el-button type="text" @click="$refs.activityDialog.saveImage()">下载</el-button> </div>
              <SaveImgDialog ref="activityDialog" v-model="activityQrCodeShow" title="活动二维码">
                <ActivityCode :id="id" slot-scope="{id}" :activity="activity" />
              </SaveImgDialog>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="activity.seatFunction" :span="9" style="max-width:390px">
        <el-card class="activity-card" shadow="never">
          <div class="board flex-x-between-center">
            <div class="board-left">
              <div class="board-title">座位表</div>
              <div class="flex-x-center-center">
                <el-upload
                  style="width:109px;height:109px"
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
                    <i class="el-icon-circle-close" @click.stop="delSeating" />
                    <div class="image-preview" @click.stop="previewSeatDialogShow=true">预览</div>
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
              <img :src="activity.seating" style="width:100%">
            </el-dialog>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-if="activity.signFunction || activity.signOutFunction">
      <el-col :span="24" style="max-width:900px">
        <el-card class="activity-card" shadow="never">
          <div class="board flex-x-between-center">
            <div class="board-left">
              <div class="board-title">签到/签退码</div>
              <div class="flex-x-between-center">
                <div v-for="(item,i) of codeList" :key="i" class="qr-code-wrap flex-y-center-center">
                  <img class="qr-code" :src="activity[item.codeKey]" @click="onQrCodePreview({url:activity[item.codeKey],title:item.title})">
                  <el-button type="text" @click="onQrCodeDownload({url:activity[item.codeKey],title:item.title})">下载{{ item.title }}</el-button>
                </div>
              </div>
              <SaveImgDialog ref="codeDialog" v-model="qrCodeDialog.show" :title="qrCodeDialog.title">
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
      <h2>招商信息</h2>
    </el-row>
    <div class="title">广州市招商办南沙自贸易区招商大会</div>
    <div class="activity-info">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">活动状态：</div>
            <div class="value">{{ infoList.status == 1 ? '未开始' : infoList.status == 2 ? '进行中' : '已结束' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">招商阶段：</div>
            <div class="value">{{ infoList.phaseStatus == 0 ? '筹备阶段' : infoList.status == 1 ? '拟策阶段' : '公开招商阶段' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">招商地区：</div>
            <div class="value">{{ infoList.province }}{{ infoList.city }}{{ infoList.area }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">已报名人数：</div>
            <div class="value">{{ infoList.registeredCount }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">报名审核：</div>
            <div class="value">{{ infoList.auditStatus == 0 ? '无需审核' : '需审核' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">报名时间：</div>
            <div class="value">{{ infoList.applyStartTime | dateFormat }} ~ {{ infoList.applyEndTime | dateFormat }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">参加人数：</div>
            <div class="value">{{ infoList.isLimit == 0 ? '不限' : infoList.activityCount }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">扩展功能：</div>
            <div class="value">
              <span v-if="infoList.extraSeat == 1" style="margin-right:2px;">座位表,</span>
              <span v-if="infoList.extraSignin == 1" style="margin-right:2px;">签到,</span>
              <span v-if="infoList.extraSignout == 1">签退</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">报名时间：</div>
            <div class="value">{{ infoList.activityStartTime | dateFormat }} ~ {{ infoList.activityEndTime | dateFormat }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">活动类型：</div>
            <div class="value">{{ infoList.applyMode == 1 ? '线上活动' : infoList.status == 2 ? '线下活动' : '线上线下活动' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">直播间链接类型：</div>
            <div class="value">{{ infoList.zhiboAddressType == 1 ? '云会播小程序' : 'H5链接' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">直播间链接：</div>
            <div class="value">{{ infoList.zhiboAddress || '--' }}</div>
          </div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content ">
            <div class="label">活动地址：</div>
            <div class="value">{{ infoList.addressInfo || '--' }}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="grid-content">
      <div class="label">类型摘要：</div>
      <div class="value">
        <div v-if="infoList.labels" class="tags">
          <div v-for="(item,index) in infoList.labels" :key="index" class="tags-block">#{{ item.label }} <span v-if="infoList.labels.length -1 != index">,</span></div>
        </div>
      </div>
    </div>

    <div class="grid-content">
      <div class="label" style="line-height: 47px;">活动简介：</div>
      <div class="value" v-html="infoList.introduce" />
    </div>

    <div class="grid-content">
      <div class="label">活动头图：</div>
      <div class="value"><img :src="infoList.headImage" alt=""></div>
    </div>

    <div class="grid-content">
      <div class="label">活动分享图：</div>
      <div class="value"><img :src="infoList.listImage" alt=""></div>
    </div>

    <div class="grid-content">
      <div class="label" style="margin-top: 10px;">招商附件：</div>
      <div class="value">
        <div v-for="(item,index) in infoList.attachment" :key="index"><el-button type="text">{{ item.fileName }}</el-button></div>
      </div>
    </div>

  </div>
</template>

<script>
import SaveImgDialog from '../verify-detail/components/SaveImgDialog'
import ActivityCode from '../verify-detail/components/ActivityCode'
import SignInCode from '../verify-detail/components/SignInCode'
import { getEcActivity } from '@/api/attract'
import { getInvesChamberActivityInfoById, uploadInvesSeating, deleteInvesSeating } from '@/api/zhaoshang/activity/activity-verify-new'
import { formatDate } from '../verify-detail/util'
export default {
  name: 'ActivityDetail',
  components: {
    SaveImgDialog,
    ActivityCode,
    SignInCode,
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
    }
  },
  computed: {
    activityId() { // 活动ID
      return this.$route.params.activeId || ''
    },
  },
  created() {
    this.fetchData()
    this.getActivityInfo()
  },
  methods: {
    async getActivityInfo() {
      const { data } = await getInvesChamberActivityInfoById(this.activityId)
      data.id = this.activityId
      this.activity = data
      console.log(this.activity, 'this.activity')
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
    formatDate,
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
        const { data } = await uploadInvesSeating(formData)
        this.activity.seating = data
      } catch (error) { /*  */ }
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
      this.qrCodeDialog = { ... this.qrCodeDialog, ...e }
      this.$refs.codeDialog.saveImage()
    },

  }
}
</script>

<style  lang="scss">
.activity-detail-wrap {
  padding: 40px;

  .title {
    margin: -20px 0 0 -20px;
  }

  .title, .sub-title {
    padding: 10px 0;
  }

  .grid-content {
    padding: 10px 0;
    display: flex;

    .value {
      flex: 1;
    }
  }
  .tags{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #000;
    padding: 10px;
    .tags-block{
      margin:0 8px 0px 0;
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

.activity-card {
  height: 200px;
}

.image-upload {
  margin-right: 10px;
  /deep/ .el-upload--picture-card{
    width: 80px;
    height: 80px;
  }
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
      .el-icon-circle-close,.image-preview {
        display: block;
      }
    }
  }
</style>
