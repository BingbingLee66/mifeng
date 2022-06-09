<template>
  <div class="app-container">
    <!-- tab控制列表展示 -->
    <el-tabs v-model="tabName" @tab-click="tabSwitch" v-show="!ckey">
      <el-tab-pane label="小程序" name="wxapp"></el-tab-pane>
      <el-tab-pane label="APP" name="app"></el-tab-pane>
    </el-tabs>

    <el-row>
      <el-button
        type="primary"
        size="small"
        @click="add($event, 1)"
        :actionid="getId('', '添加轮播图')"
        v-if="has('', '添加轮播图')"
      >
        添加轮播图
      </el-button>
    </el-row>
    <!-- 小程序轮播图 -->
    <div class="t-block" v-if="tabName === 'wxapp'">
      <el-table
        id="out-table"
        :data="list"
        v-loading="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="序号" width="80px">
        </el-table-column>
        <el-table-column label="关联内容" width="80px">
          <template slot-scope="scope">
            {{
              scope.row.type == 1
                ? "文章"
                : scope.row.type == 2
                ? "商品"
                : scope.row.type == 3
                ? "邀请有礼"
                : "- -"
            }}
          </template>
        </el-table-column>
        <el-table-column label="标题/ID" width="300px">
          <template slot-scope="scope">
            <div style="color: #ff0000">{{ scope.row.articleId }}</div>
            <div>{{ scope.row.title ? scope.row.title : "- -" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="175px">
          <template slot-scope="scope">
            <img
              style="width: 153px; height: 60px; object-fit: cover"
              :src="scope.row.img"
            />
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="155px">
          <template slot-scope="scope">
            {{ scope.row.updatedTs }}
          </template>
        </el-table-column>
        <el-table-column label="操作人" width="155px">
          <template slot-scope="scope">
            {{ scope.row.operator }}
          </template>
        </el-table-column>
        <el-table-column label="权重" width="80px">
          <template slot-scope="scope">
            <span
              style="color: #409eff; cursor: pointer"
              @click="showLevel(scope.row)"
              >{{ scope.row.level }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="edit($event, scope.row)"
              :actionid="getId('', '编辑')"
              v-if="has('', '编辑')"
              >编辑
            </el-button>
            <el-button
              type="text"
              @click="del($event, scope.row)"
              :actionid="getId('', '删除')"
              v-if="has('', '删除')"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- app轮播图 -->
    <div class="t-block" v-if="tabName === 'app'">
      <!-- 表单搜索区域start -->
      <el-form
        :inline="true"
        :model="queryParams"
        ref="queryParams"
        class="demo-form-inline"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="queryParams.title" placeholder="关键词"></el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="createdId">
          <el-select
            v-model="queryParams.createdId"
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="getAdminUserList"
            :loading="adminUserLoading"
            clearable
          >
            <el-option
              v-for="admin in adminUserList"
              :key="admin.id"
              :label="admin.remark"
              :value="admin.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="createdTime">
          <el-date-picker
            v-model="createdTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        id="out-table"
        :data="list"
        v-loading="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="序号" width="80px">
        </el-table-column>
        <el-table-column label="标题" width="300px">
          <template slot-scope="scope">
            <div>{{ scope.row.title ? scope.row.title : "- -" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="175px">
          <template slot-scope="scope">
            <img
              style="width: 153px; height: 60px; object-fit: cover"
              :src="scope.row.img"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建信息" width="155px">
          <template slot-scope="scope">
            {{ scope.row.created }}
            <br />
            {{ scope.row.createdTs }}
          </template>
        </el-table-column>
        <el-table-column label="更新信息" width="155px">
          <template slot-scope="scope">
            {{ scope.row.operator }}
            <br />
            {{ scope.row.updatedTs }}
          </template>
        </el-table-column>
        <el-table-column label="权重" width="80px">
          <template slot-scope="scope">
            <span
              style="color: #409eff; cursor: pointer"
              @click="showLevel(scope.row)"
              >{{ scope.row.level }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="edit($event, scope.row)"
              :actionid="getId('', '编辑')"
              v-if="has('', '编辑')"
              >编辑
            </el-button>
            <el-button
              type="text"
              @click="del($event, scope.row)"
              :actionid="getId('', '删除')"
              v-if="has('', '删除')"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页start -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="page.pageSizes"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        >
        </el-pagination>
        <!-- 分页end -->
      </div>
    </div>

    <el-dialog :title="addDialogTitle" :visible.sync="visible" width="40%">
      <el-form
        ref="form"
        :model="formObj"
        :rules="rules"
        label-position="right"
        label-width="120px"
      >
        <el-row v-if="isWxApp">
          <el-col :offset="2" :span="10">
            <el-form-item label="关联内容：">
              <el-select
                v-model="formObj.type"
                placeholder="请选择"
                clearable
                @clear="handleClear"
              >
                <el-option label="文章" :value="1"></el-option>
                <el-option label="商品" :value="2"></el-option>
                <el-option
                  label="邀请有礼"
                  :value="3"
                  v-if="!this.ckey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isWxApp">
          <el-col :offset="2" :span="20">
            <el-form-item
              :label="
                formObj.type == 1
                  ? '文章ID：'
                  : formObj.type == 2
                  ? '商品ID：'
                  : '文章ID: '
              "
              prop="articleId"
            >
              <el-input
                v-model="formObj.articleId"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="轮播图标题：" prop="title" class="title-input">
              <el-input
                v-model="formObj.title"
                show-word-limit
                :maxlength="formObj.type == 1 || formObj.type == 3 ? 60 : 30"
                :placeholder="
                  formObj.type == 1 || formObj.type == 3 ? '60字内' : '30字内'
                "
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="visible">
          <el-col :offset="2" :span="10">
            <el-form-item label="权重：" prop="level">
              <el-input v-model="formObj.level"></el-input>
              <div style="width: 400px">
                权重请控制在0-999，权重为0不在前台展示
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="!isWxApp">
          <el-col :offset="2" :span="20">
            <el-form-item label="跳转协议：" prop="jsonContext">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入跳转协议"
                v-model="formObj.jsonContext"
              >
              </el-input>
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
                :http-request="upload"
              >
                <img v-if="formObj.img" :src="formObj.img" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              建议尺寸：702x276 支持jpg、png
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :offset="5" :span="10">
            <el-button type="primary" v-dbClick @click="save">发布</el-button>
            <el-button @click.native="visible = false">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="权重" :visible.sync="showLevelDialog" width="30%">
      <el-form
        :model="levelForm"
        ref="levelForm"
        label-width="100px"
        :rules="rules2"
      >
        <el-form-item label="权重" prop="level">
          <el-input v-model="levelForm.level" placeholder="请输入"></el-input>
          <div>权重请控制在0-999，权重为0不在前台展示</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitLevel('levelForm')"
            >提交</el-button
          >
          <el-button @click="showLevelDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./carousel.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
<style lang="scss">
.t-block .el-button {
  margin-left: 0;
  margin-right: 10px;
}

.title-input .el-input__inner {
  padding-right: 45px !important;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
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

.avatar {
  width: 180px;
  height: 100px;
  display: block;
}
</style>
