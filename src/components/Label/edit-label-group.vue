<template>
  <div>
    <!-- 编辑标签组 -->
    <el-dialog
      title="编辑标签组"
      :visible.sync="editVisible"
      :before-close="close"
      width="520px"
    >
      <el-form
        :model="labelObj"
        ref="labelObj"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item
          prop="name"
          label="标签组"
          :rules="[
            { required: true, message: '请填写标签组名称', trigger: 'blur' },
            { validator: checkName, trigger: 'blur' },
          ]"
        >
          <el-input
            v-model.trim="labelObj.name"
            maxlength="15"
            show-word-limit
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-for="(label, index) in labelObj.labelList"
          :label="'标签' + (index + 1)"
          :key="label.key"
          :prop="'labelList.' + index + '.name'"
          :rules="{
            required: true,
            message: '请填写标签',
            trigger: 'blur',
          }"
        >
          <el-input
            v-model.trim="label.name"
            maxlength="15"
            show-word-limit
            style="width: 300px"
          />
          <i
            v-if="labelObj.labelList.length > 1"
            style="font-size: 16px; cursor: pointer"
            class="el-icon-circle-close"
            @click="remove(label)"
          ></i>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="add">添加标签</el-button>
        </el-form-item>
      </el-form>
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
  props: {
    editVisible: {
      type: Boolean,
      value: false,
    },
  },
  data() {
    return {
      labelObj: {
        id: "",
        name: "",
        labelList: [
          {
            id: "",
            name: "",
            status: "",
          },
        ],
      },
      editLabelList: [],
    };
  },
  methods: {
    setData(data) {
      this.labelObj.id = data.id;
      this.labelObj.name = data.name;
      this.labelObj.labelList = data.memberLabelVOList.map((item) => {
        return {
          id: item.id,
          name: item.name,
          status: item.status,
        };
      });
      this.editLabelList = [...this.labelObj.labelList];
      // this.$set(this.labelObj, "name", data.name);
      // this.$set(this.labelObj, "labelList", _labelList);
    },
    close() {
      this.$emit("close");
    },
    remove(item) {
      var index = this.labelObj.labelList.indexOf(item);
      if (index !== -1) {
        this.labelObj.labelList.splice(index, 1);
      }
    },
    add() {
      const bol = this.labelObj.labelList.every((item) => item.name);
      const index = this.labelObj.labelList.length - 1;
      if (!bol) {
        this.$refs["labelObj"].validateField("labelList." + index + ".name");
        return;
      }
      this.labelObj.labelList.push({
        name: "",
      });
    },
    checkName(rule, value, callback) {
      if (value === "") {
        callback(new Error("请填写标签组名称"));
      } else if (!value) {
        callback(new Error("标签名重复，换一个试试"));
      } else {
        callback();
      }
    },
    confirm() {
      this.$refs["labelObj"].validate(async (valid) => {
        if (valid) {
          let _labelList = [...this.labelObj.labelList];
          let _list = [];
          this.editLabelList.map((i) => {
            _labelList.map((j) => {
              if (i.id === j.id) {
                _list.push(i);
              }
            });
          });
          let ids = _list.map((item) => item.id);
          let delList = this.editLabelList.filter(
            (item) => !ids.includes(item.id)
          );
          if (delList.length > 0) {
            delList.forEach((item) => {
              item.status = 0;
            });
            _labelList.push(...delList);
          }
          const res = await Labels.editLabelGroup({
            id: this.labelObj.id,
            name: this.labelObj.name,
            weight: 0,
            labelList: _labelList,
          });
          if (res.state !== 1) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          this.$emit("confirm");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  margin-top: 5vh !important;
}
</style>