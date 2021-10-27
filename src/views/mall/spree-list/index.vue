<template>
  <div class="app-container">
    <div class="from-block">
      <el-form ref="query" label-position="right" :inline="true" size="mini" :model="query">
        <el-form-item label="大礼包ID">
          <el-input v-model="query.giftId" maxlength="12" placeholder="" @input="e => handleNumber(e,'giftId')"/>
        </el-form-item>
        <el-form-item label="大礼包名称">
          <el-input v-model="query.giftName" placeholder="关键词" @input="e => handleSpace(e,'giftName')"/>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="query.createName" placeholder="关键词" @input="e => handleSpace(e,'createName')"/>
        </el-form-item>
        <el-form-item label="" style="margin-left: -30px;">
          <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button type="danger" size="small" @click="create">创建大礼包</el-button>
    </div>
    <div class="table-block">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="大礼包ID" width="100px">
          <template slot-scope="scope">
            <span class="blue-label" @click="goSpreeDetail(scope.row.giftId)">{{ scope.row.giftId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="大礼包名称" width="200px">
          <template slot-scope="scope">
            <div>{{ scope.row.giftName }}</div>
            <span class="blue-label" @click="createCode(scope.row)">二维码</span>
            <span class="blue-label" @click="createLink(scope.row)">短链接</span>
          </template>
        </el-table-column>
        <el-table-column label="包含优惠券" width="200px">
          <template slot-scope="scope">
            <div v-for="item in scope.row.coupons" :key="item.giftId">
              <span class="blue-label" @click="goCouponDetail(item.couponId)">{{ item.couponId }}</span>-
              {{ item.couponName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="大礼包有效期" width="165px">
          <template slot-scope="scope">
            {{ scope.row.validStartTime | dateFormat }}至
            {{ scope.row.validEndTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="大礼包发行量" width="120px">
          <template slot-scope="scope">
            <div class="blue-label" @click="showIssue(scope.row)">{{ scope.row.quota }}</div>
          </template>
        </el-table-column>
        <el-table-column label="获取规则" width="150px">
          <template slot-scope="scope">
            <div v-if="scope.row.obtainLimit===-1">无限制</div>
            <div v-else>每人可获得{{ scope.row.obtainLimit }}份</div>
          </template>
        </el-table-column>
        <el-table-column label="已发放/领取" width="100px">
          <template slot-scope="scope">
            <div class="blue-label" @click="goIssueList(scope.row)">{{ scope.row.sendSize }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160px">
          <template slot-scope="scope">
            <div class="red-label">{{ scope.row.createName }}</div>
            <div>{{ scope.row.createTime | dateFormat }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status===0" type="text" @click="updateIssueStatu(scope.row,1)">继续发</el-button>
            <el-button v-else-if="scope.row.status===1" type="text" @click="updateIssueStatu(scope.row,0)">停发
            </el-button>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <!-- 编辑发行量 -->
    <el-dialog title="发行量" :visible.sync="issueVisible" width="400px">
      <div class="dialog-content">
        <el-input style="width: 300px" v-model="issue" placeholder="" maxlength="9" show-word-limit @input="e => handleNumber(e,'issue')"/>
        <div class="red-label mt-10">提示：编辑发行量时，只能增加，不能减少。</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateIssue">提交</el-button>
        <el-button @click="issueVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 生成短链接 -->
    <el-dialog title="生成短链接" :visible.sync="linkVisible" width="500px">
      <el-row>
        <el-col style="width: 60px;">短链接：</el-col>
        <el-col style="width: 400px;">{{ rowData.sortUrl }}</el-col>
      </el-row>
      <el-row>
        <el-col style="width: 60px;"></el-col>
        <el-col :span="10" :offset="3"><span style="color: #409eff;cursor: pointer;" @click="copyUrl">复制链接</span>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 生成二维码 -->
    <div class="code-dialog">
      <el-dialog title="礼包二维码" :visible.sync="codeVisible" width="600px">
        <div class="code-wrap">
          <div id="spreeQrcode" class="code-content">
            <div class="code-img">
              <img class="qr-code" :src="rowData.qrcode">
            </div>
            <div class="code-info">
              <div class="item">
                <div class="tit">大礼包：</div>
                <div class="txt">{{ rowData.giftName }}</div>
              </div>
            </div>
          </div>
          <div style="text-align: center;margin-top: 20px">
            <el-button type="primary" @click="downloadCode" :loading="isLoading">保存</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script src="./spree-list.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
</style>
<style lang="scss">
.from-block {
  margin: 10px 0;

  .el-form-item {
    margin-right: 40px;

    .el-select {
      .el-input__inner {
        width: 163px;
      }
    }
  }
}

.table-block {
  margin-top: 20px;
}

.table-dialog {
  .el-dialog {
    margin-top: 8vh !important;
  }
}

.code-dialog {
  .el-dialog {
    margin-top: 5vh !important;
  }

  .code-wrap {
    width: 100%;
    height: 80vh;

    .code-content {
      width: 500px;
      height: 600px;
      border: 1px solid #d6d5d5;
      border-radius: 20px;
      font-size: 16px;
      font-family: PingFang SC, PingFang SC-Regular;
      color: #999999;

      .code-img {
        width: 490px;
        height: 490px;
        text-align: center;
        padding: 5px;
        .qr-code {
          width: 100%;
          height: 100%;
        }
      }

      .code-info {
        border-top: 1px solid #d6d5d5;
        padding: 20px 33px 33px 33px;
        box-sizing: border-box;

        .item {
          display: flex;
          margin-top: 18px;

          .tit {
            width: 80px;
            flex-shrink: 0;
            line-height: 24px;
          }

          .txt {
            font-weight: bold;
            color: #222222;
            line-height: 24px;
          }

          .txt-1 {
            color: #dc0000;
          }
        }
      }
    }
  }
}
</style>
