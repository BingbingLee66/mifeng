<template>
  <div class="containers">
    <!-- 活动基本信息 start -->
    <div class="flex">
      <a-card class="activity-msg">
        <div class="border">
          <div>
            <div class="board-title">{{ activity.activityName }}</div>
            <div v-if="activity.activitySignUpStartTime" class="mb-2">
              报名时间：{{
                $filters.dateFormat(+activity.activitySignUpStartTime)
              }}
              ～{{ $filters.dateFormat(+activity.activitySignUpEndTime) }}
            </div>
            <div class="mb-2">
              活动时间：{{
                $filters.dateFormat(+activity.activityStartTime)
              }}
              ～{{ $filters.dateFormat(+activity.activityEndTime) }}
            </div>
            <div class="mb-2">举办地点：{{ activity.hostPlace }}</div>
            <div v-if="activity.limit">
              <span class="mr10">参加限制</span>
              {{ activity.numberOfApplicants }}/{{ activity.participants }}
            </div>
          </div>
          <div class="board-right">
            <img
              class="qr-code"
              :src="activity.qrCode"
              @click="activityQrCodeShow = true"
            />
            <div class="qr-code-desc">
              活动二维码
              <a-button type="link" @click="$refs.activityDialog.saveImage()">
                下载
              </a-button>
            </div>
            <SaveImgDialog
              ref="activityDialog"
              v-model:visible="activityQrCodeShow"
              title="活动二维码"
            >
              <template v-slot="{ id }">
                <ActivityCode :id="id" :activity="activity"
              /></template>
            </SaveImgDialog>
          </div>
        </div>
      </a-card>
      <!-- 活动基本信息 end -->
      <!-- 座位表 start -->
      <a-card v-if="activity.seatFunction" style="width: 400px">
        <div class="board-title">座位表</div>
        <div class="flex-x-0-center">
          <ImageUpLoad
            v-model:url="activity.seating"
            :customRequest="upload"
            :pattern="new RegExp(/\.(?:png|jpg|jpeg)$/i)"
            :limit="1"
          />
          <span style="margin-left: 10px">会员可在小程序看到座位排序情况</span>
        </div>
      </a-card>
    </div>
    <!-- 座位表 end -->
    <!-- 会员图片 start -->
    <a-card class="activity-card" shadow="never" style="width: 600px">
      <div class="board-title">会员图片</div>
      <div>
        <span class="people-num">{{ activity.numberOfAssociated }}</span>
        人关联了活动
      </div>
      <a-button
        class="btn"
        type="link"
        @click="
          $router.push({
            path: '/activity/member-album',
            query: { id: activityId },
          })
        "
      >
        查看会员相册列表
      </a-button>
    </a-card>
    <!-- 会员图片 end -->

    <!-- 签到签退 start -->
    <a-card
      v-if="activity.signFunction || activity.signOutFunction"
      class="activity-card"
      shadow="never"
    >
      <div class="flex-x-0-center">
        <div>
          <div class="board-title">签到/签退码</div>
          <div class="flex-x-between-center">
            <div v-for="(item, i) of codeList" :key="i">
              <div
                class="qr-code-wrap flex-y-center-center"
                v-show="activity[item.codeKey]"
              >
                <img
                  class="qr-code"
                  :src="activity[item.codeKey]"
                  @click="
                    Object.assign(qrCodeDialog, {
                      url: activity[item.codeKey],
                      title: item.title,
                      show: true,
                    })
                  "
                />
                <a-button
                  type="link"
                  @click="
                    Object.assign(qrCodeDialog, {
                      url: activity[item.codeKey],
                      title: item.title,
                    });
                    $refs.codeDialog.saveImage();
                  "
                >
                  下载{{ item.title }}
                </a-button>
              </div>
            </div>
            <SaveImgDialog
              ref="codeDialog"
              v-model:visible="qrCodeDialog.show"
              :title="qrCodeDialog.title"
            >
              <template v-slot="{ id }">
                <SignInCode
                  :id="id"
                  :title="qrCodeDialog.title"
                  :url="qrCodeDialog.url"
                />
              </template>
            </SaveImgDialog>
          </div>
        </div>
        <div class="board-right flex-y-center-center">
          <div class="desc">
            <div class="desc-title">使用说明</div>
            <div
              class="desc-item"
              v-for="(item, index) in QR_CODE_DESC"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </a-card>
    <!--  签到签退 end -->
  </div>
</template>
<script>
import {
  getChamberActivityInfoById,
  uploadSeating,
} from "@business/common/src/activity/api/activity-verify";
import { downloadFile } from "@business/common/src/utils";
import ImageUpLoad from "@business/components/src/upload/image-uploader";
import { QR_CODE_DESC } from "@business/common/src/activity/constant";
import { useRoute } from "vue-router";
import { reactive, ref } from "vue";
import SaveImgDialog from "@business/components/src/html2img/SaveImgDialog.vue";
import SignInCode from "./SignInCode.vue";
import ActivityCode from "./ActivityCode.vue";
export default {
  components: {
    ImageUpLoad,
    SaveImgDialog,
    SignInCode,
    ActivityCode,
  },
  emit: ["activityInfo"],
  setup(props, { emit }) {
    const route = useRoute();
    const { activityId, status } = route.query;
    // 数据定义
    const activity = reactive({
      seating: null,
    });
    // 请求
    const getActivityInfo = async () => {
      const { data } = await getChamberActivityInfoById(activityId);
      Object.assign(activity, data);
      emit("activityInfo", activity);
    };
    const upload = async (content) => {
      const formData = new FormData();
      formData.append("activityId", activityId);
      formData.append("multipartFile", content.file);
      const { data } = await uploadSeating(formData);
      activity.seating = data;
    };
    const activityQrCodeShow = ref(false);
    const qrCodeDialog = reactive({ show: false, title: "", url: "" });

    getActivityInfo();
    return {
      status,
      activityId,
      activity,
      upload,
      activityQrCodeShow,
      downloadFile,
      codeList: [
        { title: "签到码", codeKey: "signInCode" },
        { title: "临时报名签到码", codeKey: "temporaryCheckInCode" },
        { title: "签退码", codeKey: "checkoutCode" },
      ],
      QR_CODE_DESC,
      qrCodeDialog,
    };
  },
};
</script>

<style lang="scss" scoped>
.containers {
  padding: 25px 25px 0 25px;
  .activity-msg {
    width: 600px;
    margin-right: 20px;
  }
  .activity-card {
    margin: 20px 20px 20px 0px;
  }
}
.border {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;

  .qr-code {
    width: 75px;
    height: 75px;
  }
  .board-right {
    width: 160px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
}
.seating,
.avatar-uploader {
  width: 102px;
  height: 102px;
}
.board-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}
.people-num {
  font-size: 30px;
}
.btn {
  padding: 0;
  margin: 0;
}
.qr-code {
  width: 75px;
  height: 75px;
}
.desc {
  font-size: 16px;
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
      content: "";
      position: absolute;
      left: 0;
      top: 11px;
      display: block;
      width: 4px;
      height: 4px;
      background-color: #000;
      border-radius: 50%;
    }
  }
}
</style>
