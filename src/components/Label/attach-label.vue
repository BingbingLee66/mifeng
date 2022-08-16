<template>
  <div>
    <!-- 打标签 -->
    <el-dialog
      title="打标签"
      :visible.sync="attachVisible"
      v-if="attachVisible"
      width="80%"
      :before-close="close"
    >
      <el-form
        :model="labelObj"
        ref="labelObj"
        label-width="100px"
        :inline="true"
      >
        <el-form-item prop="labelGroupName" label="标签组">
          <el-input
            v-model.trim="labelObj.labelGroupName"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item prop="labelName" label="标签">
          <el-input v-model.trim="labelObj.labelName" style="width: 200px" />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="fetchData">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-tabs
        type="border-card"
        v-model="labelObj.selectType"
        @tab-click="fetchData(1)"
      >
        <el-tab-pane v-if="isMember" label="平台推荐" name="1"></el-tab-pane>
        <el-tab-pane v-if="isMember" label="本会创建" name="3"></el-tab-pane>
        <div style="max-height: 50vh; overflow-y: auto">
          <div v-if="lableList.length > 0">
            <el-row v-for="item in lableList" :key="item.id">
              <div class="mb-10">{{ item.name }}</div>
              <el-checkbox-group v-model="checkedLabel">
                <el-checkbox-button
                  v-for="i in item.memberLabelVOList"
                  :key="i.id"
                  :label="i.id"
                  style="margin-bottom: 10px"
                  >{{ i.name }}</el-checkbox-button
                >
              </el-checkbox-group>
            </el-row>
          </div>
          <div v-else class="text-center">
            <div class="mb-40 mt-40">暂无数据</div>
            <el-button v-if="labelObj.selectType == 3" @click="goCreateLabel"
              >去创建</el-button
            >
          </div>
        </div>
        <el-row v-if="lableList.length > 0" class="mt-20">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="pageData.pageSizes"
            :page-size="pageData.limit"
            :total="pageData.total"
            :current-page.sync="pageData.currentpage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-tabs>

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
      labelObj: {
        labelGroupName: "",
        labelName: "",
        selectType: "1",
      },
      lableList: [],
      memberLabelVOList: [],
      pageData: {
        currentpage: 1,
        limit: 10,
        pageSizes: [10, 20, 50, 100, 500],
        total: 0,
      },
      checkedLabel: [],
    };
  },
  props: {
    attachVisible: {
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
        freeze: 0,
        selectType,
        labelGroupName,
        labelName,
        pageNum: currentpage,
        pageSize: limit,
      };
      let res = await Labels.getLabelGroupLst(params);
      if (res.state !== 1) return;
      res.data.list.forEach((item) => {
        item.labelList = item.memberLabelVOList || [];
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

    goCreateLabel() {
      this.close();
      this.$router.push({
        path: "/member/member-tab",
      });
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