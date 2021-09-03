<template>
  <div class="app-container">
    <div class="query-form">
      <el-form ref="query" :inline="true" :model="query" label-width="100px" label-position="right" size="small">
        <el-form-item label="企业/团体名称">
          <el-input v-model="query.companyName" placeholder="关键词"/>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="query.phone"/>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="query.name"/>
        </el-form-item>
        <el-form-item label="会内职位">
          <el-select v-model="query.memberPostType" placeholder="请选择职业类型">
            <el-option v-for="post in memberPostOptions" :key="post.value" :label="post.label" :value="post.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-cascader
            v-model="departmentCas"
            :show-all-levels="false"
            :options="departmentOptions"
            :props="{checkStrictly: true , value:'id',label:'departmentName',children:'departmentRespList' }"
            placeholder="请选择部门"
            @change="handlerDepartmentChange"
          />
        </el-form-item>
        <el-form-item label="入会类型">
          <el-select v-model="query.type" placeholder="请选择入会类型" style="width:100%">
            <el-option label="全部" :value="-1"/>
            <el-option label="个人" :value="0"/>
            <el-option label="企业/团体" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="query.uname "/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="请选择">
            <el-option label="全部" :value="-1"/>
            <el-option label="正常" :value="1"/>
            <el-option label="已冻结" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="入会时间">
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
      </el-form>
    </div>
    <div style="margin-bottom:30px;">
      <el-button v-if="has('', '添加会员')" type="primary" :actionid="getId('', '添加会员')" @click="add($event)">添加会员
      </el-button>
      <el-button v-if="has('', '导表')" type="primary" :actionid="getId('', '导表')" @click="exportExcel($event)">导表
      </el-button>
    </div>
    <div style="margin-bottom:20px">
      <el-table
        id="out-table"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55px"/>
        <el-table-column label="用户头像" width="92px">
          <template slot-scope="scope">
            <img style="width: 70px;height: 70px;border-radius: 50%;object-fit: cover;" :src="scope.row.uavatar?scope.row.uavatar:'https://ysh-sz.oss-cn-shenzhen.aliyuncs.com/prod/png/yunshanghui-nologo.png.png'">
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="200px" prop="uname"/>
        <el-table-column label="入会类型" width="100px">
          <template slot-scope="scope">{{ scope.row.type == 0 ? '个人' : '企业/团体' }}</template>
        </el-table-column>
        <el-table-column label="联系信息" width="300px">
          <template slot-scope="scope">
            <div v-if="scope.row.type == 0">
              <div>【会员姓名】{{ scope.row.name }}</div>
              <div>【会员手机号】{{ scope.row.phone }}</div>
            </div>
            <div v-if="scope.row.type == 1">
              <div>【企业/团体名称】{{ scope.row.companyName }}</div>
              <div>【联系人姓名】{{ scope.row.contactName }}</div>
              <div>【联系人手机号】{{ scope.row.contactPhone }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="入会时间/会内职位/部门" width="200px">
          <template slot-scope="scope">
            <div>【入会时间】{{ scope.row.joinedTs }}</div>
            <div>【会内职位】{{ scope.row.postName }}</div>
            <div>【部门】{{ scope.row.departmentName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">已冻结</div>
            <div v-if="scope.row.status == 1">正常</div>
            <div v-if="scope.row.status == 3">待邀请</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <div class="text-btn-style" v-if="has('', '详情')" :actionid="getId('', '详情')" @click="detail($event, scope.row)">
              详情
            </div>
            <div class="text-btn-style" @click="goEdit($event, scope.row)">修改</div>
            <div class="text-btn-style" v-if="has('', '冻结') && scope.row.status == 1" :actionid="getId('', '冻结')" @click="updateStatus($event, scope.row)">
              冻结
            </div>
            <div class="text-btn-style" v-if="has('', '解冻') && scope.row.status == 0" :actionid="getId('', '解冻')" @click="updateStatus($event, scope.row)">
              解冻
            </div>
            <!-- <el-button type="text" @click="openTransfer(scope.row)" :actionid="getId('', '转让')" v-if="has('', '转让')">转让</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

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

    <el-dialog title="转让商会会长" :visible.sync="transferVisible" width="50%">
      <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="150px">
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="商会会长">
              {{ formObj.name }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="手机号码">
              {{ formObj.phone }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="账号密码" prop="password">
              <el-input v-model="formObj.password" minlength="1"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :offset="6" :span="8">
            <el-button v-dbClick type="primary" @click="transferPresident">确定</el-button>
            <el-button @click.native="transferVisible = false">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>

<style lang="scss">
.query-form .el-form-item {
  margin-right: 20px;

  .el-select, .el-cascader {
    .el-input__inner {
      width: 184px;
    }
  }
}
</style>
