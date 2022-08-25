<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="150px" label-position="right" :model="query" :inline="true">
        <el-form-item v-if="!ckey" label="商协会名称：" prop="chamberName">
          <el-input v-model="query.chamberName" placeholder="请输入商协会名称" />
        </el-form-item>
        <el-form-item label="供应商企业名称：" prop="supplierCompanyName">
          <el-input v-model="query.supplierCompanyName" placeholder="请输入供应商企业名称" />
        </el-form-item>
        <el-form-item label="供应商手机号：" prop="supplierPhone">
          <el-input v-model="query.supplierPhone" placeholder="请输入供应商手机号" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdTime">
          <el-date-picker
            v-model="query.createdTime"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="search">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="action">
      <el-button type="primary" @click="downFile">导表</el-button>
      <span class="data-definition" @click="dataDefinition">数据定义</span>
    </div>
    <h3 v-if="!ckey">汇总</h3>
    <el-row type="flex">
      <el-card shadow="never" class="card">
        <p>销售额</p>
        <p class="card-value">{{ data.price || 0 }}</p>
      </el-card>
      <el-card shadow="never" class="card">
        <p>捐赠金额</p>
        <p class="card-value">{{ data.donationPrice || 0 }}</p>
      </el-card>
      <el-card shadow="never" class="card">
        <p>商品数量</p>
        <p class="card-value">{{ data.goodsCount || 0 }}</p>
      </el-card>
    </el-row>
    <h3>明细</h3>
    <el-table
      v-loading="loading"
      :data="dataSource"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column v-if="!ckey" label="商会名称" min-width="200px" prop="chamberName" />
      <el-table-column label="供应商企业名称" min-width="200px" prop="supplierCompanyName" />
      <el-table-column label="供应商手机号" width="200px" prop="supplierPhone" />
      <el-table-column label="在售商品数量" width="200px" prop="goodsCount" />
      <el-table-column label="销售额" width="200px" prop="price" />
      <el-table-column label="捐赠比例" width="200px" prop="donationRatio">
        <span slot-scope="{ row }">
          {{ row.donationRatio * 100 }}%
        </span>
      </el-table-column>
      <el-table-column label="捐赠金额(元)" width="200px" prop="donationPrice" />
    </el-table>
    <el-pagination
      :current-page="query.page"
      :page-sizes="pageSizes"
      :page-size="query.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog title="数据定义" :visible.sync="visible" width="55%">
      <p><span class="weight-bold">销售额：</span>选定时间内所属商会所属供应商，在优云平台售卖销售额</p>
      <p><span class="weight-bold">捐赠金额：</span>为所属商会所属供应商在平台售卖商品的销售额按一定比例捐赠给商会的金额(销售额*捐赠比例）</p>
      <p><span class="weight-bold">商品数量：</span>为所属商会所属供应商在优云平台所上架售卖的商品数量。</p>
    </el-dialog>
  </div>

</template>

<script>
import { getListInfo, exportFile, getChamberList } from '@/api/chamber/earningsFigures'
import { mapGetters } from 'vuex'
import { downloadFile } from '@/utils/index'
export default {
  data() {
    return {
      query: {
        chamberName: '',
        supplierCompanyName: '',
        supplierPhone: '',
        createdTime: '',
        page: 1,
        pageSize: 10
      },
      pageSizes: [10, 20, 50, 100, 500],
      visible: false,
      loading: false,
      dataSource: [],
      total: 0,
      // 汇总数据
      data: {
        price: 0,
        donationPrice: 0,
        donationRatio: 0,
        goodsCount: 0
      }
    }
  },
  computed: {
    ...mapGetters(['ckey'])
  },
  created() {
    this.fetchData(false)
  },
  methods: {
    fetchData(isPagination) {
      this.loading = true
      const { createdTime } = this.query
      const params = {
        ...this.query,
        startTime: createdTime && createdTime.length > 0 ? createdTime[0] : '',
        endTime: createdTime && createdTime.length > 0 ? createdTime[1] : '',
      }
      delete params.createdTime
      this.getList(params)
      if (!isPagination) this.getSummaryData(params)
    },
    // 汇总
    getSummaryData(params) {
      getChamberList(params).then(res => {
        this.data = res.data
      })
    },
    // 列表
    getList(params) {
      getListInfo(params).then(response => {
        this.dataSource = response.data.list
        this.total = response.data.totalRows
      }).finally(() => {
        this.loading = false
      })
    },
    search() {
      this.query.page = 1
      this.fetchData()
    },
    dataDefinition() {
      this.visible = true
    },
    handleSizeChange(val) {
      this.query.pageSize = val
      this.fetchData(true)
    },
    handleCurrentChange(val) {
      this.query.page = val
      this.fetchData(true)
    },
    downFile() {
      const { createdTime } = this.query
      const params = {
        ...this.query,
        startTime: createdTime && createdTime.length > 0 ? createdTime[0] : '',
        endTime: createdTime && createdTime.length > 0 ? createdTime[1] : '',
      }
      delete params.createdTime
      delete params.pageSize
      delete params.page
      exportFile(params).then((blob) => {
        downloadFile({
          title: `商会收益数据.xlsx`,
          url: window.URL.createObjectURL(blob)
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";

.action {
  display: flex;
  width: 100%;
  justify-content: space-between;

  .data-definition {
    cursor: pointer;
    color: #409EFF;
  }
}

.card {
  width: 280px;
  height: 120px;
  border: 1px solid #ccc;
  text-align: center;
  margin-top: 10px;

  .card-value {
    margin-top: 10px;
    font-weight: 600;
  }

  &+& {
    margin-left: 20px;
  }
}
.el-pagination{
  text-align: center;
  margin-top: 20px;
}
.weight-bold {
  font-weight: bold;
}
</style>
