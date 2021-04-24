<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <!-- <el-button type="primary" size="small" :actionid="getId('', '添加文本')" v-if="has('', '添加文本')" @click.native="add($event)">添加文本</el-button> -->
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
      <el-table-column label="文本标题">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
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
          <div v-if="scope.row.status == 0">已禁用</div>
          <div v-if="scope.row.status == 1">已启用</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit($event, scope.row)" :actionid="getId('', '编辑')" v-if="has('', '编辑')">编辑</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row)" :actionid="getId('', '禁用')" v-if="has('', '禁用') && scope.row.status == 1">禁用</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row)" :actionid="getId('', '启用')" v-if="has('', '启用') && scope.row.status == 0">启用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="编辑文本"
      :visible.sync="visible"
      width="70%">
      <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="150px">
        <el-row>
          <el-col v-if="visible" :offset="2" :span="20">
            <el-form-item label="文本标题：" prop="title">
              <el-input v-model="formObj.title" maxLength="100"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :offset="2" :span="20">
            <el-form-item label="内容详情：" prop="content">
              <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 20 }" v-model="formObj.content"  maxLength="2000"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :offset="2" :span="20">
            <el-form-item label="内容详情：">
              <Ckeditor ref="ckeditor1" @getHtml="getHtml"></Ckeditor>
            </el-form-item>
          </el-col>
        </el-row>
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-dbClick @click="save">确定</el-button>
        <el-button @click.native="visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script src="./text.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
