<template>
  <div class="menber_manager_container">
    <div class="menu_tree">
      <div class="search_wrap">
        <el-input
          placeholder="搜索人员姓名"
          prefix-icon="el-icon-search"
          v-model="searchValue"
          @input="handleValueChange">
        </el-input>
      </div>
      <div class="search-result" v-if="showFlag">
        <div class="member-list">
          <div v-if="searchResult.length>0">
            <div class="member-item" v-for="item in searchResult" :key="item.id" @click="goDetail(item.id)">
              <div class="avatar"></div>
              <div class="name">{{item.name}}</div>
            </div>
          </div>
         <div v-else>
           未搜索到相关成员，换个词试试。
         </div>
        </div>
      </div>
      <div class="department-list" v-if="!showFlag">
        <el-tree
          :data="departmentTree"
          node-key="id"
          :props="{ value:'id',children:'departmentRespList' }"
          :expand-on-click-node="true"
          :highlight-current="true"
          :current-node-key="currentKey"
          :default-expanded-keys="[currentKey]"
          @node-click="handleNodeClick">
          <template slot-scope="{ node, data }">
            <span style="font-size: 16px">{{ data.departmentName }} ({{ data.peopleCount }})</span>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="content_wrap">
      <div class="name">{{ departmentName }}</div>
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
          :data="memberData"
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
            prop="postName"
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
          :hide-on-single-page="true"
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
      .member-list{
        padding: 10px 20px;
        .member-item{
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding: 5px 0;
          cursor: pointer;
          &:hover{
            background: rgba(245, 245, 245, 0.8);
          }
          .avatar{
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
