<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="small" :actionid="getId('', '添加商会')" v-if="has('', '添加商会')" @click.native="add($event)">添加商会</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="index" label="序号" width="60px">
      </el-table-column>
      <!-- <el-table-column label="ID">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column> -->
      <el-table-column label="商会标识" width="100px">
        <template slot-scope="scope">
          {{scope.row.ckey}}
        </template>
      </el-table-column>
      <el-table-column label="商会名称">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="账号">
        <template slot-scope="scope">
          {{scope.row.userName}}
        </template>
      </el-table-column>
      <el-table-column label="排序" width="100px">
        <template slot-scope="scope">
          {{scope.row.level}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px">
        <template slot-scope="scope">
          {{scope.row.createdTs}}
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作人">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column> -->
      <el-table-column label="状态" width="150px">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 1">正常</div>
          <div v-if="scope.row.status == 0">已冻结</div>
          <div v-if="scope.row.status == 3">待邀请</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('', '详情')" v-if="has('', '详情')">详情</el-button>
          <el-button type="text" @click="edit($event, scope.row)" :actionid="getId('', '编辑')" v-if="has('', '编辑')">编辑</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row)" :actionid="getId('', '冻结')" v-if="has('', '冻结') && scope.row.status == 1">冻结</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row)" :actionid="getId('', '解冻')" v-if="has('', '解冻') && scope.row.status == 0">解冻</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentpage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>

    <el-dialog
      title="添加/编辑商会"
      :visible.sync="editorVisible"
      width="50%">
      <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="150px">
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="商会名称" prop="name">
              <el-input v-model.trim="formObj.name" maxLength="100"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="商会会长" prop="president">
              <el-input v-model.trim="formObj.president" maxLength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="办公地址" prop="address">
              <el-input v-model.trim="formObj.address" maxLength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formObj.phone" minlength=1 placeholder="手机号码即商会后台登录账号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="营业执照" prop="license">
              <el-upload
                class="avatar-uploader"
                action="/"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="upload">
                <img v-if="formObj.license" :src="formObj.license" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="推荐人">
              <el-input v-model.trim="formObj.referrer" v-if="editorVisible" maxLength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row v-if="type == 'add'"> -->
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item v-if="type == 'add'" label="密码" prop="password">
              <el-input type="password" v-model="formObj.password" minlength=1></el-input>
            </el-form-item>
            <el-form-item v-else label="密码">
              <el-input type="password" v-model="formObj.password" minlength=1></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="type == 'add'">
          <el-col :offset="2" :span="20">
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input type="password" v-model="formObj.confirmPassword" minlength=1></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="editorVisible">
          <el-col :offset="2" :span="20">
            <el-form-item label="排序" prop="level">
              <el-input v-model="formObj.level" minlength=1></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :offset="6" :span="8">
            <el-button type="primary" v-dbClick @click="save">保存</el-button>
            <el-button @click.native="editorVisible = false">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="商会详情"
      :visible.sync="detailVisible"
    width="50%">
      <el-row>
        <el-col :offset="2" :span="8">商会名称</el-col>
        <el-col :span="10">{{detailObj.name}}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">商会会长</el-col>
        <el-col :span="10">{{detailObj.president}}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">办公地址</el-col>
        <el-col :span="10">{{detailObj.address}}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">手机号</el-col>
        <el-col :span="10">{{detailObj.phone}}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">营业执照</el-col>
        <el-col :span="10">
          <div class="license-box"><img :src="detailObj.license" @click="enlarge(detailObj.license)"/></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">推荐人</el-col>
        <el-col :span="10" v-if="detailObj.referrer">{{detailObj.referrer}}</el-col>
        <el-col :span="10" v-if="!detailObj.referrer">无</el-col>
      </el-row>
<!--       <el-row>
        <el-col :offset="2" :span="8">账号密码</el-col>
        <el-col :span="10">{{detailObj.password}}</el-col>
      </el-row> -->
      <el-row>
        <el-col :offset="2" :span="8">排序</el-col>
        <el-col :span="10">{{detailObj.level}}</el-col>
      </el-row>
      <el-row>
        <hr/>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">创建时间</el-col>
        <el-col :span="10">{{detailObj.createdTs}}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">操作人</el-col>
        <el-col :span="10">{{detailObj.operator}}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="20" :span="2">
          <el-button type="primary" v-dbClick @click.native="detailVisible = false">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

  </div>

</template>

<script src="./manager.js"></script>

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
.license-box {
  width: 180px;
  height: 100px;
  border-color: #409EFF;
}
.license-box img {
  width: 100%;
  height: 100%;
}
</style>
