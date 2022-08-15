<template>
  <div>
    <!-- el-form二次封装 -->
    <el-form
      ref="yyForm"
      :model="formData"
      :label-position="formConfig.labelPosition || 'right'"
      :label-width="formConfig.labelWidth || '80px'"
      :inline="formConfig.inline || undefined"
      :size="formConfig.size || 'medium'"
      :rules="formConfig.rules"
    >
      <el-form-item
        v-for="item in formItem"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :rules="item.rules || []"
      >
        <!-- input -->
        <el-input
          v-if="item.type === 'input'"
          :style="{ width: item.width || '165px' }"
          v-model.trim="formData[item.prop]"
          :placeholder="item.placeholder || ''"
          :maxlength="item.maxlength || ''"
          :clearable="item.clearable || false"
        />
        <!-- intInput整数 -->
        <el-input
          v-if="item.type === 'intInput'"
          :style="{ width: item.width || '165px' }"
          v-model.trim="formData[item.prop]"
          :placeholder="item.placeholder || ''"
          :maxlength="item.maxlength || ''"
          :clearable="item.clearable || false"
          @input="(val) => checkInt(formData, item.prop, val)"
        />
        <!-- posInput正整数 -->
        <el-input
          v-if="item.type === 'posInput'"
          :style="{ width: item.width || '165px' }"
          v-model.trim="formData[item.prop]"
          :placeholder="item.placeholder || ''"
          :maxlength="item.maxlength || ''"
          :clearable="item.clearable || false"
          @input="(val) => checkPositive(formData, item.prop, val)"
        />
        <!-- textarea -->
        <el-input
          v-if="item.type === 'textarea'"
          type="textarea"
          :style="{ width: item.width || '165px' }"
          :rows="item.rows || 3"
          :show-word-limit="item.showWordLimit"
          v-model.trim="formData[item.prop]"
          :placeholder="item.placeholder || ''"
          :maxlength="item.maxlength || ''"
          :clearable="item.clearable || false"
          resize="none"
        />
        <!-- select -->
        <el-select
          v-if="item.type === 'select' && item.options"
          :style="{ width: item.width || '165px' }"
          v-model.trim="formData[item.prop]"
          :placeholder="item.placeholder || ''"
          :filterable="item.filterable || false"
          :clearable="item.clearable || false"
          :multiple="item.multiple || undefined"
          @change="item.selectChange && handleSelectChange($event)"
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <!-- cascader -->
        <el-cascader
          v-if="item.type === 'cascader' && item.options"
          :style="{ width: item.width || '165px' }"
          v-model.trim="formData[item.prop]"
          :placeholder="item.placeholder || ''"
          :options="item.options"
          :filterable="item.filterable || false"
          :clearable="item.clearable || false"
        />
        <!-- date-picker -->
        <el-date-picker
          v-if="item.type === 'date-picker'"
          :style="{ width: item.width || '' }"
          v-model.trim="formData[item.prop]"
          :format="item.format || 'yyyy-MM-dd'"
          :value-format="item.valueFormat || 'yyyy-MM-dd'"
          :type="item.dateType || 'daterange'"
          :range-separator="item.rangeSeparator || '至'"
          :start-placeholder="item.startPlaceholder || '年-月-日'"
          :end-placeholder="item.endPlaceholder || '年-月-日'"
        />
        <el-upload
          style="width: 150px; height: 150px"
          v-if="item.type === 'upload'"
          class="uploader-card"
          action="/"
          accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.GIF,.BMP"
          list-type="picture-card"
          :show-file-list="false"
          :before-upload="item.beforeUpload"
          :http-request="item.upload"
        >
          <img
            style="width: 150px; height: 150px"
            v-if="formData[item.prop]"
            :src="formData[item.prop]"
          />
          <i
            style="
              width: 150px;
              height: 150px;
              font-size: 28px;
              color: #8c939d;
              line-height: 138px;
              text-align: center;
            "
            class="el-icon-plus"
            v-else
          />
        </el-upload>
        <div v-if="item.formTip">
          <div v-for="(tips, index) in item.formTip" :key="index">
            {{ tips }}
          </div>
        </div>
      </el-form-item>
      <el-form-item label="" v-if="formConfig.type === 'query'">
        <el-button type="primary" icon="el-icon-search" @click="query()">
          查询
        </el-button>
        <el-button
          v-if="!formConfig.hideReset"
          type="warning"
          icon="el-icon-refresh"
          @click="reset()"
        >
          重置
        </el-button>
      </el-form-item>
      <el-form-item label="" v-if="formConfig.type === 'edit'">
        <el-button type="primary" v-dbClick @click="submit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
      <slot name="customConetent"></slot>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "yyForm",

  props: {
    formConfig: {
      type: Object,
      value: () => {},
    },
    formItem: {
      type: Array,
      value: () => [],
    },
    formObj: {
      type: Object,
      value: () => {},
    },
  },

  data() {
    return {
      formData: {},
    };
  },

  created() {},

  methods: {
    /** 查询 */
    query() {
      this.$emit("query", this.formData);
    },

    /** 重置 */
    reset() {
      this.$emit("reset", this.formObj);
    },

    /** 取消 */
    cancel() {
      this.$emit("cancel");
    },

    /** 提交 */
    submit() {
      this.$refs["yyForm"].validate((valid) => {
        if (valid) {
          console.log("通过检验=>", this.formData);
          this.$emit("submit", this.formData);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 清除指定属性校验提示
    updateFileds(prop, val) {
      this.formData[prop] = val;
      this.$refs.yyForm.clearValidate(prop);
    },

    // 清除所有检验提示
    resetFileds() {
      this.$refs["yyForm"].clearValidate();
    },

    // 选中值发生变化时触发
    handleSelectChange(e) {
      this.$emit("selectChange", e);
    },
  },

  watch: {
    formObj: {
      handler(newValue) {
        if (newValue !== undefined) {
          this.formData = JSON.parse(JSON.stringify(this.formObj));
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.uploader-card /deep/.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.uploader-card /deep/.el-upload:hover {
  border-color: #409eff;
}
</style>