<template>
  <a-modal
    :visible="visible"
    title="选择活动类型"
    :mask-closable="false"
    @cancel="onClose"
    @ok="onConfirm"
  >
    <div class="tag-group-list">
      <a-checkbox-group v-model:value="currentCheckList">
        <div
          v-for="tagGroup in tagGroupList"
          :key="tagGroup.id"
          class="tag-group-item"
        >
          <div class="tag-group-name" style="margin: 10px 0; font-weight: bold">
            {{ tagGroup.name }}
          </div>

          <a-checkbox
            v-for="tag in tagGroup.memberLabelVOList"
            :key="tag.id"
            :value="tag.id + ':' + tag.name"
            class="checkbox-item"
            @change="tagChange"
          >
            {{ tag.name }}
          </a-checkbox>
        </div>
      </a-checkbox-group>

      <a-pagination
        v-model:current="current"
        :page-size="5"
        :total="total"
        @change="handleTableChange"
      />
    </div>
  </a-modal>
</template>

<script>
import { computed, defineComponent, ref, watch } from "vue";
import { useFetchTagList } from "../../use/useFetchTagList";
import { message } from "ant-design-vue";

export default defineComponent({
  name: "ActiveTypeDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    activeType: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["confirm", "update:visible"],
  setup(props, { emit }) {
    const checkList = ref([]);
    const currentCheckList = computed(() => checkList);
    const { tagGroupList, current, total, fetchData } = useFetchTagList();

    watch(
      () => props.visible,
      (val) => {
        if (val) {
          fetchData();
          checkList.value = props.activeType.map(
            (v) => `${v.labelId}:${v.label}`
          );
        }
      }
    );

    const handleTableChange = (page) => {
      current.value = page;
      fetchData();
    };

    const onClose = () => {
      checkList.value = [];
      emit("update:visible", false);
    };

    const onConfirm = () => {
      console.log("labels", checkList.value);
      emit(
        "confirm",
        checkList.value.map((v) => {
          const itemArr = v.split(":");
          return {
            label: itemArr[1],
            labelId: itemArr[0],
          };
        })
      );
      onClose();
    };
    const tagChange = ({ target: { value, checked } }) => {
      if (!checked) {
        const index = checkList.value.indexOf(value);
        checkList.value.splice(index, 1);
      } else if (checkList.value.length >= 5) {
        message.error("最多只可选择5个");
        checkList.value = checkList.value.splice(0, 5);
      } else {
        checkList.value.push(value);
      }
    };

    return {
      checkList,
      tagGroupList,
      current,
      total,
      currentCheckList,

      onClose,
      onConfirm,
      fetchData,
      handleTableChange,
      tagChange,
    };
  },
});
</script>

<style scoped lang="scss">
.checkbox-item {
  margin: 0 10px 10px 0;

  & >>> .el-checkbox-button__inner {
    border: 1px solid #dcdfe6;
    border-radius: 0;
  }

  &.is-checked >>> .el-checkbox-button__inner {
    border-color: transparent;
  }
}
</style>
