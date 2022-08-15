<template>
  <div class="app-container">
    <div class="query-form">
      <el-form
        ref="query"
        :inline="true"
        :model="query"
        label-width="100px"
        label-position="right"
        size="small"
      >
        <el-form-item label="企业/团体名称">
          <el-input v-model="query.companyName" placeholder="关键词" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="query.phone" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="query.name" />
        </el-form-item>
        <el-form-item label="会内职位">
          <el-select
            v-model="query.memberPostType"
            placeholder="请选择职业类型"
          >
            <el-option
              v-for="post in memberPostOptions"
              :key="post.value"
              :label="post.label"
              :value="post.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-cascader
            v-model="departmentCas"
            :show-all-levels="false"
            :options="departmentOptions"
            :props="{
              checkStrictly: true,
              value: 'id',
              label: 'departmentName',
              children: 'departmentRespList',
            }"
            placeholder="请选择部门"
            @change="handlerDepartmentChange"
          />
        </el-form-item>
        <el-form-item label="入会类型">
          <el-select
            v-model="query.type"
            placeholder="请选择入会类型"
            style="width: 100%"
          >
            <el-option label="全部" :value="-1" />
            <el-option label="个人" :value="0" />
            <el-option label="企业/团体" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="query.uname" />
        </el-form-item>
        <el-form-item label="账号状态">
          <el-select v-model="query.status" placeholder="请选择">
            <el-option label="全部" :value="-1" />
            <el-option label="正常" :value="1" />
            <el-option label="已冻结" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="激活状态">
          <el-select
            v-model="query.activatedState"
            placeholder="请选择激活状态"
            style="width: 100%"
            @change="handleActivatedStateChange"
          >
            <el-option label="全部" :value="0" />
            <el-option label="已激活" :value="1" />
            <el-option label="未激活" :value="-1" />
          </el-select>
        </el-form-item>
        <el-form-item label="短信发送状态">
          <el-select
            v-model="query.sendStatus"
            placeholder="请选择短信发送状态"
            style="width: 100%"
          >
            <el-option label="全部" :value="-1" />
            <el-option label="未发送" :value="0" />
            <el-option label="已发送" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="会员标签">
          <el-select
            v-model="query.activatedState"
            placeholder="请选择激活状态"
            style="width: 100%"
          >
            <el-option label="全部" :value="0" />
            <el-option label="已激活" :value="1" />
            <el-option label="未激活" :value="-1" />
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
          <el-button
            v-if="has('', '查询')"
            type="primary"
            :actionid="getId('', '查询')"
            @click="fetchData($event)"
            >查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom: 30px">
      <el-button type="primary" @click="attachLabel">打标签</el-button>
      <el-button
        v-if="has('', '添加会员')"
        type="primary"
        :actionid="getId('', '添加会员')"
        @click="add($event)"
        >添加会员
      </el-button>
      <el-button
        v-if="has('', '导表')"
        type="primary"
        :actionid="getId('', '导表')"
        @click="exportExcel($event)"
        >导表
      </el-button>
      <el-button v-downLoad="exportExcelModel" type="primary"
        >下载导入模板
      </el-button>
      <el-button type="primary" @click="openVisible">导入 </el-button>
      <el-button type="primary" @click="openSmsTab">发送短信 </el-button>
      <el-tooltip icon="el-icon-warning" placement="right-start">
        <div slot="content">
          针对未激活会员，可发送一次短信；<br />短信模板示例：广东省江西商会引进凯迪云商会平台，助力商协会建设，
          【这里是商会主页链接】 您可实时接收资讯动态。
        </div>
        <i class="el-icon-question" />
      </el-tooltip>
      <el-button type="primary" @click="authMember">批量认证身份信息</el-button>
    </div>
    <div style="margin-bottom: 20px">
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
        <el-table-column label="用户头像" width="92px">
          <template slot-scope="scope">
            <img
              style="
                width: 70px;
                height: 70px;
                border-radius: 50%;
                object-fit: cover;
              "
              :src="
                scope.row.uavatar
                  ? scope.row.uavatar
                  : 'https://ysh-sh.oss-cn-shanghai.aliyuncs.com/prod/png/yunshanghui-nologo.png.png'
              "
            />
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="200px" prop="uname" />
        <el-table-column label="入会类型" width="100px">
          <template slot-scope="scope">{{
            scope.row.type == 0 ? "个人" : "企业/团体"
          }}</template>
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
        <el-table-column label="会员标签" width="200px">
          <template slot-scope="scope">
            <el-tag
              v-for="item in scope.row.memberLabelList.slice(0, 3)"
              :key="item.name"
              type="info"
              effect="plain"
              style="margin: 0 6px 6px 0"
            >
              {{ item.tagName }}
            </el-tag>
            <span
              v-if="scope.row.memberLabelList.length > 3"
              class="text-blue"
              @click="handleMoreLabel(row.data)"
              >查看更多</span
            >
          </template>
        </el-table-column>
        <el-table-column label="身份信息" width="200px">
          <template slot-scope="scope">
            <div
              v-if="
                scope.row.identityVOList && scope.row.identityVOList.length > 0
              "
            >
              <div
                v-for="(item, index) in scope.row.identityVOList"
                :key="index"
              >
                <div v-if="item.type == 1">【企业】{{ item.unit }}</div>
                <div v-if="item.type == 2">【机构】{{ item.unit }}</div>
                <div>【职务】{{ item.post }}</div>
              </div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="账号状态" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">已冻结</div>
            <div v-if="scope.row.status == 1">正常</div>
            <div v-if="scope.row.status == 3">待邀请</div>
          </template>
        </el-table-column>
        <el-table-column label="激活状态" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.activatedState == 1">已激活</div>
            <div v-if="scope.row.activatedState == -1">未激活</div>
            <!--            <div v-else>待邀请</div>-->
          </template>
        </el-table-column>
        <el-table-column label="短信发送状态" width="200px">
          <template slot-scope="scope">
            <div v-if="scope.row.activatedState == 1">--</div>
            <div v-else-if="scope.row.sendStatus == 1">已发送</div>
            <div v-else-if="scope.row.sendStatus == 0">未发送</div>
            <!--            <div v-else>待邀请</div>-->
          </template>
        </el-table-column>
        <el-table-column label="商会认证状态" width="200px">
          <template slot-scope="{ row }">
            <div v-if="row.authenticate">
              已认证
              <div
                class="text-btn-style"
                :actionid="getId('', '详情')"
                @click="detail($event, row)"
              >
                去查看
              </div>
            </div>
            <div v-else>
              未认证
              <div
                class="text-btn-style"
                :actionid="getId('', '详情')"
                style="color: red"
                @click="detail($event, row)"
              >
                去认证
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <div
              v-if="has('', '详情')"
              class="text-btn-style"
              :actionid="getId('', '详情')"
              @click="detail($event, scope.row)"
            >
              详情
            </div>
            <div class="text-btn-style" @click="goEdit($event, scope.row)">
              修改
            </div>
            <div
              v-if="has('', '冻结') && scope.row.status == 1"
              class="text-btn-style"
              :actionid="getId('', '冻结')"
              @click="updateStatus($event, scope.row)"
            >
              冻结
            </div>
            <div
              v-if="has('', '解冻') && scope.row.status == 0"
              class="text-btn-style"
              :actionid="getId('', '解冻')"
              @click="updateStatus($event, scope.row)"
            >
              解冻
            </div>
            <!-- <el-button type="text" @click="openTransfer(scope.row)" :actionid="getId('', '转让')" v-if="has('', '转让')">转让</el-button> -->
            <div
              v-if="scope.row.memberLabelList.length > 0"
              class="text-btn-style"
              @click="handleRemoveLabel(scope.row)"
            >
              移除标签
            </div>
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
      <el-form
        ref="form"
        :model="formObj"
        :rules="rules"
        label-position="left"
        label-width="150px"
      >
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
            <el-button v-dbClick type="primary" @click="transferPresident"
              >确定</el-button
            >
            <el-button @click.native="transferVisible = false">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="数据导入"
      :visible.sync="visible"
      width="500px"
      @close="closeVisible"
    >
      <div style="margin-left: 50px; margin-top: -25px">
        <span class="excelSpan" style="font-size: 20px; margin-left: 100px"
          >导入说明</span
        >
        <span class="excelSpan">1、请勿增加、删除、修改表格中的字段</span>
        <span class="excelSpan">2、其他字段多次导入数据会进行覆盖</span>
      </div>
      <div v-if="execelDate" style="margin-left: 50px">
        <el-upload
          class="upload-demo"
          :multiple="false"
          :data="importQuery"
          :show-file-list="false"
          :headers="uploadHeaders"
          :on-success="successImport"
          :action="importUrl"
        >
          <span>导入文件：</span>
          <el-button><i class="el-icon-upload" />点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            <span style="margin-left: 7px" />支持扩展名：xsl、xslx
          </div>
        </el-upload>
        <!--          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em><div class="el-upload__tip" slot="tip">支持扩展名：xsl、xslx</div></div>-->
        <!--            <span  style="font-size: 15px;">导入文件：</span>
            <el-button size="small" type="primary"><i class="el-icon-upload" style="margin-right: 20px;"></i>上传文件</el-button>
            <div slot="tip" class="el-upload__tip">支持扩展名：xsl、xslx</div>-->
      </div>
      <div v-if="execelDate.state" class="tableTitle" />
      <div v-if="execelDate.state === 1" style="margin-left: 50px">
        <div>
          导入结果：导入成功
          <span style="color: red">{{ execelDate.data.successCount }}</span>
          条记录,导入失败
          <span style="color: red">{{ execelDate.data.failureCount }}</span>
          条记录
        </div>
        <div style="margin-top: 10px; margin-bottom: 10px">导入失败详情：</div>
        <el-table
          :data="execelDate.data.failureReasonList"
          border
          style="width: 100%"
        >
          <el-table-column prop="row" label="行标(表头不算在内)" />
          <el-table-column prop="reason" label="失败原因" />
        </el-table>
      </div>
      <div v-else style="margin-left: 50px">
        <div>{{ execelDate.msg }}</div>
      </div>
    </el-dialog>

    <attach-label
      ref="eleAttach"
      :attach-visible.sync="attachVisible"
      :isMember="true"
      @close="handleCloseAttach"
      @confirm="handleConfirmAttach"
    />

    <more-label
      :more-visible.sync="moreVisible"
      :labelData="labelData"
      :showGroupName="false"
      :showGroupType="moreType"
      @close="handleCloseMore"
      @remove="handleRemoveLabelConfirm"
    />
  </div>
</template>

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>

<style lang="scss">
.upload-demo {
  display: flex;
  // justify-content: center;
  // align-content: center;
  align-items: center;
}
.query-form .el-form-item {
  margin-right: 20px;

  .el-select,
  .el-cascader {
    .el-input__inner {
      width: 184px;
    }
  }
}
.el-dialog__header {
  background-color: #cfbbbb38;
}
.excelSpan {
  margin-left: 300px;
  word-break: normal;
  width: auto;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
  font-size: 7px;
  margin: 12px;
}
.tableTitle {
  position: relative;
  margin: 17px auto;
  width: 100%;
  height: 1px;
  background-color: #d4d4d4;
  text-align: center;
  font-size: 16px;
  color: rgba(101, 101, 101, 1);
}
.midText {
  position: absolute;
  left: 50%;
  background-color: #ffffff;
  padding: 0 15px;
  transform: translateX(-50%) translateY(-50%);
}
</style>
