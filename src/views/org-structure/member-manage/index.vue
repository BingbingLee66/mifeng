<template>
  <div class="menber_manager_container">
    <div class="menu_tree">
      <div class="search_wrap">
        <el-input
          placeholder="搜索人员姓名"
          prefix-icon="el-icon-search"
          v-model="searchValue">
        </el-input>
      </div>
      <el-tree
        :data="data"
        node-key="id"
        :props="defaultProps"
        :expand-on-click-node="true"
        :highlight-current="true"
        :current-node-key="1"
        :default-expanded-keys="[1]"
        @node-click="handleNodeClick">
      </el-tree>
    </div>
    <div class="content_wrap">
      <div class="name">广西省江西商会</div>
      <div class="content_item operation">
        <div class="ico"><i class="el-icon-s-custom"></i>部门成员</div>
        <div>
          <el-button type="primary" @click="add">添加成员</el-button>
          <el-button type="warning">调整部门</el-button>
          <el-button type="success" @click="invite">邀请成员加入</el-button>
        </div>
      </div>
      <div class="content_item">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="姓名"
            width="280">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column
            prop="position"
            label="职位"
            width="280">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
      <div class="content_item">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentpage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
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

    .el-tree {
      height: calc(100vh - 165px);
      background: rgba(245, 245, 245, 0.5);
      font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;;
      font-size: 24px;
      color: #000;

      .el-tree-node__content {
        padding: 25px 0 25px 10px !important;

        .el-tree-node__expand-icon {
          font-size: 19px;
        }

        .el-tree-node__label {
          font-size: 16px;
        }
      }

      .el-tree-node__children {
        .el-tree-node__content {
          padding: 25px 0;

          .el-tree-node__expand-icon {
            font-size: 19px;
          }

          .el-tree-node__label {
            font-size: 16px;
          }
        }
      }
    }

    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      background-color: rgba(64, 158, 255, .5);
      color: #fff;
    }

    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .el-tree-node__expand-icon {
      color: #fff;
      font-size: 19px;
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
  }
}

</style>
