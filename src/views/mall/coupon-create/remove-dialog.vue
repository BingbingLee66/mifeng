<template>
  <div class="create-dialog">
    <el-dialog title="可用劵商品" :visible.sync="createVisible" width="80%">
      <div class="table-block">
        <el-table height="62vh" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55px"/>
          <el-table-column label="商品ID/名称" width="200px">
            <template slot-scope="scope">
              <div class="red-label">{{ scope.row.id }}</div>
              <div> {{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="商品图片" width="120px">
            <template slot-scope="scope">
              <img class="goods-preview" :src="scope.row.descript" @click="openPreviewModal(scope.row.descript)">
            </template>
          </el-table-column>
          <el-table-column label="商品价格信息（元）" width="180px">
            <template slot-scope="scope">
              <div>【单买价】{{ scope.row.singlePriceMerge }}</div>
              <div>【拼单价】<span class="red-label">{{ scope.row.fightPriceMerge }}</span></div>
              <div>【供货价】{{ scope.row.supplyPriceMerge }}</div>
              <div>【立减优惠】{{ scope.row.discount }}</div>
            </template>
          </el-table-column>
          <el-table-column label="商品库存" width="100px">
            <template slot-scope="scope">
              {{ scope.row.sumStock }}
            </template>
          </el-table-column>
          <el-table-column label="销量" width="130px">
            <template slot-scope="scope">
              <div>【真实】 {{ scope.row.salesVolume }}</div>
              <div>【虚拟】 {{ scope.row.virtualSalesVolume }}</div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="100px">
            <template slot-scope="scope">
              {{ scope.row.createTime | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="开售时间" width="100px">
            <template slot-scope="scope">
              {{ scope.row.createTime | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="来源" width="200px">
            <template slot-scope="scope">
              {{ scope.row.chamberName }}
            </template>
          </el-table-column>
          <el-table-column label="状态" fixed="right">
            <template slot-scope="scope">
              <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock > 0">在售中</div>
              <div v-if="scope.row.isOnSale == 2 || scope.row.isOnSale == 4">商会下架</div>
              <div v-if="scope.row.isOnSale == 5">已下架</div>
              <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock == 0">已售罄</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="btn-block" style="text-align: center;margin-top: 20px">
        <el-button @click="remove" type="danger">移除</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="previewImgVisible" width="50%">
      <img :src="previewUrl" style="width: 100%; padding:20px;"/>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        ckey: '',
        goodsId: '',
        goodsName: '',
        status: '',
      },
      listLoading: false,
      list: [],
      chamberOptions: [],
      goodsIds: [],
      selectedItem: [],
      showCouponListType: '',
      selectionDatas: [],
      previewImgVisible: false,
      previewUrl: '',
      createVisible: false,
    }
  },
  methods: {
    // 工具类函数 数组对象中id相同的元素去重
    filterArrById(arr, initArr = []) {
      arr.forEach((item) => {
        let isFind = initArr.find((cell) => cell.id === item.id)
        if (!isFind) {
          initArr.push(item)
        }
      })
      return initArr
    },
    // 展示
    show() {
      this.createVisible = true
    },
    // 关闭
    close() {
      this.createVisible = false
    },
    fetchData() {
      this.list = JSON.parse(window.localStorage.getItem('selected-item'))
    },
    // 移除
    handleSelectionChange(value) {
      this.selectionDatas = value
    },
    remove() {
      if (this.selectionDatas.length === 0) {
        return this.$message.error('请选择商品！')
      }
      this.$confirm('确认移除所选商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let _this = this
        let finalList = _this.list.filter((item) => {
          let arrList = _this.selectionDatas.map((item2) => item2.id)
          return !arrList.includes(item.id)
        })
        this.list = finalList
        window.localStorage.setItem('selected-item', JSON.stringify(finalList))
        this.$emit('localChange', { data: finalList, type: 'remove' })
        this.$message.success('移除成功')
        this.createVisible = false
      }).catch(() => {
      })
    },
    openPreviewModal(url) {
      this.previewImgVisible = true
      this.previewUrl = url
    },
  },
}
</script>

<style lang="scss">
.create-dialog {
  .goods-preview {
    width: 90px;
    height: 70px;
    cursor: pointer;
    object-fit: cover;
  }

  .el-dialog {
    margin-top: 5vh !important;
    height: 90vh !important;
  }
}
</style>

