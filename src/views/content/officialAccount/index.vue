<template>
  <div class="container">
    <el-tabs v-model="type" @tab-click="handleClick">
      <el-tab-pane label="发布记录" name="1" />
      <el-tab-pane label="授权账号" name="2" />
    </el-tabs>
    <el-button v-if="type == 2 && list.length == 0" type="primary" @click="onBinding">授权公众号</el-button>
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
        <el-table-column prop="order" label="序号" align="center" width="55px" />
        <el-table-column label="文章标题" align="center">
          <template slot-scope="scope">
            <div class="pre">{{ scope.row.content }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发布平台" align="center" width="100px">
          <template slot-scope="scope">
            {{ scope.row.releasePlatform == 1 ? '微信公众号' :' --' }}
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="100px" align="center">
          <template slot-scope="scope">
            {{ scope.row.releaseTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100px" align="center">
          <template slot-scope="scope">
            {{ releaseStatusList[scope.row.releaseStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="备注" align="center" />
      </template>

      <!-- 授权账号 -->
      <template v-if="type == 2">
        <el-table-column prop="officialAccountName" label="授权的公众号" align="center" />
        <el-table-column align="center" width="150px">
          <template slot="header">
            <span>公众号类型</span>
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
            {{ scope.row.officialAccountType == 1 ? '订阅号' :' 服务号' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <div v-if="scope.row.authStatus == 2" @click="onBinding"> <el-link type="primary">授权</el-link></div>
            <div v-else @click="onRelieve(scope.row)"><el-link type="primary">解除授权</el-link></div>
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
import { officialAccountList, officialAccountUrl, getArticleSyncRecord, getArticleQRCode, officialAccountAuthInfo, officialAccountUnbind } from '@/api/content/officialAccount'
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
      releaseStatusList: ['', '发布成功', '发布失败', '发布中', '未发布'],
      auth_code: '', // 授权码
    }
  },
  created() {
    console.log('this.$route.query1111111111111', this.$route.query)
    // 授权处理完 调起查询授权信息
    if (this.$route.query.auth_code) {
      this.type = '2'
      this.auth_code = this.$route.query.auth_code
      this.onOfficialAccountAuthInfo()
    }

    if (this.$route.query.articleId) this.QRCode(this.$route.query.articleId)

    //  获取公众号短链
    this.externalLinks()
    this.fetchData(true)
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

      const res = await officialAccountUrl(parmas)
      this.link = res.data
    },

    // 如果创建完文章跳转过来显示二维码
    async QRCode(articleId) {
      const parmas = {
        articleId, // 文章ID
        ckey: this.$store.getters.ckey
      }
      this.qrCode = []
      const res = await getArticleQRCode(parmas)
      this.qrCode.push(res.data.qrCodeUrl)
      this.isShow = true
    },

    // 获取表格接口接口
    async fetchData(reset) {
      //   1:发布记录  2：授权账号
      if (reset) this.currentpage = 1
      const APi = this.type === '1' ? getArticleSyncRecord : officialAccountList
      this.listLoading = true
      const parmas = {
        pageSize: this.limit,
        page: this.currentpage,
        ckey: this.type === '1' ? this.$store.getters.ckey : ''
      }
      const res = await APi(parmas)

      this.listLoading = false
      this.list = res.data.list || []
      this.total = res.data.totalRows || 0
      this.random = Math.random()
    },
    // 查询授权信息
    async onOfficialAccountAuthInfo() {
      const parmas = {
        authCode: this.auth_code, // 文章ID
        platformType: 0
      }
      await officialAccountAuthInfo(parmas)
      this.fetchData(true)
    },
    // 点击授权
    onBinding() {
      this.$refs.agreements.open()
    },
    // 确定授权
    onSave() {
      window.location.href = this.link
    },

    // 解除授权
    onRelieve(row) {
      this.$confirm('是否确定解除授权该公众号？解绑之后无法进行将文章发布到公众号。', '提示', {
        confirmButtonText: '点错了，保持授权',
        cancelButtonText: '确定解除授权',
      }).then(() => {

      }).catch(async () => {
        const parmas = {
          id: row.id
        }
        const res = await officialAccountUnbind(parmas)
        if (res.state === 1) {
          this.$message({
            message: '解绑成功成功',
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
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
.pre{
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;  /* 超出部分省略号 */
  word-break: break-all;  /* break-all(允许在单词内换行。) */
  display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
  -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
  -webkit-line-clamp: 2; /* 显示的行数 */
}
</style>
