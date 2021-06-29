<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" :actionid="getId('', '新增供货商家')" v-if="has('', '新增供货商家')" @click.native="addSupplier($event)">新增供货商家</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
     <!--  <el-table-column type="selection" width="55px">
      </el-table-column> -->
      <el-table-column type="index" label="序号" width="80px">
      </el-table-column> 
      <!-- <el-table-column label="ID">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column> -->
      <el-table-column label="供货商名称">
        <template slot-scope="scope">
          {{scope.row.supplierName}}
        </template>
      </el-table-column>
      <el-table-column label="联系电话">
        <template slot-scope="scope">
          {{scope.row.supplierPhone}}
        </template>
      </el-table-column>
      <el-table-column label="添加时间">
        <template slot-scope="scope">
          {{scope.row.createdTs | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="添加人">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 1">正常</div>
          <div v-if="scope.row.status == 2">冻结</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="text" @click="edit($event, scope.row)" :actionid="getId('', '编辑')" v-if="has('', '编辑')">编辑</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row)" :actionid="getId('', '冻结')" v-if="has('', '冻结') && scope.row.status == 1">冻结</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row)" :actionid="getId('', '解冻')" v-if="has('', '解冻') && scope.row.status == 2">解冻</el-button>
          <!-- <el-button type="text" @click="del($event, scope.row)" :actionid="getId('', '删除')" v-if="has('', '删除')">删除</el-button> -->
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
      @current-change="handleCurrentChange">
    </el-pagination>
    <el-dialog
      title="新增/编辑供货商家"
      :visible.sync="visible"
      width="50%">
      <el-form v-if="visible" ref="form" :model="formObj" :rules="rules" label-position="left" label-width="150px">
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="供货商家名称：" prop="supplierName">
              <el-input v-model.trim="formObj.supplierName" placeholder="请填写供货商家名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="联系电话：" prop="supplierPhone">
              <el-input v-model="formObj.supplierPhone" placeholder="请填写联系电话"></el-input>
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

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
