<template>
  <div class="container">
    <div class="main">
      <el-form :inline="true" :model="formObj">
        <el-form-item label="商协会名称" prop="name">
          <el-input
            v-model="formObj.name"
            placeholder="关键词"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="fetchData(1)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <div class="mb-20">
        <el-button
          type="danger"
          icon="el-icon-folder-add"
          @click="handleDialog('add')"
          >添加友情单位</el-button
        >
      </div>
      <el-table
        :data="formData"
        border
        v-loading="formPage.loading"
        element-loading-text="loading"
        fit
        highlight-current-row
        height="65vh"
      >
        <el-table-column
          prop="systemLogo"
          label="商协会logo"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-image
              :src="scope.row.friendChamberLogo"
              class="chamber-logo"
              :preview-src-list="[scope.row.friendChamberLogo]"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="friendChamberName"
          label="商协会名称"
          width="300"
          align="center"
        />
        <el-table-column prop="weight" label="权重" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDialog('weight', scope.row)">{{
              scope.row.weight
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="添加信息" width="300" align="center">
          <template slot-scope="scope">
            <div>{{ name }}</div>
            <div>
              {{ scope.row.createdTs | dateFormat(scope.row.createdTs) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleRemove(scope.row.id)"
              >移除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px"
        @size-change="
          (e) => {
            handleSizeChange('formData', e);
          }
        "
        @current-change="
          (e) => {
            handleCurrentChange('formData', e);
          }
        "
        :current-page="formPage.page"
        :page-sizes="formPage.pageSizes"
        :page-size="formPage.pageSize"
        :total="formPage.total"
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>

    <div class="add-dialog">
      <el-dialog title="选择商协会" :visible.sync="addVisible" width="60%">
        <el-form :inline="true" :model="chamberForm" ref="formObj">
          <el-form-item label="商协会名称" prop="name">
            <el-input
              v-model="chamberForm.name"
              placeholder="关键词"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="fetchChamberData(1)"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
        <el-table
          :data="chamberData"
          @selection-change="handleSelectionChange"
          height="61vh"
          border
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="image" label="商协会logo">
            <template slot-scope="scope">
              <el-image
                :src="scope.row.systemLogo"
                class="chamber-logo"
                :preview-src-list="[scope.row.systemLogo]"
              />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商协会名称" />
        </el-table>
        <el-pagination
          style="margin-top: 20px"
          @size-change="
            (e) => {
              handleSizeChange('chamberData', e);
            }
          "
          @current-change="
            (e) => {
              handleCurrentChange('chamberData', e);
            }
          "
          :current-page="chamberPage.page"
          :page-sizes="chamberPage.pageSizes"
          :page-size="chamberPage.pageSize"
          :total="chamberPage.total"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
        <div slot="footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="weight-dialog">
      <el-dialog title="权重" :visible.sync="weightVisible" width="500px">
        <el-form
          ref="formWeight"
          :rules="weightRules"
          label-width="120px"
          :model="formWeight"
          label-position="right"
          class="demo-ruleForm"
        >
          <el-form-item label="权重：" prop="weight">
            <el-input
              v-model="formWeight.weight"
              onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"
            />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="weightVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleWeight">提 交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Friend from "@/api/home/friendLink";
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      // 友情单位
      formObj: {
        name: "",
      },
      formData: [],
      formPage: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 50, 100, 200],
        total: 0,
        loading: false,
      },
      // 可选择商会
      chamberForm: {
        name: null,
      },
      chamberPage: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 50, 100, 200],
        total: 0,
      },
      chamberData: [],
      multipleSelection: [],
      // 权重
      formWeight: {
        weight: null,
      },
      weightRules: {
        weight: [
          { required: true, message: "请输入权重", trigger: "blur" },
          { validator: this.validateWeight, trigger: ["blur", "change"] },
        ],
      },
      rowData: null,
      // 弹窗控制
      addVisible: false,
      weightVisible: false,
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    ...mapGetters([
      "name"
    ]),
  },
  methods: {
    async fetchData(page) {
      if (page === 1) {
        this.formPage.page = 1;
      }
      const data = {
        chamberName: this.formObj.name,
        pageNum: this.formPage.page,
        pageSize: this.formPage.pageSize,
      };
      const [res, err] = await Friend.getFriendLinks(data);
      if (err) return;
      if (res.state !== 1) return;
      this.formData = res.data.list;
      this.formPage.total = res.data.totalRows;
    },
    async fetchChamberData(page) {
      if (page === 1) {
        this.chamberPage.page = 1;
      }
      const data = {
        chamberName: this.chamberForm.name,
        pageNum: this.chamberPage.page,
        pageSize: this.chamberPage.pageSize,
      };
      const [res, err] = await Friend.getChamberData(data);
      if (err) return;
      if (res.state !== 1) return;
      this.chamberData = res.data.list;
      this.chamberPage.total = res.data.totalRows;
    },
    handleSizeChange(val, pageSize) {
      if (val === "chamberData") {
        this.chamberPage.pageSize = pageSize;
        this.fetchChamberData(1);
        return;
      }
      if (val === "formData") {
        this.formPage.pageSize = pageSize;
        this.fetchData(1);
        return;
      }
    },
    handleCurrentChange(val, page) {
      if (val === "chamberData") {
        this.chamberPage.page = page;
        this.fetchChamberData();
        return;
      }
      if (val === "formData") {
        this.formPage.page = page;
        this.fetchData();
        return;
      }
    },
    handleSelectionChange(data) {
      this.multipleSelection = data;
    },
    async handleDialog(dialog, rowData) {
      if (dialog === "add") {
        await this.fetchChamberData(1);
        this.chamberForm.name = "";
        this.addVisible = true;
        return;
      }
      if (dialog === "weight") {
        this.rowData = rowData;
        this.formWeight.weight = rowData.weight;
        this.weightVisible = true;
        return;
      }
    },
    /** 新增友情单位 */
    async handleAdd() {
      let ckeyList = [];
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请至少选择一个商协会");
        return;
      }
      this.multipleSelection.map((item) => {
        ckeyList.push(item.ckey);
      });
      const [res, err] = await Friend.addFriendLinks({ ckeyList });
      if (err) return;
      if (res.data.state !== 1) {
        this.$message.error(res.data.msg);
        return;
      }
      this.$message.success("已添加");
      this.addVisible = false;
      this.fetchData(1);
    },
    /** 移除友情单位 */
    handleRemove(id) {
      this.$confirm("确认将该商协会从友情单位中移除？", "移除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const [res, err] = await Friend.delFriendLinks(id);
          if (err) return;
          if (res.data.state !== 1) {
            this.$message.error(res.data.msg);
            return;
          }
          this.$message.success("已移除");
          this.fetchData(1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消移除",
          });
        });
    },
    /** 更新权重 */
    handleWeight() {
      this.$refs["formWeight"].validate(async (valid) => {
        if (valid) {
          const data = {
            id: this.rowData.id,
            value: this.formWeight.weight,
          };
          const [res, err] = await Friend.editFriendLinksWeight(data);
          if (err) return;
          if (res.data.state !== 1) {
            this.$message.error(res.data.msg);
            return;
          }
          this.$message.success(res.msg);
          this.weightVisible = false;
          this.fetchData(1);
        }
      });
    },
    validateWeight(rule, value, callback) {
      if (!/^[0-9]\d*$/.test(value)) {
        callback(new Error("请输入正整数"));
      } else if (value < 0 || value > 999) {
        callback(new Error("权重范围0-999"));
      } else {
        callback();
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../../styles/common.scss";

.container {
  padding: 20px;
}

.addButton {
  margin-bottom: 20px;
}

.chamber-logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
::v-deep .el-dialog{
  margin-top: 4vh !important;
}
</style>
