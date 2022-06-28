<template>
 <div class="app-container">
    <div class="block">
        <el-form ref="query" :inline="true"  label-position="right" :model="query">
            <el-row>
                <el-form-item  label="标题：">
                    <el-input clearable  v-model="query.title" placeholder="关键词" maxlength="60" />
                </el-form-item>
                <el-form-item label="ID：">
                    <el-input clearable v-model="query.id" placeholder="关键词" maxlength="15" />
                </el-form-item>
                <el-form-item :span="12" label="一级菜单：" >
                    <el-select   @change="onselectMenu" v-model="query.menu1Id" placeholder="请选择">
                        <el-option
                        v-for="(item, index) in menu1List"
                        :key="index"
                        :label="item.menuName"
                        :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :span="12" label="二级菜单：">
                    <el-select clearable  v-model="query.menu2Id" placeholder="请选择">
                        <el-option
                        v-for="(item, index) in menu2List"
                        :key="index"
                        :label="item.menuName"
                        :value="item.id"
                        />
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="创建人：">
                    <el-input clearable v-model="query.creator" placeholder="请输入创建人" />
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
                <el-button type="primary" @click="queryData">查询</el-button>
                <el-button type="info" @click="reset">重置</el-button>
            </el-row> 
            <el-row style="margin-bottom:20px;">
                <el-button  @click="add" type="danger" >创建操作指引</el-button>
                <el-button @click="exportExcel"  type="primary">导出浏览记录</el-button>
            </el-row>  
        </el-form>
        <!-- 表格 -->
        <div>
            <el-table
             id="out-table"
            ref="multipleTable"
             v-loading="listLoading"
             :data="list"
             element-loading-text="Loading"
             border
             fit
             highlight-current-row
             @selection-change="handleSelectionChange"
            >
                <el-table-column  align="center"  type="selection" width="55px" />
                <el-table-column align="center" prop="id" width="60px" label="ID"  />
                <el-table-column align="center" label="标题">
                    <template slot-scope="scope" width="200px">
                        <div class="tabl-tit">   
                            {{ !scope.row.title ? "--" : scope.row.title }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="menu1Name" width="120px" label="一级菜单"  />
                <el-table-column align="center" prop="menu2Name" width="120px" label="二级菜单"  />
                <el-table-column align="center" label="权重" width="70px">
                    <template slot-scope="scope">
                        <div @click="onweight(scope.row)" style="color: #409EFF;cursor: pointer;">
                            {{ scope.row.sort }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="浏览人数" width="80px">
                    <template slot-scope="scope">
                        <div v-if="scope.row.visitorNum"  @click="onvisit(scope.row)" style="color: #409EFF;cursor: pointer;">
                            {{ scope.row.visitorNum }}
                        </div>
                        <div v-else>--</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="浏览次数" width="80px">
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row.visitCount ? scope.row.visitCount : '--'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发布时间" width="180px">
                    <template slot-scope="scope">
                        <div v-if="scope.row.publishTs == ''">--</div>
                        <div v-else>{{ scope.row.publishTs }}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" width="180px">
                    <template slot-scope="scope">
                        <!-- 状态,0冻结,1发布,2删除,3平台冻结,4定时发布 -->
                        <div v-if="scope.row.status == 0">冻结</div>
                        <div v-if="scope.row.status == 1">发布</div>
                        <div v-if="scope.row.status == 2">删除</div>
                        <div v-if="scope.row.status == 3">平台冻结</div>
                        <div v-if="scope.row.status == 4">
                            <div>定时发布</div>
                            <div>{{ scope.row.publishTs }}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建信息" width="180px">
                    <template slot-scope="scope">
                        <div v-if=" scope.row.creator ||  scope.row.createdTs">
                            <div> {{ scope.row.creator }} </div>
                            <div> {{ scope.row.createdTs }} </div>
                        </div>
                        <div v-else>--</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="更新信息" width="180px">
                    <template slot-scope="scope">
                        <div v-if=" scope.row.modifier ||  scope.row.updatedTs">
                            <div> {{ scope.row.modifier }} </div>
                            <div> {{ scope.row.updatedTs }} </div>
                        </div>
                         <div v-else>--</div>
                    </template>
                </el-table-column>  
                <el-table-column align="center"   label="操作" width="120px" fixed="right">          
                    <template slot-scope="scope">
                        <div style="display: inline-block">
                            <el-button type="text" @click="detail(scope.row)">
                                详情
                            </el-button>
                            <el-button type="text" @click="edit(scope.row)">
                                编辑
                            </el-button>
                        </div>
                        <div style="display: inline-block">
                            <el-button v-if="scope.row.status == 1" type="text" @click="onFreeze(scope.row,0)">
                                冻结
                            </el-button>
                            <el-button v-if="scope.row.status == 0" type="text" @click="onUnfreeze(scope.row,1)">
                                解冻
                            </el-button>
                            <el-button type="text" @click="onDelete(scope.row,2)">
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>  
            </el-table>
            <el-pagination
             style="margin:20px 0;"
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

        <!-- 权重弹框 -->
        <el-dialog title="权重"  width="30%" :close-on-click-modal="false" :visible.sync="issort">
            <el-form  label-width="70px">
                <el-form-item label="权重 :"  :rules="[ { required: true }]" >
                    <el-col :span="8">
                        <el-input oninput="value=value.replace(/^\.+|[^\d.]/g,'')"  maxlength="3"  width="30%"  v-model="sortNum" ></el-input>
                    </el-col>
                </el-form-item>
                <div class="dialog-weight">权重请控制在0-999，权重为0不在商会后台显示,权重越大，在商会后台列表排序就越靠前</div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="onCancel">取 消</el-button>
                <el-button :disabled="sortNum == ''" type="primary" @click="ongetguideUpdate" >确 定</el-button>
            </div>
        </el-dialog>
        <!-- 浏览记录 -->
        <el-dialog title="浏览记录"  width="50%" :close-on-click-modal="false" :visible.sync="isVisit">
            <el-table
             v-loading="visitLoading"
             :data="visitList"
             element-loading-text="Loading"
             border
             fit
            >
                <el-table-column align="center" prop="account" label="账号"  />
                <el-table-column align="center" prop="userName" label="姓名"  />
                <el-table-column align="center" prop="roleName" label="角色"  />
                <el-table-column align="center" prop="chamberName" label="所属商会"  />
                <el-table-column align="center" prop="viewCount" label="浏览次数"  />
                <el-table-column align="center" prop="accessTs" label="最近浏览时间"  />
            </el-table>
            <el-pagination
                style="margin:20px 0;"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="pageSizes"
                :page-size="visitlimit"
                :total="visittotal"
                :current-page.sync="visitcurrentpage"
                @size-change="handleSizeChangevisit"
                @current-change="handleCurrentChangevisit"
            />
            <div slot="footer" class="dialog-footer">
                <el-button @click="isVisit = false" type="primary">我知道了</el-button>
            </div>
        </el-dialog>

        <!-- 详情 -->
        <div class="art-preview-wrap">
            <el-dialog title="" :visible.sync="visible" width="60%">
                <div class="m-preview-wrap">
                    <div class="m-preview-area">
                    <div class="m-article-title">{{ detailObj.title }}</div>
                    <videoComponent
                        ref="videoRef"
                        v-if="detailObj.vid"
                        :vid="detailObj.vid"
                        height="530px"
                        ></videoComponent>
                    <div class="m-article-content" v-html="detailObj.content" />
                    </div>
                </div>
            </el-dialog>
      </div>

    </div>
 </div>
</template>

<script src="./operateDetail.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
.dialog-footer{
    text-align: center;
}
.dialog-weight{
    color: #F56C6C;
    margin-left: 13%;
    width: 56%;
    margin-top: -13px;
}
.tabl-tit{
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 这里是超出几行省略 */
    overflow: hidden;
}
.m-preview-wrap {
  width: 100%;
  height: 80vh;
}
.m-preview-area img {
  width: 100% !important;
  height: auto !important;
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
}
.el-input {
  width: 270px;
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
</style>

