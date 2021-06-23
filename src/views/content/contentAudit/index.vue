<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="right" :model="query">
        <el-row>
          <el-col :span="5">
            <el-form-item label="文章来源：">
              <el-select v-model="query.publishType">
                <el-option label="所有" :value="-1"></el-option>
                <el-option label="商会" :value="1"></el-option>
                <el-option label="企业" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="5">
            <el-form-item label="状态：">
              <el-select v-model="query.auditType">
                <el-option label="待审核" :value="1"></el-option>
                <el-option label="审核通过" :value="2"></el-option>
                <el-option label="审核不通过" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="5">
            <el-form-item label="发布时间：">
              <el-select v-model="query.publishTimeType">
                <el-option label="24h内" :value="1"></el-option>
                <el-option label="3天内" :value="2"></el-option>
                <el-option label="7天内" :value="3"></el-option>
                <el-option label="一个月内" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label=" ">
              <el-button type="primary" @click="fetchData($event)" :actionid="getId('', '查询')" v-if="has('', '查询')">查询
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <br />
    <el-row>
      <el-button type="primary" @click="batchPassThrough($event)" :actionid="getId('', '通过')" v-if="has('', '通过')">通过
      </el-button>
      <el-button type="danger" @click="openBatchReject($event)" :actionid="getId('', '不通过')" v-if="has('', '不通过')">不通过
      </el-button>
    </el-row>
    <el-table id="out-table" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px"></el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ !scope.row.title ? scope.row.contentColumn : scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="文章来源">
        <template slot-scope="scope">
          <div v-if="scope.row.publishType == 1">{{ scope.row.chamberName }}</div>
          <div v-if="scope.row.publishType == 2">{{ scope.row.companyName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="200px">
        <template slot-scope="scope">
          {{ scope.row.publishTs }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row.auditStatus == -1">全部</div>
          <div v-if="scope.row.auditStatus == 0">待审核</div>
          <div v-if="scope.row.auditStatus == 1">审核通过</div>
          <div v-if="scope.row.auditStatus == 2">审核不通过</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-button type="text" @click="detail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>
    <el-dialog title="" :visible.sync="visible" width="80%">
      <div class="d-preview-wrap">
        <div class="d-preview-area">
          <div class="d-article-title">{{ detailObj.title }}</div>
          <div class="d-article-content" v-html="detailObj.contentHtml"></div>
        </div>
      </div>
      <el-col :offset="10" :span="8">
        <el-button type="primary" @click.native="passThrough($event)" :actionid="getId('', '通过')" v-if="has('', '通过')">
          通过
        </el-button>
        <el-button type="danger" @click.native="openReject($event)" :actionid="getId('', '不通过')" v-if="has('', '不通过')">
          不通过
        </el-button>
      </el-col>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
    <el-dialog title="不通过原因" :visible.sync="batchRejectVisible" width="30%">
      <el-form ref="form" label-position="left" label-width="50px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <el-radio-group v-model="remark">
                <el-row>
                  <el-radio label="内容违规">1、内容违规</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="广告">2、广告</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="其他">3、其他</el-radio>
                </el-row>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="batchReject">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="不通过原因" :visible.sync="rejectVisible" width="30%">
      <el-form ref="form" label-position="left" label-width="50px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <el-radio-group v-model="remark">
                <el-row>
                  <el-radio label="内容违规">1、内容违规</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="广告">2、广告</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="其他">3、其他</el-radio>
                </el-row>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reject">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./audit.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
  .d-preview-wrap {
    width: 95%;
    height: auto;
    min-height: 500px;
  }

  .d-preview-area {
    width: 100%;
    min-height: 500px;
    margin: 30px 20px;
    border: 1px solid #d9dde2;
    overflow-y: auto;
  }

  .d-article-title {
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    margin: 40px 40px 20px 40px;
  }

  .d-article-content {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.8;
    margin: 0 40px 20px 40px;
  }

  .d-article-content > p > img {
    margin: 20px 10%;
    width: 80% !important;
    height: auto !important;
    max-height: 100% !important;
  }
</style>
