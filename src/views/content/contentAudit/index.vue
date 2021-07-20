<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="文章" name="1" />
      <el-tab-pane label="企业官网" name="2" />
      <el-tab-pane label="评论" name="3" />
    </el-tabs>

    <div v-if="activeName == '1'">
      <div class="block">
        <el-form ref="query" label-width="90px" label-position="right" :model="query">
          <el-row>
            <el-col :span="5">
              <el-form-item label="文章来源：">
                <el-select v-model="query.publishType">
                  <el-option label="所有" :value="-1" />
                  <el-option label="商会后台" :value="1" />
                  <el-option label="小程序" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="5">
              <el-form-item label="审核状态：">
                <el-select v-model="query.auditStatus">
                  <el-option label="所有" :value="-1" />
                  <el-option label="待审核" :value="0" />
                  <el-option label="审核通过" :value="1" />
                  <el-option label="审核不通过" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="5">
              <el-form-item label="发布时间：">
                <el-select v-model="query.publishTimeType">
                  <el-option label="24h内" :value="1" />
                  <el-option label="3天内" :value="2" />
                  <el-option label="7天内" :value="3" />
                  <el-option label="一个月内" :value="4" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item label=" ">
                <el-button v-if="has('', '查询')" type="primary" :actionid="getId('文章', '查询')" @click="fetchData($event)">
                  查询
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-if="activeName == '2'">
      <div class="block">
        <el-form ref="query" label-width="90px" label-position="right" :model="query">
          <el-row>
            <el-col :span="5">
              <el-form-item label="审核状态：">
                <el-select v-model="query.auditStatus">
                  <el-option label="所有" :value="-1" />
                  <el-option label="待审核" :value="0" />
                  <el-option label="审核通过" :value="1" />
                  <el-option label="审核不通过" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="5">
              <el-form-item label="发布时间：">
                <el-select v-model="query.publishTimeType">
                  <el-option label="24h内" :value="1" />
                  <el-option label="3天内" :value="2" />
                  <el-option label="7天内" :value="3" />
                  <el-option label="一个月内" :value="4" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item label=" ">
                <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-if="activeName == '3'">
      <div class="block">
        <el-form ref="queryComment" label-width="110px" :inline="true" label-position="right" :model="queryComment">
          <el-form-item label="评论关键字：" class="query_form_item_c">
            <el-input v-model="queryComment.commentKey" />
          </el-form-item>
          <el-form-item label="发布者：" class="query_form_item_c">
            <el-input v-model="queryComment.uname" />
          </el-form-item>
          <el-form-item label="状态：" class="query_form_item_c">
            <el-select v-model="queryComment.status">
              <el-option label="所有" :value="-1" />
              <el-option label="已下架" :value="0" />
              <el-option label="已发布" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间：" class="query_form_item_t">
            <el-date-picker
              v-model="queryDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label=" " class="query_form_item_c">
            <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!--  <el-row>
      <el-button type="primary" @click="batchPassThrough($event)" :actionid="getId('', '通过')" v-if="has('', '通过')">通过
      </el-button>
      <el-button type="danger" @click="openBatchReject($event)" :actionid="getId('', '不通过')" v-if="has('', '不通过')">不通过
      </el-button>
    </el-row> -->

    <div style="width:100%;margin-bottom: 20px;text-align: right;color: #ccc;">
      待审核指通过了微信内容安全审核，待审核的内容前端可见，人工审核不通过之后，前端不可见。
    </div>
    <div v-if="activeName == '1' || activeName == '2'">
      <el-table id="out-table" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55px"></el-table-column> -->
        <el-table-column label="标题">
          <template slot-scope="scope">
            <span v-if="activeName == '1'">
              {{ !scope.row.title ? scope.row.contentColumn : scope.row.title }}
            </span>
            <span v-else>
              {{
                scope.row.contentType === 1 ? '企业简介' : scope.row.contentType === 2 ? '发展历程' : scope.row.contentType === 3 ? '荣誉资质' : '联系我们'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="文章来源">
          <template slot-scope="scope">
            <div v-if="activeName == '1'">
              <span v-if="scope.row.publishType == 1">{{ scope.row.chamberName }}</span>
              <span v-if="scope.row.publishType == 2">{{ scope.row.companyName }}</span>
            </div>
            <div v-else>
              <span>{{ scope.row.wxName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="200px">
          <template slot-scope="scope">
            <span v-if="activeName == '1'">
              {{ scope.row.publishTs }}
            </span>
            <span v-else>
              {{ scope.row.updatedTs }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150px">
          <template slot-scope="scope">
            <div v-if="scope.row.auditStatus == -1">全部</div>
            <div v-if="scope.row.auditStatus == 0">待审核</div>
            <div v-if="scope.row.auditStatus == 1">审核通过</div>
            <div v-if="scope.row.auditStatus == 2">审核不通过</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="detail(scope.row)">详情</el-button>
            <el-button type="text" :disabled="scope.row.auditStatus == 0 ? false : true" @click="rowPass(scope.row)">通过
            </el-button>
            <el-button type="text" :disabled="scope.row.auditStatus == 0 ? false : true" @click="rowReject(scope.row)">
              不通过
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="activeName == '3'">
      <el-table id="out-table-1" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column label="评论内容" prop="commentContent" show-overflow-tooltip />
        <el-table-column label="发布者" prop="uname" />
        <el-table-column label="发布时间" prop="createdTs" />
        <el-table-column label="状态">
          <template slot-scope="scope">

            <div v-if="scope.row.status == 0">已下架</div>
            <div v-if="scope.row.status == 1">已发布</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="detail(scope.row)">详情</el-button>
            <el-button v-if="scope.row.status == 0" type="text" style="color: #ccc;" @click="rowON(scope.row)">上架
            </el-button>
            <el-button v-if="scope.row.status == 1" type="text" @click="rowOff(scope.row)">下架</el-button>
            <el-button type="text" @click="rowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 20px">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog title="" :visible.sync="visible" width="80%">
      <div class="d-preview-wrap">
        <div class="d-preview-area">
          <div class="d-article-title">
            <span v-if="activeName == '1' || activeName == '3'">{{ detailObj.title }}</span>
            <span v-else>{{
              detailObj.contentType === 1 ? '企业简介' : detailObj.contentType === 2 ? '发展历程' : detailObj.contentType === 3 ? '荣誉资质' : '联系我们'
            }}</span>
          </div>
          <div v-if=" activeName== '1' || activeName == '3'" class="d-article-content" v-html="detailObj.contentHtml" />
          <div v-else class="d-article-content" v-html="detailObj.content" />
        </div>
        <div v-if="detailObj.auditStatus===0" style="height:50px;">
          <el-col :offset="10" :span="8">
            <el-button v-if="has('', '通过')" type="primary" :actionid="getId('', '通过')" @click.native="passThrough($event)">
              通过
            </el-button>
            <el-button v-if="has('', '不通过')" type="danger" :actionid="getId('', '不通过')" @click.native="openReject($event)">
              不通过
            </el-button>
          </el-col>
        </div>
        <div v-else style="height:150px;">
          <el-col :offset="10" :span="8">
            <div v-if="activeName !== '3'">
              <p>状态：{{ detailObj.auditStatus === 1 ? '审核通过' : detailObj.auditStatus === 2 ? '审核不通过' : '' }}</p>
              <p v-if="detailObj.auditStatus===2">
                不通过原因：{{ activeName == '1' ? detailObj.auditRemark : detailObj.rejectRemark }}</p>
              <p>操作人：{{ activeName == '1' ? detailObj.operator : detailObj.auditor }}</p>
              <p>操作时间：{{ detailObj.updatedTs }}</p>
            </div>
            <el-button type="success" @click="visible=false">
              我知道了
            </el-button>
          </el-col>
        </div>
      </div>
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
    <el-dialog :visible.sync="OffVisible" width="20%">
      该评论下架后，对应的回复也将不再显示
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmOff">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="delVisible" width="20%">
      <p>删除为不可回复操作，评论被删除后，</p>对应的回复也将一并删除
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmDel">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./audit.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
<style lang="scss">
.d-preview-wrap {
  width: 95%;
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

.query_form_item_c {
  .el-form-item__content {
    width: 180px;
  }
}

.query_form_item_t {
  .el-form-item__content {
    width: 280px;
  }
}
</style>
