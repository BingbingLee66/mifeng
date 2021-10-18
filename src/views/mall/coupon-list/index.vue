<template>
  <div class="app-container">
    <div class="from-block">
      <el-form ref="query" label-position="right" :inline="true" size="mini" :model="query">
        <el-form-item label="优惠券ID">
          <el-input v-model="query.id" placeholder="" maxlength="12" @input="e=>handleNumber(e,'id')"/>
        </el-form-item>
        <el-form-item label="优惠券名称">
          <el-input v-model="query.name" placeholder="关键词" @input="e=>handleSpace(e,'name')"/>
        </el-form-item>
        <el-form-item label="是否礼包劵">
          <el-select v-model="query.gift" placeholder="请选择">
            <el-option label="是礼包劵" :value="1"/>
            <el-option label="不是礼包劵" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="query.user" placeholder="关键词" @input="e=>handleSpace(e,'user')"/>
        </el-form-item>
        <el-form-item label="" style="margin-left: -30px;">
          <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button type="danger" size="small" @click="create">创建优惠券</el-button>
    </div>
    <div class="table-block">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="券模板ID" width="100px">
          <template slot-scope="scope">
            <div class="blue-label" @click="goCouponDetail(scope.row.templateId)">{{ scope.row.templateId }}</div>
          </template>
        </el-table-column>
        <el-table-column label="优惠券名称">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="类型" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.source===1">全场劵</div>
            <div v-if="scope.row.source===2" @click="goGoodsManager(scope.row.templateId)" class="blue-label">商品劵</div>
            <div v-if="scope.row.source===3">全场劵，礼包劵</div>
            <div v-if="scope.row.source===4">
              <span class="blue-label" @click="goGoodsManager(scope.row.templateId)">商品劵</span> ，礼包劵
            </div>
          </template>
        </el-table-column>
        <el-table-column label="有效期" width="110px">
          <template slot-scope="scope">{{ scope.row.desc }}</template>
        </el-table-column>
        <el-table-column label="发行量" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.quota===-1">无张数限制</div>
            <div v-else class="blue-label" @click="showIssue(scope.row)">{{ scope.row.quota }}</div>
          </template>
        </el-table-column>
        <el-table-column label="获取规则" width="110px">
          <template slot-scope="scope">
            <div v-if="scope.row.accept===-1">无张数限制</div>
            <div v-else>最多获得{{ scope.row.accept }}张</div>
          </template>
        </el-table-column>
        <el-table-column label="使用规则" width="110px">
          <template slot-scope="scope">{{ scope.row.useRule }}</template>
        </el-table-column>
        <el-table-column label="已发放/领取" width="100px">
          <template slot-scope="scope">
            <div class="blue-label" @click="goIssueList(scope.row)">{{ scope.row.obtainSize }}</div>
          </template>
        </el-table-column>
        <el-table-column label="已使用" width="100px">
          <template slot-scope="scope">
            <div class="blue-label" @click="goOrderList">{{ scope.row.useSize }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160px">
          <template slot-scope="scope">
            <div>{{ scope.row.create }}</div>
            <div>{{ scope.row.createTime | dateFormat }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status===1" type="text" @click="updateIssueType(scope.row,0)">停发</el-button>
            <el-button v-if="scope.row.status===0" type="text" @click="updateIssueType(scope.row,1)">继续发</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <!-- 编辑发行量 -->
    <el-dialog title="发行量" :visible.sync="issueVisible" width="400px">
      <div class="dialog-content">
        <el-input v-model="issue" placeholder="" maxlength="4" show-word-limit @input="e=>handleNumber(e,'issue')"/>
        <div class="red-label mt-10">提示：编辑发行量时，只能增加，不能减少。</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateIssues" type="primary">提交</el-button>
        <el-button @click="issueVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./coupon-list.js"></script>

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
</style>
