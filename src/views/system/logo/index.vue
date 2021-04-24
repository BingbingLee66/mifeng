<template>
  <div class="app-container">
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="商会logo">
        <template slot-scope="scope">
          <img style="width: 120px; height: 120px;" :src="scope.row.systemLogo" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作时间">
        <template slot-scope="scope">
          {{scope.row.updatedTs}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit($event, scope.row)" :actionid="getId('', '编辑')" v-if="has('', '编辑')">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="商会LOGO编辑"
      :visible.sync="visible"
      width="50%">
      <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="150px">
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="上传图片：" prop="systemLogo">
              <el-upload
                class="l-avatar-uploader"
                action="/"
                :show-file-list="false"
                :before-upload="beforel-avatarUpload"
                :http-request="upload">
                <img v-if="formObj.systemLogo" :src="formObj.systemLogo" class="l-avatar">
                <i v-else class="el-icon-plus l-avatar-uploader-icon"></i>
              </el-upload>
                支持jpg、png
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确定</el-button>
        <el-button @click.native="visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script src="./logo.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.l-avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.l-avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.l-avatar-uploader-icon {
  font-size: 58px;
  color: #8c939d;
  width: 280px;
  height: 280px;
  line-height: 280px;
  text-align: center;
}
.l-avatar {
  width: 280px;
  height: 280px;
  display: block;
}
</style>
