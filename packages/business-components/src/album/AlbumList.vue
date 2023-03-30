<template>
  <PlusTable
    :loading="loading"
    :dataSource="tableData"
    :columns="tableCols"
    :scroll="{ x: 'max-content' }"
    :pagination="pagination"
    @change="handleTableChange"
    bordered
  >
    <template #filterItem>
      <slot name="filterItem"></slot>
    </template>
    <template #searchToolBar>
      <div></div>
    </template>
  </PlusTable>
</template>

<script setup>
import { Modal } from "ant-design-vue";
import { useAntTable } from "@business/logics/src/useAntTable";
import { defineComponent, reactive, ref, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import {
  getAlbumList,
  deleteAlbum,
  auditAlbum,
} from "@business/common/src/album/api";
import {
  UPDATE_TYPE_OPTIONS,
  ALBUM_TYPES_LIST,
  ALBUM_TYPES,
} from "@business/common/src/album/constant";
const props = defineProps({
  /** 拓展表格字段 */
  inheritedColumns: {
    type: Object,
    default: {},
  },
  /** 表单筛选  mifeng需要传ckey */
  tableFilter: {
    type: Object,
    default: {},
  },
  /** 拓展表格操作列  (record)=>{return JSX} */
  tableOperations: {
    type: Function,
    default: () => {},
  },
});
const tableFilter = reactive({
  albumName: "",
});
// tableFilter变化时实时获取数据绑定的timer
let QueryChangetimer = null;
const router = useRouter();
const tableData = ref([]);
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
  fetchFn: async (pageOption) => {
    const params = { ...tableFilter, total: true };
    params.pageSize = pageOption.pageSize;
    params.pageNum = pageOption.current;
    const {
      data: { list, totalRows },
    } = await getAlbumList(params);

    tableData.value = list;

    // 输出总数
    return {
      total: totalRows,
    };
  },
});

const tableCols = [
  {
    title: "相册信息",
    width: 200,
    dataIndex: "albumName",
    filter: true,
    customRender: ({ record }) => (
      <div>
        <div style="color:#66b1ff">{record.albumCkey}</div>
        {record.albumName}
      </div>
    ),
  },
  ...props.inheritedColumns,
  {
    title: "图片数",
    dataIndex: "imgNum",
    width: 80,
  },

  {
    title: "点赞数",
    dataIndex: "likeNum",
    width: 80,
  },
  {
    title: "相册状态",
    width: 100,
    customRender: ({ record }) => {
      return record.status === 0 ? (
        <span style="color:#f56c6c">
          <a-badge status="error" />
          冻结
        </span>
      ) : record.auditStatus === 0 ? (
        <span style="color:#f56c6c">
          <a-badge status="error" /> 隐藏
        </span>
      ) : (
        <span style="color:#67c23a">
          <a-badge status="success" />
          正常
        </span>
      );
    },
  },
  {
    title: "浏览量",
    dataIndex: "readPeopleNum",
    customRender: ({ record }) => {
      return record.readPeopleNum || 0;
    },
    width: 100,
  },
  {
    title: "操作",
    fixed: "right",
    width: 185,
    dataIndex: "operations",
    customRender: ({ record }) => (
      <div>{props.tableOperations(record)}</div>
      /* <div>
        <div>
          <a-button
            type="link"
            onClick={() =>
              router.push({ path: "/album/edit", query: { id: record.id } })
            }
          >
            编辑
          </a-button>
          <a-button
            type="link"
            onClick={() =>
              router.push({
                path: "/album/detail",
                query: { id: record.id },
              })
            }
          >
            进入相册
          </a-button>
        </div>
        <div>
          <a-button
            style="margin-left:0"
            type="link"
            onClick={() => hideAlbum(record)}
            danger={record.auditStatus === 1}
          >
            {+record.auditStatus === 1 ? "隐藏" : "公开"}
          </a-button>
          <a-button type="link" onClick={() => delAlbum(record)} danger>
            删除
          </a-button>
        </div>
      </div> */
    ),
  },
];

const onQueryChange = async (query) => {
  Object.assign(tableFilter, query);
  clearTimeout(QueryChangetimer);
  QueryChangetimer = setTimeout(() => fetchTableData(true), 300);
};
onUnmounted(() => {
  clearTimeout(QueryChangetimer);
});

watch(
  () => props.tableFilter,
  (newV) => {
    onQueryChange(newV);
  },
  {
    deep: true,
    immediate: true,
  }
);
defineExpose({
  fetchTableData,
});
</script>

<style lang="scss" scoped>
div {
  word-break: break-all;
}
</style>
