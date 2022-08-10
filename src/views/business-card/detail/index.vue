<template>
  <div class="card-detail-wrap">
    <div class="avatar">
      <img src="@/assets/img/avatar.gif" alt="">
    </div>
    <div class="card-detail-info">
      <div class="header">
        <div class="name">马化腾</div>
        <div class="company">深圳市腾讯科技有限公司</div>
        <div class="post">腾讯公司执行董事、董事会主席兼本公司首席执行官</div>
      </div>

      <div class="hr" />

      <div class="profile common">
        <div class="title">个人简介：</div>
        <div class="desc">1998年，创办腾讯计算机系统有限公司。</div>
        <div class="desc">2009年当选中国经济十年商业领袖。</div>
        <div class="desc">2010年，福布斯富豪排行榜第249位，大陆富豪第6位。</div>
        <div class="desc">2010年5月14日，“2010新财富500富人榜”，以336.2亿元资产排名第5位。</div>
        <div class="desc">2010年10月21日，“2010胡润IT富豪榜”以293亿资产，屈居第二。</div>
        <div class="desc">连续三年入选《巴伦周刊》评出的2011、2012、2013年度排名前30位的全球最佳CEO。</div>
      </div>

      <div class="hr" />

      <div class="chamber common">
        <div class="title">所在商/协会：</div>
        <div class="desc">广州商会 <el-tag size="mini">会长</el-tag></div>
        <div class="desc">广州商会 <el-tag size="mini">会长</el-tag></div>
        <div class="desc">广州商会 <el-tag size="mini">会长</el-tag></div>
        <div class="desc">广州商会 <el-tag size="mini">会长</el-tag></div>
      </div>

      <div class="hr" />

      <div class="identity common">
        <div class="title">身份：</div>
        <div class="identity-detail">
          <div class="title">深圳市腾讯科技有限公司</div>
          <div class="desc">腾讯公司执行董事、董事会主席兼本公司首席执行官</div>
        </div>
        <div class="identity-detail">
          <div class="title">深圳市腾讯科技有限公司</div>
          <div class="desc">腾讯公司执行董事、董事会主席兼本公司首席执行官</div>
        </div>
      </div>

      <div class="tag common">
        <div class="title">标签：</div>
        <div class="desc">计算机软，硬件设计，技术开发，货物及技术进出口，利用互联网经营游戏产品运营,</div>
        <div class="desc">计算机软，硬件设计，技术开发，货物及技术进出口，利用互联网经营游戏产品运营,</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessCardDetail',
  computed: {
    cardId() {
      return this.$route.params.cardId || ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // TODO 待完善
    }
  }
}
</script>

<style scoped lang="scss">
.card-detail-wrap {
  display: flex;
  padding: 20px;

  .avatar {
    width: 160px;
    height: 160px;

    img {
      width: 100%;
    }
  }

  .hr {
    height: 1px;
    background: #e6e6e6;
    width: 100%;
    margin: 20px 0;
  }

  .card-detail-info {
    padding: 20px;
    flex: 1;

    .header {
      .name {
        font-size: 30px;
      }

      .company {
        margin-top: 4px;
        font-size: 14px;
      }

      .post {
        margin-top: 10px;
        font-size: 16px;
      }
    }
  }

  .common {
    > .title {
      font-size: 20px;
      font-weight: bold;
      line-height: 30px;
    }

    .desc {
      font-size: 14px;
      line-height: 24px;
    }
  }

  .identity-detail {
    padding: 10px 0;

    .title {
      font-size: 16px;
    }

    .desc {
      font-size: 14px;
      color: #959595;
    }
  }

  .tag {
    margin-top: 20px;
  }
}
</style>
