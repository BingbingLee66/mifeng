<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="small" :actionid="getId('', '新增成员')" v-if="has('', '新增成员')" @click.native="add($event)">新增成员</el-button>
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
      <el-table-column label="账号">
        <template slot-scope="scope">
          {{scope.row.userName}}
        </template>
      </el-table-column>
      <el-table-column label="成员名称">
        <template slot-scope="scope">
          {{scope.row.remark}}
        </template>
      </el-table-column>
      <el-table-column label="成员角色">
        <template slot-scope="scope">
          {{roleName(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          {{scope.row.updatedTs}}
        </template>
      </el-table-column>
      <el-table-column label="最近登录">
        <template slot-scope="scope">
          {{scope.row.lastLogonTs}}
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
          <el-button type="text" @click="edit($event, scope.row)" :actionid="getId('', '编辑')" v-if="has('', '编辑')">编辑</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row)" :actionid="getId('', '冻结')" v-if="has('', '冻结') && scope.row.status == 1">冻结</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row)" :actionid="getId('', '解冻')" v-if="has('', '解冻') && scope.row.status == 0">解冻</el-button>
          <el-button type="text" @click="delRole($event, scope.row)" :actionid="getId('', '删除')" v-if="has('', '删除')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>

    <el-dialog title="新增/编辑成员" :visible.sync="visible" width="50%">
      <el-form v-if="visible" ref="form" :model="formObj" :rules="users" label-position="left" label-width="150px">
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="登录账号：" prop="userName">
              <el-input v-model="formObj.userName" maxLength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="type == 'add'">
          <el-col :offset="2" :span="20">
            <el-form-item label="登录密码：" prop="password">
              <el-input v-model="formObj.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="type == 'edit'">
          <el-col :offset="2" :span="20">
            <el-form-item label="登录密码：">
              <el-input v-model="formObj.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="姓名：" prop="remark">
              <el-input v-model="formObj.remark" maxLength="100"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="所属角色：" prop="roleId">
              <el-select v-model="formObj.roleId" placeholder="请选择角色">
                <el-option v-for="(item, index) in roleOptions" :label="item.label" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 
        <el-row>
          <el-col :offset="2" :span="20" v-if="ckey">
            <el-form-item label="商会标识：" prop="ckey">
            <el-input v-if="formObj.ckey" v-model="formObj.ckey" disabled></el-input> 
              <el-input v-model="formObj.ckey" placeholder="若角色为商会管理人员，需添加商会标识"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-dbClick @click="save">确定</el-button>
        <el-button @click.native="visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script src="./user.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
