<template>
  <div class="activity-detail-wrap">
    <div class="title">广州市招商办南沙自贸易区招商大会</div>
    <div class="sub-title">活动信息</div>
    <div class="activity-info">
      <el-row :gutter="20">
        <el-col v-for="(activity, index) in activityInfo" :key="index" :span="8">
          <div class="grid-content ">
            <div class="label">{{ activity.label }}：</div>
            <div class="value">{{ activity.value }}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="grid-content">
      <div class="label">类型摘要：</div>
      <div class="value">
        <el-select v-model="detail.summary" multiple disabled remote filterable placeholder="" />
      </div>
    </div>

    <div class="grid-content">
      <div class="label">活动简介：</div>
      <div class="value">
        文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案文案
      </div>
    </div>

    <div class="grid-content">
      <div class="label">活动头图：</div>
      <div class="value"><img src="@/assets/img/logo_active.png" alt=""></div>
    </div>

    <div class="grid-content">
      <div class="label">活动分享图：</div>
      <div class="value"><img src="@/assets/img/logo_active.png" alt=""></div>
    </div>

    <div class="grid-content">
      <div class="label">招商附件：</div>
      <div class="value">
        <div><el-button type="text">广州南沙自贸区招商报名表.doc</el-button></div>
        <div><el-button type="text">广州南沙自贸区招商报名表.doc</el-button></div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'ActivityDetail',
  data() {
    return {
      detail: {
        summary: ['1', '2']
      },
      activityInfo: [
        { prop: 'status', label: '活动状态', value: '报名中' },
        { prop: 'stage', label: '招商阶段', value: '筹备阶段' },
        { prop: 'address', label: '招商地区', value: '广州市南沙自贸区' },
        { prop: 'status', label: '已报名人数', value: '120' },
        { prop: 'status', label: '报名审核', value: '需审核' },
        { prop: 'status', label: '报名时间', value: '2022-07-11 00:00:00 ~2022-07-12 00:00:00' },
        { prop: 'status', label: '参加人数', value: '线下限50人' },
        { prop: 'status', label: '拓展功能', value: '签到，签退，座位表' },
        { prop: 'status', label: '活动类型', value: '线上线下活动' },
        { prop: 'status', label: '直播间链接类型', value: 'H5小程序' },
        { prop: 'status', label: '活动时间', value: '2022-07-11 00:00:00 ~2022-07-12 00:00:00' },
        { prop: 'status', label: '活动地址', value: '广州市海珠区阅江大道888号' },
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.activity-detail-wrap {
  padding: 40px;

  .title {
    margin: -20px 0 0 -20px;
  }

  .title, .sub-title {
    padding: 10px 0;
  }

  .grid-content {
    padding: 10px 0;
    display: flex;

    .value {
      flex: 1;
    }
  }

  img {
    width: 200px;
  }

  /deep/ .el-button {
    padding: 0;
  }
}
</style>
