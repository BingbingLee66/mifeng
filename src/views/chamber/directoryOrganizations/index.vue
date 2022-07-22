<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="left" :model="query" :inline="true">
        <el-form-item label="社会组织名称：" prop="name">
          <el-input v-model="query.name" placeholder="请输入社会组织名称" />
        </el-form-item>
        <el-form-item :span="12" label="入驻来源：" prop="settledSource">
          <el-select v-model="query.settledSource" placeholder="请选择入驻来源">
            <el-option label="全部" value="" />
            <el-option v-for="item in inSource" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="入驻状态：">
          <el-select v-model="query.auditStatus" placeholder="请选择入驻状态" filterable>
            <el-option label="全部" value="" />
            <el-option v-for="state in inState" :key="state.value" :label="state.label" :value="state.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据来源：">
          <el-select v-model="query.dataSource" placeholder="请选择数据来源" filterable>
            <el-option label="全部" value="" />
            <el-option v-for="data in dataSource" :key="data.value" :label="data.label" :value="data.value" />
          </el-select>
        </el-form-item>
        <el-form-item :span="12" label="地区：">
          <el-cascader
            v-model="query.cities"
            :options="regionData"
            separator="-"
            collapse-tags
            clearable
            :props="{ expandTrigger: 'hover', value: 'code', label: 'name' }"
          />
        </el-form-item>
        <el-form-item label="组织状态：">
          <el-select v-model="query.status" placeholder="请选择组织状态" filterable>
            <el-option label="全部" value="" />
            <el-option
              v-for="organization in organizationState"
              :key="organization.value"
              :label="organization.label"
              :value="organization.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <!-- <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="init">查询
          </el-button> -->
          <el-button type="primary" :actionid="getId('', '查询')" @click="init">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom: 10px">
      <el-dropdown>
        <el-button type="primary">
          导入社会组织名单
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="upload">立即导入</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="downloadExcel">下载导入模板</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button @click="addOrganization">添加社会组织</el-button>
      <el-button @click="delConfirm">删除</el-button>
      <el-button @click="toClaim">认领入驻</el-button>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :selectable="checkSelectable" />
      <el-table-column label="社会组织名称" width="200px">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="统一社会信用代码" width="200px">
        <template slot-scope="{ row }">
          {{ row.socialCode }}
        </template>
      </el-table-column>
      <el-table-column label="地区" width="200px">
        <template slot-scope="{ row }">
          {{ row.province ? row.province + row.city : row.city }}
        </template>
      </el-table-column>
      <el-table-column label="展示权重" width="120px">
        <template slot-scope="{ row }">
          <span style="color: #409eff; cursor: pointer" @click="updateLevel(row)">{{
            row.level
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据来源" width="120px">
        <template slot-scope="{ row }">
          {{ row.dataSource === 1 ? '页面录入' : row.dataSource === 2 ? '导入' : '抓取' }}
        </template>
      </el-table-column>
      <el-table-column label="入驻状态" width="120px">
        <template slot-scope="{ row }">
          {{ row.auditStatus === 1 ? '已认证' : '待入驻' }}
        </template>
      </el-table-column>
      <el-table-column label="入驻来源" width="120px">
        <template slot-scope="{ row }">
          <span v-if="row.settledSource === 1">小程序</span>
          <span v-else-if="row.settledSource === 2">后台录入</span>
          <span v-else-if="row.settledSource === 3">小程序名录</span>
          <span v-else-if="row.settledSource === 4">app</span>
          <span v-else>APP名录</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" fixed="right">
        <template slot-scope="{ row }">
          <!-- <el-button v-if="has('', '详情')" type="text" :actionid="getId('', '详情')" @click="detail($event, row)">
            详情
          </el-button> -->
          <el-button type="text" :actionid="getId('', '详情')" @click="detail(row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="query.pageNum"
      :page-sizes="pageSizes"
      :page-size="query.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <weight ref="weight" @refresh="init" />
    <add-info ref="addInfo" @refresh="init" />
    <upload-list ref="uploadList" @refresh="init" />
    <organizations-detail ref="organDetail" @refresh="init" />
    <claim-in ref="claimIn" @refresh="init" />
  </div>

</template>

<script src="./directoryOrganizations.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
