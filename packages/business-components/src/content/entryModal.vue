<template>
  <div>
    <AModal
      :visible="props.entryVisible"
      :title="title"
      @ok="handleOk"
      @cancel="closeHandler"
      width="1000px"
    >
      <div>
        <a-input
          v-model:value="keywordFilter.encyclopediaName"
          placeholder="请输入关键字"
          style="width: 340px"
        >
          <template #prefix>
            <search-outlined style="color: #999" />
          </template>
        </a-input>
        <a-button type="primary" class="ml-4" @click="searchHandler()"
          >搜索</a-button
        >
      </div>
      <EntryCard
        title="最近推荐"
        :lists="recommendList"
        :total="recommendTotal"
        :filterInfo="recommendFilter"
        @onChange="
          (page) => onChange(page, recommendFilter, queryRecommendList)
        "
        @onShowSizeChange="
          (pageSize) =>
            onShowSizeChange(pageSize, recommendFilter, queryRecommendList)
        "
        @checkboxChange="checkboxChange"
      />
      <EntryCard
        title="商会相关"
        :lists="chamberList"
        :total="chamberTotal"
        :filterInfo="chamberFilter"
        :showOrganizationName="false"
        @onChange="(page) => onChange(page, chamberFilter, queryChamberList)"
        @onShowSizeChange="
          (pageSize) =>
            onShowSizeChange(pageSize, chamberFilter, queryChamberList)
        "
        @checkboxChange="checkboxChange"
      />
      <EntryCard
        v-if="otherList.length"
        title="其他"
        :lists="otherList"
        :total="otherTotal"
        :filterInfo="keywordFilter"
        @onChange="(page) => onChange(page, keywordFilter, searchList)"
        @onShowSizeChange="
          (pageSize) => onShowSizeChange(pageSize, keywordFilter, searchList)
        "
        @checkboxChange="checkboxChange"
      />
    </AModal>
  </div>
</template>
<script setup>
import { reactive, ref, watch, getCurrentInstance } from "vue";
import {
  recommendLexicalRecently,
  queryChamberLexical,
  queryEntryList,
} from "@business/common/src/content/api/bossin";
import EntryCard from "./EntryCard";

const props = defineProps({
  entryVisible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  entryInfo: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(["update:entryVisible", "onSureHandler"]);
const { proxy } = getCurrentInstance();
const recommendList = ref([]);
const chamberList = ref([]);
const otherList = ref([]);
const recommendFilter = reactive({
  limit: 10,
  page: 1,
});
const chamberFilter = reactive({
  limit: 10,
  page: 1,
});
const keywordFilter = reactive({
  encyclopediaName: "",
  limit: 10,
  page: 1,
});
const recommendTotal = ref(0);
const chamberTotal = ref(0);
const otherTotal = ref(0);
const selectionKey = ref({});
const closeHandler = () => {
  emit("update:entryVisible", false);
};
watch(
  () => props.entryVisible,
  async (Val) => {
    if (Val) {
      await initData();
      if (props.entryInfo?.selectionData.length > 0) setSelectionMap();
      await queryRecommendList();
      queryChamberList();
    }
  }
);
const initData = () => {
  selectionKey.value = {};
  recommendTotal.value = 0;
  chamberTotal.value = 0;
  otherTotal.value = 0;
  recommendList.value = [];
  chamberList.value = [];
  otherList.value = [];
  recommendFilter.limit = 10;
  chamberFilter.limit = 10;
  keywordFilter.limit = 10;
  recommendFilter.page = 1;
  chamberFilter.page = 1;
  keywordFilter.page = 1;
  keywordFilter.encyclopediaName = "";
};
const setSelectionMap = () => {
  props.entryInfo.selectionData.forEach((item, index) => {
    selectionKey.value[item.encyclopediaId] = {
      ...item,
      index,
    };
  });
};
const queryRecommendList = async () => {
  const { total, lists } = await requestData(recommendLexicalRecently, {
    ...recommendFilter,
    ckey: props.entryInfo.ckey,
  });
  recommendTotal.value = total;
  recommendList.value = lists;
};
const searchHandler = () => {
  otherList.value = [];
  keywordFilter.page = 1;
  searchList();
};
const queryChamberList = async () => {
  const { total, lists } = await requestData(queryChamberLexical, {
    ...chamberFilter,
    ckey: props.entryInfo.ckey,
  });
  chamberTotal.value = total;
  chamberList.value = lists;
};
const searchList = async () => {
  if (!keywordFilter.encyclopediaName) return;
  const { total, lists } = await requestData(queryEntryList, keywordFilter);
  otherTotal.value = total;
  otherList.value = lists;
};
const requestData = async (requestFnc, params) => {
  try {
    const { data } = await requestFnc(params);
    const lists = data.records.map((item) => {
      const selectItem = selectionKey.value[item.encyclopediaId];
      return {
        ...item,
        check: selectItem ? !!selectItem.check : false,
      };
    });
    return {
      total: data.total,
      lists,
    };
  } catch (error) {
    return {
      total: 0,
      lists: [],
    };
  }
};
const handleOk = () => {
  if (selectionKey.value.length > 15) {
    return proxy.$message.error("最多选择15个词条关联");
  } else {
    const originIds = Object.values(selectionKey.value)
      .sort((a, b) => a.index - b.index)
      .filter((item) => item.check);
    const encyclopediaIds = originIds.map((item) => item.encyclopediaId);
    emit("onSureHandler", encyclopediaIds, originIds);
  }
};
const checkboxChange = (value, item) => {
  if (!selectionKey.value[item.encyclopediaId]) {
    selectionKey.value[item.encyclopediaId] = {
      index: Object.keys(selectionKey.value).length,
      check: value,
      ...item,
    };
  } else {
    selectionKey.value[item.encyclopediaId].check = value;
  }
};
const onChange = (page, filter, searchFnc) => {
  filter.page = page;
  searchFnc();
};
const onShowSizeChange = (limit, filter, searchFnc) => {
  filter.limit = limit;
  filter.page = 1;
  searchFnc();
};
</script>
<style lang="scss" scoped>
.c-entry-list {
  display: flex;
  flex-wrap: wrap;
}
.c-entry-list__item {
  width: 20%;
  padding: 0 5px;
  margin-bottom: 10px;
  text-align: center;
  .img {
    object-fit: cover;
  }
  .entry-name {
    margin: 5px 0;
    text-align: center;
    color: #222;
  }
  .entry-polysemant {
    text-align: center;
    font-size: 12px;
    color: #666;
  }
}
.c-eli__relative {
  position: relative;
  width: 80px;
  height: 90px;
  margin: auto;
}
.c-eli__checkbox {
  position: absolute;
  right: -25px;
  top: 0;
}
.c-entry-button {
  margin-top: 10px;
  text-align: center;
}
.c-recent-list {
  display: flex;
}
.c-recent-item {
  position: relative;
  margin-right: 10px;
  .c-recent-item__checkbox {
    position: absolute;
    right: 0;
    top: 0;
  }
}
.c-recent-item__tag {
  padding: 8px 15px 0 8px;
  box-sizing: content-box;
}

.m-auto {
  display: block;
  margin: auto;
}
.c-entry-h2 {
  font-size: 1.5em;
  font-weight: bold;
}
.no-data-text {
  margin-bottom: 20px;
}
</style>
