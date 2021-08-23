<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" :actionid="getId('', '添加新渠道')" v-if="has('', '添加新渠道')" @click.native="addSupplier($event)">添加新渠道</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
     
      <el-table-column label="渠道ID">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="渠道名称">
        <template slot-scope="scope">
          {{scope.row.channelName}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createdTs | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作人">
        <template slot-scope="scope">
          {{scope.row.operatorName}}
        </template>
      </el-table-column>
      
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="text" @click="edit($event, scope.row)" :actionid="getId('', '编辑')" v-if="has('', '编辑')">编辑</el-button>
          <el-button type="text" @click="delChannel($event, scope.row)" :actionid="getId('', '删除')" v-if="has('', '删除')">删除</el-button> 
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
      :style="{'padding-top': '15px'}">
    </el-pagination>
    <el-dialog
      title="新增/编辑渠道"
      :visible.sync="visible"
      width="50%">
      <el-form v-if="visible" ref="form" :model="formObj" :rules="rules" label-position="left" label-width="150px">
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="渠道名称：" prop="channelName">
              <el-input v-model.trim="formObj.channelName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-dbClick @click="save">提交</el-button>
        <el-button @click.native="visible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
