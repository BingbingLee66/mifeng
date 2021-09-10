<template>
  <div class="app-container">
    <div style="font-size: 24px;font-weight: 700;margin-bottom: 40px;">创建新活动</div>
    <div class="create-container">
      <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="120px">
        <el-row>
          <el-col style="width: 600px;height: 50px">
            <el-form-item label="活动名称：" prop="name">
              <el-input v-model="formObj.name" show-word-limit maxlength="30" placeholder="限30字内"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="width: 600px;height: 160px">
            <el-form-item label="活动头像：" prop="pic" class="upload-style">
              <el-upload
                class="uploader-pic-wrap"
                action="/"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="uploadPic"
              >
                <img v-if="formObj.pic" :src="formObj.pic" class="pic">
                <i v-else class="el-icon-plus uploader-pic-icon"></i>
              </el-upload>
              <div style="color: #999;line-height: 1.3;margin-top: 8px;">建议尺寸 744*300，支持jpg、png</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="width: 600px;height: 120px">
            <el-form-item label="活动列表图：" prop="lpic" class="upload-style">
              <el-upload
                class="uploader-lpic-wrap"
                action="/"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="uploadLpic"
              >
                <img v-if="formObj.lpic" :src="formObj.lpic" class="lpic">
                <i v-else class="el-icon-plus uploader-lpic-icon"></i>
              </el-upload>
              <div style="color: #999;line-height: 1.3;margin-top: 8px;">建议尺寸 744*300，支持jpg、png</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="width: 600px;">
            <el-form-item label="活动时间：" prop="date">
              <el-date-picker v-model="formObj.date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="width: 600px;height: 120px">
            <el-form-item class="address-wrap" label="活动地点：" required>
              <el-select v-model="provinceValue" placeholder="请选择省份" @change="provinceChange">
                <el-option
                  v-for="item in provinceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="cityValue" placeholder="请选择市" @change="cityChange">
                <el-option
                  v-for="item in cityOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="countryValue" placeholder="请选择区" @change="countryChange">
                <el-option
                  v-for="item in countryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input class="address-inp" type="textarea" resize="none" :rows="2" v-model="formObj.address" show-word-limit maxlength="50" placeholder="详细地址，限50字内"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="width: 600px;height: 40px;">
            <el-form-item label="报名对象：" required>
              <el-checkbox v-model="target.unlimit" @change="handleCheckTarget($event,1)">不限</el-checkbox>
              <el-checkbox v-model="target.limit" @change="handleCheckTarget($event,2)">限云商会成员</el-checkbox>
              <span style="margin-left: 20px;color: #ff0000">指云商会平台的任意商会的任意成员</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="width: 1000px;">
            <el-form-item label="参加人数：" required>
              <el-checkbox v-model="number.unlimit" @change="handleCheckNum($event,1)">不限</el-checkbox>
              <el-checkbox v-model="number.limit" @change="handleCheckNum($event,2)">限</el-checkbox>
              <el-input v-show="number.limit" style="width: 200px;" placeholder="大于0的整数" v-model="formObj.number2">
                <template slot="append">人</template>
              </el-input>
              <span style="margin-left: 20px;color: #ff0000">若这里限定了参加人数，在后台审核通过的，才能参加活动</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="width: 1000px;">
            <el-form-item label="活动介绍：" required class="upload-style">
              <Ckeditor ref="ckeditor1" @getHtml="getHtml"></Ckeditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="width: 600px;padding-left: 120px;">
            <el-button type="primary" v-dbClick @click="save">保存</el-button>
            <el-button @click="closeTab">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script src="./create.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>

<style lang="scss">
.create-container {
  .upload-style {
    .el-form-item__label {
      line-height: 1;
    }
  }

  .uploader-pic-wrap {
    height: 120px;
    width: 300px;
  }

  .uploader-pic-wrap .el-upload {
    width: 298px;
    height: 120px;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .uploader-pic-wrap .el-upload:hover {
    border-color: #409eff;
  }

  .uploader-pic-icon {
    font-size: 28px;
    color: #8c939d;
    width: 298px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .pic {
    width: 298px;
    height: 120px;
    display: block;
  }

  .uploader-lpic-wrap {
    width: 117px;
    height: 80px;
  }

  .uploader-lpic-wrap .el-upload {
    width: 117px;
    height: 80px;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .uploader-lpic-wrap .el-upload:hover {
    border-color: #409eff;
  }

  .uploader-lpic-icon {
    font-size: 28px;
    color: #8c939d;
    width: 117px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }

  .lpic {
    width: 117px;
    height: 80px;
    display: block;
  }

  .address-wrap .el-select {
    width: 120px !important;
    margin-right: 10px;
  }

  .address-wrap {
    .address-inp {
      margin-top: 20px;

      .el-input__count {
        background: none;
        position: absolute;
        bottom: -5px;
        right: 10px;
      }
    }
  }
}
</style>

