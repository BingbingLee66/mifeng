<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="small" :actionid="getId('', '新增职务')" v-if="has('', '新增职务')" @click.native="add($event)">新增职务</el-button>
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
      <el-table-column label="职务名称">
        <template slot-scope="scope">
          {{scope.row.position}}
        </template>
      </el-table-column>
      <!-- <el-table-column label="排序">
        <template slot-scope="scope">
          {{scope.row.level}}
        </template>
      </el-table-column> -->
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          {{scope.row.updatedTs}}
        </template>
      </el-table-column>
      <el-table-column label="操作人">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 1">已启用</div>
          <div v-if="scope.row.status == 0">已禁用</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="text" @click="edit($event, scope.row)" :actionid="getId('', '编辑')" v-if="has('', '编辑')">编辑</el-button>
          <!-- <el-button type="text" @click="del($event, scope.row)" :actionid="getId('', '删除')" v-if="has('', '删除')">删除</el-button> -->
          <el-button type="text" @click="updateStatus($event, scope.row)" :actionid="getId('', '禁用')" v-if="has('', '禁用') && scope.row.status == 1">禁用</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row)" :actionid="getId('', '启用')" v-if="has('', '启用') && scope.row.status == 0">启用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="添加/编辑职务"
      :visible.sync="visible"
      width="30%">
      <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="100px">
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="职务名称：" prop="position">
              <el-input v-model="formObj.position" maxLength="100"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row v-if="visible">
          <el-col :offset="2" :span="20">
            <el-form-item label="排序：" prop="level">
              <el-input v-model="formObj.level"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="是否启用：">
              <el-radio-group v-model="formObj.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
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

<script src="./position.js"></script>

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
