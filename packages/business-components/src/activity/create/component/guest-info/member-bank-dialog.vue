<template>
  <div>
    <a-modal
      :title="`从${ckey ? '会员' : '用户'}库选嘉宾`"
      :visible="visible"
      width="800px"
      @cancel="onClose"
      @ok="onConfirm"
    >
      <div class="search-wrap flex-x">
        <a-input
          v-model:value="searchKey"
          placeholder="搜索姓名"
          style="width: 200px"
        />
        <a-button class="ml20" type="primary" @click="onQueryChange"
          >查询</a-button
        >
      </div>

      <a-table
        class="mt20 mb15"
        :loading="loading"
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        :row-selection="rowSelection"
        :scroll="{ x: 'max-content', y: '30vh' }"
        :row-key="
          (record) =>
            `${record.id}:${record.name}:${record.post}:${record.unit}:${record.introduction}`
        "
        style="margin-top: 20px"
        @change="handleTableChange"
      >
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'avatar'">
            <img :src="record.portrait" alt="" width="50" height="50" />
          </template>

          <template v-if="column.dataIndex === 'introduction'">
            <div>
              <div class="text-overflow">{{ record.introduction || "/" }}</div>
              <div
                v-if="record.introduction && record.introduction.length >= 40"
              >
                【<a-button type="link" @click="showText(record.introduction)"
                  >查看更多</a-button
                >】
              </div>
            </div>
          </template>
        </template>
      </a-table>
    </a-modal>

    <a-modal
      title="嘉宾介绍"
      v-model:visible="textVisible"
      width="800px"
      @cancel="textVisible = false"
      @ok="textVisible = false"
    >
      <div>{{ introduction }}</div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, inject } from "vue";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { useAntTable } from "@business/logics/src/useAntTable";
import {
  checkGuess,
  getMemberList,
  getWxUserList,
} from "@business/common/src/activity/api/activity-guest";

export default defineComponent({
  name: "GuestFormDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    staticData: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["confirm", "update:visible"],
  setup(props, { emit }) {
    const route = useRoute();
    const ckey = inject("ckey");

    const searchKey = ref("");
    const tableData = ref([]);
    const timer = ref(null);
    const selectData = ref([]);
    const textVisible = ref(false);
    const introduction = ref("");

    const activityId = computed(() => {
      return route.query.activityId || "";
    });

    watch(
      () => props.visible,
      (val) => {
        if (val) onQueryChange();
      }
    );

    const { pagination, handleTableChange, fetchTableData, loading } =
      useAntTable({
        fetchFn: async (pageOption) => {
          const api = ckey.value ? getMemberList : getWxUserList;
          const {
            data: { totalRows, list },
          } = await api({
            name: searchKey.value,
            phone: "",
            page: pageOption.current,
            pageSize: pageOption.pageSize,
          });
          tableData.value = list.map((v) => {
            return {
              ...v,
              portrait: ckey.value ? v.portrait : v.avatar,
              name: ckey.value ? v.name : v.userName,
              introduction: (ckey.value ? v.resume : v.introduction) || "",
            };
          });

          // 输出总数
          return {
            total: totalRows,
          };
        },
      });

    const showText = (val) => {
      textVisible.value = true;
      introduction.value = val;
    };

    const onQueryChange = () => {
      clearTimeout(timer.value);
      timer.value = setTimeout(() => fetchTableData(true), 300);
    };

    const onConfirm = async () => {
      if (!selectData.value.length)
        return message.error(`请选择${ckey.value ? "会员" : "用户"}`);

      if (!(await validateGuestRepeat()))
        return message.error("存在重复数据，不可操作");

      emit(
        "confirm",
        selectData.value.map((v) => {
          delete v.ckey;
          delete v.nickname;
          delete v.resume;
          delete v.phone;

          return {
            ...v,
            isChamber: 1,
            introduction: v.introduction || "",
            post: v.post || "",
            userId: v.userId || null,
            portrait: [{ url: v.portrait }],
          };
        })
      );
      onClose();
    };

    const validateGuestRepeat = async () => {
      if (activityId.value) {
        const { state } = await checkGuess(
          selectData.value.map((v) => {
            return {
              ...v,
              activityId: activityId.value,
              isChamber: 1,
              flag: true,
            };
          })
        );

        if (!state) return false;
      }
      for (let i = 0, len = props.staticData.length; i < len; i++) {
        for (let j = 0, jLen = selectData.value.length; j < jLen; j++) {
          const select = selectData.value[j];
          const item = props.staticData[i];
          if (
            select.id === item.id &&
            select.name === item.name &&
            select.post === item.post &&
            select.unit === item.unit &&
            select.introduction === item.introduction
          ) {
            return false;
          }
        }
      }
      return true;
    };

    const onClose = () => {
      emit("update:visible", false);
      searchKey.value = "";
    };

    return {
      ckey,
      loading,
      tableData,
      searchKey,
      timer,
      columns: [
        { title: "头像", dataIndex: "avatar" },
        { title: "姓名", dataIndex: "name" },
        { title: "职位/称谓", dataIndex: "post" },
        { title: "所在公司/组织", dataIndex: "unit", width: 140 },
        { title: "嘉宾介绍", dataIndex: "introduction" },
      ],
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          selectData.value = selectedRows;
        },
      },
      selectData,
      textVisible,
      introduction,
      pagination,
      handleTableChange,

      onConfirm,
      showText,
      onClose,
      onQueryChange,
    };
  },
});
</script>

<style lang="scss"></style>
