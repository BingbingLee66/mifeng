<template>
  <div class="container">
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
          type="primary"
          @click="fetchData($event)"
        >
          查询
        </el-button>
      </el-row>
    </el-form>
    <el-row>
      <el-button
        type="danger"
        size="small"
        @click="add($event)"
      >
        创建文章
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
      style="width: 100%"
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
      <el-table-column label="操作" width="200px" fixed="right">
        <template slot-scope="scope">
          <el-button
            class="my-btn"
            type="text"
            @click="edit($event, scope.row)"
          >
            编辑
          </el-button>
          <!-- <br/> -->
          <el-button
            v-if="
              scope.row.status == 1 || scope.row.status == 4
            "
            class="my-btn"
            type="text"
            @click="updateStatus($event, scope.row)"
          >
            冻结
          </el-button>
          <el-button
            v-if="scope.row.status == 0"
            class="my-btn"
            type="text"
            @click="updateStatus($event, scope.row)"
          >
            解冻
          </el-button>
          <el-button
            class="my-btn"
            type="text"
            @click="openDetail(scope.row)"
          >
            详情
          </el-button>
          <!-- <br/> -->
          <el-button
            class="my-btn"
            type="text"
            @click="delArticle(scope.row)"
          >删除</el-button>
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
            <div style="margin: 0 auto;width: 97%;">
              <videoComponent v-show="detailObj.vid" ref="videoRef" :vid="detailObj.vid" height="530px" />
            </div>

            <div class="u-article-content" v-html="detailObj.contentHtml" />
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script src="./committee.js"></script>

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
