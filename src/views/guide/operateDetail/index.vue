<template>
 <div class="app-container">
    <div class="block">
        <el-form ref="query" :inline="true" label-position="right" :model="query">
            <el-row>
                <el-form-item label="标题：">
                    <el-input v-model="query.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="ID：">
                    <el-input v-model="query.id" placeholder="请输入ID" />
                </el-form-item>
                <el-form-item :span="12" label="一级菜单：" >
                    <el-select v-model="query.menu1Id" placeholder="请选择">
                        <el-option
                        v-for="(item, index) in menu1List"
                        :key="index"
                        :label="item.menuName"
                        :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :span="12" label="二级菜单：">
                    <el-select v-model="query.menu2Id" placeholder="请选择">
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
                    <el-input v-model="query.creator" placeholder="请输入创建人" />
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
                <el-button type="primary" @click="queryData($event)">查询</el-button>
                <el-button type="info">重置</el-button>
            </el-row>        
            <el-row>
                <el-button   type="danger" >创建操作指引</el-button>
                <el-button   type="primary">导出浏览记录</el-button>
            </el-row>  
        </el-form>
        <!-- 表格 -->
        <div>
            <el-table
             id="out-table"
             v-loading="listLoading"
             :data="list"
             element-loading-text="Loading"
             border
             fit
             highlight-current-row
             @selection-change="handleSelectionChange"
            >
                <el-table-column align="center" type="selection" width="55px" />
                <el-table-column align="center" prop="id" width="80px" label="ID"  />
                <el-table-column align="center" label="标题">
                    <template slot-scope="scope" width="180px">
                        <div>   
                            {{ !scope.row.title ? "--" : scope.row.title }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="menu1Name" width="120px" label="一级菜单"  />
                <el-table-column align="center" prop="menu2Name" width="120px" label="二级菜单"  />
                <el-table-column align="center" label="权重" width="80px">
                    <template slot-scope="scope">
                        <div @click="onweight(scope.row)" style="color: #409EFF;cursor: pointer;">
                            {{ scope.row.sort }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="浏览人数" width="80px">
                    <template slot-scope="scope">
                        <div @click="onvisit(scope.row)" style="color: #409EFF;cursor: pointer;">
                            {{ scope.row.visitorNum }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="浏览次数" width="80px">
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row.visitCount }}
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
                        <div v-if="scope.row.state == 0">冻结</div>
                        <div v-if="scope.row.state == 1">发布</div>
                        <div v-if="scope.row.state == 2">删除</div>
                        <div v-if="scope.row.state == 3">平台冻结</div>
                        <div v-if="scope.row.state == 4">
                            <div>定时发布</div>
                            <div>{{ scope.row.publishTs }}</div>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建信息" width="180px">
                    <template slot-scope="scope">
                        <div>
                            <div> {{ scope.row.creator }} </div>
                            <div> {{ scope.row.createdTs }} </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="更新信息" width="180px">
                    <template slot-scope="scope">
                        <div>
                            <div> {{ scope.row.modifier }} </div>
                            <div> {{ scope.row.updatedTs }} </div>
                        </div>
                    </template>
                </el-table-column>  
                <el-table-column  label="操作" width="120px" fixed="right">          
                    <div style="display: inline-block">
                        <el-button type="text">
                            详情
                        </el-button>
                        <el-button type="text">
                            编辑
                        </el-button>
                    </div>
                    <div style="display: inline-block">
                        <el-button type="text" @click="onFreeze">
                            冻结
                        </el-button>
                        <el-button type="text" @click="onUnfreeze">
                            解冻
                        </el-button>
                         <el-button type="text" @click="onDelete">
                            删除
                        </el-button>
                    </div>
                       
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
        <el-dialog title="权重"  width="30%" :close-on-click-modal="false" :visible.sync="isweight">
            <el-form  label-width="70px">
                <el-form-item label="权重 :"  :rules="[ { required: true }]" >
                    <el-col :span="8">
                        <el-input oninput="value=value.replace(/^\.+|[^\d.]/g,'')"  maxlength="3"  width="30%"  v-model="eightNum" ></el-input>
                    </el-col>
                </el-form-item>
                <div class="dialog-weight">权重请控制在0-999，权重为0不在商会后台显示,权重越大，在商会后台列表排序就越靠前</div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isweight = false">取 消</el-button>
                <el-button :disabled="eightNum == ''" type="primary">确 定</el-button>
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
                <el-table-column align="center" prop="visitCount" label="浏览次数"  />
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
</style>