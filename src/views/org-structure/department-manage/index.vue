<template>
  <div class="app-container">
    <div class="department_container">
      <div class="tit">在这里创建、编辑和删除部门</div>
      <div style="margin-top:30px">
        <el-table
          :data="departmentData"
          style="width: 80%;margin-bottom: 20px;"
          row-key="id"
          border
          default-expand-all
          :tree-props="{children: 'departmentRespList', hasChildren: 'hasChildren'}"
        >
          <el-table-column label="部门名称" width="480">
            <template slot-scope="scope">
              {{ scope.$index === 0 ? scope.row.name : scope.row.departmentName }}
            </template>
          </el-table-column>
          <el-table-column prop="peopleCount" label="成员数" width="280">
            <template slot-scope="scope">
              {{ scope.$index === 0 ? scope.row.count : scope.row.peopleCount }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.$index === 0" @click="handleDialog('add',scope.row)">添加部门</el-button>
              <el-button type="text" v-if="scope.$index !== 0" @click="handleDialog('edit',scope.row)">编辑部门名称
              </el-button>
              <el-button type="text" v-if="scope.$index !== 0" @click="handleDialog('addChild',scope.row)">添加下级部门
              </el-button>
              <el-button type="text" v-if="scope.$index !== 0" @click="handleDelDialog(scope.row)">删除部门</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--  添加/编辑部门弹窗  -->
    <div class="department_dialog">
      <el-dialog :close-on-click-modal="false" :visible.sync="showDialog" width="500px">
        <template slot="title">
          {{ type === 'add' ? '添加部门' : '编辑部门' }}
        </template>
        <div class="from_wrap">
          <div class="from_item" v-show="type!=='edit'">
            <div class="from_item_label">上级部门：</div>
            <div class="">{{ departmentParentName }}</div>
          </div>
          <div class="from_item">
            <div class="from_item_label">部门名称：</div>
            <el-input
              v-model="departmentName"
              type="text"
              placeholder="请输入部门名称"
              maxlength="20"
              show-word-limit></el-input>
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
      <el-dialog title="删除部门" :close-on-click-modal="false" :visible.sync="showDelDialog" width="400px">
        <div class="wraning_tips">
          <div class="tips">
            <p>确认删除该部门吗？</p>
            <p>如果该部门有下级部门，也将一并删除。</p>
            <p>部门下的成员将自动挪到商会下面。</p>
          </div>
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
@import 'src/styles/common.scss';
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

  .wraning_tips{
    font-size: 14px;
    margin-top: -20px;
  }
}
</style>
