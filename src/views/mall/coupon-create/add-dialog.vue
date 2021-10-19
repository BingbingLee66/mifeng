<template>
  <div class="create-dialog">
    <el-dialog title="可用劵商品" :visible.sync="createVisible" width="80%">
      <el-form ref="query" label-position="right" size="small" :inline="true" :model="query">
        <el-form-item label-width="80px" label="商品来源">
          <el-select v-model="query.ckey" placeholder="请选择商品来源" clearable filterable>
            <el-option v-for="chamber in chamberOptions" :key="chamber.value" :label="chamber.label" :value="chamber.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label-width="80px" label="商品ID">
          <el-input v-model="query.goodId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label-width="80px" label="商品名称">
          <el-input v-model="query.goodsName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label-width="80px" label="商品状态">
          <el-select v-model="query.status" placeholder="请选择状态">
            <el-option label="所有" :value="-1"/>
            <el-option label="在售中" :value="1"/>
            <el-option label="已下架" :value="6"/>
            <el-option label="商会下架" :value="2"/>
            <el-option label="已售罄" :value="5"/>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="fetchData">查询
          </el-button>
        </el-form-item>
      </el-form>
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
        <el-button @click="add" type="primary">添加</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="previewImgVisible" width="50%">
      <img :src="previewUrl" style="width: 100%; padding:20px;"/>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/mall/mall'
import { getChamberOptions } from '@/api/finance/finance'

export default {
  props: {
    /* createVisible: {
      type: Boolean,
      required: true,
    }, */
  },
  data() {
    return {
      // 选择可用商品劵
      query: {
        ckey: '',
        goodId: '',
        goodsName: '',
        status: -1,
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
  created() {
    this.getChamberList()
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
    // 添加
    handleSelectionChange(value) {
      // 清除两个数组中相同的元素
      // let tempList = [...this.selectionDatas, ...value]
      // this.selectionDatas = this.filterArrById(tempList)
      // console.log(this.selectionDatas)
      this.selectionDatas = value
    },
    add() {
      if (this.selectionDatas.length === 0) {
        return this.$message.error('请选择商品！')
      }
      this.$confirm('确认添加所选商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let selectedItem = window.localStorage.getItem('selected-item')
        if (selectedItem) {
          selectedItem = JSON.parse(selectedItem)
        }
        let setSelectedItem = [...this.selectionDatas, ...selectedItem]
        window.localStorage.setItem(
          'selected-item',
          JSON.stringify(setSelectedItem)
        )
        this.$emit('localChange', {
          data: setSelectedItem,
          type: 'add',
        })
        let _this = this
        let finalList = _this.list.filter((item) => {
          let arrList = _this.selectionDatas.map((item2) => item2.id)
          return !arrList.includes(item.id)
        })
        this.list = finalList
        this.listLoading = false
        this.$message.success('添加成功')
        this.createVisible = false
      }).catch(() => {
      })
    },
    fetchData(e) {
      if (e === 'reset') {
        this.query.goodsName = ''
        this.query.goodId = ''
        this.query.status = ''
        this.query.ckey = ''
      }
      this.listLoading = true
      let params = {
        page: 1,
        pageSize: 100,
        goodsName: this.query.goodsName,
        goodId: this.query.goodId,
        status: this.query.status,
        ckey: this.query.ckey,
      }
      getList(params).then((res) => {
        let localList = window.localStorage.getItem('selected-item')
        if (localList) {
          localList = JSON.parse(localList)
          let finalList = res.data.data.list.filter((item) => {
            let arrList = localList.map((item2) => item2.id)
            return !arrList.includes(item.id)
          })
          this.list = finalList
          this.listLoading = false
        } else {
          this.list = res.data.data.list
          this.listLoading = false
        }
      })
    },
    getChamberList() {
      getChamberOptions().then((res) => {
        if (res.state === 1) {
          this.chamberOptions = res.data.data
          this.chamberOptions.unshift({ label: '全部', value: '' })
        }
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

