<template>
  <div class="menber_manager_container">
    <div class="menu_tree">
      <div class="search_wrap">
        <el-input placeholder="搜索人员姓名" prefix-icon="el-icon-search" v-model="searchValue" @input="handleValueChange">
        </el-input>
      </div>
      <div ref="searchBox" class="search-result" v-show="showFlag">
        <div class="member-list">
          <div v-if="searchResult.length>0">
            <div class="member-item" v-for="item in searchResult" :key="item.id" @click="goDetail(item.id)">
              <!-- <div class="avatar"></div> -->
              <i class="el-icon-s-custom"></i>
              <div class="name">{{ item.name }}</div>
            </div>
          </div>
          <div v-else>
            未搜索到相关成员，换个词试试。
          </div>
        </div>
      </div>
      <div class="department-list" v-show="!showFlag">
        <el-tree
          :data="departmentTree"
          node-key="id"
          :props="{ value:'id',children:'departmentRespList' }"
          :expand-on-click-node="true"
          :highlight-current="true"
          :current-node-key="-1"
          :default-expanded-keys="[-1]"
          :default-checked-keys="[-1]"
          @node-click="handleNodeClick"
        >
          <template slot-scope="{ node, data }">
            <span style="font-size: 16px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">{{
                data.departmentName
              }} ({{ data.peopleCount }})</span>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="content_wrap">
      <div class="name">{{ departmentName }}</div>
      <div class="content_item operation">
        <div class="ico"><i class="el-icon-s-custom"></i>成员</div>
        <div>
          <el-button type="primary" @click="add">添加成员</el-button>
          <el-button type="warning" @click="handleOpenAdjustDialog">调整部门</el-button>
          <el-button type="success" @click="invite">邀请成员加入</el-button>
        </div>
      </div>
      <div class="content_item table_wrap">
        <el-table
          style="width: 100%"
          :header-cell-style="{background:'rgba(245,245,245,0.5)',color:'#000',fontSize:'15px'}"
          ref="multipleTable"
          :data="memberData"
          tooltip-effect="dark"
          @row-click="skipToDetail"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="姓名/联系人姓名" width="200">
            <template slot-scope="scope">
              {{ scope.row.type === 0 ? scope.row.name : scope.row.contactName }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="企业名称"
            width="200">
            <template slot-scope="scope">
              {{ scope.row.companyName ? scope.row.companyName : '-' }}
            </template>
          </el-table-column> -->
          <el-table-column label="企业名称" width="200">
            <template slot-scope="scope">
              {{ scope.row.companyName ? scope.row.companyName : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="入会类型" width="200" prop="type">
            <template slot-scope="scope">
              {{ scope.row.type === 0 ? '个人入会' : '企业入会' }}
            </template>
          </el-table-column>
          <el-table-column label="会内职位" width="200">
            <template slot-scope="scope">
              {{ scope.row.postName ? scope.row.postName : '-' }}
            </template>
          </el-table-column>
          <el-table-column width="200" prop="phone" label="手机号/联系人电话" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.type === 0">
                {{ scope.row.phone ? scope.row.phone : '-' }}
              </span>
              <span v-if="scope.row.type === 1">
                {{ scope.row.contactPhone ? scope.row.contactPhone : '-' }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content_item">
        <el-pagination
          :hide-on-single-page="false"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentpage"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPages">
        </el-pagination>
      </div>
    </div>

    <!-- 调整部门弹窗 -->
    <div class="adjust_dialog">
      <el-dialog :visible.sync="showDialog" title="调整部门" width="500px">
        <div class="from_wrap">
          <div class="from_item">
            <div class="from_item_label">选择部门：</div>
            <el-cascader
              clearable
              :show-all-levels="false"
              :options="departmentOptions"
              :props="{
                emitPath:false,
                checkStrictly: true ,
                value:'id',
                label:'departmentName',
                children:'departmentRespList'
              }"
              v-model="departmentCas"
              placeholder="请选择部门"
              @change="handlerDepartmentChange">
            </el-cascader>
          </div>
          <div class="from_item" style="padding-left: 80px">
            <el-button @click.native="showDialog = false">取消</el-button>
            <el-button type="primary" v-dbClick @click="save">保存</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script src="./member-manage.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>

<style lang="scss">
.menber_manager_container {
  width: 100%;
  display: flex;

  .menu_tree {
    width: 20%;

    .search_wrap {
      padding: 20px;
      background: rgba(245, 245, 245, 0.5);
    }

    .department-list {
      height: calc(100vh - 165px);
      overflow-y: auto;
    }

    .search-result {
      height: calc(100vh - 165px);
      overflow-y: auto;
      background: rgba(245, 245, 245, 0.5);

      .member-list {
        padding: 0 20px;

        .member-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding: 10px 0;
          cursor: pointer;
          border-bottom: 1px solid #ebeef5;

          &:hover {
            background: rgba(245, 245, 245, 0.8);
          }

          .name {
            margin-left: 5px;
          }

          .avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #fcc;
            margin-right: 20px;
          }
        }
      }
    }

    .el-tree {
      height: calc(100vh - 165px);
      background: rgba(245, 245, 245, 0.5);
      font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
      Microsoft YaHei, Arial, sans-serif;
      font-size: 24px;
      color: #000;

      .el-tree-node__content {
        height: 50px;
      }

      .el-tree-node__expand-icon {
        font-size: 18px;
      }
    }

    .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
      background-color: rgba(64, 158, 255, 0.5);
      color: #fff;
    }
  }

  .content_wrap {
    width: 70%;
    padding: 20px;

    .name {
      font-size: 22px;
      color: #000;
    }

    .ico {
      font-size: 18px;

      .el-icon-s-custom {
        font-size: 18px;
        margin-right: 5px;
      }
    }

    .operation {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .content_item {
      margin-top: 30px;
    }

    .table_wrap {
      height: 530px;
      overflow-y: auto;
    }
  }

  .adjust_dialog {
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
}
</style>
