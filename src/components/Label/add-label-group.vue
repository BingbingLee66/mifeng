<template>
  <div>
    <!-- 新建标签 -->
    <el-dialog
      title="新建标签组"
      :visible.sync="addVisible"
      width="520px"
      :before-close="close"
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
            style="font-size: 16px; cursor: pointer"
            class="el-icon-circle-close"
            @click="remove"
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
  data() {
    return {
      labelObj: {
        labelList: [
          {
            name: "",
          },
        ],
        name: "",
      },
    };
  },
  props: {
    addVisible: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
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
          const res = await Labels.addLabelGroup(this.labelObj);
          if (res.state !== 1) return;
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