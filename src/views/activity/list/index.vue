<template>
  <div class="app-container">
    <el-tabs v-model="type" @tab-click="handleClick">
      <el-tab-pane label="已发布" name="1"></el-tab-pane>
      <el-tab-pane label="未发布" name="0"></el-tab-pane>
    </el-tabs>
    <div style="margin:20px 0">
      <el-form ref="query" label-position="right" :inline="true" size="mini" :model="query">
        <el-form-item style="margin-right: 30px;" label="活动来源" v-if="!ckey">
          <el-select v-model="query.ckey" placeholder="请选择" clearable>
            <el-option v-for="chamber in chamberOptions" :key="chamber.ckey" :label="chamber.name" :value="chamber.ckey"/>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 30px;" label="活动ID">
          <el-input v-model="query.id" placeholder="请输入" maxlength="9" @input="handleInput" />
        </el-form-item>
        <el-form-item style="margin-right: 30px;" label="活动名称">
          <el-input v-model="query.activityName" placeholder="关键词"/>
        </el-form-item>
        <el-form-item label="活动状态" v-if="type!=='0'">
          <el-select v-model="query.status" placeholder="请选择状态">
            <el-option label="全部状态" :value="0"/>
            <el-option label="未开始" :value="1"/>
            <el-option label="进行中" :value="2"/>
            <el-option label="已结束" :value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="活动列表图" width="115px">
          <template slot-scope="scope">
            <img class="activity-img" :src="scope.row.listImage" @click="openPreviewModal(scope.row.listImage)">
          </template>
        </el-table-column>
        <el-table-column label="活动ID/名称" width="200px">
          <template slot-scope="scope">
            <div class="red-label">{{ scope.row.id }}</div>
            <div> {{ scope.row.activityName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="活动时间" width="100px">
          <template slot-scope="scope">
            <div>{{ scope.row.startTime | dateFormat }} ~</div>
            <div>{{ scope.row.endTime | dateFormat }}</div>
          </template>
        </el-table-column>
        <el-table-column label="活动地点" width="200px">
          <template slot-scope="scope">
            {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.addressInfo }}
          </template>
        </el-table-column>
        <el-table-column label="活动来源" width="100px" v-if="!ckey">
          <template slot-scope="scope">
            <span v-if="scope.row.chamberName === null">凯迪云商会</span>
            <span v-if="scope.row.chamberName !== null">{{ scope.row.chamberName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报名对象" width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.applyObject === 0">不限</span>
            <span v-if="scope.row.applyObject === 1 && scope.row.chamberName === null">限云商会成员</span>
            <span v-if="scope.row.applyObject === 1 && scope.row.chamberName !== null">限本商会成员</span>
          </template>
        </el-table-column>
        <el-table-column label="参加人数" width="100px">
          <template slot-scope="scope">
          <!-- {{ scope.row.isLimit ? '限' + scope.row.applyCount + '人' : '不限' }}-->
            <span v-if="scope.row.isLimit===0">不限</span>
            <span v-if="scope.row.isLimit===1">限{{scope.row.applyCount}}人 </span>
          </template>
        </el-table-column>
        <el-table-column label="发布状态" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.isPublish === 1">已发布</div>
            <div v-if="scope.row.isPublish === 0">未发布</div>
          </template>
        </el-table-column>
        <el-table-column label="活动状态" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.isPublish === 0">--</div>
            <div v-else>
              <div v-if="scope.row.status === 1">未开始</div>
              <div v-if="scope.row.status === 2">进行中</div>
              <div v-if="scope.row.status === 3">已结束</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="100px">
          <template slot-scope="scope">
            {{ scope.row.createdTs | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="创建人" width="100px">
          <template slot-scope="scope">
            {{ scope.row.operatorName }}
          </template>
        </el-table-column>
        <el-table-column label="权重" width="100px">
          <template slot-scope="scope">
            <span @click="showSort(scope.row)" class="blue-label"> {{
                scope.row.sort
              }} </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <div v-if="type==1">
              <div class="blue-label" @click="showUpdate(scope.row,0)">取消发布</div>
              <div class="blue-label" @click="editActivity(scope.row)">编辑</div>
            </div>
            <div v-else>
              <div class="blue-label" @click="showUpdate(scope.row,1)">发布</div>
              <div class="blue-label" @click="editActivity(scope.row)">编辑</div>
              <div class="blue-label" @click="showDel(scope.row)">删除</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <!-- 修改权重弹窗 -->
    <el-dialog title="权重" :visible.sync="showSortDialog" width="30%">
      <el-form :model="sortForm" ref="sortForm" label-width="100px" :rules="sortRules">
        <el-form-item label="权重" prop="sort">
          <el-input v-model="sortForm.sort" placeholder="请输入"></el-input>
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
      <div>{{ isPublish === 0 ? '确认取消发布吗？' : '确认发布吗？' }}</div>
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
      <img :src="previewUrl" style="width: 100%; padding:20px;" v-if="previewUrl.indexOf('.jpeg') != -1 || previewUrl.indexOf('.jpg') != -1 || previewUrl.indexOf('.png') != -1"/>
      <video :src="previewUrl" v-else style="width: 100%; padding:20px;" controls>
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
</style>

