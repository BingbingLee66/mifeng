<template>
  <div class="app-container">
    <kd-dialog
      ref="levelDialog"
      dialog-title="权重"
      @savePopupData="savePopupData"
    >
      <div slot="content">
        <el-form
          ref="levelForm"
          :model="levelForm"
          :rules="levelRules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="权重" prop="level">
            <el-input v-model.number="levelForm.level" />
          </el-form-item>
        </el-form>
      </div>
    </kd-dialog>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="商会文章" name="3" />
      <el-tab-pane label="关于商会" name="4" />
    </el-tabs>
    <div v-if="activeName == '3'">
      <el-row>
        <el-button
          v-if="has('商会文章', '新增栏目')"
          type="primary"
          :actionid="getId('商会文章', '新增栏目')"
          @click="add($event)"
        >新增栏目</el-button>
      </el-row>
      <el-table
        id="out-table"
        :key="table3Ckey"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="序号" width="60px" />
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
              {{ scope.row.level }}</a>
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
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">已冻结</div>
            <div v-if="scope.row.status == 1">正常</div>
            <div v-if="scope.row.status == 3">固定栏位</div>
          </template>
        </el-table-column>
        <el-table-column v-if="isSpecialCommitteeBolVisible" label="">
          <template slot="header">
            <span>是否给专委会使用</span>
            <el-tooltip effect="dark" content="开启后，专委会可以发文到栏目下。" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isSpecialCommitteeBol" :disabled="scope.row.columnName==='会员分享'" @change="handleSpecialCommitteeChange($event,scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status != 3 && scope.row.columnName!=='会员分享'"
              class="my-btn"
              type="text"
              @click="openVisible($event, scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.status == 3 && scope.row.columnName!=='会员分享'"
              class="my-btn"
              type="text"
              disabled
              @click="openVisible($event, scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.status == 1"
              class="my-btn"
              type="text"
              @click="updateStatus($event, scope.row)"
            >冻结</el-button>
            <el-button
              v-if="scope.row.status == 0"
              class="my-btn"
              type="text"
              @click="updateStatus($event, scope.row)"
            >解冻</el-button>
            <el-button
              v-if="scope.row.columnName!=='会员分享'"
              class="my-btn"
              type="text"
              @click="delColumn(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- <div class="block">
          <el-pagination layout="prev, pager, next" :current-page.sync="page" :total="10000" @current-change="currentChange">
          </el-pagination>
        </div> -->
    </div>
    <div v-if="activeName == '4'">
      <el-row>
        <el-button
          v-if="has('关于商会', '新增栏目')"
          type="primary"
          :actionid="getId('关于商会', '新增栏目')"
          @click="add($event)"
        >新增栏目</el-button>
      </el-row>
      <el-table
        id="out-table"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="序号" width="60px" />
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
              {{ scope.row.level }}</a>
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
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">已冻结</div>
            <div v-if="scope.row.status == 1">正常</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="has('关于商会', '编辑') && scope.row.status !== 3"
              type="text"
              :actionid="getId('关于商会', '编辑')"
              class="my-btn"
              @click="openVisible($event, scope.row)"
            >编辑</el-button>
            <div v-else>--</div>
            <el-button
              v-if="has('关于商会', '冻结') && scope.row.status == 1"
              type="text"
              :actionid="getId('关于商会', '冻结')"
              class="my-btn"
              @click="updateStatus($event, scope.row)"
            >冻结</el-button>
            <el-button
              v-if="has('关于商会', '解冻') && scope.row.status == 0"
              type="text"
              :actionid="getId('关于商会', '解冻')"
              class="my-btn"
              @click="updateStatus($event, scope.row)"
            >解冻</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div class="block">
      <el-pagination :page-size="pageSize" :current-page.sync="page" :total="totalRows" layout="prev, pager, next" @current-change="currentChange" />
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
              <el-input
                v-model="formObj.columnName"
                max-length="5"
                placeholder="限5个字符内"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="visible">
          <el-col :offset="2" :span="20">
            <el-form-item label="权重：" prop="level">
              <el-input
                v-model="formObj.level"
                placeholder="请输入大于0的整数"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :offset="4" :span="16">
            <el-button v-dbClick type="primary" @click="save">保存</el-button>
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
