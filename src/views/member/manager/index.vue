<template>
  <div class="app-container">
    <div class="block query_form">
      <el-form ref="query" :inline="true" :model="query">
        <el-form-item label="会员名字：" class="query_form_item_1">
          <el-input v-model="query.name" />
        </el-form-item>
        <el-form-item label="联系人姓名：" class="query_form_item_1">
          <el-input v-model="query.contactName" />
        </el-form-item>
        <el-form-item label="会员手机号：" class="query_form_item_1">
          <el-input v-model="query.phone" />
        </el-form-item>
        <el-form-item label="联系人电话：" class="query_form_item_1">
          <el-input v-model="query.contactPhone" />
        </el-form-item>
        <el-form-item label="企业/团体名称：" class="query_form_item_1">
          <el-input v-model="query.companyName" />
        </el-form-item>
        <el-form-item label="职位：" class="query_form_item_1">
          <el-select v-model="query.memberPostType" placeholder="请选择职业类型">
            <el-option v-for="post in memberPostOptions" :key="post.value" :label="post.label" :value="post.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门：" class="query_form_item_1">
          <el-cascader
            v-model="departmentCas"
            :show-all-levels="false"
            :options="departmentOptions"
            :props="{checkStrictly: true , value:'id',label:'departmentName',children:'departmentRespList' }"
            placeholder="请选择部门"
            @change="handlerDepartmentChange"
          />
        </el-form-item>
        <el-form-item label="入会类型：" class="query_form_item_1">
          <el-select v-model="query.type" placeholder="请选择入会类型">
            <el-option label="全部" :value="-1" />
            <el-option label="个人" :value="0" />
            <el-option label="企业/团体" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="行业：" class="query_form_item_1">
          <el-cascader v-model="tradeCas" :options="tradeOptions" placeholder="请选择行业" @change="handlerChange" />
        </el-form-item>
        <el-form-item label="入会时间：">
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
        <el-form-item label=" " class="query_form_item_3">
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
    <div style="margin-bottom:30px">
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
        <el-table-column type="selection" width="55px" />
        <el-table-column label="头像/企业(团体)logo" width="150px">
          <template slot-scope="scope">
            <div v-if="scope.row.companyLogo || scope.row.portrait">
              <img style="width: 88px;height: 88px;border-radius: 50%;" :src="scope.row.type == 0 ? scope.row.portrait : scope.row.companyLogo">
            </div>
            <img v-else style="width: 88px;height: 88px;border-radius: 50%;" src="@/assets/img/nologo.png">
          </template>
        </el-table-column>
        <el-table-column label="会员姓名" width="180px">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="联系人姓名" width="180px">
          <template slot-scope="scope">{{ scope.row.contactName }}</template>
        </el-table-column>
        <el-table-column label="会员手机号" width="180px">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column label="联系人电话" width="180px">
          <template slot-scope="scope">{{ scope.row.contactPhone }}</template>
        </el-table-column>
        <el-table-column label="企业/团体名称" width="180px">
          <template slot-scope="scope">{{ scope.row.companyName }}</template>
        </el-table-column>
        <el-table-column label="入会类型" width="120px">
          <template slot-scope="scope">{{ scope.row.type == 0 ? '个人' : '企业/团体' }}</template>
        </el-table-column>
        <el-table-column label="会内职位" width="120px">
          <template slot-scope="scope">{{ scope.row.postName }}</template>
        </el-table-column>
        <el-table-column label="行业" width="180px">
          <template slot-scope="scope">{{ scope.row.tradeName }}</template>
        </el-table-column>
        <el-table-column label="部门" width="180px">
          <template slot-scope="scope">{{ scope.row.departmentName }}</template>
        </el-table-column>
        <el-table-column label="入会时间" width="180px">
          <template slot-scope="scope">{{ scope.row.joinedTs }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">已冻结</div>
            <div v-if="scope.row.status == 1">正常</div>
            <div v-if="scope.row.status == 3">待邀请</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button v-if="has('', '详情')" type="text" :actionid="getId('', '详情')" @click="detail($event, scope.row)">
              详情
            </el-button>
            <el-button type="text" @click="goEdit($event, scope.row)">修改</el-button>
            <el-button v-if="has('', '冻结') && scope.row.status == 1" type="text" :actionid="getId('', '冻结')" @click="updateStatus($event, scope.row)">
              冻结
            </el-button>
            <el-button v-if="has('', '解冻') && scope.row.status == 0" type="text" :actionid="getId('', '解冻')" @click="updateStatus($event, scope.row)">
              解冻
            </el-button>
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
              <el-input v-model="formObj.password" minlength="1" />
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
.query_form {
  .el-form-item {
    margin-right: 30px !important;
  }

  .el-form-item__label-wrap {
    margin-left: 0px !important;
  }

  .query_form_item_1 {
    .el-form-item__content {
      width: 180px;
    }
  }

  .query_form_item_2 {
    .el-form-item__content {
      width: 130px;
    }
  }

  .query_form_item_3 {
    margin-right: 0 !important;
  }

  .el-form-item__label {
    padding: 0;
  }
}
</style>
