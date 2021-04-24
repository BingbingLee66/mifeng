<template>
  <div class="app-container">
    <el-row>
      <!-- <el-button type="primary" @click="add" :actionid="getId('', '添加来源')" v-if="has('', '添加来源')">添加来源</el-button> -->
      <el-button type="primary" @click="add">添加来源</el-button>
    </el-row>
    <el-table id="out-table" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> -->
      <!-- <el-table-column label="ID">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column> -->
      <el-table-column label="文章来源">
        <template slot-scope="scope">
          {{scope.row.source}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 0">已冻结</div>
          <div v-if="scope.row.status == 1">正常</div>
        </template>
      </el-table-column>
      <el-table-column label="更新人">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          {{scope.row.updatedTs}}
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="openVisible(scope.row)" :actionid="getId('', '编辑')" v-if="has('', '编辑')">编辑</el-button> -->
          <el-button type="text" @click="openVisible(scope.row)">编辑</el-button>
          <!-- <el-button type="text" @click="updateStatus(scope.row)" :actionid="getId('', '冻结')" v-if="has('', '冻结') && scope.row.status == 1">冻结</el-button> -->
          <el-button type="text" v-if="scope.row.status == 1" @click="updateStatus(scope.row)">冻结</el-button>
          <!-- <el-button type="text" @click="updateStatus(scope.row)" :actionid="getId('', '解冻')" v-if="has('', '解冻') && scope.row.status == 0">解冻</el-button> -->
          <el-button type="text" v-if="scope.row.status == 0" @click="updateStatus(scope.row)">解冻</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加/编辑"
      :visible.sync="visible"
      width="30%">
      <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="100px">
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="文章来源：" prop="source">
              <el-input v-model="formObj.source" placeholder="请输入文章来源（2-30个字符）" maxLength="30"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :offset="4" :span="16">
            <el-button type="primary" v-dbClick @click="save">确定</el-button>
            <el-button @click.native="visible = false">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
