<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="采集结果" name="1"></el-tab-pane>
      <el-tab-pane label="回收站" name="2"></el-tab-pane>
      <el-tab-pane label="网站等级" name="3"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName == '1'">
      <div class="block">
        <el-form ref="query"  :inline="true"  label-position="right"  :model="query">
          <el-form-item label="采集网站">
            <el-select v-model="query.crawlerId">
              <el-option v-for="crawler in crawlerOptions" :label="crawler.name" :value="crawler.id" :key="crawler.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="openPublishBatch($event)" >查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="small" @click="batchToRecycleBin($event)" >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row>
        <el-button type="danger" size="small" @click="batchDelArticle($event)">移入回收站</el-button>
        <span>移入回收站的供需不会发布到前台</span>
      </el-row>

      <el-table id="out-table" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px">
        </el-table-column>
        <el-table-column label="标题">
          <template slot-scope="scope">
            {{scope.row.title}}
          </template>
        </el-table-column>
        <el-table-column label="采集网站名称" >
          <template slot-scope="scope">
            {{scope.row.websiteName}}
          </template>
        </el-table-column>
        <el-table-column label="采集频道" width="160px">
          <template slot-scope="scope">
            {{scope.row.channel}}
          </template>
        </el-table-column>
        <el-table-column label="采集内容发布时间" width="200px">
          <template slot-scope="scope">
            {{scope.row.publishTs}}
          </template>
        </el-table-column>
        <el-table-column label="采集时间" width="130px">
          <template slot-scope="scope">
            {{scope.row.reptileTs}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="detail($event, scope.row)">预览</el-button>
            <el-button type="text" @click="edit($event, scope.row)">编辑</el-button>
            <el-button type="text" @click="openPublish($event, scope.row)">发布</el-button>
            <el-button type="text" @click="toRecycleBin($event, scope.row)">移入回收站</el-button>
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
        @current-change="handleCurrentChange">
      </el-pagination>
      <el-dialog
        title=""
        :visible.sync="publishVisible"
        width="50%">
        <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="100px">
          <el-row>
            <el-col :offset="2" :span="20">
              <el-form-item label="发布文章数：" prop="title">
                <span style="color: red;">{{formObj.count}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="2" :span="20">
              <el-form-item label="对应栏目：" prop="contentColumnId">
                <el-select v-model="formObj.contentColumnId" placeholder="请选择对应栏目">
                  <el-option v-for="cc in contentColumnOptions" :label="cc.label" :value="cc.value" :key="cc.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="2" :span="10">
              <el-form-item label="发布时间：">
                <el-radio-group v-model="formObj.status">
                  <el-radio :label="1">立即发布</el-radio>
                  <el-radio :label="4">定时发布</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="formObj.status == 4">
              <el-form-item label="" prop="publishTs" label-width="0">
                <el-date-picker
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="formObj.publishTs"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-col :offset="9" :span="2">
              <el-button type="primary" @click="publish">发布</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div v-if="activeName == '2'">
      <div class="block">
        <el-form ref="query" :inline="true" label-position="right" :model="query">
          <el-form-item label="采集网站：">
            <el-select v-model="query.crawlerId">
              <el-option v-for="crawler in crawlerOptions" :label="crawler.name" :value="crawler.id" :key="crawler.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="batchDelArticle($event)">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="small" @click="batchDelArticle($event)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row>
        <el-button type="danger" size="small" @click="batchDelArticle($event)">删除</el-button>
        <span>回收站的内容“删除”后将从数据库彻底删除，不可恢复，请慎重操作</span>
      </el-row>
      <el-table id="out-table" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px">
        </el-table-column>
        <el-table-column label="标题">
          <template slot-scope="scope">
            <div @click="detail($event, scope.row)" :actionid="getId('回收站', '预览')" v-if="has('回收站', '预览')"><span style="cursor: pointer;">{{scope.row.title}}</span></div>
            <div v-if="!has('回收站', '预览')">{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column label="采集网站名称">
          <template slot-scope="scope">
            {{scope.row.createdTs}}
          </template>
        </el-table-column>
        <el-table-column label="采集频道">
          <template slot-scope="scope">
            {{scope.row.websiteName}}
          </template>
        </el-table-column>
        <el-table-column label="采集内容发布时间">
          <template slot-scope="scope">
            {{scope.row.channel}}
          </template>
        </el-table-column>
        <el-table-column label="采集时间">
          <template slot-scope="scope">
            {{scope.row.recycledTs}}
          </template>
        </el-table-column>
        <el-table-column label="操作信息">
          <template slot-scope="scope">
            {{scope.row.operator}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('回收站', '预览')" v-if="has('回收站', '预览')">预览</el-button>
            <el-button type="text" @click="edit($event, scope.row)" :actionid="getId('回收站', '编辑')" v-if="has('回收站', '编辑')">编辑</el-button>
            <el-button type="text" @click="toCollectionResult($event, scope.row)" :actionid="getId('回收站', '移出')" v-if="has('回收站', '移出')">移出</el-button>
            <el-button type="text" @click="delArticle($event, scope.row)" style="color: red;" :actionid="getId('回收站', '删除')" v-if="has('回收站', '删除')">删除</el-button>
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
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <div v-if="activeName == '3'">
      <div class="block">
        <el-form ref="query" :inline="true" label-position="right" :model="query">
          <el-form-item label="创建人：">
            <el-input v-model="query.operator"></el-input>
          </el-form-item>
          <el-form-item label="网站名称：">
            <el-select v-model="query.website">
              <el-option v-for="channel in crawlerOptions" :label="channel.name" :value="channel.id" :key="channel.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采集状态：">
            <el-select v-model="query.status">
              <el-option label="全部" :value="-1"></el-option>
              <el-option label="未采集" :value="0"></el-option>
              <el-option label="采集" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="fetchData($event)">查询</el-button>
            <el-button type="primary" @click="fetchData($event)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row>
        <el-button type="primary" size="small" @click="batchDelArticle($event)">新增网站</el-button>
        <span>抓取网站登记表，便于运营维护与技术查找</span>
      </el-row>
      <el-table id="out-table" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px">
        </el-table-column>
        <el-table-column label="采集网站名称">
          <template slot-scope="scope">
            <div @click="detail($event, scope.row)" :actionid="getId('回收站', '预览')" v-if="has('回收站', '预览')"><span style="cursor: pointer;">{{scope.row.title}}</span></div>
            <div v-if="!has('回收站', '预览')">{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column label="采集频道">
          <template slot-scope="scope">
            {{scope.row.createdTs}}
          </template>
        </el-table-column>
        <el-table-column label="网站地址">
          <template slot-scope="scope">
            {{scope.row.websiteName}}
          </template>
        </el-table-column>
        <el-table-column label="创建信息">
          <template slot-scope="scope">
            {{scope.row.channel}}
          </template>
        </el-table-column>
        <el-table-column label="更新信息">
          <template slot-scope="scope">
            {{scope.row.recycledTs}}
          </template>
        </el-table-column>
        <el-table-column label="采集状态">
          <template slot-scope="scope">
            {{scope.row.operator}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('回收站', '预览')" v-if="has('回收站', '预览')">预览</el-button>
            <el-button type="text" @click="edit($event, scope.row)" :actionid="getId('回收站', '编辑')" v-if="has('回收站', '编辑')">编辑</el-button>
            <el-button type="text" @click="toCollectionResult($event, scope.row)" :actionid="getId('回收站', '移出')" v-if="has('回收站', '移出')">移出</el-button>
            <el-button type="text" @click="delArticle($event, scope.row)" style="color: red;" :actionid="getId('回收站', '删除')" v-if="has('回收站', '删除')">删除</el-button>
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
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog
      title=""
      :visible.sync="detailVisible"
      width="80%">
      <div class="c-preview-wrap">
        <div class="c-preview-area">
          <div class="c-article-title">{{detailObj.title}}</div>
          <div class="c-article-content" v-html="detailObj.contentHtml"></div>
        </div>
      </div>
    </el-dialog>
  </div>

</template>

<script src="./reptile.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
<style>
.c-preview-wrap {
  width: 95%;
  height: auto;
  min-height: 500px;
}
.c-preview-area {
  width: 100%;
  min-height: 500px;
  margin: 30px 20px;
  border: 1px solid #d9dde2;
  overflow-y: auto;
}
.c-article-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin: 40px 40px 20px 40px;
}
.c-article-content {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.8;
  margin: 0 40px 20px 40px;
}
.c-article-content>p>img {
  margin: 20px 10%;
  width: 80% !important;
  height: auto !important;
  max-height: 100% !important;
}
</style>
