<template>
  <div class="p-albumCreate">
    <Panel>
      <AForm
        ref="formRef"
        :model="formState"
        name="basic"
        :label-col="{ span: 3 }"
        :wrapperCol="{ span: 12 }"
        autocomplete="off"
        @finish="onSave"
      >
        <AFormItem
          label="图片直播名称"
          name="albumName"
          :rules="[{ required: true, message: '相册名称不能为空' }]"
        >
          <a-input
            v-model:value="formState.albumName"
            placeholder="限60字内"
            :maxlength="60"
          />
        </AFormItem>
        <AFormItem label="图片直播介绍" name="introduce">
          <a-textarea
            v-model:value="formState.introduce"
            :maxlength="200"
            showCount
            :autoSize="{ minRows: 3 }"
          />
        </AFormItem>
        <AFormItem label="关联业务" name="type">
          <a-select
            v-model:value="formState.type"
            style="width: 300px"
            placeholder="请选择"
            :options="getMapDict(ALBUM_RELATE_TYPE_MAP)"
          >
          </a-select>
        </AFormItem>

        <AFormItem
          v-if="formState.type === ALBUM_RELATE_TYPE.ACTIVITY"
          label="关联活动"
          name="businessId"
          :rules="[
            {
              required: true,
              validator: async (rule, value) => {
                if (formState.type === ALBUM_RELATE_TYPE.ACTIVITY && !value)
                  throw '关联活动不能为空';
              },
              trigger: 'change',
            },
          ]"
        >
          <a-select
            v-model:value="formState.businessId"
            show-search
            placeholder="请选择"
            :filter-option="
              (input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            "
            style="width: 300px"
            :options="businessList"
          />
        </AFormItem>
        <slot :form="formState"></slot>
        <AFormItem style="min-height: 50px">
          <template #label>
            <div>前台图片管理</div>
            <div class="desc">最多5位</div>
          </template>
          <div v-for="item of albumAdminPhones" :key="item">
            {{ item }}
            <a-button
              type="link"
              style="color: red"
              @click="delAlbumAdminUser(item)"
              >删除</a-button
            >
          </div>
          <a-button
            v-if="albumAdminPhones.length < 5"
            type="link"
            @click="addUserModal.visible = true"
            >+添加上传人员</a-button
          >
        </AFormItem>
        <AFormItem :wrapper-col="{ offset: 2 }">
          <AButton @click="isPreview = true" class="mr10">预览</AButton>
          <AButton type="primary" html-type="submit" :loading="submitLoading"
            >确认</AButton
          >
        </AFormItem>
      </AForm>
      <a-modal
        v-model:visible="addUserModal.visible"
        title="添加人员"
        width="40%"
        :footer="null"
      >
        <AForm
          ref="modalFormRef"
          :model="addUserModal"
          autocomplete="off"
          @finish="addAlbumAdminUser"
        >
          <AFormItem
            label=""
            name="inputVal"
            :rules="[
              { required: true, message: '手机号不能为空' },
              {
                validator: async (rule, value) => {
                  if (
                    !/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(
                      value
                    )
                  )
                    throw '手机号格式不正确';
                  if (albumAdminPhones.includes(value)) throw '手机号已存在';
                },
                trigger: 'change',
              },
            ]"
          >
            <a-input
              v-model:value.trim="addUserModal.inputVal"
              placeholder="请输入手机号"
            />
          </AFormItem>
          <AFormItem style="text-align: right">
            <AButton @click="addUserModal.visible = false" class="mr10"
              >返回</AButton
            >
            <AButton type="primary" html-type="submit">确认</AButton>
          </AFormItem>
        </AForm>
      </a-modal>
    </Panel>
    <AlbumPreview v-model:visible="isPreview" :album="formState" />
  </div>
</template>

<script setup>
import { Modal } from "ant-design-vue";
import { defineComponent, reactive, computed, ref, watch, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  getActivityList,
  saveAlbum,
  getAlbumInfo,
} from "@business/common/src/album/api";
import AlbumPreview from "./components/AlbumPreview";
import {
  ALBUM_RELATE_TYPE_MAP,
  ALBUM_RELATE_TYPE,
} from "@business/common/src/album/constant";
import { getMapDict } from "@business/common/src/utils";

const props = defineProps({
  /** 表单筛选  mifeng需要传ckey */
  formStateFilter: {
    type: Object,
    default: {},
  },
});
const formState = reactive({
  albumName: "",
  introduce: "",
  type: ALBUM_RELATE_TYPE.NONE,
  businessId: undefined,
  albumAdminUser: "",
  watchLimitType: 0,
  limitData: "",
  ...props.formStateFilter,
});
const isPreview = ref(false);
const businessList = ref([]);
const router = useRouter();
const route = useRoute();
const submitLoading = ref(false);
const addUserModal = reactive({
  visible: false,
  inputVal: null,
});
const albumAdminPhones = computed({
  get() {
    const { albumAdminUser } = formState;
    return albumAdminUser ? albumAdminUser.split(",") : [];
  },
  set(phones) {
    formState.albumAdminUser = phones.join(",");
  },
});
watch(
  () => formState.type,
  (newV) => {
    if (newV === 2) queryBusinessList();
  },
  { immediate: true }
);
watch(
  () => props.formStateFilter,
  (newV) => {
    Object.assign(formState, newV);
  },
  { deep: true, immediate: true }
);
const queryBusinessList = async () => {
  if (businessList.value.length) return;
  const { data } = await getActivityList();
  businessList.value = data.map((item) => ({
    value: item.id,
    label: `${item.activityName}（ID：${item.id}）`,
  }));
};
const queryAlbumInfo = async () => {
  if (!route.query.id) return;
  const { data } = await getAlbumInfo(route.query);
  Object.assign(formState, data);
};
const addAlbumAdminUser = async () => {
  addUserModal.visible = false;
  albumAdminPhones.value = [...albumAdminPhones.value, addUserModal.inputVal];
  addUserModal.inputVal = null;
};
const onSave = async () => {
  submitLoading.value = true;
  await saveAlbum({
    ...formState,
    introduce: (formState.introduce || "").replace(/[\s]+/g, " ").trim(),
  });
  submitLoading.value = false;
  router.push("/album/list");
};
const delAlbumAdminUser = (item) => {
  Modal.confirm({
    title: "删除后无法恢复",
    content: "是否继续删除？",
    okText: "确认删除",
    onOk: () => {
      albumAdminPhones.value = albumAdminPhones.value.filter((v) => v !== item);
    },
  });
};
queryAlbumInfo();
</script>

<style lang="scss" scoped>
.desc {
  font-size: 12px;
  color: #999;
  line-height: 18px;
  position: absolute;
  top: 30px;
  right: 12px;
}
</style>
