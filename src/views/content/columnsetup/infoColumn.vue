<template>
  <div class="app-container">
    <el-row>
      <el-button
        v-if="has('', '新增栏目')"
        type="primary"
        :actionid="getId('', '新增栏目')"
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
      <!-- <el-table-column label="ID">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column> -->
      <el-table-column label="栏目">
        <template slot-scope="scope">
          {{ scope.row.columnName }}
        </template>
      </el-table-column>
      <el-table-column label="展示路径">
        <template slot-scope="scope">
          <span v-if="scope.row.typeUrl==1">标签聚合页</span>
          <span v-else-if="scope.row.typeUrl==2">合作商会</span>
          <span v-else>标签聚合页与合作商会</span>
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
      <!-- <el-table-column label="修改时间">
        <template slot-scope="scope">
          {{scope.row.updatedTs}}
        </template>
      </el-table-column>
      <el-table-column label="修改人">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column> -->
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 0">已冻结</div>
          <div v-if="scope.row.status == 1">正常</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="has('', '编辑')"
            type="text"
            :actionid="getId('', '编辑')"
            @click="openVisible($event, scope.row)"
          >编辑</el-button>
          <el-button
            v-if="has('', '冻结') && scope.row.status == 1"
            type="text"
            :actionid="getId('', '冻结')"
            @click="updateStatus($event, scope.row)"
          >冻结</el-button>
          <el-button
            v-if="has('', '解冻') && scope.row.status == 0"
            type="text"
            :actionid="getId('', '解冻')"
            @click="updateStatus($event, scope.row)"
          >解冻</el-button>
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
    <el-dialog title="添加/编辑栏目" :visible.sync="visible" width="30%">
      <el-form
        ref="form"
        :model="formObj"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <!-- <el-col :offset="2" :span="20"> -->
          <el-form-item label="栏目名称：" prop="columnName">
            <el-input v-model.trim="formObj.columnName" max-length="5" />
          </el-form-item>
          <!-- </el-col> -->
        </el-row>
        <el-row v-if="visible">
          <!-- <el-col :offset="2" :span="20"> -->
          <el-form-item label="权重：" prop="level">
            <el-input v-model.number="formObj.level" maxlength="3" min="1" />
          </el-form-item>
          <!-- </el-col> -->
        </el-row>
      </el-form>
      <div style="display: flex;padding-left:18px">
        <label><span style="color: red">*</span>展示路径：</label>
        <el-checkbox-group v-model="typeUrl">
          <el-checkbox label="1">标签聚合页</el-checkbox>
          <el-checkbox label="2">合作商会</el-checkbox>
          <el-checkbox label="3">tab栏</el-checkbox>
        </el-checkbox-group>
      </div>
      <div style="margin:10px 50px;color:#7F7F7F">提示：该栏目在前台展示的位置</div>
      <span slot="footer" class="dialog-footer">
        <el-button v-dbClick type="primary" @click="save">保存</el-button>
        <el-button @click.native="visible = false">取消</el-button>
      </span>
    </el-dialog>
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
  </div>
</template>

<script src="./infoColumnSetup.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.a-link{
  color: #409EFF;
}
</style>
