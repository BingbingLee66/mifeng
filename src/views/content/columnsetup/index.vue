<template>
  <div class="app-container">
    <kd-dialog
      ref="levelDialog"
      dialogTitle="权重"
      @savePopupData="savePopupData"
    >
      <div slot="content">
        <el-form
          :model="levelForm"
          :rules="levelRules"
          ref="levelForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="权重" prop="level">
            <el-input v-model.number="levelForm.level"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </kd-dialog>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="商会文章" name="3"></el-tab-pane>
      <el-tab-pane label="关于商会" name="4"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName == '3'">
      <el-row>
        <el-button
          type="primary"
          @click="add($event)"
          :actionid="getId('商会资讯', '新增栏目')"
          v-if="has('商会资讯', '新增栏目')"
          >新增栏目</el-button
        >
      </el-row>
      <el-table
        id="out-table"
        :data="list"
        v-loading="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="序号" width="60px">
        </el-table-column>
        <!-- <el-table-column label="ID">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column> -->
        <el-table-column label="所属模块">
          <template slot-scope="scope">
            {{ scope.row.contentModule }}
          </template>
        </el-table-column>
        <el-table-column label="栏目">
          <template slot-scope="scope">
            {{ scope.row.columnName }}
          </template>
        </el-table-column>
        <el-table-column label="权重">
          <template slot-scope="scope">
            <a class="a-link" @click="setLevel(scope.row)">
              {{ scope.row.level }}</a
            >
          </template>
        </el-table-column>
        <el-table-column label="创建信息">
          <template slot-scope="scope">
            <div>
              {{ scope.row.operator }}
            </div>
            <div>
              {{ scope.row.createdTs }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="更新信息">
          <template slot-scope="scope">
            <div>
              {{ scope.row.updater }}
            </div>
            <div>
              {{ scope.row.updatedTs }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="修改时间">
          <template slot-scope="scope">
            {{ scope.row.updatedTs }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="修改人">
          <template slot-scope="scope">
            {{ scope.row.operator }}
          </template>
        </el-table-column> -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">已冻结</div>
            <div v-if="scope.row.status == 1">正常</div>
            <div v-if="scope.row.status == 3">固定栏位</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              class="my-btn"
              type="text"
              @click="openVisible($event, scope.row)"
              :actionid="getId('商会资讯', '编辑')"
              v-if="has('商会资讯', '编辑') && scope.row.status != 3"
              >编辑</el-button
            ><el-button
              class="my-btn"
              type="text"
              @click="openVisible($event, scope.row)"
              :actionid="getId('商会资讯', '编辑')"
              v-if="has('商会资讯', '编辑') && scope.row.status == 3"
              disabled
              >编辑</el-button
            >
            <el-button
              class="my-btn"
              type="text"
              @click="updateStatus($event, scope.row)"
              :actionid="getId('商会资讯', '冻结')"
              v-if="has('商会资讯', '冻结') && scope.row.status == 1"
              >冻结</el-button
            >
            <el-button
              class="my-btn"
              type="text"
              @click="updateStatus($event, scope.row)"
              :actionid="getId('商会资讯', '解冻')"
              v-if="has('商会资讯', '解冻') && scope.row.status == 0"
              >解冻</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="activeName == '4'">
      <el-row>
        <el-button
          type="primary"
          @click="add($event)"
          :actionid="getId('关于商会', '新增栏目')"
          v-if="has('关于商会', '新增栏目')"
          >新增栏目</el-button
        >
      </el-row>
      <el-table
        id="out-table"
        :data="list"
        v-loading="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="序号" width="60px">
        </el-table-column>
        <!-- <el-table-column label="ID">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column> -->
        <el-table-column label="所属模块">
          <template slot-scope="scope">
            {{ scope.row.contentModule }}
          </template>
        </el-table-column>
        <el-table-column label="栏目">
          <template slot-scope="scope">
            {{ scope.row.columnName }}
          </template>
        </el-table-column>
        <el-table-column label="权重">
          <template slot-scope="scope">
            <a class="a-link" @click="setLevel(scope.row)">
              {{ scope.row.level }}</a
            >
          </template>
        </el-table-column>
        <el-table-column label="修改时间">
          <template slot-scope="scope">
            {{ scope.row.updatedTs }}
          </template>
        </el-table-column>
        <el-table-column label="修改人">
          <template slot-scope="scope">
            {{ scope.row.operator }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">已冻结</div>
            <div v-if="scope.row.status == 1">正常</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="openVisible($event, scope.row)"
              :actionid="getId('关于商会', '编辑')"
              v-if="has('关于商会', '编辑')"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="updateStatus($event, scope.row)"
              :actionid="getId('关于商会', '冻结')"
              v-if="has('关于商会', '冻结') && scope.row.status == 1"
              >冻结</el-button
            >
            <el-button
              type="text"
              @click="updateStatus($event, scope.row)"
              :actionid="getId('关于商会', '解冻')"
              v-if="has('关于商会', '解冻') && scope.row.status == 0"
              >解冻</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加/编辑栏目" :visible.sync="visible" width="30%">
      <el-form
        ref="form"
        :model="formObj"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="栏目名称：" prop="columnName">
              <el-input v-model="formObj.columnName" maxLength="5" placeholder="限5个字符内"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="visible">
          <el-col :offset="2" :span="20">
            <el-form-item label="权重：" prop="level">
              <el-input placeholder="请输入大于0的整数" v-model="formObj.level"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :offset="4" :span="16">
            <el-button type="primary" v-dbClick @click="save">保存</el-button>
            <el-button @click.native="visible = false">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./setup.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.my-btn {
  display: block;
  margin: 0;
}
.a-link {
  color: #409eff;
}
</style>
