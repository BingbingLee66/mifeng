import { ref } from "vue";
import { useAntTable } from "@business/logics/src/useAntTable";
import Labels from "@business/common/src/lable/api";
import { DATA_SOURCE, FREEZE } from "@business/common/src/activity/constant";

/**
 * 获取会员标签逻辑
 */
export function useFetchTagList() {
  const tagGroupList = ref([]);

  const conditionQuery = (pageOption) => {
    return {
      pageSize: pageOption.pageSize,
      pageNum: pageOption.current,
      dataSource: DATA_SOURCE.admin,
      freeze: FREEZE.no,
      total: true,
    };
  };

  const {
    current,
    fetchTableData: fetchData,
    total,
  } = useAntTable({
    fetchFn: async (pageOptions) => {
      const {
        data: { list, totalRows },
      } = await Labels.getLabelGroupLst(conditionQuery(pageOptions));

      if (!totalRows) return;
      tagGroupList.value = list;

      return {
        total: totalRows,
      };
    },
    defaultPageSize: 5,
  });

  return {
    tagGroupList,
    current,
    fetchData,
    total,
  };
}
