<template>
  <div class="app-container">
     <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" :actionid="getId('', '创建推广信息')" v-if="has('', '创建推广信息')" @click.native="addSupplier($event)">创建推广信息</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="block-table">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column label="推广ID">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column label="关联渠道">
          <template slot-scope="scope">
            <div> {{ scope.row.id }}</div>
            <div> {{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="关联商品" width="250px">
          <template slot-scope="scope">
            <div class="red-label">{{ scope.row.id }}</div>
            <div> {{ scope.row.name }}</div>
            <el-button type="text" style="margin-left:0px;" @click="detail($event, scope.row)">查看商品详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" width="110px">
          <template slot-scope="scope">
            <img class="goods-preview" :src="scope.row.descript" @click="openPreviewModal(scope.row.descript)">
          </template>
        </el-table-column>
        <el-table-column label="来源商会" width="100px">
          <template slot-scope="scope">
            {{ scope.row.sumStock }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作人" width="300px">
          <template slot-scope="scope">
            {{ scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="has('', '生成渠道码')" type="text" :actionid="getId('', '生成渠道码')" @click="detail($event, scope.row)">
              生成渠道码
            </el-button>
            <el-button v-if="has('', '生产短链接')" type="text" :actionid="getId('', '生产短链接')" @click="detail($event, scope.row)">
              生产短链接
            </el-button>
            <el-button v-if="has('', '删除')" type="text" :actionid="getId('', '删除')" @click="detail($event, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <el-dialog
      title=""
      :visible.sync="previewImgVisible"
      width="50%"
    >
      <img :src="previewUrl" style="width: 100%; padding:20px;">
    </el-dialog>
  </div>
</template>

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
<style lang="scss">
.goods-preview {
  width: 90px;
  height: 90px;
  cursor: pointer;
  object-fit: cover;
}

.block-table .el-button {
  margin-left: 0;
  margin-right: 10px;
}

.red-label {
  color: #FF0000;
}
</style>
