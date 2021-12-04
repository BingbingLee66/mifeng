<template>
  <div class="app-container">
    <el-form ref="query" label-width="auto" label-position="right" :model="query">
      <el-row>
        <el-col :span="5">
          <el-form-item label="文章来源：">
            <el-input v-model="query.source" placeholder="关键词" />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item :span="3" label="状态：">
            <el-select v-model="query.status">
              <el-option label="全部" :value="-1" />
              <el-option label="正常" :value="1" />
              <el-option label="冻结" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="创建人：">
            <el-input v-model="query.creator" placeholder="关键词" />
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item label=" ">
            <el-button  type="primary"  @click="queryData()">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-button type="primary" @click="add" :actionid="getId('', '添加来源')" v-if="has('', '添加来源')">添加来源</el-button> -->
        <el-button type="primary" @click="add">添加来源</el-button>
      </el-row>
    </el-form>
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
      <el-table-column label="创建信息">
        <template slot-scope="scope">
          <div>
            {{scope.row.operator}}
          </div>
          <div>
            {{scope.row.updatedTs}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="openVisible(scope.row)" :actionid="getId('', '编辑')" v-if="has('', '编辑')">编辑</el-button> -->
          <div>
            <el-button type="text" @click="openVisible(scope.row)">编辑</el-button>
          </div>
          <div>
            <el-button type="text" v-if="scope.row.status == 1" @click="updateStatus(scope.row)">冻结</el-button>
            <el-button type="text" v-if="scope.row.status == 0" @click="updateStatus(scope.row)">解冻</el-button>
          </div>
          <!-- <el-button type="text" @click="updateStatus(scope.row)" :actionid="getId('', '冻结')" v-if="has('', '冻结') && scope.row.status == 1">冻结</el-button> -->
          <!-- <el-button type="text" @click="updateStatus(scope.row)" :actionid="getId('', '解冻')" v-if="has('', '解冻') && scope.row.status == 0">解冻</el-button> -->
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
