<template>
  <div class="app-container">
    <div class="department_container">
      <div class="tit">在这里创建、编辑和删除部门</div>
      <div style="margin-top:30px">
        <el-table
          :data="tableData"
          style="width: 80%;margin-bottom: 20px;"
          row-key="id"
          border
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column
            prop="name"
            label="部门名称"
            width="480">
            <!-- <template slot-scope="scope">
              {{ scope.row.name }}
            </template>-->
          </el-table-column>
          <el-table-column
            prop="num"
            label="成员数"
            width="280">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.$index === 0" @click="handleDialog('add',scope.row)">添加部门</el-button>
              <el-button type="text" v-if="scope.$index !== 0" @click="handleDialog('edit',scope.row)">编辑部门名称
              </el-button>
              <el-button type="text" v-if="scope.$index !== 0" @click="handleDialog('addsub',scope.row)">添加下级部门
              </el-button>
              <el-button type="text" v-if="scope.$index !== 0" @click="handleDelDialog(scope.row)">删除部门</el-button>
              <!-- <el-button type="text" @click="openTransfer(scope.row)" :actionid="getId('', '转让')" v-if="has('', '转让')">转让</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--  添加/编辑部门弹窗  -->
    <div class="department_dialog">
      <el-dialog
        title="添加部门"
        :visible.sync="showDialog"
        width="500px">
        <div class="from_wrap">
          <div class="from_item">
            <div class="from_item_label">上级部门：</div>
            <div class="">广东省江西商会</div>
          </div>
          <div class="from_item">
            <div class="from_item_label">部门名称：</div>
            <el-input v-model="name" type="text" placeholder="请输入部门名称" maxlength="20" show-word-limit></el-input>
          </div>
          <div class="from_item" style="padding-left: 80px">
            <el-button @click.native="showDialog = false">取消</el-button>
            <el-button type="primary" v-dbClick @click="save">保存</el-button>
          </div>
        </div>
      </el-dialog>
    </div>

    <!--  删除部门弹窗  -->
    <div class="department_dialog">
      <el-dialog
        title="删除部门"
        :visible.sync="showDelDialog"
        width="400px">
        <div class="wraning_tips">
          <p class="tips">
            <span>确认删除该部门吗？</span> <br/>
            <span>如果该部门有下级部门，也将一并删除。</span> <br/>
            <span>部门下的成员将自动挪到商会下面。</span> <br/>
          </p>
        </div>
        <div class="from_item" style="padding-left: 80px;margin-top: 30px;">
          <el-button @click.native="showDelDialog = false">取消</el-button>
          <el-button type="primary" v-dbClick @click="del">删除</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script src="./department-manage.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>

<style lang="scss">
.department_dialog {
  .from_wrap {
    .from_item {
      display: flex;
      align-items: center;
      margin-bottom: 40px;

      .from_item_label {
        width: 80px;
      }

      .el-input {
        width: 350px;
      }
    }
  }

  .el-button {
    margin-right: 20px;
  }
}
</style>
