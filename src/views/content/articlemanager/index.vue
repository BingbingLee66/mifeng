<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="文章" name="1" />
      <el-tab-pane label="会员分享" name="2" />
      <el-tab-pane label="企业动态" name="3" />
    </el-tabs>
    <div class="block">
      <el-form ref="query" label-width="auto" :model="query">
        <el-row>
          <el-col :span="6">
            <el-form-item label="文章标题：">
              <el-input v-model="query.title" placeholder="请输入文章标题" />
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="4">
            <el-form-item label="文章状态：">
              <el-select v-model="query.status">
                <el-option label="已发布" :value="1" />
                <el-option label="已冻结(商会)" :value="0" />
                <el-option label="已冻结(平台)" :value="3" />
                <el-option label="审核不通过" :value="5" />
                <el-option label="定时发布" :value="4" />
                <el-option label="所有" :value="-1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="4">
            <el-form-item :span="10" label="来源商会：">
              <el-select
                v-model="query.ckey"
                filterable
                @change="selectionChange"
              >
                <el-option
                  v-for="cc in chamberOptions"
                  :key="cc.value"
                  :label="cc.label"
                  :value="cc.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="activeName !== '1'" :offset="1" :span="4">
            <el-form-item label="动态类型：">
              <el-select v-model="query.dynamicType">
                <el-option
                  v-for="item in dynamicTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col
            v-if="query.ckey && activeName == 1"
            :span="4"
            style="margin-left: 10px"
          >
            <el-form-item :span="10" label="栏目：">
              <el-select v-model="query.contentColumnId" filterable>
                <el-option
                  v-for="cc in contentColumnOptions"
                  :key="cc.value"
                  :label="
                    cc.label === '全部' || cc.typeUrl === 0
                      ? cc.label
                      : optionList[cc.typeUrl - 1] + '-' + cc.label
                  "
                  :value="cc.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div v-if="activeName == '2'">
            <el-col :span="4">
              <el-form-item label="是否是后台发布：">
                <el-select v-model="query.backgroundRelease">
                  <el-option
                    v-for="item in backstageList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="来源">
                <el-select v-model="query.backgroundRelease">
                  <el-option
                    v-for="item in backstageList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </div>

          <el-col :span="4">
            <el-form-item label="发布时间：">
              <el-select v-model="query.publishTimeType">
                <el-option label="所有" :value="0" />
                <el-option label="24小时内" :value="1" />
                <el-option label="3天内" :value="2" />
                <el-option label="7天内" :value="3" />
                <el-option label="一个月内" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item label=" ">
              <el-button
                v-if="has('', '查询')"
                type="primary"
                :actionid="getId('', '查询')"
                @click="queryData($event)"
              >查询
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <br>
    <el-row>
      <el-button
        v-if="has('', '删除')"
        type="danger"
        :actionid="getId('', '删除')"
        @click="batchDelArticle($event)"
      >删除
      </el-button>
      <el-button
        v-if="has('', '冻结') && activeName == '1'"
        type="danger"
        :actionid="getId('', '冻结')"
        @click="batchUpdateStatus($event)"
      >冻结
      </el-button>
      <el-button
        v-if="has('', '置顶管理') && activeName == '1'"
        type="primary"
        :actionid="getId('', '置顶管理')"
        @click="goSettop($event)"
      >置顶管理
      </el-button>
    </el-row>
    <div v-if="activeName == '1'">
      <el-table
        id="out-table"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="55px" />
        <el-table-column label="文章ID" width="80px">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="文章标题">
          <template slot-scope="scope">
            {{ !scope.row.title ? "--" : scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="来源商会" width="120px">
          <template slot-scope="scope">
            {{ scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="栏目" width="120px">
          <template slot-scope="scope">
            {{ scope.row.contentColumn }}
          </template>
        </el-table-column>
        <el-table-column
          label="浏览量"
          width="120px"
          prop="readCount"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ scope.row.readCount ? scope.row.readCount : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          label="点赞量"
          width="120px"
          prop="commentLikeNums"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ scope.row.commentLikeNums ? scope.row.commentLikeNums : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          label="评论量"
          width="120px"
          prop="commentNums"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ scope.row.commentNums ? scope.row.commentNums : "--" }}
          </template>
        </el-table-column>
        <el-table-column label="关联词条" width="120px" prop="commentNums">
          <template slot-scope="scope">
            <el-button type="text" @click="editEntryHandler(scope.row)">
              {{ scope.row.existEntry ? '修改词条' : '添加词条' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="来源" width="180px">
          <template slot-scope="scope">
            <div v-if="scope.row.publishType == 1">--</div>
            <div v-if="scope.row.publishType == 5">
              {{ scope.row.companyName }}
            </div>
            <div
              v-if="
                scope.row.publishType == 3 ||
                  scope.row.publishType == 4 ||
                  scope.row.publishType == 6 ||
                  scope.row.publishType == 7 ||
                  scope.row.publishType == 2
              "
            >
              {{ scope.row.sourceName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="180px">
          <template slot-scope="scope">
            <div v-if="scope.row.status != 1">--</div>
            <div v-else>{{ scope.row.publishTs }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="200px">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">已冻结(商会)</div>
            <div v-if="scope.row.status == 1">已发布</div>
            <div v-if="scope.row.status == 3">已冻结(平台)</div>
            <div v-if="scope.row.status == 4">
              定时发布
              <div>{{ scope.row.publishTs }}</div>
            </div>
            <div v-if="scope.row.status == 5">审核不通过</div>
          </template>
        </el-table-column>
        <el-table-column label="是否置顶" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.istop ">是</div>
            <div v-else>否</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px" fixed="right">
          <template slot-scope="scope">
            <div style="display: inline-block">
              <el-button
                v-if="!!scope.row.title && has('', '置顶')"
                type="text"
                :disabled="scope.row.istop"
                :actionid="getId('', '置顶')"
                @click="top($event, scope.row)"
              >
                置顶
              </el-button>

              <el-button
                v-if="has('', '详情')"
                type="text"
                :actionid="getId('', '详情')"
                @click="detail($event, scope.row)"
              >
                详情
              </el-button>
            </div>
            <div style="display: inline-block">
              <el-button
                v-if="has('', '编辑')"
                type="text"
                :disabled="
                  scope.row.publishType === 1 || scope.row.publishType === 2
                    ? true
                    : false
                "
                :actionid="getId('', '编辑')"
                @click="edit(scope.row)"
              >
                编辑
              </el-button>

              <el-button
                v-if="has('', '冻结') && scope.row.status == 1"
                type="text"
                :actionid="getId('', '冻结')"
                @click="updateStatus($event, scope.row)"
              >
                冻结
              </el-button>
              <el-button
                v-if="has('', '解冻') && scope.row.status == 0"
                type="text"
                disabled
              >
                解冻
              </el-button>
              <el-button
                v-if="has('', '解冻') && scope.row.status == 3"
                type="text"
                :actionid="getId('', '解冻')"
                @click="updateStatus($event, scope.row)"
              >
                解冻
              </el-button>
            </div>
            <div style="display: inline-block">
              <el-button
                v-if="has('', '删除')"
                type="text"
                :actionid="getId('', '删除')"
                @click="delArticle($event, scope.row)"
              >
                删除
              </el-button>
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
      <div class="art-preview-wrap">
        <el-dialog title="" :visible.sync="visible" width="60%">
          <div class="m-preview-wrap">
            <div
              v-if="detailObj.auditStatus === 2 || detailObj.auditStatus === 3"
              class="m-article-remark"
            >
              不通过理由：{{ detailObj.auditRemark }}
            </div>
            <div class="m-preview-area">
              <div class="m-article-title">{{ detailObj.title }}</div>
              <videoComponent
                v-if="detailObj.vid"
                ref="videoRef"
                :vid="detailObj.vid"
                height="530px"
              />
              <div class="m-article-content" v-html="detailObj.contentHtml" />
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
    <div v-if="activeName == '2'">
      <el-dialog
        title="冻结"
        :visible.sync="freezeVisible"
        width="25%"
        :before-close="freezeClose"
      >
        <el-checkbox-group v-model="freezeSelectedList">
          <el-checkbox
            v-for="item in freezeOperationList"
            :key="item.value"
            style="display: block; padding-top: 10px; margin-left: 10px"
            :label="item.value"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="freezeClose">取 消</el-button>
          <el-button type="primary" @click="commitFreeze">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="解冻"
        :visible.sync="unFreezeVisible"
        width="25%"
        :before-close="unFreezeClose"
      >
        <el-checkbox-group v-model="unFreezeSelectedList">
          <el-checkbox
            v-for="item in unFreezeOperationList"
            :key="item.value"
            style="display: block; padding-top: 10px; margin-left: 10px"
            :label="item.value"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="unFreezeClose">取 消</el-button>
          <el-button type="primary" @click="commitUnFreeze">确 定</el-button>
        </span>
      </el-dialog>
      <el-table
        id="out-table"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="55px" />
        <el-table-column label="文章ID" width="80px">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="来源商会" width="150px">
          <template slot-scope="scope">
            {{ scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="动态类型">
          <template slot-scope="scope">
            <span v-if="scope.row.contentType == 1"> 图文动态 </span>
            <span v-else-if="scope.row.contentType == 2"> 视频动态 </span>
            <span v-else> 其他 </span>
            <div v-if="scope.row.backgroundRelease == 1">(后台发布)</div>
          </template>
        </el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope">
            <span class="myspan" v-html="scope.row.contentHtml" />
          </template>
        </el-table-column>
        <el-table-column
          label="浏览量"
          width="120px"
          prop="readCount"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ scope.row.readCount ? scope.row.readCount : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          label="点赞量"
          width="120px"
          prop="commentLikeNums"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ scope.row.commentLikeNums ? scope.row.commentLikeNums : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          label="评论量"
          width="120px"
          prop="commentNums"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ scope.row.commentNums ? scope.row.commentNums : "--" }}
          </template>
        </el-table-column>
        <el-table-column label="来源" width="180px">
          <template slot-scope="scope">
            <div v-if="scope.row.publishType == 1">--</div>
            <div v-if="scope.row.publishType == 5">
              {{ scope.row.companyName }}
            </div>
            <div
              v-if="
                scope.row.publishType == 3 ||
                  scope.row.publishType == 4 ||
                  scope.row.publishType == 6 ||
                  scope.row.publishType == 7 ||
                  scope.row.publishType == 2
              "
            >
              {{ scope.row.sourceName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="200px">
          <template slot-scope="scope">
            <div v-if="scope.row.status != 1">--</div>
            <div v-else>
              <div>{{ scope.row.publishTs }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="200px">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">已冻结(商会)</div>
            <div v-if="scope.row.status == 3 || scope.row.status == 1">
              <div
                v-if="
                  scope.row.statusNameVO.freezeList &&
                    scope.row.statusNameVO.freezeList.length > 0
                "
              >
                【已冻结（平台）】
                <span
                  v-for="(item, index) in scope.row.statusNameVO.freezeList"
                  :key="index"
                >
                  {{
                    index == scope.row.statusNameVO.freezeList.length - 1
                      ? item
                      : item + "、"
                  }}
                </span>
              </div>
              <div v-if="scope.row.statusNameVO.unFreezeList.length > 0">
                【已发布】
                <span
                  v-for="(item, index) in scope.row.statusNameVO.unFreezeList"
                  :key="index"
                >
                  {{
                    index == scope.row.statusNameVO.unFreezeList.length - 1
                      ? item
                      : item + "、"
                  }}
                </span>
              </div>
            </div>
            <div v-if="scope.row.status == 4">
              定时发布
              <div>{{ scope.row.publishTs }}</div>
            </div>
            <div v-if="scope.row.status == 4">
              定时发布
              <div>{{ scope.row.publishTs }}</div>
            </div>
            <div v-if="scope.row.status == 5">审核不通过</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="has('', '详情')"
              type="text"
              :actionid="getId('', '详情')"
              @click="detail($event, scope.row)"
            >
              详情
            </el-button>
            <el-button
              v-if="has('', '删除')"
              type="text"
              :actionid="getId('', '删除')"
              @click="delArticle($event, scope.row)"
            >
              删除
            </el-button>
            <br>
            <el-button
              v-if="has('', '冻结') && scope.row.isCanFreeze == 1"
              type="text"
              :actionid="getId('', '冻结')"
              @click="openFreeze(scope.row)"
            >
              冻结
            </el-button>
            <el-button
              v-if="has('', '解冻') && scope.row.isCanUnFreeze == 1"
              type="text"
              :actionid="getId('', '解冻')"
              @click="openUnFreeze(scope.row)"
            >
              解冻
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
      <div class="art-preview-wrap">
        <el-dialog
          title=""
          :visible.sync="visible"
          width="60%"
          @close="closeDia"
        >
          <div class="m-preview-wrap">
            <div
              v-if="detailObj.auditStatus === 2 || detailObj.auditStatus === 3"
              class="m-article-remark"
            >
              不通过理由：{{ detailObj.auditRemark }}
            </div>
            <div class="m-preview-area">
              <div class="m-article-title">{{ detailObj.title }}</div>
              <div v-if="detailObj.contentType === 2">
                <div
                  v-if="detailObj.contentHtml"
                  v-html="detailObj.contentHtml"
                />
                <videoComponent
                  v-if="detailObj.vid"
                  ref="videoRef"
                  :vid="detailObj.vid"
                  height="530px"
                />
              </div>
              <div
                v-else
                class="m-article-content"
                v-html="detailObj.contentHtml"
              />
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
    <div v-if="activeName == '3'">
      <el-table
        id="out-table"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="55px" />
        <el-table-column label="文章ID" width="80px">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="动态标题">
          <template slot-scope="scope">
            {{ !scope.row.title ? scope.row.contentColumn : scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="来源商会" width="200px">
          <template slot-scope="scope">
            {{ scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="动态类型">
          <template slot-scope="scope">
            <div v-if="scope.row.contentType == 1">图文动态</div>
            <div v-else-if="scope.row.contentType == 2">视频动态</div>
            <div v-else>其他</div>
            <div v-if="scope.row.backgroundRelease == 1">(后台发布)</div>
          </template>
        </el-table-column>
        <el-table-column
          label="浏览量"
          width="120px"
          prop="readCount"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ scope.row.readCount ? scope.row.readCount : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          label="点赞量"
          width="120px"
          prop="commentLikeNums"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ scope.row.commentLikeNums ? scope.row.commentLikeNums : "--" }}
          </template>
        </el-table-column>
        <el-table-column
          label="评论量"
          width="120px"
          prop="commentNums"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ scope.row.commentNums ? scope.row.commentNums : "--" }}
          </template>
        </el-table-column>
        <el-table-column label="来源" width="180px">
          <template slot-scope="scope">
            <div v-if="scope.row.publishType == 1">--</div>
            <div v-if="scope.row.publishType == 5">
              {{ scope.row.companyName }}
            </div>
            <div
              v-if="
                scope.row.publishType == 3 ||
                  scope.row.publishType == 4 ||
                  scope.row.publishType == 6 ||
                  scope.row.publishType == 7 ||
                  scope.row.publishType == 2
              "
            >
              {{ scope.row.sourceName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="180px">
          <template slot-scope="scope">
            <div v-if="scope.row.status != 1">--</div>
            <div v-else>{{ scope.row.publishTs }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">已冻结(商会)</div>
            <div v-if="scope.row.status == 1">已发布</div>
            <div v-if="scope.row.status == 3">已冻结(平台)</div>
            <div v-if="scope.row.status == 4">
              定时发布
              <div>{{ scope.row.publishTs }}</div>
            </div>
            <div v-if="scope.row.status == 5">审核不通过</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="270" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="has('', '详情')"
              type="text"
              :actionid="getId('', '详情')"
              @click="detail($event, scope.row)"
            >
              详情
            </el-button>
            <el-button
              v-if="has('', '冻结') && scope.row.status == 1"
              type="text"
              :actionid="getId('', '冻结')"
              @click="updateStatus($event, scope.row)"
            >
              冻结
            </el-button>
            <div>
              <el-button
                v-if="has('', '解冻') && scope.row.status == 0"
                type="text"
                disabled
              >
                解冻
              </el-button>
            </div>
            <div>
              <el-button
                v-if="has('', '解冻') && scope.row.status == 3"
                type="text"
                :actionid="getId('', '解冻')"
                @click="updateStatus($event, scope.row)"
              >
                解冻
              </el-button>
            </div>
            <div>
              <el-button
                v-if="has('', '删除')"
                type="text"
                :actionid="getId('', '删除')"
                @click="delArticle($event, scope.row)"
              >
                删除
              </el-button>
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
      <div class="art-preview-wrap">
        <el-dialog
          title=""
          :visible.sync="visible"
          width="60%"
          @close="closeDia"
        >
          <div class="m-preview-wrap">
            <div
              v-if="detailObj.auditStatus === 2 || detailObj.auditStatus === 3"
              class="m-article-remark"
            >
              不通过理由：{{ detailObj.auditRemark }}
            </div>
            <div class="m-preview-area">
              <div class="m-article-title">{{ detailObj.title }}</div>
              <div class="m-article-content" v-html="detailObj.contentHtml" />

              <videoComponent
                v-if="detailObj.vid"
                ref="videoRef"
                :vid="detailObj.vid"
                height="530px"
              />
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
    <entry-dialog
      :visible.sync="entryVisible"
      title="添加词条"
      :entry-info="entryInfo"
      @sure-handler="sureHandler"
    />
    <selection-dialog
      :visible.sync="selectionVisible"
      :entry-info="entryInfo"
      @sure-handler="sureHandler"
      @add-entry="addEntryHandler"
    />
  </div>
</template>

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
/deep/ .el-checkbox__label {
  width: 270px;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.m-preview-wrap {
  width: 100%;
  height: 80vh;
}

.m-preview-area {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0 auto;
  border: 1px solid #d9dde2;
  overflow-y: auto;
}

.m-article-remark {
  font-size: 19px;
  font-weight: 500;
  margin: 0px 20px;
}

.m-article-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin: 20px 40px 20px 40px;
}

.m-article-content {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.8;
  //margin: 20px;
}

::-webkit-scrollbar {
  width: 0px;
}

.m-preview-area img {
  width: 100% !important;
  height: auto !important;
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
.myspan {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.myspan img {
  width: 20%;
  height: 20%;
}
</style>

