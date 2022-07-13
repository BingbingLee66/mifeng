<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button v-if="has('', '添加职位')" type="primary" size="small" :actionid="getId('', '添加职位')" @click.native="add($event)">添加职位</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="index" label="序号" width="60px" />
      <!-- <el-table-column label="ID">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column> -->
      <el-table-column label="职位">
        <template slot-scope="scope">
          {{ scope.row.postName }}
        </template>
      </el-table-column>
      <el-table-column label="会费（元/年）">
        <template slot-scope="scope">
          {{ memberFeeCp(scope.row.memberFee) }}
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          {{ scope.row.level }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间">
        <template slot-scope="scope">
          {{ scope.row.createdTs }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 1">启用</div>
          <div v-if="scope.row.status == 0">禁用</div>
        </template>
      </el-table-column> -->
      <el-table-column label="修改时间">
        <template slot-scope="scope">
          {{ scope.row.updatedTs }}
        </template>
      </el-table-column>
      <el-table-column label="操作人">
        <template slot-scope="scope">
          {{ scope.row.operator }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="has('', '编辑')" type="text" :actionid="getId('', '编辑')" @click="edit($event, scope.row)">编辑</el-button>
          <el-button type="text" @click="del(scope.row,list.length)">删除</el-button>
          <!-- <el-button type="text" @click="updateStatus(scope.row)" v-if="scope.row.status == 1">冻结</el-button>
          <el-button type="text" @click="updateStatus(scope.row)" v-if="scope.row.status == 0">解冻</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="添加/编辑职位"
      :visible.sync="visible"
      width="40%"
    >
      <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="100px">
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="职位名称：" prop="postName" :rules="{validator: postNameVaild, trigger: 'blur'}">
              <el-input v-model="formObj.postName" maxlength="20" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="17">
            <el-form-item label="会费：" prop="memberFee">
              <el-input v-model="formObj.memberFee" />
            </el-form-item>
          </el-col>
          <el-col :span="3"><div class="member-fee">元/年</div></el-col>
        </el-row>
        <el-row v-if="visible">
          <el-col :offset="2" :span="20">
            <el-form-item label="排序：" prop="level">
              <el-input v-model="formObj.level" />
              <span style="font-size: 10px;">注：数字越大排序越靠后，且此处排序决定小程序端会员展示的顺序</span>
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

<script src="./post.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
  .member-fee {
    margin-left: 10px;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    font-weight: 700;
  }
</style>
