<template>
  <div class="app-container">
    <officialComponent :type="1" ref="officialDialog" :chamberOptions="chamberOptions"></officialComponent>
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="left" :model="query" :inline="true">
        <el-form-item label="用户ID：">
          <el-input v-model="query.wxUserId" placeholder="请输入ID"/>
        </el-form-item>
        <el-form-item label="用户名：">
          <el-input v-model="query.uName" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="手机号：">
                  <el-input v-model="query.phone" placeholder="请输入手机号" />
                </el-form-item>
        <el-form-item label="所属商会：">
          <el-select v-model="query.chamberId" placeholder="请选择" filterable>
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
     
        <el-form-item label="">
          <el-button  type="primary"  @click="fetchData($event)">查询
          </el-button>
        </el-form-item>
        
        <el-row>
            <el-button  type="primary"  @click="showOfficialDialog($event)">添加官方账号
          </el-button>
        </el-row>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column type="index" label="序号" width="60px"/> -->
      <el-table-column label="用户ID" width="70px">
        <template slot-scope="scope">
          {{ scope.row.wxUserId }}
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
      
      <el-table-column label="所属商会">
        <template slot-scope="scope">
          <div v-if="scope.row.chamberName">{{ scope.row.chamberName }}</div>
          <div v-if="!scope.row.chamberName">未加入商会</div>
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
          <el-button  type="text"  @click="detail($event, scope.row)">
            移除
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

<script src="./officialManager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
