<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="right" :model="query">
        <el-row>
          <el-col :span="5">
            <el-form-item label="文章标题：">
              <el-input v-model="query.title" placeholder="请输入文章标题" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :span="12" label="栏目：">
              <el-select v-model="query.contentColumnId">
                <el-option v-for="cc in contentColumnOptions" :key="cc.value" :label="cc.label === '全部' || cc.typeUrl === 0 ? cc.label : optionList[cc.typeUrl - 1] + '-' + cc.label" :value="cc.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item :span="12" label="状态：">
              <el-select v-model="query.status">
                <el-option label="全部" :value="-1" />
                <el-option label="已发布" :value="1" />
                <el-option label="已冻结" :value="3" />
                <el-option label="定时发布" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="创建人：">
              <el-input v-model="query.creator" placeholder="请输入创建人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <el-form-item label="文章ID：">
              <el-input v-model="query.articleId" placeholder="请输入文章id" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
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
          </el-col>
          <el-col :span="2">
            <el-form-item label=" " >
              <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="queryData($event)">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row>
      <el-button v-if="has('', '添加文章')" type="danger" size="small" :actionid="getId('', '添加文章')" @click="add" >创建文章</el-button>
      <el-button v-if="has('', '文章来源管理')" type="primary" size="small" :actionid="getId('', '文章来源管理')" @click="articleSourceManager($event)">文章来源管理</el-button>
    </el-row>
    <el-table id="out-table" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @sort-change="changeTableSort">
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> -->
       <el-table-column label="文章ID" width="80px" prop="id">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="文章标题"  show-overflow-tooltip prop="title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="对应栏目" width="200px" prop="contentColumn">
        <template slot-scope="scope">
          {{ optionList[scope.row.typeUrl - 1] + '-' + scope.row.contentColumn }}
        </template>
      </el-table-column>
      <el-table-column label="浏览量" width="100px" :sortable="'custom'" prop="readCount">
        <template slot-scope="scope">
          {{ scope.row.readCount }}
        </template>
      </el-table-column>
      <el-table-column label="点赞量" width="100px" :sortable="'custom'" prop="commentLikeNums">
        <template slot-scope="scope">
          {{ scope.row.commentLikeNums }}
        </template>
      </el-table-column>
      <el-table-column label="评论量" width="100px" :sortable="'custom'" prop="commentNums">
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
          <div v-if="scope.row.status == 4">
            --
          </div>
          <div v-else >
            {{ scope.row.publishTs }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180px" prop="status">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 3">已冻结</div>
          <div v-if="scope.row.status == 1">
            已发布
          </div>
          <div v-if="scope.row.status == 4">
            定时发布
            <div>{{ scope.row.publishTs }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80px">
        <template slot-scope="scope">
          <div>
            <el-button v-if="has('', '编辑')" type="text" :actionid="getId('', '编辑')" @click="edit(scope.row)">编辑</el-button>
          </div>
          <div>
            <el-button v-if="has('', '冻结') && scope.row.status == 1 || scope.row.status == 4" type="text" :actionid="getId('', '冻结')" @click="updateStatus($event, scope.row)">冻结</el-button>
            <el-button v-if="has('', '解冻') && scope.row.status == 3" type="text" :actionid="getId('', '解冻')" @click="updateStatus($event, scope.row)">解冻</el-button>
          </div>
          <div>
            <el-button type="text" @click="detail($event, scope.row)">详情</el-button>
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
</style>
