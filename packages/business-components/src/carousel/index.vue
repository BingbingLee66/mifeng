<template>
  <PlusTable
    :columns="columns"
    :data-source="tableData"
    :loading="loading"
    :customRow="customRow"
  >
    <template #toolBar>
      <a-button type="primary" @click="goAddBanner" v-action="'添加轮播图'"
        ><plus-outlined />添加轮播图</a-button
      >
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'action'">
        <a-button class="p0" type="link" @click="goEditBanner(record)">
          编辑
        </a-button>
        <a-button class="p0 pl10" type="link" @click="onDel(record)" danger>
          删除
        </a-button>
      </template>
    </template>
  </PlusTable>
  <FormDialog ref="formRef" @refresh="fetchTableData" />
</template>

<script>
import { defineComponent, inject, ref } from "vue";
import { message, Modal } from "ant-design-vue";
import { useAntTable } from "@business/logics/src/useAntTable";
import {
  getBannerImgList,
  delBanner,
  dragBannerImg,
} from "@business/common/src/content/api/bannerImg";
import { useRouter } from "vue-router";
import { BANNER_DETAIL } from "@business/common/src/storage/constant";
import FormDialog from "./form-dialog.vue";
import { useDrag } from "@business/logics/src/useTableDrag";

// 表格相关
function useTable() {
  const ckey = inject("ckey");
  const tableData = ref([]);
  const { fetchTableData, loading } = useAntTable({
    async fetchFn() {
      const {
        data: { data },
      } = await getBannerImgList({
        ckey: ckey.value || "",
        type: 1,
        pageNum: 1,
        pageSize: 10,
        clientType: 0,
      });
      tableData.value = data.list;
      return { total: data.totalRows };
    },
  });
  fetchTableData();
  return {
    tableData,
    loading,
    fetchTableData,
    ckey,
  };
}

export default defineComponent({
  components: {
    FormDialog,
  },
  props: {
    tableColumns: {
      type: Array,
      default: [],
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const table = useTable();
    const updateSort = async (tableData) => {
      const ids = tableData.map((item) => {
        return item.id;
      });
      await dragBannerImg(ids);
      table.fetchTableData();
    };
    let customRow = () => {};
    if (table.ckey.value) {
      const { customRow: customRow1 } = useDrag(table.tableData, updateSort);
      customRow = customRow1;
    }

    const columns = [
      { title: "序号", customRender: ({ index }) => index + 1, width: 80 },
      {
        title: "关联内容",
        customRender: ({ record }) =>
          ({ 1: "文章", 2: "商品", 3: "邀请有礼" }[record.type] || "- -"),
        width: 120,
      },
      {
        title: "标题/ID",
        width: 120,
        customRender: ({ record }) => (
          <div>
            <div style="color:red">{record.articleId}</div>
            <div>{record.title || "- -"}</div>
          </div>
        ),
      },
      {
        title: "图片",
        customRender: ({ record }) => (
          <img
            style="width: 153px; height: 60px; object-fit: cover"
            src={record.img}
          />
        ),
      },
      { title: "更新时间", dataIndex: "updatedTs" },
      { title: "操作人", dataIndex: "operator", width: 80 },
      { title: "操作", fixed: "right", width: 150, dataIndex: "action" },
    ];
    if (table.ckey.value) {
      columns.unshift(...props.tableColumns);
    } else {
      columns.splice(columns.length - 1, 0, ...props.tableColumns);
    }
    const formRef = ref();
    return {
      ...table,
      columns,
      formRef,
      customRow,
      onDel(record) {
        Modal.confirm({
          title: "确定删除？",
          async onOk() {
            const { state, msg } = await delBanner({ id: record.id });
            if (state !== 1) throw msg;
            table.fetchTableData();
          },
        });
      },
      goAddBanner() {
        formRef.value.openModal();
      },
      goEditBanner(record) {
        formRef.value.openModal(record);
      },
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.ant-table-tbody > tr.target > td) {
  border-top: 2px #f4c820 dashed;
}
</style>
