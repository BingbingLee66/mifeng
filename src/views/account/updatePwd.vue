<template>
  <div class="app-container">
    <div class="user">
      <strong>{{ user.name }}</strong><br>
      <small>{{ user.dept }} &nbsp;&nbsp; {{ user.roles }}</small>
    </div>
    <el-row class="user-content" style="">
      <el-col :span="6" class="profile">
        <img class="user-avatar" :src="systemLogo"><br>
        <p><span class="title"><i class="el-icon-s-custom"></i>&nbsp;&nbsp;{{user.remark}}</span></p>
        <p v-if="chamberName"><span class="title"><i class="el-icon-s-shop"></i>&nbsp;&nbsp;{{chamberName}}</span></p>
      </el-col>
      <el-col :span="18" style="padding-left:10px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- <el-tab-pane label="个人资料" name="profile"></el-tab-pane> -->
          <!-- <el-tab-pane label="最近活动" name="timeline"></el-tab-pane> -->
          <el-tab-pane label="修改密码" name="updatePwd"></el-tab-pane>
        </el-tabs>
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="原密码">
                <el-input type="password" v-model="form.oldPassword" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="新密码" prop="password">
                <el-input type="password" v-model="form.password" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="重复密码">
                <el-input type="password" v-model="form.rePassword" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="updatePwd">确定</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script src="./updatePwd.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";

</style>
