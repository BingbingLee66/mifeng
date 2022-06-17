<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="采集结果" name="1"></el-tab-pane>
      <el-tab-pane label="回收站" name="0"></el-tab-pane>
      <el-tab-pane label="网站等级" name="2"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName == '1'">
      <div class="block">
        <el-form ref="query"  :inline="true"  label-position="right"  :model="query">
          <el-form-item label="采集网站">
            <el-select v-model="query.websiteId">
              <el-option v-for="crawler in websites" :label="crawler.name" :value="crawler.id" :key="crawler.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="fetchData()" >查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="small" @click="reset()" >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row>
        <el-button type="danger" size="small" @click="inRecycleBatch($event)">移入回收站</el-button>
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
            {{scope.row.publishTs | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="采集时间" width="130px">
          <template slot-scope="scope">
            {{scope.row.reptileTs | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="detail($event, scope.row)">预览</el-button>
            <el-button type="text" @click="edit($event, scope.row)">编辑</el-button>
            <el-button type="text" @click="inRecycle($event, scope.row)">移入回收站</el-button>
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
    <div v-if="activeName == '0'">
      <div class="block">
        <el-form ref="query" :inline="true" label-position="right" :model="query">
          <el-form-item label="采集网站：">
            <el-select v-model="query.websiteId">
              <el-option v-for="crawler in websites" :label="crawler.name" :value="crawler.id" :key="crawler.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="fetchData()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="small" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row>
        <el-button type="danger" size="small" @click="batchDel($event)">删除</el-button>
        <span>回收站的内容“删除”后将从数据库彻底删除，不可恢复，请慎重操作</span>
      </el-row>
      <el-table id="out-table" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px">
        </el-table-column>
        <el-table-column label="标题">
          <template slot-scope="scope">
            {{scope.row.title}}
          </template>
        </el-table-column>
        <el-table-column label="采集网站名称">
          <template slot-scope="scope">
            {{scope.row.websiteName}}
          </template>
        </el-table-column>
        <el-table-column label="采集频道">
          <template slot-scope="scope">
            {{scope.row.channel}}
          </template>
        </el-table-column>
        <el-table-column label="采集内容发布时间">
          <template slot-scope="scope">
            {{scope.row.publishTs | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="采集时间">
          <template slot-scope="scope">
            {{scope.row.reptileTs | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作信息">
          <template slot-scope="scope">
            <div>{{scope.row.operatorName}}</div>
            <div>{{scope.row.updatedTs | dateFormat}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="toCollectionResult($event, scope.row)">移出回收站</el-button>
            <el-button type="text" @click="del($event, scope.row)" style="color: red;">删除</el-button>
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
    <div v-if="activeName == '2'">
      <div class="block">
        <el-form ref="query" :inline="true" label-position="right" :model="query">
          <el-form-item label="创建人：">
            <el-input v-model="query.operator" placeholder="关键词"></el-input>
          </el-form-item>
          <el-form-item label="网站名称：">
            <el-select v-model="query.websiteId">
              <el-option v-for="channel in websites" :label="channel.name" :value="channel.id" :key="channel.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采集状态：">
            <el-select v-model="query.collectStatus">
              <el-option label="全部" value=""></el-option>
              <el-option label="未采集" value="0"></el-option>
              <el-option label="采集" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="fetchData($event)">查询</el-button>
            <el-button type="primary" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row>
        <el-button type="primary" size="small" @click="showAddWebSite">新增网站</el-button>
        <span>抓取网站登记表，便于运营维护与技术查找</span>
      </el-row>
      <el-table id="out-table" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px">
        </el-table-column>
        <el-table-column label="采集网站名称">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column label="采集频道">
          <template slot-scope="scope">
            {{scope.row.chanel}}
          </template>
        </el-table-column>
        <el-table-column label="网站地址">
          <template slot-scope="scope">
            {{scope.row.url}}
          </template>
        </el-table-column>
        <el-table-column label="创建信息">
          <template slot-scope="scope">
            <div>{{scope.row.creator}}</div>
            <div>{{scope.row.createdTs | dateFormat}}</div>
          </template>
        </el-table-column>
        <el-table-column label="更新信息">
          <template slot-scope="scope">
            <div>{{scope.row.operator}}</div>
            <div>{{scope.row.updatedTs | dateFormat}}</div>
          </template>
        </el-table-column>
        <el-table-column label="采集状态">
          <template slot-scope="scope">
            {{scope.row.collectStatus === 0 ? '未采集' : '已采集'}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editWebSite($event, scope.row)">编辑</el-button>
            <el-button type="text" @click="delWebSite($event, scope.row)" style="color: red;">删除</el-button>
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
    <addWebSite ref="addWebSite"></addWebSite>
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
