<template>
  <div class="flex-x-between-center board-wrapper">
    <a-card class="board" style="width: 60%">
      <div class="flex-x-between-center">
        <div class="board-left">
          <div class="board-title">{{ activity.activityName }}</div>
          <div v-if="activity.activitySignUpStartTime" class="board-item">
            <span class="mr10">报名时间</span> {{ $filters.dateFormat(activity.activitySignUpStartTime) }} ～
            {{ $filters.dateFormat(activity.activitySignUpEndTime) }}
          </div>
          <div class="board-item">
            <span class="mr10">活动时间</span> {{ $filters.dateFormat(activity.activityStartTime) }} ～
            {{ $filters.dateFormat(activity.activityEndTime) }}
          </div>
          <div class="board-item"><span class="mr10">举办地点</span> {{ activity.addressInfo }}</div>
          <div v-if="activity.limit" class="board-item">
            <span class="mr10">参加限制</span> {{ activity.numberOfApplicants }}/{{ activity.participants }}
          </div>
        </div>
        <div class="board-right">
          <img
            class="qr-code"
            :src="activity.qrCode"
            @click="showImage({ url: activity.qrCode, title: '活动二维码' })"
          />
          <div class="qr-code-desc">
            活动二维码
            <a-button type="link" @click="onQrCodeDownload({ url: activity.qrCode, title: '活动二维码' })"
              >下载</a-button
            >
          </div>
        </div>
      </div>
    </a-card>
    <a-card class="board" v-if="activity.extraSeat" style="width: 40%">
      <div class="flex-x-between-center">
        <div class="board-left">
          <div class="board-title" style="margin-bottom: 5px">座位表</div>
          <div class="flex-x-center-center">
            <ImageUpLoad
              v-model:url="activity.seating"
              :customRequest="upload"
              :pattern="new RegExp(/\.(?:png|jpg|jpeg)$/i)"
              :limit="1"
            />
            <div>会员可在小程序看到座位排序情况</div>
          </div>
        </div>
      </div>
    </a-card>
  </div>
  <a-card class="board" v-if="activity.extraSignin || activity.extraSignout">
    <div class="flex-x">
      <div class="board-left">
        <div class="board-title">签到/签退码</div>
        <div class="flex-x-between-center">
          <div v-for="(item, i) of codeList" :key="i" class="qr-code-wrap flex-y-center-center">
            <img
              class="qr-code"
              :src="activity[item.codeKey]"
              @click="showImage({ url: activity[item.codeKey], title: item.title })"
            />
            <a-button type="link" @click="onQrCodeDownload({ url: activity[item.codeKey], title: item.title })"
              >下载{{ item.title }}</a-button
            >
          </div>
        </div>
      </div>
      <div class="board-right">
        <div class="desc">
          <div class="desc-title">使用说明</div>
          <ul>
            <li>保存图片打印在活动海报、易拉宝等场合</li>
            <li>用户使用微信扫码即签到成功，并显示会场座位号。</li>
            <li>临时报名签到码用于临时到场会员，未报名无法签到情况，扫码后自动通过并签到。</li>
          </ul>
        </div>
      </div>
    </div>
  </a-card>
  <Panel>
    <a-row justify="space-between">
      <a-col :span="6">
        <div class="grid-content">
          <div class="label">活动状态：</div>
          <div class="value">{{ activity.status == 1 ? '未开始' : activity.status == 2 ? '进行中' : '已结束' }}</div>
        </div></a-col
      >
      <a-col :span="6"
        ><div class="grid-content">
          <div class="label">报名审核：</div>
          <div class="value">{{ activity.auditStatus === 1 ? '需审核' : '不需审核' }}</div>
        </div></a-col
      >
      <a-col :span="6">
        <div class="grid-content">
          <div class="label">活动地址：</div>
          <div class="value introduce">{{ activity.addressInfo }}</div>
        </div></a-col
      >
    </a-row>
    <a-row justify="space-between">
      <a-col :span="6">
        <div class="grid-content">
          <div class="label">已报名人数：</div>
          <div class="value">{{ activity.registeredCount }}</div>
        </div></a-col
      >
      <a-col :span="6"
        ><div class="grid-content">
          <div class="label">拓展功能：</div>
          <div class="value">
            {{ expendValue }}
          </div>
        </div></a-col
      >
      <a-col :span="6">
        <div class="grid-content">
          <div class="label">报名时间：</div>
          <div class="value">
            {{ $filters.dateFormat(activity.applyStartTime) }} ~ {{ $filters.dateFormat(activity.applyEndTime) }}
          </div>
        </div></a-col
      >
    </a-row>
    <a-row justify="space-between">
      <a-col :span="6">
        <div class="grid-content">
          <div class="label">参加人数：</div>
          <div class="value">{{ activity.isLimit == 0 ? '不限' : activity.activityCount }}</div>
        </div></a-col
      >
      <a-col :span="6">
        <div class="grid-content">
          <div class="label">类型摘要：</div>
          <div class="value">
            <div v-if="activity.labels" class="tags">
              <div v-for="(item, index) in activity.labels" :key="index" class="tags-block">
                #{{ item.label }} <span v-if="activity.labels.length - 1 != index">,</span>
              </div>
            </div>
          </div>
        </div></a-col
      >
      <a-col :span="6">
        <div class="grid-content">
          <div class="label">活动时间：</div>
          <div class="value">
            {{ $filters.dateFormat(activity.activityStartTime) }} ~ {{ $filters.dateFormat(activity.activityEndTime) }}
          </div>
        </div></a-col
      >
    </a-row>
    <a-row justify="space-between">
      <a-col :span="6">
        <div class="grid-content">
          <div class="label">报名对象：</div>
          <div class="value">{{ applyObject }}</div>
        </div></a-col
      >
      <a-col :span="6"
        ><div class="grid-content">
          <div class="label">图片直播关联权限：</div>
          <div class="value">{{ activity.zhiboAddressType == 1 ? '云会播小程序' : 'H5链接' }}</div>
        </div></a-col
      >
      <a-col :span="6">
        <div class="grid-content">
          <div class="label">直播间链接：</div>
          <div class="value">{{ activity.zhiboAddress || '--' }}</div>
        </div></a-col
      >
    </a-row>
    <div class="grid-content">
      <div class="label">活动简介：</div>
      <div class="value introduce" v-html="activity.introduce" />
    </div>
    <div class="grid-content">
      <div class="label">活动头图：</div>
      <div class="value"><img :src="activity.headImage" alt="" /></div>
    </div>
    <div class="grid-content">
      <div class="label">活动分享图：</div>
      <div class="value"><img :src="activity.listImage" alt="" /></div>
    </div>
    <div class="grid-content">
      <div class="label">招商附件：</div>
      <div class="value">
        <div v-for="(item, index) in activity.attachment" :key="index">
          <a-button type="link" @click="downLoadAttach(item)">{{ item.fileName }}</a-button>
        </div>
      </div>
    </div>
    <div v-if="activity.activityGuestsVOS && activity.activityGuestsVOS.length > 0" class="grid-content guests-content">
      <div class="label">嘉宾信息：</div>
      <div class="value guests">
        <a-card v-for="item in activity.activityGuestsVOS" :key="item.id" class="box-card">
          <div>
            <div class="user">
              <div class="user-msg">
                <span class="name">{{ item.name }}</span>
                <span class="unit">{{ item.unit }}</span>
                <span
                  >职位：
                  {{ item.post }}
                </span>
              </div>
              <img class="portrait" :src="item.portrait" />
            </div>
            <div style="margin: 0 0 5px 10px">嘉宾介绍：</div>
            <div style="display: inline-block; margin-left: 10px">{{ item.showContent }}</div>
            <span v-if="item.showMore" style="color: #2878ff; cursor: pointer" @click="showDialog(item)">查看更多</span>
          </div>
        </a-card>
      </div>
    </div>
  </Panel>
  <a-modal :visible="previewVisible" :title="title" :footer="null" @cancel="handleCancel">
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>
<script>
import { activityDetail, uploadSeating } from '@/api/activity/activity'
import { useRoute } from 'vue-router'
import { computed, reactive, toRefs } from 'vue'
import { deleteInvesSeating } from '@/api/zhaoshang/activity/activity-verify-new'
import { downloadByBlob, filetype } from '../util'
import ImageUpLoad from '@/components/upload/image-uploader'
import { Modal } from 'ant-design-vue'
import { APPLY_OBJECT_MAP, SEATING_MAP, SIGN_IN_MAP, SIGN_OUT_MAP } from '@/constant/activity'
export default {
  components: {
    ImageUpLoad
  },
  setup() {
    const activityInfo = useActivity()
    return {
      ...activityInfo,
      codeList: [
        { title: '签到码', codeKey: 'signInCode' },
        { title: '临时报名签到码', codeKey: 'temporaryCheckInCode' },
        { title: '签退码', codeKey: 'checkoutCode' }
      ]
    }
  }
}
function useActivity() {
  const route = useRoute()
  const activityId = route.query.activityId || ''
  const activity = reactive({
    seating: '',
    id: activityId
  })
  const fileList = computed(() => {
    return activity.seating ? [{ url: activity.seating }] : []
  })
  const applyObject = computed(() => {
    const { applyObject } = activity
    return APPLY_OBJECT_MAP.get(applyObject)
  })
  const expendValue = computed(() => {
    const { extraSignin, extraSignout, extraSeat } = activity
    return SIGN_IN_MAP.get(extraSignin) + SIGN_OUT_MAP.get(extraSignout) + SEATING_MAP.get(extraSeat)
  })
  const getActivityInfo = async () => {
    const { data } = await activityDetail({ id: activityId })
    Object.assign(activity, data)
    handelActivityGuests()
  }
  getActivityInfo()
  const handelActivityGuests = () => {
    const { activityGuestsVOS } = activity
    if (!activityGuestsVOS?.length > 0) return
    activityGuestsVOS.forEach(i => {
      if (i.introduction.length > 500) {
        i.showMore = true
        i.showContent = i.introduction.slice(0, 500)
      } else {
        i.showMore = false
        i.showContent = i.introduction
      }
    })
    activity.activityGuestsVOS = activityGuestsVOS
  }
  // 上传逻辑
  const upload = async content => {
    const formData = new FormData()
    formData.append('activityId', activityId)
    formData.append('multipartFile', content.file)
    try {
      const { data } = await uploadSeating(formData)
      activity.seating = data
    } catch (error) {}
  }
  const delSeating = async () => {
    await deleteInvesSeating(activityId)
    activity.seating = ''
  }
  const onQrCodeDownload = e => {
    downloadByBlob(e.url, e.title)
  }
  // 下载
  const downLoadAttach = item => {
    const arr = item.attachment.split('.')
    const type = arr[arr.length - 1]
    if (!type) return
    if (filetype.indexOf(type) !== -1) {
      window.open(item.attachment)
    } else {
      downloadByBlob(item.attachment, item.fileName)
    }
  }
  const showDialog = ({ introduction: content }) => {
    Modal.confirm({
      title: '嘉宾介绍',
      icon: '',
      content,
      okText: '我知道了',
      cancelButtonProps: { style: { display: 'none' } }
    })
  }
  const previewInfo = reactive({ previewImage: '', previewVisible: false, title: '' })
  const showImage = ({ url, title }) => {
    previewInfo.previewImage = url
    previewInfo.previewVisible = true
    previewInfo.title = title
  }
  const handleCancel = () => {
    previewInfo.previewVisible = false
  }
  return {
    activity,
    upload,
    delSeating,
    onQrCodeDownload,
    downLoadAttach,
    showDialog,
    fileList,
    applyObject,
    showImage,
    handleCancel,
    ...toRefs(previewInfo),
    expendValue
  }
}
</script>
<style lang="scss" scoped>
.board-wrapper {
  align-items: stretch;
}
.board {
  margin: 20px 24px 0;
  .board-left {
    max-width: 70%;
  }
  .board-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 25px;
    @include ellipsis(2);
  }
  .board-item {
    margin-bottom: 10px;
    @include ellipsis(1);
  }
  .board-right {
    text-align: center;

    .qr-code-wrap {
      margin-right: 15px;
    }
    .qr-code-desc {
      width: 150px;
    }
  }
  .qr-code {
    @include size(75px, 75px);
  }
}
.grid-content {
  padding: 10px 0;
  display: flex;
  .introduce {
    @include ellipsis(1);
  }
  .value {
    flex: 1;
    :deep(img) {
      width: 200px;
    }
  }
}
.image-upload {
  margin-right: 10px;
}
:deep(.ant-upload.ant-upload-select-picture-card) {
  @include size(146px, 146px);
}
:deep(.ant-upload.ant-upload-select-picture-card img) {
  @include size(146px, 146px);
}
:deep(.ant-upload-list-picture-card-container) {
  @include size(146px, 146px);
}
.desc {
  text-align: left;
  .desc-title {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 10px;
  }
}
.guests {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
.user {
  display: flex;
  justify-content: space-between;
}
.user-msg {
  display: flex;
  flex-direction: column;
}
.guests-content {
  .value {
    flex: 1;
    :deep(img) {
      width: 100px;
      height: 100px;
      flex-shrink: 0;
    }
  }
  .name,
  .unit {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
.box-card {
  width: 40%;
  margin: 0px 15px 10px 0px;
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
.seating-wrapper {
  position: relative;
  .del-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    color: red;
    display: none;
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
    .image-preview,
    .del-icon {
      display: block;
    }
  }
}
</style>
