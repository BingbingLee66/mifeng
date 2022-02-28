<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="发布文章" name="1" />
      <el-tab-pane label="发布动态" name="2" />
    </el-tabs>
    <div class="block">
      <el-form ref="query" :inline="true" label-position="right" :model="query">
        <div v-if="activeName === '1'">
          <el-row>
            <el-form-item label="文章标题：">
              <el-input v-model="query.title" placeholder="请输入文章标题" />
            </el-form-item>
            <el-form-item :span="12" label="栏目：">
              <el-select v-model="query.contentColumnId">
                <el-option
                  v-for="cc in contentColumnOptions"
                  :key="cc.value"
                  :label="
                    cc.label === '全部' || cc.typeUrl === 0
                      ? cc.label
                      : optionList[cc.typeUrl - 1] + '-' + cc.label
                  "
                  :value="cc.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :span="12" label="状态：">
              <el-select v-model="query.status">
                <el-option
                  v-for="(item, index) in statusList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="创建人：">
              <el-input v-model="query.creator" placeholder="请输入创建人" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="文章ID：">
              <el-input v-model="query.articleId" placeholder="请输入文章id" />
            </el-form-item>
            <el-form-item label="发布时间：" label-width="120px">
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
            <el-form-item label=" ">
              <el-button
                v-if="has('', '查询')"
                type="primary"
                :actionid="getId('', '查询')"
                @click="queryData($event)"
                >查询</el-button
              >
            </el-form-item>
          </el-row>
          <el-row>
            <el-button
              v-if="has('', '添加文章')"
              type="danger"
              size="small"
              :actionid="getId('', '添加文章')"
              @click="add"
              >创建文章</el-button
            >
            <el-button
              v-if="has('', '文章来源管理')"
              type="primary"
              size="small"
              :actionid="getId('', '文章来源管理')"
              @click="articleSourceManager($event)"
              >文章来源管理</el-button
            >
          </el-row>
        </div>
        <div v-if="activeName === '2'">
          <el-row style="margin-bottom:0">
            <el-form-item label="来源商会：">
              <el-select v-model="query.ckey">
                <el-option
                  v-for="(item, index) in chamberOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.ckey"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="动态类型：">
              <el-select v-model="query.dynamicType">
                <el-option
                  v-for="(item, index) in dynamicTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="发布状态：">
              <el-select v-model="query.status">
                <el-option
                  v-for="(item, index) in statusList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="发布时间：">
              <el-select v-model="query.publishTimeType">
                <el-option
                  v-for="(item, index) in publishTimeTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label=" ">
              <el-button
                v-if="has('', '查询')"
                type="primary"
                :actionid="getId('', '查询')"
                @click="queryData($event)"
                >查询</el-button
              >
            </el-form-item>
          </el-row>
             <el-row>
            <el-button
              type="primary"
              @click="addDynamic(1)"
              >发布图文动态</el-button
            >
            <el-button
              type="primary"
              @click="addDynamic(2)"
              >发布视频动态</el-button
            >
          </el-row>
        </div>
      </el-form>
    </div>

    <el-table
      v-if="activeName === '1'"
      id="out-table"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @sort-change="changeTableSort"
      ref="tableData"
    >
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> -->
      <el-table-column label="文章ID" width="80px" prop="id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="文章标题" show-overflow-tooltip prop="title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="对应栏目" width="200px" prop="contentColumn">
        <template slot-scope="scope">
          {{
            optionList[scope.row.typeUrl - 1] + "-" + scope.row.contentColumn
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="浏览量"
        width="100px"
        :sortable="'custom'"
        prop="readCount"
      >
        <template slot-scope="scope">
          {{ scope.row.readCount }}
        </template>
      </el-table-column>
      <el-table-column
        label="点赞量"
        width="100px"
        :sortable="'custom'"
        prop="commentLikeNums"
      >
        <template slot-scope="scope">
          {{ scope.row.commentLikeNums }}
        </template>
      </el-table-column>
      <el-table-column
        label="评论量"
        width="100px"
        :sortable="'custom'"
        prop="commentNums"
      >
        <template slot-scope="scope">
          {{ scope.row.commentNums }}
        </template>
      </el-table-column>
      <el-table-column label="创建信息" width="200px" prop="operator">
        <template slot-scope="scope">
          <div>
            {{ scope.row.operator }}
          </div>
          <div>
            {{ scope.row.createdTs }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="200px" prop="publishTs">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 4">--</div>
          <div v-else>
            {{ scope.row.publishTs }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180px" prop="status">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 3">已冻结</div>
          <div v-if="scope.row.status == 1">已发布</div>
          <div v-if="scope.row.status == 4">
            定时发布
            <div>{{ scope.row.publishTs }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80px">
        <template slot-scope="scope">
          <div>
            <el-button
              v-if="has('', '编辑')"
              type="text"
              :actionid="getId('', '编辑')"
               @click="edit(scope.row)"
              >编辑</el-button
            >
          </div>
          <div>
            <el-button
              v-if="
                (has('', '冻结') && scope.row.status == 1) ||
                scope.row.status == 4
              "
              type="text"
              :actionid="getId('', '冻结')"
              @click="updateStatus($event, scope.row)"
              >冻结</el-button
            >
            <el-button
              v-if="has('', '解冻') && scope.row.status == 3"
              type="text"
              :actionid="getId('', '解冻')"
              @click="updateStatus($event, scope.row)"
              >解冻</el-button
            >
          </div>
          <div>
            <el-button type="text" @click="detail($event, scope.row)"
              >详情</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="activeName === '2'"
      id="out-table"
      v-loading="listLoading"
      :data="dynamicList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @sort-change="changeTableSort"
      ref="tableData"
    >
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> -->
      <el-table-column label="动态ID" width="80px" prop="id">
        <template slot-scope="scope">
          {{ scope.row.articleResp.id }}
        </template>
      </el-table-column>
      <el-table-column label="来源商会" prop="chamberName">
        <template slot-scope="scope">
          {{ scope.row.articleResp.chamberName }}
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="contentHtml">
        <template slot-scope="scope">
          <span
            class="contentHtml"
            id="myhtml"
            v-html="scope.row.articleResp.contentHtml"
          ></span>
        </template>
      </el-table-column>
      <el-table-column
        label="浏览量"
        width="100px"
        :sortable="'custom'"
        prop="read_count"
      >
        <template slot-scope="scope">
          {{ scope.row.articleResp.readCount }}
        </template>
      </el-table-column>
      <el-table-column
        label="点赞量"
        width="100px"
        :sortable="'custom'"
        prop="like_nums"
      >
        <template slot-scope="scope">
          {{ scope.row.articleResp.commentLikeNums }}
        </template>
      </el-table-column>
      <el-table-column
        label="评论量"
        width="100px"
        :sortable="'custom'"
        prop="comment_nums"
      >
        <template slot-scope="scope">
          {{ scope.row.articleResp.commentNums }}
        </template>
      </el-table-column>
      <el-table-column label="来源" width="80px" prop="sourceName">
        <template slot-scope="scope">
          {{ scope.row.articleResp.sourceName }}
        </template>
      </el-table-column>

      <el-table-column label="动态类型" width="80px" prop="contentType">
        <template slot-scope="scope">
          {{
            scope.row.articleResp.contentType === 1 ? "图文动态" : "视频动态"
          }}
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="80px" prop="publishTs">
        <template slot-scope="scope">
          {{ scope.row.articleResp.publishTs }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180px" prop="status">
        <template slot-scope="scope">
          <div v-if="scope.row.articleResp.status == 3">已冻结</div>
          <div v-if="scope.row.articleResp.status == 1">已发布</div>
          <div v-if="scope.row.articleResp.status == 4">
            定时发布
            <div>{{ scope.row.articleResp.publishTs }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建信息" width="200px" prop="operator">
        <template slot-scope="scope">
          <div>【创建人】{{ scope.row.articleResp.operator }}</div>
          <div>【创建时间】{{ scope.row.articleResp.createdTs }}</div>
          <div>【更新人】{{ scope.row.articleResp.updater }}</div>
          <div>【更新时间】{{ scope.row.articleResp.updatedTs }}</div>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="200px" prop="publishTs">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 4">--</div>
          <div v-else>
            {{ scope.row.publishTs }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="80px">
        <template slot-scope="scope">
          <div>
            <el-button
              v-if="has('', '编辑')"
              type="text"
              :actionid="getId('', '编辑')"
               @click="editDynamic(scope.row)"
            
              >编辑</el-button
            >
          </div>
          <div>
            <el-button
              v-if="
                (has('', '冻结') && scope.row.status == 1) ||
                scope.row.status == 4
              "
              type="text"
              :actionid="getId('', '冻结')"
              @click="updateStatus($event, scope.row)"
              >冻结</el-button
            >
            <el-button
              v-if="has('', '解冻') && scope.row.status == 3"
              type="text"
              :actionid="getId('', '解冻')"
              @click="updateStatus($event, scope.row)"
              >解冻</el-button
            >
          </div>
          <div>
            <el-button type="text" @click="detail($event, scope.row)"
              >详情</el-button
            >
          </div>
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
</template>

<script src="./editor.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.contentHtml {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  img {
    width: 20% !important;
    height: 20% !important;
  }
}
#myhtml img {
  width: 20% !important;
    height: 20% !important;
}
</style>
