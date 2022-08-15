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
          :rules="[
            {
              required: true,
              message: '请填写标签',
              trigger: 'blur',
            },
          ]"
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
  data() {
    return {
      labelObj: {
        labelList: [
          {
            name: "",
          },
        ],
        name: "",
        weight: 999,
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
    reset() {
      this.labelObj = {
        labelList: [
          {
            name: "",
          },
        ],
        name: "",
        weight: 999,
      };
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
      const _labelList = this.labelObj.labelList;
      // 校验标签名是否已填
      const bol = _labelList.every((item) => item.name);
      const index = _labelList.length - 1;
      if (!bol) {
        this.$refs["labelObj"].validateField("labelList." + index + ".name");
        return;
      }
      // 校验标签名是否重复
      const bol2 =
        [...new Set(_labelList.map((item) => item.name))].length <
        _labelList.length;
      if (bol2) {
        return this.$message.error("标签名重复，换一个试试");
      }
      this.labelObj.labelList.push({
        name: "",
      });
    },
    confirm() {
      this.$refs["labelObj"].validate(async (valid) => {
        if (valid) {
          const res = await Labels.addLabelGroup(this.labelObj);
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