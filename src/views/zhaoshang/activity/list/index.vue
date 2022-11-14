<template>
  <div class="app-container">
    <!--    <el-tabs v-model="type" @tab-click="handleClick">-->
    <!--      <el-tab-pane label="已发布" name="1" />-->
    <!--      <el-tab-pane label="未发布" name="0" />-->
    <!--    </el-tabs>-->
    <div style="margin:20px 0">

      <el-form ref="query" label-position="right" :inline="true" size="mini" :model="query">
        <el-form-item style="margin-right: 30px;" label="活动名称">
          <el-input v-model="query.activityName" clearable placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item style="margin-right: 30px;" label="活动ID">
          <el-input v-model="query.activityId" clearable placeholder="请输入活动ID" maxlength="9" @input="handleInput" />
        </el-form-item>
        <!--         <el-form-item label="招商类型">
          <el-select v-model="query.investmentType" clearable placeholder="请选择阶段">
            <el-option v-for="item in getMapDict(stageMap)" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="活动状态">
          <el-select v-model="query.status" placeholder="请选择状态">
            <el-option label="全部" :value="0" />
            <el-option label="未开始" :value="1" />
            <el-option label="进行中" :value="2" />
            <el-option label="已结束" :value="3" />
            <el-option label="报名中" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 30px;" label="活动来源">
          <el-select v-model="query.invesKey" placeholder="请选择" clearable filterable>
            <el-option v-for="chamber in chamberOptions" :key="chamber.ckey" :label="chamber.name" :value="chamber.invesKey" />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="fetchData(true)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="goTo('create', null)">创建活动</el-button>
    </div>
    <div>
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column align="center" label="活动列表图" width="115px">
          <template slot-scope="scope">
            <img class="activity-img" :src="scope.row.headImage" @click="openPreviewModal(scope.row.headImage)">
          </template>
        </el-table-column>
        <el-table-column align="center" label="活动ID/名称" width="180px">
          <template slot-scope="scope">
            <div class="red-label">{{ scope.row.id }}</div>
            <div> {{ scope.row.activityName }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="活动来源" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.invesName === null">凯迪云商会</span>
            <span v-if="scope.row.invesName !== null">{{ scope.row.invesName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="活动类型" width="120px">
          <template slot-scope="scope">
            {{ scope.row.applyMode == 1 ? '线上活动' : scope.row.applyMode == 2 ? '线下活动' : '线上线下活动' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="招商类型" width="100px">
          <template slot-scope="scope">
            {{ stageMap.get(scope.row.investmentType) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="地区" width="100px">
          <template slot-scope="scope">
            {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型摘要" width="130px">
          <template slot-scope="scope">
            <div v-if="scope.row.labels.length > 0" class="tag-info">
              <span v-for="(item,index) in scope.row.labels" :key="index">
                {{ item.label }}
                <span v-if="scope.row.labels.length -1 != index">,</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="报名时间" width="200px">
          <template slot-scope="scope">
            <div v-if="scope.row.applyStartTime">
              <div>{{ scope.row.applyStartTime | dateFormat }} ~</div>
              <div>{{ scope.row.applyEndTime | dateFormat }}</div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="活动时间" width="200px">
          <template slot-scope="scope">
            <div>{{ scope.row.activityStartTime | dateFormat }} ~</div>
            <div>{{ scope.row.activityEndTime | dateFormat }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="活动地点" width="200px">
          <template slot-scope="scope">
            {{ scope.row.addressInfo }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="已报名人数" width="70px">
          <template slot-scope="scope">
            <span>{{ scope.row.registeredCount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="活动状态" width="100px">
          <template slot-scope="scope">
            <div>{{ scope.row.status == 0 ? '全部' : scope.row.status == 1 ? '未开始' : scope.row.status == 2 ? '进行中' : scope.row.status == 3 ? '已结束' : '报名中' }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人" width="100px">
          <template slot-scope="scope">
            {{ scope.row.operatorName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="权重" width="100px">
          <template slot-scope="scope">
            <span class="blue-label" @click="showSort(scope.row)"> {{
              scope.row.sort
            }} </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">

            <div
              v-if="scope.row.isPublish == 0"
              class="blue-label"
              @click="showUpdate(scope.row,1)"
            >
              上线
            </div>
            <div
              v-if="scope.row.isPublish == 1"
              class="blue-label"
              @click="showUpdate(scope.row,0)"
            >
              下线
            </div>

            <div v-if="scope.row.isPublish == 0">
              <div class="blue-label" @click="showDel(scope.row)">删除</div>
              <div class="blue-label" @click="editActivity(scope.row)">编辑</div>
            </div>

            <div v-if="scope.row.cardCount > 0" class="blue-label" @click="goTo('card', scope.row)">收到的名片</div>
            <div
              v-if="scope.row.status == 2 || scope.row.status == 4"
              class="blue-label"
              @click="goTo('verify', scope.row)"
            >
              报名审核
            </div>
            <div class="blue-label" @click="goTo('detail', scope.row)">详情</div>

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
        :style="{'padding-top': '15px'}"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 修改权重弹窗 -->
    <el-dialog title="权重" :visible.sync="showSortDialog" width="30%">
      <el-form ref="sortForm" :model="sortForm" label-width="100px" :rules="sortRules">
        <el-form-item label="权重" prop="sort">
          <el-input v-model="sortForm.sort" placeholder="请输入" />
          <div>权重请控制在0-999，权重为0不在前台展示</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateSort('sortForm')">提交</el-button>
          <el-button @click="showSortDialog=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 更新发布状态弹窗 -->
    <el-dialog title="提示" :visible.sync="showUpdateDialog" width="400px">
      <div>{{ isPublish === 0 ? '确认下线吗？' : '确认上线吗？' }}</div>
      <div slot="footer" style="text-align: center;">
        <el-button @click="showUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="upadteActivity">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 删除确认弹窗 -->
    <el-dialog title="提示" :visible.sync="showDelDialog" width="400px">
      <div>确认删除吗？</div>
      <div slot="footer" style="text-align: center;">
        <el-button @click="showDelDialog = false">取 消</el-button>
        <el-button type="primary" @click="delActivity">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="预览" :visible.sync="previewImgVisible" width="50%">
      <img v-if="previewUrl.indexOf('.jpeg') != -1 || previewUrl.indexOf('.jpg') != -1 || previewUrl.indexOf('.png') != -1" :src="previewUrl" style="width: 100%; padding:20px;">
      <video v-else :src="previewUrl" style="width: 100%; padding:20px;" controls>
        您的浏览器不支持 video 标签。
      </video>
    </el-dialog>
  </div>
</template>

<script src="./list.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";

.activity-img {
  width: 88px;
  height: 60px;
  object-fit: cover;
}
.tag-info{
	text-overflow: -o-ellipsis-lastline;
	overflow: hidden;				//溢出内容隐藏
	text-overflow: ellipsis;		//文本溢出部分用省略号表示
	display: -webkit-box;			//特别显示模式
	-webkit-line-clamp: 2;			//行数
	line-clamp: 2;
	-webkit-box-orient: vertical;	//盒子中内容竖直排列
  width: 100%;
}
</style>

