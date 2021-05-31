<template>
  <div class="app-container">
    <div class="block query_form">
      <el-form ref="query" :inline="true" :model="query">
        <el-form-item label="会员名字/手机号码：" class="query_form_item_1">
          <el-input v-model="query.mulValue"/>
        </el-form-item>
        <el-form-item label="职位：" class="query_form_item_2">
          <el-select v-model="query.memberPostType" placeholder="请选择职业类型">
            <el-option v-for="post in memberPostOptions" :label="post.label" :value="post.value"
                       :key="post.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入会类型：" class="query_form_item_2">
          <el-select v-model="query.type" placeholder="请选择入会类型">
            <el-option label="全部" :value="-1"></el-option>
            <el-option label="个人" :value="0"></el-option>
            <el-option label="企业" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业：">
          <el-cascader :options="tradeOptions" v-model="tradeCas" placeholder="请选择行业" @change="handlerChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="入会时间：">
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
        <el-form-item label="部门：">
          <el-cascader
            :show-all-levels="false"
            :options="departmentOptions"
            :props="{checkStrictly: true , value:'id',label:'departmentName',children:'departmentRespList' }"
            v-model="departmentCas"
            placeholder="请选择部门"
            @change="handlerDepartmentChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label=" " class="query_form_item_3">
          <el-button type="primary" :actionid="getId('', '查询')" v-if="has('', '查询')" @click="fetchData($event)">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom:30px;">
      <el-button type="primary" @click="add($event)" :actionid="getId('', '添加会员')" v-if="has('', '添加会员')">添加会员
      </el-button>
      <el-button type="primary" @click="exportExcel($event)" :actionid="getId('', '导表')" v-if="has('', '导表')">导表
      </el-button>
    </div>
    <div style="margin-bottom:30px">
      <el-table
        id="out-table"
        :data="list"
        v-loading="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px">
        </el-table-column>
        <el-table-column label="头像/企业logo" width="180px">
          <template slot-scope="scope">
            <img style="width: 88px;height: 88px;border-radius: 50%;"
                 :src="scope.row.type == 0 ? scope.row.portrait : scope.row.companyLogo">
          </template>
        </el-table-column>
        <el-table-column label="姓名/企业名称" width="180px">
          <template slot-scope="scope">
            {{ scope.row.type == 0 ? scope.row.name : scope.row.companyName }}
          </template>
        </el-table-column>
        <el-table-column label="手机号/联系方式" width="180px">
          <template slot-scope="scope">
            {{ scope.row.phone }}
          </template>
        </el-table-column>
        <el-table-column label="入会类型" width="120px">
          <template slot-scope="scope">
            {{ scope.row.type == 0 ? '个人' : '企业' }}
          </template>
        </el-table-column>
        <el-table-column label="会内职位" width="120px">
          <template slot-scope="scope">
            {{ scope.row.postName }}
          </template>
        </el-table-column>
        <el-table-column label="行业" width="180px">
          <template slot-scope="scope">
            {{ scope.row.tradeName }}
          </template>
        </el-table-column>
        <el-table-column label="部门" width="180px">
          <template slot-scope="scope">
            {{ scope.row.departmentName }}
          </template>
        </el-table-column>
        <el-table-column label="入会时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.joinedTs }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">已冻结</div>
            <div v-if="scope.row.status == 1">正常</div>
            <div v-if="scope.row.status == 3">待邀请</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('', '详情')" v-if="has('', '详情')">
              详情
            </el-button>
            <el-button type="text" @click="updateStatus($event, scope.row)" :actionid="getId('', '冻结')"
                       v-if="has('', '冻结') && scope.row.status == 1">冻结
            </el-button>
            <el-button type="text" @click="updateStatus($event, scope.row)" :actionid="getId('', '解冻')"
                       v-if="has('', '解冻') && scope.row.status == 0">解冻
            </el-button>
            <!-- <el-button type="text" @click="openTransfer(scope.row)" :actionid="getId('', '转让')" v-if="has('', '转让')">转让</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes"
                   :page-size="limit" :total="total" :current-page.sync="currentpage" @size-change="handleSizeChange"
                   @current-change="handleCurrentChange">
    </el-pagination>
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
              <el-input v-model="formObj.password" minlength=1></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :offset="6" :span="8">
            <el-button type="primary" v-dbClick @click="transferPresident">确定</el-button>
            <el-button @click.native="transferVisible = false">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
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
      width: 150px;
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
