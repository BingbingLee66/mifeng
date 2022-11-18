<template>
  <div class="app-container">
    <tabulation ref="tabulation" :type="1" />
    <div class="chamber-statistics">
      <h3>商会后台使用统计</h3>
      <div class="text-btn-style" @click="showMeaning = true">数据定义</div>
    </div>
    <div>
      <div>
        签约状态：
        <el-select
          v-model="query.signStatus"
          style="width: 160px; margin-right: 10px"
          placeholder="请选择"
          @change="fetchData"
        >
          <el-option label="已签约" value="1" />
          <el-option label="邀请码注册未签约" value="2" />
        </el-select>
        <el-select
          v-model="query.ckey"
          style="width: 300px; margin-right: 20px"
          placeholder="数据维度"
          filterable
          @change="change"
        >
          <el-option v-for="item in chamberList" :key="item.id" :label="item.name" :value="item.ckey" />
        </el-select>

        <el-radio-group v-model="days" style="margin-right: 20px" @change="initDatePicker">
          <el-radio-button :label="7">7天</el-radio-button>
          <el-radio-button :label="14">14天</el-radio-button>
          <el-radio-button :label="30">30天</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="query.date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          :clearable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="fetchData"
        />
      </div>
      <div style="margin: 10px 0px">
        <el-button type="primary" :loading="exportLoaing" @click="AllExportExcel">全部导出</el-button>
        <el-button type="primary" @click="exportExcel">导表</el-button>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55px" />
      <el-table-column align="center" label="商协会名称" width="230px">
        <template slot-scope="scope">
          {{ scope.row.chamberName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="签约状态" width="230px">
        <template slot-scope="scope">
          {{ scope.row.signStatusStr }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录次数">
        <template slot-scope="scope">
          {{ scope.row.loginSum }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <div @click="onPopup(9)">首页更新</div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.homePageUpdateSum }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <div @click="onPopup(10)">供需管理</div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.demandSum }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <div @click="onPopup(11)">会员管理</div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.memberSum }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <div @click="onPopup(12)">组织架构</div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.organizationSum }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <div @click="onPopup(13)">内容管理</div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.contentSum }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <div @click="onPopup(14)">活动管理</div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.activitySum }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <div @click="onPopup(15)">数据统计</div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.dataSum }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <div @click="onPopup(16)">系统设置</div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.systemSum }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="120px">
        <template slot-scope="scope">
          <div style="margin: 0 auto">
            <el-button type="text" @click="onRecord(scope.row)">查看登录记录</el-button>
            <el-button type="text" @click="onDetails(scope.row)">查看详情</el-button>
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
      :style="{ 'padding-top': '15px' }"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog title="数据定义" :visible.sync="showMeaning" width="496px">
      <div class="meaning-wrap">
        <div class="meaning-item">
          <div class="tit">登录次数</div>
          <div class="sub">
            统计该商会后台总的登录次数<span style="color: #ff0000">（登录是指使用账号密码登录，次数+1）</span>
          </div>
        </div>
        <div class="meaning-item">
          <div class="tit">首页更新</div>
          <div class="sub">统计首页更新导航栏的点击、供需添加数量、轮播图添加数量的总和</div>
        </div>
        <div class="meaning-item">
          <div class="tit">供需管理</div>
          <div class="sub">统计供需管理的导航点击、发布供需数量的总和</div>
        </div>
        <div class="meaning-item">
          <div class="tit">会员管理</div>
          <div class="sub">
            统计会员管理的导航点击、添加会员数量、发送短信数量、入会审核数量、会员修改资料审核数量、职位设置数量、添加缴费记录数量、发送缴费通知数量的总和。
          </div>
        </div>
        <div class="meaning-item">
          <div class="tit">组织架构</div>
          <div class="sub">统计组织架构的导航点击、添加部门数量、添加成员数量、调整部门次数的总和</div>
        </div>
        <div class="meaning-item">
          <div class="tit">内容管理</div>
          <div class="sub">统计内容管理的导航点击、添加栏目数量、创建文章数量的总和</div>
        </div>
        <div class="meaning-item">
          <div class="tit">活动管理</div>
          <div class="sub">统计活动管理的导航点击、创建活动次数、发布活动次数、报名审核次数的总和</div>
        </div>
        <div class="meaning-item">
          <div class="tit">数据统计</div>
          <div class="sub">统计数据统计的导航点击总和</div>
        </div>
        <div class="meaning-item">
          <div class="tit">系统设置</div>
          <div class="sub">统计入会二维码的导航点击和保存图片次数的总和</div>
        </div>
      </div>
      <div style="text-align: center">
        <el-button type="primary" @click="showMeaning = false">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./chamberStats.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
</style>
<style>
.chamber-statistics {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
