<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button v-if="has('', '新增角色')" type="primary" size="small" :actionid="getId('', '新增角色')" @click.native="add($event)">新增角色</el-button>
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
      <el-table-column label="角色">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updatedTs }}
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
          <div v-if="scope.row.roleName!=='专业委员会'">
            <el-button v-if="has('', '设置权限')" type="text" :actionid="getId('', '设置权限')" @click="setup($event, scope.row)">设置权限</el-button>
            <el-button v-if="has('', '编辑角色')" type="text" :actionid="getId('', '编辑角色')" @click="edit($event, scope.row)">编辑角色</el-button>
            <el-button v-if="has('', '冻结') && scope.row.status == 1" type="text" :actionid="getId('', '冻结')" @click="updateStatus($event, scope.row)">冻结</el-button>
            <el-button v-if="has('', '解冻') && scope.row.status == 0" type="text" :actionid="getId('', '解冻')" @click="updateStatus($event, scope.row)">解冻</el-button>
            <el-button v-if="has('', '删除')" type="text" :actionid="getId('', '删除')" @click="delRole($event, scope.row)">删除</el-button>
          </div>
          <div v-else>
            <el-button v-if="has('', '冻结') && scope.row.status == 1" type="text" :actionid="getId('', '冻结')" @click="updateStatus($event, scope.row)">冻结</el-button>
            <el-button v-if="has('', '解冻') && scope.row.status == 0" type="text" :actionid="getId('', '解冻')" @click="updateStatus($event, scope.row)">解冻</el-button>
          </div>
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
      title="新增/编辑角色"
      :visible.sync="visible"
      width="50%"
      :before-close="beforeClose"
    >
      <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="150px">
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="角色：" prop="roleName">
              <el-input v-model="formObj.roleName" max-length="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="是否启用：">
              <el-radio-group v-model="formObj.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-dbClick type="primary" @click="save">确定</el-button>
        <el-button @click.native="beforeClose">取消</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
