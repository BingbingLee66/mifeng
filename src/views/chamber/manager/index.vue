<template>
  <div class="app-container">
    <div class="query-form">
      <el-form
        ref="query"
        :inline="true"
        :model="query"
        label-width="100px"
        label-position="right"
        size="small"
      >
        <el-form-item label="商/协会名称">
          <el-input v-model.trim="query.name" clearable maxlength="16" />
        </el-form-item>
        <el-form-item label="地区">
          <el-cascader
            v-model="query.area"
            :options="areaOptions"
            separator="-"
            collapse-tags
            :props="{ expandTrigger: 'hover', value: 'code', label: 'name', multiple: true }"
          />
        </el-form-item>
        <el-form-item label="商/协会账号">
          <el-input
            v-model="query.userName"
            clearable
            oninput="value=value.replace(/[^\d]/g,'')"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="请选择">
            <el-option label="全部" :value="0" />
            <el-option label="正常" :value="1" />
            <el-option label="已冻结" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="query.date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            size="small"
            @click.native="selectData($event)"
          >查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button
            v-if="has('', '添加商会')"
            type="primary"
            size="small"
            :actionid="getId('', '添加商会')"
            @click.native="add($event)"
          >添加商会
          </el-button>
          <span>当商协会权重为0时，将隐藏其在前台【推荐商协会】和【新入驻商协会】页面的展示</span>
        </el-col>
      </el-row>

    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="index" label="序号" width="60px" />
      <!-- <el-table-column label="ID">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column> -->
      <el-table-column label="商/协会标识" width="100px">
        <template slot-scope="scope">
          {{ scope.row.ckey }}
        </template>
      </el-table-column>
      <el-table-column label="商/协会logo" width="140px">
        <template slot-scope="scope">
          <img
            style="
              width: 44px;
              height: 44px;
              border-radius: 50%;
              object-fit: cover;
            "
            :src="
              scope.row.systemLogo
                ? scope.row.systemLogo
                : 'https://ysh-sh.oss-cn-shanghai.aliyuncs.com/prod/png/default_avatar.png'
            "
            alt=""
          >
        </template>
      </el-table-column>
      <el-table-column label="商/协会名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="商/协会名称">
        <template slot-scope="scope">
          {{ scope.row.province + scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="账号">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="权重" width="100px">
        <template slot-scope="scope">
          <span style="color: #409eff; cursor: pointer" @click="updateLevel(scope.row)">{{
            scope.row.level
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px">
        <template slot-scope="scope">
          {{ scope.row.createdTs }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150px">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 1">正常</div>
          <div v-if="scope.row.status == 0">已冻结</div>
          <div v-if="scope.row.status == 3">待邀请</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="has('', '详情')"
            type="text"
            :actionid="getId('', '详情')"
            @click="detail($event, scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-if="has('', '编辑')"
            type="text"
            :actionid="getId('', '编辑')"
            @click="edit($event, scope.row)"
          >编辑
          </el-button>
          <el-button
            v-if="has('', '冻结') && scope.row.status == 1"
            type="text"
            :actionid="getId('', '冻结')"
            @click="updateStatus($event, scope.row)"
          >冻结账号
          </el-button>
          <el-button
            v-if="has('', '解冻') && scope.row.status == 0"
            type="text"
            :actionid="getId('', '解冻')"
            @click="updateStatus($event, scope.row)"
          >解冻账号
          </el-button>
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
      @current-change="handleCurrentChange"
    />
    <el-dialog title="添加/编辑商会" :visible.sync="editorVisible" width="50%">
      <el-form
        ref="form"
        :model="formObj"
        :rules="rules"
        label-position="left"
        label-width="150px"
      >
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="商/协会名称：" prop="name">
              <el-input v-model.trim="formObj.name" max-length="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="商/协会logo：" prop="systemLogo">
              <el-upload
                class="systemLogo_uploader"
                action="/"
                :show-file-list="false"
                :before-upload="beforeSystemLogoUpload"
                :http-request="uploadSystemLogo"
              >
                <img
                  v-if="formObj.systemLogo"
                  :src="formObj.systemLogo"
                  class="system_logo"
                >
                <i v-else class="el-icon-plus systemLogo_uploader_icon" />
              </el-upload>
              <p style="margin: 0; padding: 0">
                建议尺寸:88*88px; 格式:png/jpeg/jpg
              </p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="联系人姓名：" prop="president">
              <el-input
                v-model.trim="formObj.president"
                max-length="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="联系人手机号" prop="phone">
              <el-input
                v-model="formObj.phone"
                minlength="1"
                placeholder="手机号码即商会后台登录账号"
                :readonly="type === 'add' ? false : true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="地区" prop="area">
              <el-cascader
                v-model="formObj.area"
                clearable
                separator="-"
                :options="areaOptions"
                :props="{ expandTrigger: 'hover', value: 'code', label: 'name'}"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="办公地址" prop="address">
              <el-input
                v-model.trim="formObj.address"
                max-length="200"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="社会团体法人登记证" prop="license">
              <el-upload
                class="avatar-uploader"
                action="/"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="upload"
              >
                <img
                  v-if="formObj.license"
                  :src="formObj.license"
                  class="avatar"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="推荐人">
              <el-input
                v-if="editorVisible"
                v-model.trim="formObj.referrer"
                max-length="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row v-if="type == 'add'"> -->
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item v-if="type == 'add'" label="密码" prop="password">
              <el-input
                v-model="formObj.password"
                type="password"
                minlength="1"
              />
            </el-form-item>
            <el-form-item v-else label="密码">
              <el-input
                v-model="formObj.password"
                type="password"
                minlength="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="type == 'add'">
          <el-col :offset="2" :span="20">
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="formObj.confirmPassword"
                type="password"
                minlength="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row v-if="editorVisible">
          <el-col :offset="2" :span="20">
            <el-form-item label="排序" prop="level">
              <el-input v-model="formObj.level" minlength="1"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-form-item>
          <el-col :offset="6" :span="8">
            <el-button v-dbClick type="primary" @click="save">保存</el-button>
            <el-button @click.native="editorVisible = false">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="商会详情" :visible.sync="detailVisible" width="50%">
      <el-row>
        <el-col :offset="2" :span="6">商/协会名称：</el-col>
        <el-col :span="10">{{ detailObj.name }}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="6">商/协会logo：</el-col>
        <el-col
          :span="10"
        ><img
          :src="
            detailObj.systemLogo
              ? detailObj.systemLogo
              : 'https://ysh-sh.oss-cn-shanghai.aliyuncs.com/prod/png/default_avatar.png'
          "
          alt=""
          style="width: 88px; height: 88px; border-radius: 50%"
        ></el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="6">联系人姓名：</el-col>
        <el-col :span="10">{{ detailObj.president }}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="6">联系人手机号：</el-col>
        <el-col :span="10">{{ detailObj.phone }}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="6">地区：</el-col>
        <el-col :span="10">{{ detailObj.province + detailObj.city }}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="6">办公地址：</el-col>
        <el-col :span="10">{{ detailObj.address }}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="6">社会团体法人登记证：</el-col>
        <el-col :span="10">
          <div class="license-box">
            <img :src="detailObj.license" @click="enlarge(detailObj.license)">
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="6">推荐人：</el-col>
        <el-col v-if="detailObj.referrer" :span="10">{{
          detailObj.referrer
        }}</el-col>
        <el-col v-if="!detailObj.referrer" :span="10">无</el-col>
      </el-row>
      <!--       <el-row>
        <el-col :offset="2" :span="8">账号密码</el-col>
        <el-col :span="10">{{detailObj.password}}</el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :offset="2" :span="6">排序：</el-col>
        <el-col :span="10">{{ detailObj.level }}</el-col>
      </el-row> -->
      <el-row>
        <hr>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="6">创建时间：</el-col>
        <el-col :span="10">{{ detailObj.createdTs }}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="6">操作人：</el-col>
        <el-col :span="10">{{ detailObj.operator }}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="20" :span="2">
          <el-button
            v-dbClick
            type="primary"
            @click.native="detailVisible = false"
          >确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <levelDialog ref="levelDialog" title="权重" width="30%" />
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

.systemLogo_uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 180px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.systemLogo_uploader_icon {
  font-size: 28px;
  color: #8c939d;
  width: 88px;
  height: 88px;
  line-height: 88px;
  border-radius: 50%;
  text-align: center;
}

.avatar {
  width: 180px;
  height: 100px;
  display: block;
}

.system_logo {
  width: 88px;
  height: 88px;
  display: block;
  object-fit: cover;
  border-radius: 50%;
}

.license-box {
  width: 180px;
  height: 100px;
  border-color: #409eff;
}

.license-box img {
  width: 100%;
  height: 100%;
}
</style>
