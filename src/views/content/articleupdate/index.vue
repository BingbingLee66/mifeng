<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="商会文章" name="5" />
      <el-tab-pane label="关于商会" name="6" />
      <el-tab-pane label="商会荣誉" name="8" />
    </el-tabs>
    <div v-if="activeName == '5'">
      <div class="block">
        <el-form
          ref="query"
          label-width="auto"
          label-position="right"
          :model="query"
          :inline="true"
        >
          <el-row>
            <el-form-item label="文章标题：">
              <el-input v-model="query.title" />
            </el-form-item>

            <el-form-item :span="12" label="栏目：">
              <el-select v-model="query.contentColumnId">
                <el-option
                  v-for="cc in contentColumnOptions"
                  :key="cc.value"
                  :label="cc.label"
                  :value="cc.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item :span="12" label="状态：">
              <el-select v-model="query.status">
                <el-option label="全部" :value="-1" />
                <el-option label="已发布" :value="1" />
                <el-option label="已冻结(商会)" :value="0" />
                <el-option label="已冻结(平台)" :value="3" />
                <el-option label="定时发布" :value="4" />
                <el-option label="审核不通过" :value="8" />
              </el-select>
            </el-form-item>

            <el-form-item label="创建人：">
              <el-input v-model="query.creator" />
            </el-form-item>
          </el-row>
          <el-row>
            <!-- <el-col :span="5"> -->
            <el-form-item label="文章ID：">
              <el-input
                v-model="query.articleId"
                oninput="value=value.replace(/[^\d]/g,'')"
              />
            </el-form-item>
            <!-- </el-col> -->
            <!-- <el-col :span="8" style="margin-left: 20px"> -->
            <el-form-item label="发布时间：">
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
            <!-- </el-col > -->

            <el-button
              v-if="has('商会资讯', '查询')"
              type="primary"
              :actionid="getId('商会资讯', '查询')"
              @click="fetchData($event)"
            >
              查询
            </el-button>
          </el-row>
        </el-form>
      </div>
      <el-row>
        <el-button
          v-if="has('商会资讯', '添加文章')"
          type="danger"
          size="small"
          :actionid="getId('商会资讯', '添加文章')"
          @click="add($event)"
        >
          创建文章
        </el-button>
        <el-button type="primary" size="small" @click="toStick($event)">
          置顶管理
        </el-button>
      </el-row>
      <el-table
        id="out-table"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @sort-change="handleSortChange"
      >
        <!-- <el-table-column type="index" label="序号" width="60px">
        </el-table-column> -->
        <el-table-column key="activeName5" label="文章ID" width="80px">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="文章标题">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="权重" width="100px">
          <template slot-scope="scope">
            <span class="blue-label" @click="showSort(scope.row)">
              {{ scope.row.sort }}
            </span>
          </template>
        </el-table-column> -->
        <el-table-column label="栏目" width="180px">
          <template slot-scope="scope">
            {{ scope.row.contentColumn }}
          </template>
        </el-table-column>
        <el-table-column
          label="浏览量"
          width="100px"
          prop="readCount"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ scope.row.readCount ? scope.row.readCount : "--" }}
          </template>
        </el-table-column>

        <el-table-column
          prop="commentLikeNums"
          sortable="custom"
          label="点赞量"
          width="100px"
        >
          <template slot-scope="scope">
            {{ scope.row.commentLikeNums }}
          </template>
        </el-table-column>
        <el-table-column
          prop="commentNums"
          sortable="custom"
          label="评论量"
          width="100px"
        >
          <template slot-scope="scope">
            {{ scope.row.commentNums }}
          </template>
        </el-table-column>
        <el-table-column label="创建信息" width="180px">
          <template slot-scope="scope">
            <div>{{ scope.row.operator }}</div>
            <div>{{ scope.row.createdTs }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="160px">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 4">定时发布</div>
            {{ scope.row.publishTs }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作人" width="100px">
          <template slot-scope="scope">
            {{ scope.row.operator }}
          </template>
        </el-table-column> -->
        <el-table-column label="状态" width="120px">
          <template slot-scope="scope">
            <div
              v-if="
                scope.row.status == 1 &&
                (scope.row.auditStatus == 0 || scope.row.auditStatus == 1)
              "
            >
              已发布
            </div>
            <div
              v-if="
                scope.row.status == 0 &&
                (scope.row.auditStatus == 0 || scope.row.auditStatus == 1)
              "
            >
              已冻结(商会)
            </div>
            <div
              v-if="
                scope.row.status == 3 &&
                (scope.row.auditStatus == 0 || scope.row.auditStatus == 1)
              "
            >
              已冻结(平台)
            </div>
            <div
              v-if="
                scope.row.status == 4 &&
                (scope.row.auditStatus == 0 || scope.row.auditStatus == 1)
              "
            >
              定时发布
            </div>
            <div
              v-if="scope.row.auditStatus == 2 || scope.row.auditStatus == 3"
            >
              审核不通过
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否置顶" width="100px">
          否
        </el-table-column>
        <el-table-column label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button
              class="my-btn"
              type="text"
              @click="updateTop(scope.row)"
            >
             置顶
            </el-button>
            <el-button
              class="my-btn"
              v-if="has('商会资讯', '编辑')"
              type="text"
              :actionid="getId('商会资讯', '编辑')"
              @click="edit($event, scope.row)"
            >
              编辑
            </el-button>
            <!-- <br/> -->
            <el-button
              class="my-btn"
              v-if="
                has('商会资讯', '冻结') &&
                (scope.row.status == 1 || scope.row.status == 4)
              "
              type="text"
              :actionid="getId('商会资讯', '冻结')"
              @click="updateStatus($event, scope.row)"
            >
              冻结
            </el-button>
            <el-button
              class="my-btn"
              v-if="has('商会资讯', '解冻') && scope.row.status == 0"
              type="text"
              :actionid="getId('商会资讯', '解冻')"
              @click="updateStatus($event, scope.row)"
            >
              解冻
            </el-button>
            <el-button
              class="my-btn"
              v-if="has('商会资讯', '详情')"
              type="text"
              :actionid="getId('商会资讯', '详情')"
              @click="openDetail(scope.row)"
            >
              详情
            </el-button>
            <!-- <br/> -->
            <el-button
              class="my-btn"
              type="text"
              @click="delArticle(scope.row)"
              >删除</el-button
            >
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
      />
    </div>
    <div v-if="activeName == '6'">
      <el-row>
        <el-button type="primary" size="small" @click="addCloumn($event)"
          >新增栏目</el-button
        >
      </el-row>
      <el-table
        id="out-table"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          key="activeName6"
          type="index"
          label="序号"
          width="60px"
        />
        <!-- <el-table-column label="ID">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column> -->
        <el-table-column label="栏目">
          <template slot-scope="scope">
            {{ scope.row.contentColumn }}
          </template>
        </el-table-column>
        <el-table-column label="文章内容">
          <template slot-scope="scope">
            <div class="content-box" v-html="scope.row.contentHtml" />
          </template>
        </el-table-column>
        <el-table-column label="权重" width="100px">



          <template slot-scope="scope">
            <span class="blue-label" @click="showSort(scope.row)">
              {{ scope.row.sort }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="创建信息" width="240px">
          <template slot-scope="scope">
            <div>{{ scope.row.operator }}</div>
            <div>{{ scope.row.createdTs }}</div>
          </template>
        </el-table-column>
        <el-table-column label="更新信息" width="240px">
          <template slot-scope="scope">
            <div>{{ scope.row.updater }}</div>
            <div>{{ scope.row.updatedTs }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="修改时间">
          <template slot-scope="scope">
            {{ scope.row.updatedTs }}
          </template>
        </el-table-column>
        <el-table-column label="修改人">
          <template slot-scope="scope">
            {{ scope.row.operator }}
          </template>
        </el-table-column> -->
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">
            <div
              v-if="
                scope.row.status == 0 &&
                (scope.row.auditStatus == 0 || scope.row.auditStatus == 1)
              "
            >
              已冻结
            </div>
            <div
              v-if="
                scope.row.status == 1 &&
                (scope.row.auditStatus == 0 || scope.row.auditStatus == 1)
              "
            >
              已发布
            </div>
            <div
              v-if="
                scope.row.status == 3 &&
                (scope.row.auditStatus == 0 || scope.row.auditStatus == 1)
              "
            >
              已冻结(平台)
            </div>
            <div
              v-if="
                scope.row.status == 4 &&
                (scope.row.auditStatus == 0 || scope.row.auditStatus == 1)
              "
            >
              定时发布
            </div>
            <div
              v-if="scope.row.auditStatus == 2 || scope.row.auditStatus == 3"
            >
              审核不通过
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="审核状态" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.auditStatus == 0">未审核</div>
            <div v-if="scope.row.auditStatus == 1">通过</div>
            <div v-if="scope.row.auditStatus == 2">不通过</div>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="detail($event, scope.row)">详情</el-button> -->
            <el-button class="my-btn" type="text" @click="openDetail(scope.row)"
              >详情</el-button
            >
            <el-button
              class="my-btn"
              v-if="has('关于商会', '编辑')"
              type="text"
              :actionid="getId('关于商会', '编辑')"
              @click="editColumn($event, scope.row)"
            >
              编辑
            </el-button>
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
      />
    </div>
    <div v-if="activeName == '8'">
      <el-table
        id="out-table"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          key="activeName7"
          type="index"
          label="序号"
          width="60px"
        />
        <!-- <el-table-column label="ID">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="栏目">
          <template slot-scope="scope">
            {{scope.row.contentColumn}}
          </template>
        </el-table-column> -->
        <el-table-column label="文章内容">
          <template slot-scope="scope">
            <div class="content-box" v-html="scope.row.contentHtml" />
          </template>
        </el-table-column>
        <el-table-column label="创建信息" width="240px">
          <template slot-scope="scope">
            <div>{{ scope.row.operator }}</div>
            <div>{{ scope.row.createdTs }}</div>
          </template>
        </el-table-column>
        <el-table-column label="更新信息" width="240px">
          <template slot-scope="scope">
            <div>{{ scope.row.updater }}</div>
            <div>{{ scope.row.updatedTs }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="修改时间">
          <template slot-scope="scope">
            {{ scope.row.updatedTs }}
          </template>
        </el-table-column>
        <el-table-column label="修改人">
          <template slot-scope="scope">
            {{ scope.row.operator }}
          </template>
        </el-table-column> -->
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button class="my-btn" type="text" @click="openDetail(scope.row)"
              >详情</el-button
            >
            <el-button
              class="my-btn"
              v-if="has('关于商会', '编辑')"
              type="text"
              :actionid="getId('联系我们', '编辑')"
              @click="editColumn($event, scope.row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="art-preview-wrap">
      <el-dialog title="" :visible.sync="detailVisible" width="60%">
        <div class="u-preview-wrap">
          <div
            v-if="detailObj.auditStatus === 2 || detailObj.auditStatus === 3"
            class="u-article-remark"
          >
            不通过理由：{{ detailObj.auditRemark }}
          </div>
          <div class="u-preview-area">
            <div class="u-article-title">{{ detailObj.title }}</div>
            <div class="u-article-content" v-html="detailObj.contentHtml" />
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- 修改权重 -->
    <el-dialog title="权重" :visible.sync="showSortDialog" width="520px">
      <el-form
        :model="sortForm"
        ref="sortForm"
        label-width="100px"
        :rules="sortFormRules"
      >
        <el-form-item label="权重" prop="sort">
          <el-input v-model="sortForm.sort" placeholder="请输入"></el-input>
          <div style="line-height: 1.5; margin-top: 10px">
            权重请控制在0-999，权重为0不在前台展示，权重越大越靠前
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateSort('sortForm')"
            >提交</el-button
          >
          <el-button @click="showSortDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <addColumn ref="addColumnRef" />
  </div>
</template>

<script src="./articleupdate.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.u-preview-wrap {
  width: 100%;
  height: 80vh;
}
.my-btn {
  display: block;
  margin: 0;
}

.u-preview-area {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0 auto;
  border: 1px solid #d9dde2;
  overflow-y: auto;
}

.u-article-remark {
  font-size: 19px;
  font-weight: 500;
  margin: 0px 20px;
}

.u-article-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin: 40px 40px 20px 40px;
}

.u-article-content {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.8;
  margin: 20px;
}

::-webkit-scrollbar {
  width: 0px;
}

> .u-article-content img {
  margin: 10px 10%;
  width: 80% !important;
  height: auto !important;
}

.content-box {
  max-height: 140px;
  overflow-y: auto;
}
</style>

<style lang="scss">
.art-preview-wrap {
  .el-dialog {
    margin-top: 5vh !important;
    height: 90vh;
    overflow: hidden;
  }
}
</style>
