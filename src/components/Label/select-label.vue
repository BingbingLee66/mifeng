<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="selectVisible"
      v-if="selectVisible"
      width="80%"
      :before-close="close"
    >
      <div v-for="item in labelObj" :key="item.id">
        <div>
          标记方：<el-input v-model="item.source" />
        </div>
        <div>
          标签组：<el-input v-model="item.groupName" />
          标签：<el-input v-model="item.labelId" />
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="close"> 取消 </el-button>
        <el-button type="primary" @click="confirm"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Labels from "@/api/labels/labels";
export default {
  data() {
    return {
      labelObj: [
        {
          id: 1,
          source: "",
          sourceOptions: [],
          groupName: "",
          groupOptions: [],
          labelId: "",
          idOptions: [],
        },
      ],
    };
  },
  props: {
    selectVisible: {
      type: Boolean,
      value: false,
    },
    isMember: {
      type: Boolean,
      value: true,
    },
  },
  methods: {
    async fetchData(e) {
      this.checkedLabel = [];
      const { labelGroupName, labelName, selectType } = this.labelObj;
      this.pageData.currentpage = e === 1 ? 1 : this.pageData.currentpage;
      const { currentpage, limit } = this.pageData;
      const params = {
        freeze: "",
        selectType,
        labelGroupName,
        labelName,
        pageNum: currentpage,
        pageSize: limit,
      };
      let res = await Labels.getLabelGroupLst(params);
      if (res.state !== 1) return;
      res.data.list.forEach((item) => {
        if (item.memberLabelVOList) {
          item.labelList = item.memberLabelVOList.slice(0, 3);
        }
      });
      this.lableList = res.data.list;
      this.pageData.total = res.data.totalRows;
    },

    handleSizeChange(val) {
      this.pageData.limit = val;
      this.fetchData(1);
    },

    handleCurrentChange(val) {
      this.pageData.currentpage = val;
      this.fetchData();
    },

    close() {
      this.$emit("close");
    },

    confirm() {
      this.$emit("confirm", this.checkedLabel);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  margin-top: 5vh !important;
}
/deep/ .el-checkbox-button {
  display: inline-block;
  position: relative;
  margin-right: 20px;
  border: 1px solid #dcdfe6;
}
</style>