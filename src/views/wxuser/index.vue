<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="left" :model="query">
        <el-row>
          <el-col :span="5">
            <el-form-item label="用户ID/昵称/名字：">
              <el-input v-model="query.mulValue" placeholder="请输入ID/昵称/名字"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item :span="12" label="用户属性：">
              <el-select v-model="query.userType" placeholder="请选择操作行为">
                <el-option label="全部" :value="-1"></el-option>
                <el-option label="商会会员" :value="1"></el-option>
                <el-option label="普通用户" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="所属商会：">
              <el-input v-model="query.chamberName" placeholder="请输入所属商会"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :span="12" label="状态：">
              <el-select v-model="query.status" placeholder="请选择操作行为">
                <!-- <el-option v-for="(item, index) in typeOptions" :label="item" :value="item" :key="index"></el-option> -->
                <el-option label="全部" :value="-1"></el-option>
                <el-option label="正常" :value="1"></el-option>
                <el-option label="已冻结" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="注册时间：">
              <el-date-picker
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="query.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label=" ">
              <el-button type="primary" :actionid="getId('', '查询')" v-if="has('', '查询')" @click="fetchData($event)">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="index" label="序号" width="60px">
      </el-table-column>
      <el-table-column label="ID" width="70px">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template slot-scope="scope">
          {{scope.row.uname}}
        </template>
      </el-table-column>
      <el-table-column label="名字">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="120px">
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>
      <el-table-column label="用户属性">
        <template slot-scope="scope">
          <div v-if="scope.row.userType == 1">商会会员</div>
          <div v-if="scope.row.userType == 2">普通用户</div>
        </template>
      </el-table-column>
      <el-table-column label="所属商会">
        <template slot-scope="scope">
          <div v-if="scope.row.chamberName">{{scope.row.chamberName}}</div>
          <div v-if="!scope.row.chamberName">未加入商会</div>
        </template>
      </el-table-column>
      <el-table-column label="注册时间">
        <template slot-scope="scope">
          {{scope.row.createdTs}}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 1">正常</div>
          <div v-if="scope.row.status == 0">已冻结</div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="text" :actionid="getId('', '详情')" v-if="has('', '详情')" @click="detail($event, scope.row)">详情</el-button>
          <el-button type="text" :actionid="getId('', '冻结')" v-if="has('', '冻结') && scope.row.status == 1" @click="updateStatus($event, scope.row)">冻结</el-button>
          <el-button type="text" :actionid="getId('', '解冻')" v-if="has('', '解冻') && scope.row.status == 0" @click="updateStatus($event, scope.row)">解冻</el-button>
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
  </div>

</template>

<script src="./wxuser.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
