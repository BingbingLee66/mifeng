<template>
  <div class="container">
    <el-tabs v-model="type" @tab-click="handleClick">
      <el-tab-pane label="发布记录" name="1" />
      <el-tab-pane label="授权账号" name="2" />
    </el-tabs>
    <el-button type="primary" @click="onBinding">授权</el-button>
    <el-button type="primary" @click="onRelieve">解除授权</el-button>
    <el-table
      :key="random"
      v-loading="listLoading"
      style="margin-top: 20px"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!--发布记录  -->
      <template v-if="type == 1">
        <el-table-column prop="ID" label="序号" align="center" />
        <el-table-column label="文章标题" align="center">
          <template slot-scope="scope">
            <div class="pre">{{ scope.row.content }}</div>
          </template>
        </el-table-column>
      </template>

      <!-- 授权账号 -->
      <template v-if="type == 2">
        <el-table-column prop="officialAccountName" label="授权的公众号" align="center" />
        <el-table-column label="公众号类型" align="center" width="100px">
          <template slot-scope="scope">
            {{ scope.row.officialAccountType == 1 ? '订阅号' :' 服务号' }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
        >
          <template slot="header">
            <span>状态</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="根据微信规定，每个订阅号，每天可发布一次，每次最多8篇文章；每个服务号，每月可发布4次，每次最多8篇文章."
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            {{ scope.row.authStatus == 1 ? '已授权' :' 未授权' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.authStatus == 2" @click="onBinding"> <el-link type="primary">授权</el-link></div>
            <div v-else @click="onRelieve"><el-link type="primary">解除授权</el-link></div>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="说明" align="center" />
      </template>
    </el-table>

    <el-pagination
      style="margin-top: 20px"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentpage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 绑定公众号协议组件 -->
    <agreement ref="agreements" @save="onSave" />
    <!-- 文章二维码 -->
    <el-dialog title="" :visible.sync="isShow" width="40%">
      <div class="box">
        <h3>已发布到云商会，扫码立即分享</h3>
        <el-image
          style="width: 250px; height: 250px"
          :src="qrCode[0]"
          :preview-src-list="qrCode"
          @click.stop="handleClickitem"
        />
      </div>
      <div class="btn">
        <el-button type="primary" @click="isShow=false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import agreement from './component/agreement'
import { officialAccountList, officialAccountUrl } from '@/api/content/officialAccount'
export default {
  components: {
    agreement
  },
  data() {
    return {
      type: '1', // 1:发布记录  2：授权账号
      link: '', // 外部公众号跳转链接
      listLoading: false,
      random: 1, // 动态改变table视图
      list: [],
      currentpage: 1,
      limit: 10,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      isShow: false, // 文章二维码
      qrCode: ['https://ysh-cdn.kaidicloud.com/ysh-test3/qrcode/e7d40535-8457-44f9-a73c-fbb9c3e9c6a8.jpg'], // 文章二维码
    }
  },
  created() {
    this.type = this.$route.query.type || '1'
    this.externalLinks()
    this.fetchData()
    this.isShow = true
  },

  methods: {
    // 头部切换栏
    handleClick(e) {
      this.type = e.name
      this.limit = 10
      this.currentpage = 1
      this.list = []
      this.fetchData(true)
    },
    // 公众号外部链接
    async externalLinks() {
      const parmas = {
        deviceType: 0, // 设备类型：0-PC, 1-H5
        platformType: 0, // 平台类型： 0-微信公众号
      }
      console.log(11111111111, parmas)
      const res = await officialAccountUrl(parmas)
      console.log('res', res)
    },
    // 获取表格接口接口
    async fetchData(reset) {
      if (this.type === '1') return
      //   1:发布记录  2：授权账号
      if (reset) this.currentpage = 1
      const APi = this.type === '1' ? null : officialAccountList
      this.listLoading = true
      const parmas = {
        pageSize: this.limit,
        page: this.currentpage,
      }
      console.log('APi', APi, this.type)
      const res = await APi(parmas)
      this.listLoading = false
      this.list = res.data.list || []
      this.total = res.data.totalRows || 0
      this.random = Math.random()
    },
    // 点击授权
    onBinding() {
      this.$refs.agreements.open()
    },
    // 确定授权
    onSave() {
      console.log(1111111111)
      window.location.href = 'https://www.cnblogs.com/zhaostudy/p/16714020.html'
    },

    // 解除授权
    onRelieve() {
      this.$confirm('是否确定解除授权该公众号？解绑之后无法进行将文章发布到公众号。', '提示', {
        confirmButtonText: '点错了，保持授权',
        cancelButtonText: '确定解除授权',
      }).then(() => {

      }).catch(() => {
        console.log(111111111)
      })
    },

    handleSizeChange(val) {
      this.limit = val
      this.fetchData(true)
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    },
    // 关闭二维码蒙层
    handleClickitem() {
      this.$nextTick(() => {
        const domlmageMask = document.querySelector('.el-image-viewer__mask')
        if (!domlmageMask) return
        domlmageMask.addEventListener('click', () => {
          document.querySelector('.el-image-viewer__close').click()
        })
      })
    }

  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../../styles/common.scss";
.btn{
  width: 100%;
  text-align: center;
  margin: 50px 0 20px 0;
}
.box{
  width: 100%;
  text-align: center;

}
</style>
