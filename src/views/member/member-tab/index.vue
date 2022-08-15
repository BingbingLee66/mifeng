<template>
  <div class="container">
    <ys-form
      :formConfig="formConfig"
      :formItem="formItem"
      :formObj="formObj"
      @query="queryData"
      @reset="resetData"
    ></ys-form>
    <el-row>
      <el-button
        icon="el-icon-folder-add"
        size="small"
        type="success"
        @click="handleShowAdd"
      >
        创建标签组
      </el-button>
      <span class="text-gray ml-10">给会员打标签后，可实现快速筛选</span>
    </el-row>
    <ys-table
      :tableConfig="tableConfig"
      :tableColumn="tableColumn"
      :tableData="tableData"
      :pageData="pageData"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    >
      <template v-slot:labels="row">
        <el-tag
          v-for="item in row.data.labelList"
          :key="item.name"
          type="info"
          effect="plain"
          style="margin: 0 6px 6px 0"
        >
          {{ item.name }}
        </el-tag>
        <span
          v-if="row.data.memberLabelVOList && row.data.memberLabelVOList > 3"
          class="text-blue"
          @click="handleMoreLabel(row.data)"
          >查看更多</span
        >
      </template>
      <template v-slot:operate="row">
        <span class="text-blue ml-10" @click="handleEdit(row.data)">
          编辑
        </span>
        <span class="text-red-cur" @click="handleDel(row.data)">删除</span>
        <span class="text-gray" v-if="row.data.freeze === 0">平台冻结</span>
      </template>
    </ys-table>

    <!-- 查看更多标签 -->
    <more-label
      :more-visible.sync="moreVisible"
      :labelData="moreData"
      :showGroupName="true"
      @close="handleCloseMore"
    />
    <!-- 新建标签组 -->
    <add-label-group
      :add-visible.sync="addVisible"
      @close="handleCloseAdd"
      @confirm="handleConfirmAdd"
    />
    <!-- 编辑标签组 -->
    <edit-label-group
      ref="eleEdit"
      :edit-visible.sync="editVisible"
      @close="handleCloseEdit"
      @confirm="handleConfirmEdit"
    />
  </div>
</template>

<script>
import ysTable from "@/components/ys-table";
import ysForm from "@/components/ys-form";
import addLabelGroup from "@/components/Label/add-label-group";
import editLabelGroup from "@/components/Label/edit-label-group";
import moreLabel from "@/components/Label/more-label";
import data from "./data";
import Labels from "@/api/labels/labels";

export default {
  components: {
    "ys-table": ysTable,
    "ys-form": ysForm,
    "add-label-group": addLabelGroup,
    "edit-label-group": editLabelGroup,
    "more-label": moreLabel,
  },
  data() {
    return {
      // 签到设置
      formConfig: {
        type: "query",
        inline: true,
      },
      formObj: data.formData,
      formItem: data.formItem,
      tableConfig: {
        loading: false,
      },
      tableColumn: data.tableColumn,
      tableData: [],
      pageData: {
        currentpage: 1,
        limit: 10,
        pageSizes: [10, 20, 50, 100, 500],
        total: 0,
      },
      labelVisible: false,
      labelData: {
        name: "",
        memberLabelVOList: [],
      },
      rowData: [],
      moreData: {},
      moreVisible: false,
      addVisible: false,
      editVisible: false,
    };
  },
  methods: {
    async fetchData(e) {
      this.tableConfig.loading = true;
      const { labelGroupName, labelName } = this.formObj;
      this.pageData.currentpage = e === 1 ? 1 : this.pageData.currentpage;
      const { currentpage, limit } = this.pageData;
      const params = {
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
      this.tableData = res.data.list;
      this.pageData.total = res.data.totalRows;
      this.tableConfig.loading = false;
    },

    queryData(data) {
      this.formObj = { ...data };
      this.fetchData(1);
    },

    resetData() {
      this.formObj = { ...data.formData };
      this.fetchData(1);
    },

    handleSizeChange(val) {
      this.pageData.limit = val;
      this.fetchData(1);
    },

    handleCurrentChange(val) {
      this.pageData.currentpage = val;
      this.fetchData();
    },

    /** 查看更多标签 */
    handleMoreLabel(rowData) {
      let moreData = {
        name: rowData.name,
        labeList: [],
      };
      moreData.labeList = rowData.memberLabelVOList.map((item) => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      this.moreData = moreData;
      this.moreVisible = true;
    },

    handleCloseMore() {
      this.moreVisible = false;
    },

    /** 新建标签组 */
    handleShowAdd() {
      this.addVisible = true;
    },

    handleCloseAdd() {
      this.addVisible = false;
    },

    handleConfirmAdd() {
      this.addVisible = false;
      this.fetchData(1);
    },

    /** 编辑标签组 */
    handleEdit(rowData) {
      this.$refs.eleEdit.setData(rowData);
      this.editVisible = true;
    },

    handleCloseEdit() {
      this.editVisible = false;
    },

    handleConfirmEdit() {
      this.editVisible = false;
      this.fetchData(1);
    },

    handleDel(rowData) {
      console.log(rowData);
      this.$confirm(
        "确定删除该标签组吗？删除后，会员将自动卸下标签；",
        "删除标签组",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }
      )
        .then(async () => {
          const res = await Labels.delLabelGroup({
            ids: [rowData.id],
          });
          if (res.state === 1) {
            this.$message.success(res.msg);
            this.fetchData(1);
          }
        })
        .catch(() => {});
    },
  },

  created() {
    this.fetchData(1);
  },
};
</script>