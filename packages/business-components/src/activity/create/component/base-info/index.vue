<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    labelAlign="right"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 16 }"
  >
    <a-form-item label="活动名称：" name="activityName">
      <a-input
        v-model:value="formState.activityName"
        show-count
        :maxlength="60"
        placeholder="限60字内"
        style="width: 400px"
      />
    </a-form-item>

    <a-form-item label="报名时间：" name="applyDate">
      <a-range-picker
        v-model:value="formState.applyDate"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        separator="至"
        show-time
        :disabled="status_startingOrEnd"
        style="width: 400px"
      />
    </a-form-item>

    <a-form-item label="活动时间：" name="date">
      <a-range-picker
        v-model:value="formState.date"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        separator="至"
        show-time
        :disabled="status_startingOrEnd"
        style="width: 400px"
      />
    </a-form-item>

    <a-form-item label="活动地点：" name="addressInfo">
      <div class="address-wrap">
        <a-input
          v-model:value="formState.addressInfo"
          :disabled="status_startingOrEnd"
          allowClear
          placeholder="请输入地址"
          style="width: 400px"
        >
          <template #suffix>
            <environment-outlined />
          </template>
        </a-input>
        <div v-if="addressList" class="address-list">
          <div
            v-for="(item, index) in addressList"
            :key="index"
            class="address-item"
            @click="onSelectAddress(item)"
          >
            {{ item.title }}
            <span class="address">{{ item.address }}</span>
          </div>
        </div>
      </div>

      <TencentMap
        width="800px"
        height="390px"
        :addr="formState.addressInfo"
        :location="[formState.longitude, formState.latitude]"
        :address-info="addressInfo"
        @location-change="onLocationChange"
      />
    </a-form-item>

    <a-form-item label="报名对象：" required>
      <a-checkbox
        v-model:checked="applyObject.unlimit"
        :disabled="status_startingOrEnd"
        @change="handleCheckTarget(0)"
      >
        不限
      </a-checkbox>
      <a-checkbox
        v-model:checked="applyObject.limit"
        :disabled="status_startingOrEnd"
        @change="handleCheckTarget(1)"
      >
        {{ ckey ? "限本商会成员" : "限云商会成员" }}
      </a-checkbox>
      <a-checkbox
        v-if="ckey"
        v-model:checked="applyObject.port"
        :disabled="status_startingOrEnd"
        @change="handleCheckTarget(2)"
      >
        限定本商会内指定职位
      </a-checkbox>
      <a-checkbox
        v-if="ckey"
        v-model:checked="applyObject.department"
        :disabled="status_startingOrEnd"
        @change="handleCheckTarget(3)"
      >
        限本商会内指定部门
      </a-checkbox>
    </a-form-item>

    <a-form-item v-if="applyObject.port" label="会内职位：" required>
      <a-select
        v-model:value="port"
        mode="multiple"
        placeholder="请选择"
        :disabled="status_startingOrEnd"
      >
        <a-select-option
          v-for="item in portSelect"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item v-if="applyObject.department" label="会内部门：" required>
      <a-tree-select
        v-model:value="tree"
        tree-checkable
        :tree-data="treeData"
        :fieldNames="{ children: 'children', label: 'label', value: 'value' }"
        allow-clear
        :show-checked-strategy="SHOW_PARENT"
        placeholder="请选择"
        :disabled="status_startingOrEnd"
      />
    </a-form-item>

    <a-form-item label="参加人数：" required>
      <a-checkbox
        v-model:checked="applyNum.unlimit"
        :disabled="status_startingOrEnd"
        @change="handleCheckNum(0)"
      >
        不限
      </a-checkbox>
      <a-checkbox
        v-model:checked="applyNum.limit"
        :disabled="status_startingOrEnd"
        @change="handleCheckNum(1)"
      >
        限
      </a-checkbox>
      <a-input
        v-show="applyNum.limit"
        v-model:value="formState.applyCount"
        style="width: 200px"
        placeholder="大于0的整数"
        :maxlength="9"
        :disabled="status_startingOrEnd"
      >
        <template #suffix>人</template>
      </a-input>
    </a-form-item>

    <a-form-item label="报名审核：" required>
      <a-checkbox
        v-model:checked="applyAudit.unlimit"
        :disabled="status_startingOrEnd"
        @change="handleAuditStatus(0)"
      >
        无需审核
      </a-checkbox>
      <a-checkbox
        v-model:checked="applyAudit.limit"
        :disabled="status_startingOrEnd"
        @change="handleAuditStatus(1)"
      >
        需审核
      </a-checkbox>
    </a-form-item>

    <!-- 扩展功能 -->
    <a-form-item label="扩展功能：">
      <a-checkbox-group v-model:value="expand">
        <a-checkbox :disabled="status_startingOrEnd" :value="1"
          >签到</a-checkbox
        >
        <a-checkbox :disabled="status_startingOrEnd" :value="2"
          >签退</a-checkbox
        >
        <a-checkbox :disabled="status_startingOrEnd" :value="3"
          >座位表</a-checkbox
        >
      </a-checkbox-group>
    </a-form-item>

    <a-form-item label="活动头图：" name="headImage">
      <ImageUpload
        v-model:value="formState.headImage"
        :limit="1"
        :pattern="new RegExp(/\.(?:png|jpg|jpeg)$/i)"
        :custom-request="uploadHeadImage"
        class="activity-header-image upload-image"
      />
      <div style="color: #999; line-height: 1.3; margin-top: 8px">
        建议尺寸 744*300，支持jpg、png
      </div>
    </a-form-item>

    <a-form-item label="活动分享图：" name="listImage" class="upload-style">
      <ImageUpload
        v-model:value="formState.listImage"
        :limit="1"
        :pattern="new RegExp(/\.(?:png|jpg|jpeg)$/i)"
        :custom-request="uploadListImage"
        class="activity-share-image upload-image"
      />
      <div style="color: #999; line-height: 1.3; margin-top: 8px">
        建议尺寸 678*540，支持jpg、png
      </div>
    </a-form-item>
    <a-form-item label="附件：">
      <a-upload
        class="import-upload"
        :beforeUpload="beforeUploadFile"
        @remove="handleRemoveAttachment"
        :maxCount="9"
        :on-remove="handleRemoveAttachment"
        :file-list="formState.attachment"
        :customRequest="handleFile"
      >
        <div class="import-upload-content">
          <a-button type="primary">点击上传</a-button>
          <div style="color: #999">
            上传格式限制word、excel、pdf、ppt、bmp、jpg、png、jpeg
            大小限30M，限9个
          </div>
        </div>
      </a-upload>
    </a-form-item>
    <a-form-item label="活动类型：" name="labels" class="upload-style">
      <CustomSelect
        v-model:value="formState.labels"
        @click="activeVisible = true"
        style="width: 400px"
      />
    </a-form-item>

    <slot> </slot>

    <div class="album-row">
      <a-form-item label="用户图片直播关联权限：">
        <a-radio-group
          v-model:value="formState.authAlbum"
          class="pt5"
          @change="onReleChange"
        >
          <a-radio :value="1">可关联</a-radio>
          <a-radio :value="0">不可关联</a-radio>
        </a-radio-group>
        <div class="tips">
          开启后，参与人员可将图片直播关联到 活动详情 的 会员图片 展示
        </div>
      </a-form-item>
    </div>

    <a-form-item label="报名人数：">
      <a-radio-group v-model:value="formState.applyCountShow" class="pt5">
        <a-radio :value="1">显示</a-radio>
        <a-radio :value="0">不显示</a-radio>
      </a-radio-group>
      <div class="tips">开启后，在开始报名时显示目前已报名人数</div>
    </a-form-item>
    <div v-if="ruleCkeys.includes(ckey) || !ckey">
      <a-form-item label="直播链接类型：">
        <a-radio-group v-model:value="formState.linkType">
          <a-radio :value="1">云会播小程序</a-radio>
          <a-radio :value="2">H5链接</a-radio>
          <a-radio :value="3">商会直播</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="直播间链接：" name="link">
        <a-input
          v-if="formState.linkType !== 3"
          v-model:value="formState.link"
          show-count
          :maxlength="2000"
          placeholder="输入直播间链接，在活动开始后的活动详情页面会显示相应的入口"
          style="width: 500px"
        />
        <a-select
          v-else
          v-model:value="formState.link"
          placeholder="请选择"
          allowClear
          style="width: 500px"
        >
          <a-select-option
            v-for="item in audienceList"
            :key="item.id"
            :value="item.viewerUrl"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
        <div class="mt10">
          <div>提示：</div>
          <div style="margin: 5px 0">若不输入链接，则不显示入口；</div>
          <div>在发布活动后，也可以修改链接。</div>
        </div>
      </a-form-item>

      <a-form-item label="观看权限：" name="competence">
        <a-radio-group v-model:value="formState.competence">
          <a-radio :value="0">不限</a-radio>
          <a-radio v-if="ckey" :value="1">限本商会会员</a-radio>
          <a-radio v-else :value="2">限云商会会员</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        v-if="formState.link && formState.link.trim()"
        label="入口显示："
        name="liveCloseTime"
      >
        <div>
          入口开放时间：
          <a-radio-group v-model:value="formState.liveEntranceDisplayType">
            <a-radio :value="0">报名成功后</a-radio>
            <a-radio :value="1">活动开始后</a-radio>
          </a-radio-group>
        </div>
        <div class="mt10">
          <span style="color: #f56c6c; padding: 5px; font-size: 16px">*</span
          >入口关闭时间：
          <a-date-picker
            v-model:value="formState.liveCloseTime"
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled="status_startingOrEnd"
            style="width: 200px"
            show-time
          />
        </div>
      </a-form-item>
    </div>

    <!--  选择活动类型  -->
    <ActiveTypeDialog
      v-model:visible="activeVisible"
      :active-type="formState.labels"
      @confirm="(val) => (formState.labels = val)"
    />
  </a-form>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  inject,
  getCurrentInstance,
  computed,
} from "vue";
import { TreeSelect, Modal } from "ant-design-vue";
import TencentMap from "@business/components/src/map/tencent";
import ImageUpload from "@business/components/src/upload/image-uploader";

import CustomSelect from "./custom-select.vue";
import ActiveTypeDialog from "./active-type-dialog";
import useVModel from "@business/logics/src/use-vmodel";
import { getDepartmentListTreeSelect } from "@business/common/src/org-structure/org";
import { getListOfSelect } from "@business/common/src/member/api/post";
import { uploadPortrait } from "@business/common/src/activity/api/activity";
import { getAudienceList } from "@business/common/src/merchant/api";
import { uploadFile } from "@business/common/src/content/api/article";
import { ACTIVITY_STATUS } from "@business/common/src/activity/constant";

export default defineComponent({
  name: "BaseInfo",

  components: {
    TencentMap,
    ImageUpload,
    CustomSelect,
    ActiveTypeDialog,
  },

  props: {
    form: {
      type: Object,
      default: () => {},
    },
    status: {
      type: Number,
      default: 1,
    },
    applyObj: {
      type: Object,
      default: () => {},
    },
    valueTree: {
      type: Array,
      default: () => [],
    },
    portValue: {
      type: Array,
      default: () => [],
    },
    applyCount: {
      type: Object,
      default: () => {},
    },
    auditStatus: {
      type: Object,
      default: () => {},
    },
    roleIds: {
      type: Array,
      default: () => [],
    },
    ruleCkeys: {
      type: Array,
      default: () => [],
    },
    isReleActivity: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const ckey = inject("ckey");

    /** 活动状态为已结束和进行中 */
    const status_startingOrEnd = computed(() => {
      return (
        props.status === ACTIVITY_STATUS.STARTING ||
        props.status === ACTIVITY_STATUS.END
      );
    });

    const formState = useVModel(props, "form");
    const applyObject = useVModel(props, "applyObj");
    const tree = useVModel(props, "valueTree");
    const port = useVModel(props, "portValue");
    const applyNum = useVModel(props, "applyCount");
    const applyAudit = useVModel(props, "auditStatus");
    const expand = useVModel(props, "roleIds");

    const addressInfo = ref({}); // 选中搜索的地址信息
    const addressList = ref([]); // 搜索数组
    const treeData = ref([]);
    const { SHOW_PARENT } = TreeSelect;
    const activeVisible = ref(false);
    const formRef = ref();

    // 下拉选择 begin
    const portSelect = ref([]);

    const checkSpace = async (rule, value) => {
      if (!value.trim()) {
        return Promise.reject(new Error("活动名称不能为空"));
      } else {
        return Promise.resolve();
      }
    };

    const checkErtanceDate = (rule, value) => {
      if (!value) {
        return Promise.reject(new Error("入口关闭时间不能为空"));
      } else if (value < formState.value.date[1]) {
        return Promise.reject(new Error("入口关闭时间不能小于活动结束时间"));
      } else {
        return Promise.resolve();
      }
    };

    // 调用腾讯接口获取地址信息
    const onLocationChange = (res) => {
      addressList.value = [];
      addressList.value = res?.data || [];
    };

    const treeSelectInit = async () => {
      const params = {
        ckey: ckey.value,
        parentId: 0,
      };
      const { data } = await getDepartmentListTreeSelect(params);
      treeData.value = data.data;
    };

    const postSelectInit = async () => {
      const params = {
        ckey: ckey.value,
      };
      const { data } = await getListOfSelect(params);
      portSelect.value = data.data;
    };

    // 选择报名对象
    const handleCheckTarget = (val) => {
      applyObject.value.unlimit = false;
      applyObject.value.limit = false;
      applyObject.value.port = false;
      applyObject.value.department = false;

      formState.value.applyObject = val;

      if (val === 0) {
        applyObject.value.unlimit = true;
      } else if (val === 1) {
        applyObject.value.limit = true;
      } else if (val === 2) {
        applyObject.value.port = true;
        tree.value = [];
      } else if (val === 3) {
        applyObject.value.department = true;
        port.value = [];
      }
    };

    // 选择参加人数
    const handleCheckNum = (val) => {
      formState.value.isLimit = val;
      applyNum.value.unlimit = val === 0;
      applyNum.value.limit = val !== 0;
    };

    // 报名审核
    const handleAuditStatus = (val) => {
      formState.value.auditStatus = val;
      applyAudit.value.unlimit = val === 0;
      applyAudit.value.limit = val !== 0;
    };

    const onSelectAddress = (e) => {
      addressInfo.value = e;
      formState.value.province = e.province; // 活动地点(省)
      formState.value.city = e.city || ""; // 活动地点(市)
      formState.value.area = e.district || ""; // 活动地点(区)
      formState.value.addressInfo = e.title; // 活动地点（详细地址）
      formState.value.longitude = e.location?.lng || e.longitude; // 经度
      formState.value.latitude = e.location?.lat || e.latitude; // 纬度

      setTimeout(() => {
        addressList.value = [];
      }, 200);
    };

    const handleProgress = (c, e) => {
      if (c.onProgress) {
        if (e.total > 0) {
          e.percent = (e.loaded / e.total) * 100;
        }
        c.onProgress(e);
      }
    };

    // 上传活动头图
    const uploadHeadImage = async (content) => {
      const formData = new FormData();
      formData.append("file", content.file);
      const { data } = await uploadPortrait(formData, (e) =>
        handleProgress(content, e)
      );
      formState.value.headImage = [{ url: data.filePath }];
    };

    // 上传活动列表图
    const uploadListImage = async (content) => {
      const formData = new FormData();
      formData.append("file", content.file);
      const { data } = await uploadPortrait(formData, (e) =>
        handleProgress(content, e)
      );
      formState.value.listImage = [{ url: data.filePath }];
    };

    const onReleChange = (evt) => {
      if (evt === 0 && props.isReleActivity) {
        Modal.confirm({
          title: "取消关联提醒",
          content: "选择【不可关联】后，当前所关联的会员相册全部取消。",
          okText: "确认",
          cancelText: "取消",
          onCancel() {
            formState.value.authAlbum = 1;
          },
        });
      }
    };

    const audienceList = ref([]);
    const linkSelectInit = async () => {
      const { data } = await getAudienceList(ckey.value);
      audienceList.value = data;
    };
    // 上传文件校验
    const { proxy } = getCurrentInstance();
    const beforeUploadFile = (file) => {
      const rule = file.name.split(".");
      if (!rule.length > 0) {
        proxy.$message.error("上传格式错误");
        return;
      }
      const type = rule.length && rule[rule.length - 1];
      if (
        ![
          "docx",
          "doc",
          "xls",
          "xlsx",
          "pdf",
          "ppt",
          "bmp",
          "BMP",
          "jpg",
          "JPG",
          "png",
          "PNG",
          "jpeg",
          "JPEG",
        ].includes(type)
      ) {
        proxy.$message.error(
          "上传文件只能是 word、excel、pdf、ppt、bmp、jpg、png、jpeg格式!"
        );
        return false;
      }
      // 大小限制30M
      if (file.size / 1024 / 1024 > 30) {
        proxy.$message.error("上传文件大于30M！");
        return false;
      }
    };
    // 上传文件
    const handleFile = async ({ file }) => {
      if (formState.value.attachment.length >= 9) {
        return proxy.$message.error("不能大于9个文件");
      }
      const formData = new FormData();
      formData.append("file", file);
      try {
        const { data } = await uploadFile(formData, "activityAttachment");
        formState.value.attachment.push({
          fileName: file.name,
          name: file.name,
          attachment: data,
        });
      } catch (error) {
        proxy.$message.error("上传失败,请重试");
      }
    };
    // 删除上传文件
    const handleRemoveAttachment = (file) => {
      formState.value.attachment = formState.value.attachment.filter(
        (item) => item.uid !== file.uid
      );
    };
    onMounted(() => {
      if (ckey.value) {
        treeSelectInit();
        postSelectInit();
        return;
      }
      linkSelectInit();
    });

    return {
      ckey,
      formState,
      applyObject,
      tree,
      port,
      applyNum,
      applyAudit,
      expand,
      rules: {
        activityName: [
          { required: true, validator: checkSpace, trigger: "blur" },
        ],
        date: [
          { required: true, message: "活动时间不能为空", trigger: "blur" },
        ],
        applyDate: [
          { required: true, message: "报名时间不能为空", trigger: "blur" },
        ],
        liveCloseTime: [{ validator: checkErtanceDate, trigger: "blur" }],
      },
      addressInfo,
      addressList,
      treeData,
      SHOW_PARENT,
      portSelect,
      activeVisible,
      formRef,
      audienceList,
      status_startingOrEnd,

      onSelectAddress,
      onLocationChange,
      handleCheckTarget,
      handleCheckNum,
      handleAuditStatus,
      uploadHeadImage,
      uploadListImage,
      onReleChange,
      beforeUploadFile,
      handleFile,
      handleRemoveAttachment,
    };
  },
});
</script>

<style scoped lang="scss">
::v-global(.upload-image .ant-upload-picture-card-wrapper),
::v-global(.upload-image .ant-upload),
::v-global(.upload-image .ant-upload-list),
::v-global(.upload-image .ant-upload-list-item),
::v-global(.upload-image .ant-upload-list-item-image),
::v-global(.upload-image .ant-upload-list-picture-card-container) {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  object-fit: fill !important;
}

.app-container {
  .address-wrap {
    margin-bottom: 20px;
    width: 450px;
    position: relative;
    margin-right: 20px;
    z-index: 1000;

    .address-list {
      width: 100%;
      position: absolute;
      background: rgba(252, 250, 250, 0.918);
      border-top: none;
      font-size: 13px;
      color: #5a5a5a;
      max-height: 350px;
      overflow-y: auto;
      top: 111%;
      left: 0;
      .address-item {
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        border-bottom: 1px solid #f1f1f1;
        padding: 5px 10px;
        margin: 0;
        cursor: pointer;
        line-height: 40px;
        &:hover {
          background: #eff6fd;
        }
        .address {
          font-size: 12px;
          color: #b9b9b9;
          margin-left: 20px;
        }
      }
    }
  }

  .activity-header-image {
    width: 298px;
    height: 120px;
  }

  .activity-share-image {
    width: 117px;
    height: 80px;
  }
}
</style>
