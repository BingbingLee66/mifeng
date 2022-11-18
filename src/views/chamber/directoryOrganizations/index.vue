<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="150px" label-position="right" :model="query" :inline="true">
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
        <el-form-item label="签约状态：">
          <el-select v-model="query.signStatus" placeholder="请选择" filterable>
            <el-option label="未签约" value="0" />
            <el-option label="已签约" value="1" />
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
        <el-form-item label="信用状态">
          <el-select v-model="query.codestatus" placeholder="请选择组织状态" filterable>
            <el-option label="全部" value="-1" />
            <el-option v-for="code in codestatusOptions" :key="code.value" :label="code.label" :value="code.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="展示权重" prop="name">
          <el-input v-model.number="query.wight" placeholder="请输入0-999的数值" />
        </el-form-item>
        <el-form-item label="">
          <!-- <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="init">查询
          </el-button> -->
          <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="init">查询 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom: 10px">
      <el-dropdown>
        <el-button type="primary"> 导入社会组织名单 </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span v-if="has('', '导入社会组织')" class="search-fill" @click="upload">立即导入</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span class="search-fill" @click="downloadExcel">下载导入模板</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button v-if="has('', '添加社会组织')" @click="addOrganization">添加社会组织</el-button>
      <el-button v-if="has('', '删除社会组织')" @click="delConfirm">删除</el-button>
      <el-button v-if="has('', '认领入驻')" @click="toClaim">认领入驻</el-button>
      <el-button @click="setWeights">批量权重</el-button>
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
      <el-table-column label="社会组织名称" min-width="200px">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="统一社会信用代码" min-width="200px">
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
          <span style="color: #409eff; cursor: pointer" @click="updateLevel(row)">{{ row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据来源" width="120px">
        <template slot-scope="{ row }">
          <span>{{ dataSourceObj[row.dataSource] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入驻状态" width="120px">
        <template slot-scope="{ row }">
          {{ stateMap.get(row.auditStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="主要人员" width="120px">
        <template slot-scope="{ row }">
          {{ row.chamberPerson }}
        </template>
      </el-table-column>
      <el-table-column label="入驻来源" width="120px">
        <template slot-scope="{ row }">
          <span>{{ inSourceObj[row.settledSource] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组织状态" width="120px">
        <template slot-scope="{ row }">
          <span>{{
            row.status === 0
              ? '不可用'
              : row.status === 1
                ? '正常'
                : row.status === 2
                  ? '删除'
                  : row.status === 4
                    ? '注销'
                    : '撤销'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信用状态" width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.creditStatus === 0 ? '正常' : row.creditStatus === 1 ? '活动异常' : '严重违法失信' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" fixed="right">
        <template slot-scope="{ row }">
          <el-button v-if="has('', '详情')" type="text" :actionid="getId('', '详情')" @click="detail(row)">
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
    <levelDialog ref="levelDialog" width="30%" @levelCallback="subConfirm">
      <p style="color: #999; margin: 0 70px">权重值为0时，商会不在小程序端显示</p>
      <p style="color: #999; margin: 0 70px">权重值大的商会，在小程序那边的显示会靠前</p>
      <p style="color: #999; margin: 0 70px">权重值越大的商会，在小程序社会组织名录列表会越靠前</p>
    </levelDialog>
  </div>
</template>

<script src="./directoryOrganizations.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
.search-fill {
  display: inline-block;
  width: 100%;
}
</style>
