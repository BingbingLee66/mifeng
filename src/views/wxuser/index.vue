<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="left" :model="query" :inline="true">
        <el-form-item label="用户ID：">
          <el-input v-model="query.mulValue" placeholder="请输入ID"/>
        </el-form-item>
        <el-form-item label="用户名：">
          <el-input v-model="query.uname" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item :span="12" label="用户属性：">
          <el-select v-model="query.userType" placeholder="请选择操作行为">
            <el-option label="全部" :value="-1"/>
            <el-option label="商会会员" :value="1"/>
            <el-option label="普通用户" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属商会：">
          <el-select v-model="query.chamberId" placeholder="请选择职业类型" filterable>
            <el-option v-for="chamber in chamberOptions" :key="chamber.id" :label="chamber.name" :value="chamber.id" />
          </el-select>
          <!-- <el-input v-model="query.chamberName" placeholder="请输入所属商会"/> -->
        </el-form-item>
        <el-form-item :span="12" label="状态：">
          <el-select v-model="query.status" placeholder="请选择操作行为">
            <!-- <el-option v-for="(item, index) in typeOptions" :label="item" :value="item" :key="index"></el-option> -->
            <el-option label="全部" :value="-1"/>
            <el-option label="正常" :value="1"/>
            <el-option label="已冻结" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间：">
          <el-date-picker
            v-model="query.date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="">
          <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询
          </el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button  type="primary"  @click="clickRouter($event)">跳转
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="index" label="序号" width="60px"/>
      <el-table-column label="ID" width="70px">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{ scope.row.uname }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="名字">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column> -->
      <el-table-column label="手机号" width="120px">
        <template slot-scope="scope">
          {{ scope.row.phone }}
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
          <div v-if="scope.row.chamberName">{{ scope.row.chamberName }}</div>
          <div v-if="!scope.row.chamberName">未加入商会</div>
        </template>
      </el-table-column>
      <el-table-column label="注册时间">
        <template slot-scope="scope">
          {{ scope.row.createdTs }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 1">正常</div>
          <div v-if="scope.row.status == 0">已冻结</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="has('', '详情')" type="text" :actionid="getId('', '详情')" @click="detail($event, scope.row)">
            详情
          </el-button>
          <el-button v-if="has('', '冻结') && scope.row.status == 1" type="text" :actionid="getId('', '冻结')" @click="updateStatus($event, scope.row)">
            冻结
          </el-button>
          <el-button v-if="has('', '解冻') && scope.row.status == 0" type="text" :actionid="getId('', '解冻')" @click="updateStatus($event, scope.row)">
            解冻
          </el-button>
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
  </div>

</template>

<script src="./wxuser.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
