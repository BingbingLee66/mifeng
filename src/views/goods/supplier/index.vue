<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button
            type="primary"
            :actionid="getId('', '新增供货商家')"
            v-if="has('', '新增供货商家')"
            @click.native="addSupplier($event)"
            >新增供货商家</el-button
          >
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="list"
      v-loading="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!--  <el-table-column type="selection" width="55px">
      </el-table-column> -->
      <el-table-column type="index" label="序号" width="80px">
      </el-table-column>
      <!-- <el-table-column label="ID">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column> -->
      <el-table-column label="联系人姓名">
        <template slot-scope="scope">
          {{ scope.row.supplierName }}
        </template>
      </el-table-column>
      <el-table-column label="联系电话">
        <template slot-scope="scope">
          {{ scope.row.supplierPhone }}
        </template>
      </el-table-column>
      <el-table-column label="收款账户" width="350">
        <template slot-scope="scope">
          <div class="layout-box">
            <div>单位名称/账户名：{{scope.row.companyName}}</div>
            <div>开户行：{{scope.row.bankName}}</div>
            <div>银行卡号：{{scope.row.bankCard}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="结算周期">
        <template slot-scope="scope">
          {{ scope.row.settlementDay | filterSettlementPeriod(scope.row.settlementPeriod,weekOptions,halfMonthOptions,monthOptions) }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间">
        <template slot-scope="scope">
          {{ scope.row.createdTs | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="添加人">
        <template slot-scope="scope">
          {{ scope.row.operator }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 1">正常</div>
          <div v-if="scope.row.status == 2">冻结</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="250">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="edit($event, scope.row)"
            :actionid="getId('', '编辑')"
            v-if="has('', '编辑')"
            >编辑</el-button
          >
          <el-button
            type="text"
            @click="setUpSettlementPeriod($event, scope.row)"
            >设置结算周期</el-button
          >
          <el-button
            type="text"
            @click="updateStatus($event, scope.row)"
            :actionid="getId('', '冻结')"
            v-if="has('', '冻结') && scope.row.status == 1"
            >冻结</el-button
          >
          <el-button
            type="text"
            @click="updateStatus($event, scope.row)"
            :actionid="getId('', '解冻')"
            v-if="has('', '解冻') && scope.row.status == 2"
            >解冻</el-button
          >
          <!-- <el-button type="text" @click="del($event, scope.row)" :actionid="getId('', '删除')" v-if="has('', '删除')">删除</el-button> -->
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
      :style="{ 'padding-top': '15px' }"
    >
    </el-pagination>
    <el-dialog title="新增/编辑供货商家" :visible.sync="visible" width="50%">
      <el-form
        v-if="visible"
        ref="form"
        :model="formObj"
        :rules="rules"
        label-position="left"
        label-width="150px"
      >
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="联系人姓名：" prop="supplierName">
              <el-input
                v-model.trim="formObj.supplierName"
                placeholder="请填写联系人姓名"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="联系电话：" prop="supplierPhone">
              <el-input
                v-model="formObj.supplierPhone"
                placeholder="请填写联系电话"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="单位名称/账户名：" prop="companyName">
              <el-input
                v-model.trim="formObj.companyName"
                placeholder="请填写单位名称/账户名"
                class="form-bank-area"
                type="textarea"
                show-word-limit
                maxlength="50"
                resize="none"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="开户行：" prop="bankName">
              <el-input
                v-model.trim="formObj.bankName"
                placeholder="请填写开户行"
                class="form-bank-area"
                type="textarea"
                show-word-limit
                maxlength="50"
                resize="none"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="银行卡号：" prop="bankCard">
              <el-input
                v-model.trim="formObj.bankCard"
                placeholder="请填写银行卡号"
                type="text"
                show-word-limit
                maxlength="30"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-dbClick @click="save">确定</el-button>
        <el-button @click.native="visible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- --------------------------结算周期弹窗-------------------------- -->
    <el-dialog
      title="结算周期"
      :visible.sync="settlementPeriodVisible"
      width="40%"
    >
      <el-row>
        <el-col :offset="2" :span="20">
          <span class="settlement-period-label">联系人姓名：</span
          ><span>{{ settlementPeriodObj.supplierName }}</span></el-col
        >
      </el-row>
      <el-form
        ref="settlementPeriodForm"
        :model="settlementPeriodObj"
        :rules="settlementPeriodObjRules"
        label-position="left"
        label-width="150px"
      >
        <el-row>
          <el-col :offset="2" :span="20">
            <div class="settlement-period-box">
              <i class="required-point">*</i>
              <span class="settlement-period-label">结算周期：</span>
              <el-form-item class="flex-radio" prop="settlementPeriod">
                <el-radio-group
                  v-model="settlementPeriodObj.settlementPeriod"
                  @change="radioChange"
                >
                  <el-radio label="1">周</el-radio>
                  <el-radio label="2">半月</el-radio>
                  <el-radio label="3">月</el-radio>
                </el-radio-group>
                <el-form-item class="custom-select-one">
                  <el-select
                    v-model="settlementPeriodObj.settlementDayOne"
                    placeholder="请选择"
                    :disabled="settlementPeriodObj.settlementPeriod !== '1'"
                    clearable
                  >
                    <el-option
                      v-for="item in weekOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="custom-select-two">
                  <el-select
                    v-model="settlementPeriodObj.settlementDayTwo"
                    placeholder="请选择"
                    :disabled="settlementPeriodObj.settlementPeriod !== '2'"
                    clearable
                  >
                    <el-option
                      v-for="item in halfMonthOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="custom-select-three">
                  <el-select
                    v-model="settlementPeriodObj.settlementDayThree"
                    placeholder="请选择"
                    :disabled="settlementPeriodObj.settlementPeriod !== '3'"
                    clearable
                  >
                    <el-option
                      v-for="item in monthOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-dbClick
          @click="submitForm('settlementPeriodForm')"
          >确定</el-button
        >
        <el-button @click.native="visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>

<style scoped lang="scss">
/deep/.el-textarea.form-bank-area {
  .el-textarea__inner {
    height: 54px;
    overflow-y: auto;
  }
  .el-input__count {
    width: 34px;
    height: 20px;
    line-height: 20px;
    right: -2px;
    bottom: -24px;
  }
}
.settlement-period-label {
  display: inline-block;
  width: 150px;
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}
/deep/.el-form-item.flex-radio {
  position: relative;
  .el-form-item__content {
    margin-top: 30px;
    .el-radio-group {
      display: flex;
      flex-direction: column;
      .el-radio {
        margin-bottom: 50px;
      }
    }
  }
}
.custom-select-one {
  position: absolute;
  top: -44px;
  left: 100px;
}
.custom-select-two {
  position: absolute;
  top: 24px;
  left: 100px;
}
.custom-select-three {
  position: absolute;
  top: 90px;
  left: 100px;
}
.settlement-period-box {
  position: relative;
  .required-point {
    position: absolute;
    top: 29px;
    left: -15px;
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
  .settlement-period-label {
    position: absolute;
    top: 29px;
  }
}
.layout-box{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
}
</style>
