<template>
  <a-modal
    :title="isEdit ? '编辑嘉宾' : '添加嘉宾'"
    :visible="visible"
    ok-text="保存"
    width="800px"
    @cancel="onClose"
    @ok="onSave"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ style: { width: '150px' } }"
    >
      <a-form-item label="嘉宾姓名：" name="name">
        <a-input
          v-model:value.trim="formState.name"
          placeholder="限15字内"
          :maxlength="15"
          clearable
        />
      </a-form-item>

      <a-form-item label="职位/头衔：" name="post">
        <a-input
          v-model:value.trim="formState.post"
          placeholder="限20字内"
          :maxlength="20"
          clearable
        />
      </a-form-item>

      <a-form-item label="所在公司/组织：" name="unit">
        <a-input
          v-model:value.trim="formState.unit"
          placeholder="限40字内"
          :maxlength="40"
          clearable
        />
      </a-form-item>

      <a-form-item label="嘉宾头像：" name="portrait">
        <ImageUpload
          v-model:value="formState.portrait"
          class="avator-uploader"
          :limit="1"
          :pattern="new RegExp(/\.(?:png|jpg|jpeg|gif)$/i)"
          :custom-request="uploadSystemLogo"
        />
        <p style="margin: 0; padding: 0">
          建议上传尺寸600px*600px；小于300kb；.jpg,.gif,.png的图片
        </p>
      </a-form-item>

      <a-form-item label="嘉宾介绍：" name="introduction">
        <a-textarea
          v-model:value.trim="formState.introduction"
          type="textarea"
          :rows="6"
          placeholder="5000字内"
          :maxlength="5000"
        />
      </a-form-item>
      <a-form-item v-if="showBank" label="保存至嘉宾库" name="isChamber">
        <a-checkbox
          v-model:checked="formState.isChamber"
          :disabled="disabledChamber"
        >
          同时添加至嘉宾库中，方便下次直接从嘉宾库选择，无需再次创建
        </a-checkbox>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { defineComponent, ref, computed, watch, inject } from "vue";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
import ImageUpload from "@business/components/src/upload/image-uploader";
import { upload } from "@business/common/src/chamber/api/manager";
import {
  checkGuess,
  updateChamberGuest,
} from "@business/common/src/activity/api/activity-guest";
import { cloneDeep } from "lodash";

export default defineComponent({
  name: "GuestFormDialog",
  components: { ImageUpload },
  props: {
    id: {
      type: [String, Number],
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    showBank: {
      type: Boolean,
      default: false,
    },
    staticData: {
      type: Object,
      default: () => {},
    },
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["add", "edit", "editChamber", "update:visible"],
  setup(props, { emit }) {
    const route = useRoute();
    const ckey = inject("ckey");
    const formRef = ref();
    const formState = ref({
      name: "",
      post: "",
      unit: "",
      portrait: [],
      introduction: "",
      isChamber: false,
    });

    const isEdit = computed(() => {
      return !!props.id;
    });

    const activityId = computed(() => {
      return route.query.activityId || "";
    });

    const disabledChamber = computed(() => {
      return isEdit.value && formState.value.isChamber;
    });

    watch(
      () => props.visible,
      (val) => {
        if (!val) return;

        const { chamberGuestsId } = props.staticData;
        formState.value = {
          ...cloneDeep(props.staticData),
          isChamber: chamberGuestsId
            ? chamberGuestsId !== "0"
            : !props.staticData.isChamber,
        };
      }
    );

    const onSave = () => {
      formRef.value.validate().then(async () => {
        if (!(await validateGuestRepeat()))
          return message.error("存在重复数据，不可操作");

        isEdit.value ? editGuest() : createGuest();
      });
    };

    const validateGuestRepeat = async () => {
      if (activityId.value) {
        const { state } = await checkGuess([
          {
            ...formState.value,
            portrait: formState.value.portrait[0].url,
            activityId: activityId.value,
            isChamber: formState.value.isChamber ? 0 : 1,
            flag: !isEdit.value,
          },
        ]);
        if (!state) return false;
      }
      for (let i = 0, len = props.tableData.length; i < len; i++) {
        const item = props.tableData[i];
        const select = formState.value;
        if (
          select.name === item.name &&
          select.post === item.post &&
          select.unit === item.unit &&
          select.introduction === item.introduction
        ) {
          if (props.showBank && select.isChamber === !!item.isChamber) {
            return true;
          }
          return false;
        }
      }
      return true;
    };

    const onClose = () => {
      emit("update:visible", false);
      formRef.value.resetFields();
    };

    const createGuest = () => {
      emit("add", {
        id: Date.now(),
        ...formState.value,
        userId: null,
        isChamber: formState.value.isChamber ? 0 : 1,
        isStatic: true,
        ckey: ckey.value || "ysh",
      });
      onClose();
    };

    const editGuest = () => {
      if (formState.value.isStatic || props.showBank) {
        emit("edit", {
          ...formState.value,
          isChamber: formState.value.isChamber ? 0 : 1,
          chamberGuestsId: formState.value.isChamber ? "1" : "0",
        });
        onClose();
      }

      if (!formState.value.isStatic && !props.showBank) {
        editChamberGuestPromise();
      }
    };

    const editChamberGuestPromise = async () => {
      const params = {
        id: props.id,
        ...formState.value,
        ckey: ckey.value || "ysh",
      };

      delete params.isChamber;

      await updateChamberGuest(params);
      emit("editChamber", {
        ...formState.value,
        isChamber: formState.value.isChamber ? 0 : 1,
      });
      onClose();
    };

    const uploadSystemLogo = (content) => {
      function handleProgress(e) {
        if (content.onProgress) {
          if (e.total > 0) {
            e.percent = (e.loaded / e.total) * 100;
          }
          content.onProgress(e);
        }
      }

      const formData = new FormData();
      formData.append("file", content.file);
      upload(formData, handleProgress).then((response) => {
        formState.value.portrait = [{ url: response.data.filePath }];
        formRef.value.validateFields("portrait");
      });
    };

    return {
      formRef,
      formState,
      rules: {
        name: [{ required: true, message: "请输入嘉宾姓名", trigger: "blur" }],
        post: [{ required: true, message: "请输入职位/头衔", trigger: "blur" }],
        unit: [
          { required: true, message: "请输入所在公司/组织", trigger: "blur" },
        ],
        portrait: [
          { required: true, message: "请上传嘉宾头像", trigger: "change" },
        ],
      },
      isEdit,
      activityId,
      disabledChamber,

      uploadSystemLogo,
      onSave,
      onClose,
    };
  },
});
</script>

<style scoped lang="scss">
.avator-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avator {
  width: 88px;
  height: 88px;
  display: block;
  object-fit: cover;
}
</style>
