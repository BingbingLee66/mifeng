<template>
  <Panel class="app-container">
    <Preview ref="previewRef" />
    <a-tabs v-model:activeKey="activeName">
      <a-tab-pane key="base" tab="活动信息">
        <BaseInfo
          ref="baseInfoRef"
          v-model:form="formState"
          v-model:apply-obj="applyObject"
          v-model:value-tree="valueTree"
          v-model:port-value="portValue"
          v-model:apply-count="applyCount"
          v-model:audit-status="auditStatus"
          v-model:role-ids="roleIds"
          :rule-ckeys="ruleCkeys"
          :is-rele-activity="isReleActivity"
          :status="status"
          class="mt-10"
        >
          <slot name="baseInfoItem" :formState="formState"></slot>
        </BaseInfo>
      </a-tab-pane>

      <a-tab-pane key="apply" tab="报名信息" :disabled="disabledApplyBtn">
        <ApplyInfo
          v-model:form="formState"
          v-model:apply-array="arrayData"
          :status="status"
          class="mt-10"
        />
      </a-tab-pane>

      <a-tab-pane key="guest" tab="活动嘉宾" :disabled="disabledGuestBtn">
        <ActiveGuest @guestList="addGuestList" class="mt-10" />
      </a-tab-pane>
    </a-tabs>

    <div class="btn-group mt20">
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button v-if="activeName === 'base'" @click="onPreview"
          >预览</a-button
        >

        <a-button v-if="activeName !== 'base'" @click="onPrev" class="ml10"
          >上一步</a-button
        >
        <a-button
          v-if="activeName !== 'guest'"
          type="primary"
          @click="onNext"
          class="ml10"
        >
          下一步
        </a-button>
        <template v-if="activeName === 'guest'">
          <a-button @click="onSave(0, formState.isPublish)" class="ml10"
            >保存，暂不发布</a-button
          >
          <a-button
            type="primary"
            @click="onSave(1, formState.isPublish)"
            class="ml10"
            >保存并发布</a-button
          >
        </template>
      </a-form-item>
    </div>

    <!-- 到场人数提示 -->
    <a-modal
      title="到场人数设置后，小程序显示"
      v-model:visible="isPresent"
      width="30%"
    >
      <div class="Present-img">
        <img
          src="https://ysh-cdn.kaidicloud.com/prod/png/info.png"
          class="pic"
          alt=""
        />
      </div>
      <template #footer>
        <a-button type="primary" @click="isPresent = false">知道了</a-button>
      </template>
    </a-modal>
  </Panel>
</template>

<script>
import { defineComponent, ref, computed, inject, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { useFetchDetail } from "./use/useFetchDetail";
import { useSubmitForm } from "./use/useSubmitForm";
import Preview from "./component/base-info/preview";
import ActiveGuest from "./component/guest-info/active-guest";
import BaseInfo from "./component/base-info";
import ApplyInfo from "./component/apply-info";
import { getAlbumRelevance } from "@business/common/src/activity/api/activity";
import { cloneDeep } from "lodash";
import { DataCollect } from "@business/logics/src/dataCollect";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    Preview,
    BaseInfo,
    ApplyInfo,
    ActiveGuest,
  },

  setup() {
    const ckey = inject("ckey");
    const route = useRoute();
    const store = useStore();
    const activeName = ref("base"); // tab
    const disabledApplyBtn = ref(true);
    const isReleActivity = ref(false); // 是否关联活动

    const isPresent = ref(false);
    const previewRef = ref();
    const baseInfoRef = ref();

    const activityId = computed(() => {
      return route.query.activityId || "";
    });

    const formState = ref({
      id: "",
      activityName: "", // 活动名称
      headImage: [], // 活动头图
      listImage: [], // 活动列表图
      date: [], // 活动时间
      applyDate: [], // 报名时间
      province: "", // 活动地点(省)
      city: "", // 活动地点(市)
      area: "", // 活动地点(区)
      addressInfo: "", // 活动地点（详细地址）
      addresscon: "", // 搜索内容
      applyObject: 0, // 报名对象
      isLimit: 0, // 是否限制参加人数
      applyCount: "", // 参加人数
      introduce: "", // 活动介绍
      competence: "0", // 观看权限 0 不限 1 限本商会会员
      link: null, // 直播链接
      signType: 0, // 报名方式是否必填 0否 1是
      arriveType: 1, // 到场人数是否必填 0否 1是
      longitude: 113.326548, // 经度
      latitude: 23.125821, // 纬度
      auditStatus: 0, // 报名审核
      extraSignin: 0, // 拓展功能签到 0否 1是
      extraSignout: 0, // 拓展功能签退 0否 1是
      extraSeat: 0, // 拓展功能座位 0否 1是
      isPublish: 0, // 是否发布 0否 1是
      authAlbum: 1, // 图片直播关联权限 1可关联 0不可关联
      applyCountShow: 0, // 是否显示报名人数
      liveEntranceDisplayType: 1, // 直播间入口显示类型 0 报名成功后 1 活动开始后
      liveEntranceCloseTime: null, // 直播间入口关闭时间
      linkType: 1, // 直播链接类型 1 云会播小程序 2 H5链接
      daibao: 1, // 代报名是否支持
      labels: [],
      signNeedCard: 1,
      cardShow: 1,
      cardShowType: 1,
      cardInfoType: 0,
      attachment: [],
      liveCloseTime: "",
      arrayData: [],
      canReplaceApply: 2,
    });

    const validatorStepOne = async (showError = true) => {
      let res = false;

      const validatorRes = () => {
        if (!formState.value.applyObject && formState.value.applyObject !== 0) {
          message.error("请选择报名对象");
          res = false;
          return;
        }

        if (!formState.value.isLimit && formState.value.isLimit !== 0) {
          message.error("请选择参加人数");
          res = false;
          return;
        }

        if (formState.value.isLimit === 1) {
          const regexp = /^[1-9]\d*$/;
          if (!regexp.test(formState.value.applyCount)) {
            message.error("参加人数为大于0的正整数");
            res = false;
            return;
          }
        }

        res = true;
      };

      if (showError) {
        await baseInfoRef.value.formRef.validate();
        validatorRes();
      } else {
        if (
          !formState.value.activityName ||
          !formState.value.date.length ||
          !formState.value.applyDate.length
        ) {
          res = false;

          return;
        }

        validatorRes();
      }

      return res;
    };

    const fetchAlbumRelevance = async () => {
      const { data, state } = await getAlbumRelevance({
        activityId: activityId.value,
      });
      if (!state) return;
      isReleActivity.value = data;
    };

    const onPrev = () => {
      switch (activeName.value) {
        case "guest":
          activeName.value = "apply";
          break;
        case "apply":
          activeName.value = "base";
          break;
        default:
          activeName.value = "base";
          break;
      }
    };

    const onNext = async () => {
      switch (activeName.value) {
        case "base":
          if (await validatorStepOne()) activeName.value = "apply";
          break;
        case "apply":
          // 如果选择了自定义报名 但是没有选择自定义报名信息 就返回提示
          if (+formState.value.signType === 0 && !arrayData.value.length) {
            return message.error(
              "自定义报名表需添加报名信息才可以发布活动，若无需自定义报名表，请选择【一键报名】"
            );
          }
          activeName.value = "guest";
          break;
        default:
          activeName.value = "base";
          break;
      }
    };

    const onPreview = () => {
      previewRef.value.open(formState.value);
    };

    const addGuestList = (val) => {
      const tempVal = cloneDeep(val);
      tempVal.forEach((item) => {
        if (!activityId.value || typeof item.id === "number") delete item.id;
        delete item.activityId;
        item.isChamber = item.chamberGuestsId
          ? item.chamberGuestsId !== "0"
            ? 0
            : 1
          : item.isChamber;
        item.portrait = item.portrait?.[0].url || "";
        if (item.chamberGuestsId === "1") delete item.chamberGuestsId;
        if (ckey.value) item.ckey = ckey.value;
      });
      formState.value = {
        ...formState.value,
        activityGuestsDTOList: tempVal || [],
      };
    };

    const {
      status,
      roleIds,
      applyObject,
      portValue,
      valueTree,
      applyCount,
      auditStatus,
      arrayData,
      disabledGuestBtn,
      fetchDetail,
    } = useFetchDetail(formState, activityId, baseInfoRef, activeName);
    const { onSave, ruleCkeys } = useSubmitForm(
      formState,
      roleIds,
      ckey,
      activityId,
      valueTree,
      portValue,
      arrayData
    );
    onMounted(() => {
      if (activityId.value) {
        fetchDetail();
        fetchAlbumRelevance();
      } else {
        DataCollect.Activity.create({ store });
      }
    });
    watch(
      () => formState.value,
      async () => {
        if (activeName.value === "base") {
          disabledApplyBtn.value = !(await validatorStepOne(false));
        }

        if (activeName.value === "apply") {
          disabledGuestBtn.value =
            +formState.value.signType === 0 && !arrayData.value.length;
        }
        if (formState.value.canReplaceApply === 1) {
          let arrlastData = [];
          if (arrayData.value.length) {
            arrlastData = arrayData.value;
            arrlastData.splice(0, 2);
          }
          arrayData.value = [
            {
              title: "参与人姓名",
              msgAlert: "请输入姓名",
              lengthLimit: "",
              check: 1,
              selects: [
                {
                  value: "",
                },
                {
                  value: "",
                },
              ],
              key: ";",
              type: "0",
            },
            {
              title: "参与人手机号",
              msgAlert: "请输入手机号",
              lengthLimit: "",
              check: 1,
              selects: [
                {
                  value: "",
                },
                {
                  value: "",
                },
              ],
              key: ";",
              type: "0",
            },
            ...arrlastData,
          ];
        }
      },
      { deep: true }
    );
    return {
      status,
      valueTree,
      activeName,
      disabledApplyBtn,
      disabledGuestBtn,
      portValue,
      arrayData,
      formState,
      isReleActivity,
      roleIds,
      applyObject,
      applyCount,
      auditStatus,
      isPresent,
      ruleCkeys,
      previewRef,
      baseInfoRef,

      onPreview,
      addGuestList,
      onSave,
      onNext,
      onPrev,
    };
  },
});
</script>

<style lang="scss" scoped></style>
