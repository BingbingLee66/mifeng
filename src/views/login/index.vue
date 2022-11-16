<template>
  <div class="login-container" style="background-image: url(img/bg.jpg); background-size: 100% 100%">
    <div class="login-tab">
      <span :class="active ? 'active' : ''" @click="active = 1">登录</span> |
      <span :class="active ? '' : 'active'" @click="active = 0">注册</span>
    </div>
    <el-form
      v-if="active"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">云商会</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" placeholder="账号" name="username" type="text" auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
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

      <!-- <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          placeholder="密码"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item> -->

      <el-button
        :loading="loading"
        type="info"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
    <el-form
      v-else
      ref="registerForm"
      :model="formObj"
      :rules="registerRules"
      label-position="left"
      label-width="150px"
      class="register-form"
    >
      <!-- 要加两个无用的form-item 否则前两个form-item不会校验 -->
      <el-form-item style="display: none" />
      <el-form-item style="display: none" />
      <el-form-item label="统一社会信用代码：" prop="socialCode">
        <el-input v-model.trim="formObj.socialCode" max-length="100" @blur="checkCode" />
      </el-form-item>
      <el-form-item label="商/协会名称：" prop="chamberName">
        <el-input v-model.trim="formObj.chamberName" max-length="100" />
      </el-form-item>
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
        <p style="margin: 0; padding: 0;color:#494d50">建议尺寸:88*88px; 格式:png/jpeg/jpg</p>
      </el-form-item>

      <el-form-item label="地区" prop="area">
        <el-cascader
          v-model="formObj.area"
          clearable
          separator="-"
          :options="areaOptions"
          :props="{ expandTrigger: 'hover', value: 'code', label: 'name' }"
        />
      </el-form-item>
      <el-form-item label="邀请码：" prop="inviteCode">
        <el-input v-model.trim="formObj.inviteCode" max-length="20" />
      </el-form-item>
      <el-form-item label="联系人姓名：" prop="contactName">
        <el-input v-model.trim="formObj.contactName" max-length="20" placeholder="请填写真实名字" />
      </el-form-item>
      <el-form-item label="联系人手机号" prop="contactPhone">
        <el-input v-model="formObj.contactPhone" minlength="1" placeholder="手机号码即商会后台登录账号" />
      </el-form-item>
      <el-form-item label="密码" prop="password2">
        <el-input v-model="formObj.password2" type="password" />
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="formObj.confirmPassword" type="password" minlength="1" />
      </el-form-item>
    </el-form>
    <el-button
      v-show="!active"
      :loading="loading"
      type="info"
      style="width: 20%; margin-bottom: 30px"
      @click.native.prevent="handleRegister"
    >注册</el-button>
  </div>
</template>

<script src="./login.js"></script>
<style rel="stylesheet/scss" lang="scss" src="./login.scss"></style>
