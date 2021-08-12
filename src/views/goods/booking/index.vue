<template>
  <div class="app-container">
    <div class="block">商品名称：{{ goodsName }}</div>
    <div class="block">
      <el-form ref="query" label-position="left" :model="query">
        <el-row>
          <el-col :span="4" style="margin-left: 10px;">
            <el-form-item label-width="70px" label="用户名：">
              <el-input v-model="query.uname" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left: 20px;">
            <el-form-item label-width="90px" label="用户手机：">
              <el-input v-model="query.phone" placeholder="请输入用户手机" />
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left: 20px;">
            <el-form-item label-width="90px" label="所属商会：">
              <el-select v-model="query.chamberId" placeholder="请选择职业类型">
                <el-option v-for="chamber in chamberOptions" :key="chamber.id" :label="chamber.name" :value="chamber.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left: 20px;">
            <el-form-item label-width="90px" label="预约状态：">
              <el-select v-model="query.status" placeholder="请选择状态">
                <el-option label="全部" :value="-1"></el-option>
                <el-option label="已预约" :value="1"></el-option>
                <el-option label="取消" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left: 10px;">
            <el-form-item label=" " style="float: left;margin-left: 10px;">
              <el-button type="primary" @click="getBookingList($event)">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-table :data="bookingList" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{scope.row.uname}}
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>
      <el-table-column label="所属商会" >
        <template slot-scope="scope">
          {{scope.row.chamberName ? scope.row.chamberName : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="预约时间">
        <template slot-scope="scope">
          {{scope.row.bookingStartTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column label="预约状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 1">已预约</div>
          <div v-if="scope.row.status == 0">已取消</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="margin-left:0px;" @click="detail($event, scope.row)">查看用户详情</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-size="pageSize" :total="total" :current-page.sync="currentpage" @size-change="handleSizeChange" @current-change="handleCurrentChange" :style="{'padding-top': '15px'}">
    </el-pagination>
  </div>

</template>

<script src="./detail.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
</style>
<style>
.m-goods-preview {
  width: 76px;
  height: 56px;
  border: 1px solid #ddd !important;
  cursor: pointer;
}
</style>
