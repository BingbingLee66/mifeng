<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" size="small" @click="add($event)" :actionid="getId('', '添加轮播图')" v-if="has('', '添加轮播图')">添加轮播图</el-button>
    </el-row>
    <el-table id="out-table" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="index" label="序号" width="60px">
      </el-table-column>
<!--       <el-table-column label="文章ID" width="80px">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column> -->
      <el-table-column label="文章标题">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img style="width: 80px; height: 35px;" :src="scope.row.img"/>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="160px">
        <template slot-scope="scope">
          {{scope.row.updatedTs}}
        </template>
      </el-table-column>
      <el-table-column label="操作人" width="120px">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column>
      <el-table-column label="排序" width="120px">
        <template slot-scope="scope">
          {{scope.row.level}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-button type="text" @click="edit($event, scope.row)" :actionid="getId('', '编辑')" v-if="has('', '编辑')">编辑</el-button>
          <el-button type="text" @click="del($event, scope.row)" :actionid="getId('', '删除')" v-if="has('', '删除')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加/编辑轮播图"
      :visible.sync="visible"
      width="50%">
      <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="150px">
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="文章标题：">
              <el-input v-model="formObj.title" maxlength="60" placeholder="限输入最多60个字的标题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="文章ID：" prop="articleId">
              <el-input v-model="formObj.articleId" placeholder="输入文章ID"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="visible">
          <el-col :offset="2" :span="10">
            <el-form-item label="排序：" prop="level">
              <el-input v-model="formObj.level"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label=" " label-width="10px">
              1-10的数字，由小到大排序
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="上传图片" prop="img">
              <el-upload
                class="avatar-uploader"
                action="/"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="upload">
                <img v-if="formObj.img" :src="formObj.img" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              建议尺寸：702x276  支持jpg、png
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :offset="6" :span="8">
            <el-button type="primary" v-dbClick @click="save">发布</el-button>
            <el-button @click.native="visible = false">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script src="./carousel.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 180px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 180px;
  height: 100px;
  display: block;
}
</style>
