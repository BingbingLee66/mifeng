<template>
  <PlusTable
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    :search="{ hiddenNum: 4 }"
    :request="handlerSearch"
    @change="handleTableChange"
    :pagination="pagination"
    :loading="loading"
    :resizable="true"
  >
    <template #searchToolBar>
      <a-button type="primary" html-type="submit">查询</a-button>
    </template>
  </PlusTable>
</template>
<script setup>
import { getActivityApplyList } from "@business/common/src/activity/api/activity-verify";
import { getMapDict } from "@business/common/src/utils";
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAntTable } from "@business/logics/src/useAntTable";
import {
  HOT_ACTIVITY_STATUS_MAP,
  APPLY_OBJECT_TYPE,
} from "@business/common/src/activity/constant";

const props = defineProps({
  /** 拓展表格字段 */
  inheritedColumns: {
    type: Object,
    default: {},
  },
  /** 拓展表格筛选项  秘锋请传{ckey} */
  tableFilter: {
    type: Object,
    default: {},
  },
});

const router = useRouter();
const columns = reactive([
  ...props.inheritedColumns,
  {
    title: "活动ID",
    dataIndex: "activityId",
    filter: true,
    hideInTable: true,
    valueType: "text",
  },
  {
    title: "活动名称",
    dataIndex: "activityName",
    filter: true,
    hideInTable: true,
    valueType: "text",
  },
  {
    title: "活动状态",
    dataIndex: "activityStatus",
    filter: true,
    valueType: "select",
    hideInTable: true,
    formItemProps: {
      options: getMapDict(HOT_ACTIVITY_STATUS_MAP),
    },
  },
  {
    title: "活动ID/名称",
    dataIndex: "id",
    width: 180,
    customRender: ({ record }) => (
      <div>
        <div style="color:#ff0000">{record.activityId}</div>
        <div>{record.activityName}</div>
      </div>
    ),
  },
  { title: "活动创建时间", dataIndex: "createdTs" },
  { title: "活动开始时间", dataIndex: "activityStartTime" },
  {
    title: "活动来源",
    dataIndex: "chamberName",
    customRender: ({ record }) => {
      return (
        <div>{record.chamberName ? record.chamberName : "凯迪云商会"}</div>
      );
    },
  },
  {
    title: "报名对象",
    dataIndex: "applyObject",
    customRender: ({ record }) => {
      if (record.applyObject === APPLY_OBJECT_TYPE.ALL) {
        return <span>不限</span>;
      }
      if (record.applyObject === APPLY_OBJECT_TYPE.MEMBER) {
        return (
          <span>{record.chamberName ? "限本商会成员" : "限云商会成员"}</span>
        );
      }
      if (record.applyObject === APPLY_OBJECT_TYPE.POST) {
        return (
          <span>
            {record.chamberName ? "限本商内指定职位" : "限商会内指定职位"}
          </span>
        );
      }
      if (record.applyObject === APPLY_OBJECT_TYPE.DEPARTMENT) {
        return (
          <span>
            {record.chamberName ? "限本商内指定部门" : "限商会内指定部门"}
          </span>
        );
      }
    },
  },
  {
    title: "参加人数",
    dataIndex: "isLimit",
    customRender: ({ record }) => {
      return (
        <span>{record.isLimit ? `限${record.applyCount}人` : "不限"}</span>
      );
    },
    width: 100,
  },
  {
    title: "已报名人数",
    dataIndex: "appliedNum",
    customRender: ({ record }) => {
      return (
        <span>{record.appliedNum === null ? "0" : record.appliedNum}</span>
      );
    },
    width: 120,
  },
  {
    title: "待审核",
    dataIndex: "notAuditNum",
    customRender: ({ record }) => {
      return (
        <div>
          <div style="text-align: center;">
            {record.auditNum === null ? "0" : record.auditNum}
          </div>
          <a-button
            style="color:#66b1ff"
            type="link"
            onclick={() => {
              router.push(
                `/activity/verifyDetail??activityId=${record.activityId}&status=0`
              );
            }}
          >
            去审核
          </a-button>
        </div>
      );
    },
  },
  {
    title: "已审核",
    dataIndex: "auditNum",
    customRender: ({ record }) => {
      return (
        <span>{record.auditedNum === null ? "0" : record.auditedNum}</span>
      );
    },
    width: 100,
  },
  {
    title: "审核通过",
    dataIndex: "approvedNum",
    customRender: ({ record }) => {
      return (
        <div>
          <div style="text-align: center;">
            {record.approvedNum === null ? "0" : record.approvedNum}
          </div>
          <a-button
            style="color:#66b1ff"
            type="link"
            onclick={() => {
              router.push(
                `/activity/verifyDetail??activityId=${record.activityId}&status=1`
              );
            }}
          >
            下载签到表
          </a-button>
        </div>
      );
    },
  },
  {
    title: "审核驳回",
    dataIndex: "rejectedNum",
    customRender: ({ record }) => {
      return (
        <span>{record.rejectedNum === null ? "0" : record.rejectedNum}</span>
      );
    },
    width: 100,
  },
  {
    title: "操作",
    dataIndex: "operation",
    customRender: ({ record }) => {
      return (
        <div>
          <div>
            <a-button
              type="link"
              onclick={() => {
                router.push(
                  `/activity/verifyDetail??activityId=${record.activityId}&status=1`
                );
              }}
            >
              录入签到情况
            </a-button>
          </div>
          <div>
            <a-button
              type="link"
              onclick={() => {
                router.push(
                  `/activity/verifyDetail??activityId=${record.activityId}&status=0`
                );
              }}
            >
              查看审核详情
            </a-button>
          </div>
        </div>
      );
    },
    fixed: "right",
  },
]);

const tableFilter = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  activityId: null,
  activityName: null,
  activityStatus: -1,
});
const activeKey = ref("ysh");
const tableData = ref([]);

const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
  async fetchFn({ current: page, pageSize }) {
    const params = {
      page,
      pageSize,
      ...tableFilter,
    };
    const { data } = await getActivityApplyList(params);
    tableData.value = data.list || [];

    return { total: data.totalRows || 0 };
  },
});
const handlerSearch = (value) => {
  Object.assign(tableFilter, { ...value });
  fetchTableData(true);
};
watch(
  () => props.tableFilter,
  (newV) => {
    Object.assign(tableFilter, {
      ...newV,
      activityId: null,
      activityName: null,
      activityStatus: -1,
    });
    fetchTableData(true);
  },
  { deep: true, immediate: true }
);
</script>
