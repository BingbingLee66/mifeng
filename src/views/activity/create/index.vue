<template>
  <div class="app-container">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="创建新活动" name="1"></el-tab-pane>
      <el-tab-pane label="活动介绍" name="2"></el-tab-pane>
      <el-tab-pane label="活动报名表" name="3"></el-tab-pane>
    </el-tabs>

    <div v-if="activeName == '1'">
      <div class="create-container">
        <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="120px">
          <el-row>
            <el-col style="width: 600px;height: 50px">
              <el-form-item label="活动名称：" prop="activityName">
                <el-input v-model="formObj.activityName" show-word-limit maxlength="30" placeholder="限30字内"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width: 600px;height: 160px">
              <el-form-item label="活动头图：" prop="headImage" class="upload-style">
                <el-upload
                  class="uploader-pic-wrap"
                  action="/"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :http-request="uploadHeadImage"
                >
                  <img v-if="formObj.headImage" :src="formObj.headImage" class="pic">
                  <i v-else class="el-icon-plus uploader-pic-icon"></i>
                </el-upload>
                <div style="color: #999;line-height: 1.3;margin-top: 8px;">建议尺寸 744*300，支持jpg、png</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width: 600px;height: 120px">
              <el-form-item label="活动列表图：" prop="listImage" class="upload-style">
                <el-upload
                  class="uploader-lpic-wrap"
                  action="/"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :http-request="uploadListImage"
                >
                  <img v-if="formObj.listImage" :src="formObj.listImage" class="lpic">
                  <i v-else class="el-icon-plus uploader-lpic-icon"></i>
                </el-upload>
                <div style="color: #999;line-height: 1.3;margin-top: 8px;">建议尺寸 300*205，支持jpg、png</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width: 800px;">
              <el-form-item class="date-wrap" label="活动时间：" prop="date">
                <el-date-picker v-model="formObj.date" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width: 600px;height: 120px">
              <el-form-item class="address-wrap" label="活动地点：" prop="addressInfo">
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
                <el-input class="address-inp" type="textarea" resize="none" :rows="2" v-model="formObj.addressInfo" show-word-limit maxlength="50" placeholder="详细地址，限50字内"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width: 600px;height: 40px;">
              <el-form-item label="报名对象：" required>
                <el-checkbox v-model="applyObject.unlimit" @change="handleCheckTarget($event,0)">不限</el-checkbox>
                <el-checkbox v-model="applyObject.limit" @change="handleCheckTarget($event,1)">
                  {{ ckey ? '限本商会成员' : '限云商会成员' }}
                </el-checkbox>
                <span style="margin-left: 20px;color: #ff0000" v-if="!ckey">指云商会平台的任意商会的任意成员</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width: 1000px;">
              <el-form-item label="参加人数：" required>
                <el-checkbox v-model="applyCount.unlimit" @change="handleCheckNum($event,0)">不限</el-checkbox>
                <el-checkbox v-model="applyCount.limit" @change="handleCheckNum($event,1)">限</el-checkbox>
                <el-input v-show="applyCount.limit" style="width: 200px;" placeholder="大于0的整数" maxlength="9" v-model="formObj.applyCount">
                  <template slot="append">人</template>
                </el-input>
                <span style="margin-left: 20px;color: #ff0000">若这里限定了参加人数，在后台审核通过的，才能参加活动</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width: 600px;padding-left: 120px;">
              <el-button type="primary" v-dbClick @click="save">保存</el-button>
              <el-button @click="cancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-if="activeName == '2'">
      <div class="create-container">
        <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="120px">
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
              <el-button @click="cancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-if="activeName == '3'">
      <div class="create-container mydiv" >
        <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="120px">

          <el-row>
            <el-col style="width: 600px;height: 50px;margin-top: 30px">
              <el-form-item label="姓名：" prop="activityName">
                <el-input v-model="formObj.activityName" show-word-limit maxlength="30" placeholder="限30字内"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width: 600px;height: 50px">
              <el-form-item label="手机：" prop="activityName">
                <el-input v-model="formObj.activityName" show-word-limit maxlength="30" placeholder="限30字内"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width: 600px;height: 50px">
              <el-form-item label="邮箱：" prop="activityName">
                <el-input v-model="formObj.activityName" show-word-limit maxlength="30" placeholder="限30字内"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width: 600px;height: 50px">
              <el-form-item label="微信：" prop="activityName">
                <el-input v-model="formObj.activityName" show-word-limit maxlength="30" placeholder="限30字内"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="width: 600px;height: 50px">
            <el-form-item >
            <el-button type="primary"  @click="add">自定义</el-button>
            </el-form-item>
          </el-row>

          <div v-for="(item,index) in arrayData" :key="item.id">
            <el-row>
              <el-col style="width: 600px;height: 50px">
                <el-form-item label="邮箱：" prop="activityName">
                  <el-input v-model="formObj.activityName" show-word-limit maxlength="30" placeholder="限30字内"></el-input>
                </el-form-item>
              </el-col>
              <el-button type="primary"  @click="add">编辑</el-button>
              <el-button type="primary"  @click="add">上移</el-button>
              <el-button type="primary"  @click="add">下移</el-button>
              <el-button type="primary"  @click="del(item,index)">删除</el-button>
            </el-row>
          </div>

        </el-form>
      </div>
    </div>

  </div>
</template>

<script src="./create.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>

<style lang="scss">
.mydiv {
  width: 1200px;

  border: 1px solid black;
  margin-left: 30px;
  height:auto;
  min-height:500px;
}
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

  .date-wrap .el-input__inner {
    width: 385px;
  }

  .date-wrap .el-date-editor .el-range-input {
    width: 45%;
  }
}
</style>

