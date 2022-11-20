<template>
  <div class="login-container" style="background-image: url(/img/bg.png); background-size: cover;">
    <div v-if="active" class="form-wrapper">
      <div class="login-bar">
        <div class="login-bar-icon">
          <img src="img/login-logo-1-svg.svg" alt=""> |<img src="img/login-logo-2-svg.svg" alt=""><span>秘锋</span>
        </div>
        <div class="login-title">云商会旗下商协会数字管理系统</div>
      </div>
      <div class="form-title">账号密码登录</div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="username">
          <img src="img/login-logo-user.png" alt="">
          <!-- <span class="svg-container">
            <svg-icon icon-class="user" />
          </span> -->
          <el-input v-model="loginForm.username" placeholder="账号" name="username" type="text" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="password">
          <img src="img/login-logo-password.png" alt="">
          <!-- <span class="svg-container">
            <svg-icon icon-class="password" />
          </span> -->
          <el-input
            v-model="loginForm.password"
            :type="pwdType"
            placeholder="密码"
            name="password"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>

        <el-button
          :loading="loading"
          style="width: 100%; background: #ffb800; color: #fff; margin-bottom: 12px"
          @click.native.prevent="handleLogin"
        >登录</el-button>
        <div class="tips-text">还没有账号，<span class="link" @click="changeTab(0)">立即注册</span></div>
      </el-form>
    </div>
    <div v-else class="form-wrapper">
      <div class="register-title">
        <div class="title">注册</div>
        <div class="link" @click="changeTab(1)">登录></div>
      </div>
      <el-form ref="registerForm" :model="formObj" :rules="registerRules" class="register-form">
        <el-row class="row">
          <el-form-item label="商/协会名称" prop="chamberName">
            <el-input v-model.trim="formObj.chamberName" max-length="100" />
          </el-form-item>
        </el-row>
        <el-row class="row logo-wrapper">
          <el-form-item label="商/协会logo：" prop="chamberLogo">
            <el-upload
              class="systemLogo_uploader"
              action="/"
              :show-file-list="false"
              :before-upload="beforeChamberLogoUpload"
              :http-request="uploadChamberLogo"
            >
              <img v-if="formObj.chamberLogo" :src="formObj.chamberLogo" class="system_logo">
              <i v-else class="el-icon-plus systemLogo_uploader_icon" />
            </el-upload>
            <div class="logo-tips">
              <p>建议尺寸:88*88px</p>
              <p>格式:png/jpeg/jpg</p>
            </div>
          </el-form-item>
        </el-row>
        <el-row class="row">
          <el-form-item label="地区" prop="area">
            <el-cascader
              v-model="formObj.area"
              clearable
              separator="-"
              placeholder="选择所在地区"
              :options="areaOptions"
              :props="{ expandTrigger: 'hover', value: 'code', label: 'name' }"
            />
          </el-form-item>
        </el-row>
        <el-row class="row">
          <el-form-item label="邀请码" prop="inviteCode">
            <el-input v-model.trim="formObj.inviteCode" max-length="20" />
          </el-form-item>
        </el-row>
        <el-row :gutter="10" class="row">
          <el-col :span="12">
            <el-form-item label="联系人姓名" prop="contactName">
              <el-input v-model.trim="formObj.contactName" max-length="20" placeholder="请填写真实名字" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人手机号" prop="contactPhone">
              <el-input v-model="formObj.contactPhone" minlength="1" placeholder="手机号即为登录账号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
          <el-col :span="12">
            <el-form-item label="密码" prop="password2">
              <el-input v-model="formObj.password2" type="password" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input v-model="formObj.confirmPassword" type="password" minlength="1" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button
        v-show="!active"
        :loading="loading"
        style="width: 100%; background: #ffb800; color: #fff; margin: 20px 0"
        @click.native.prevent="handleRegister"
      >注册</el-button>
    </div>
  </div>
</template>

<script src="./login.js"></script>
<style rel="stylesheet/scss" lang="scss" src="./login.scss"></style>
