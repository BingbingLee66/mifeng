<template>
  <div class="activity-detail-wrap">
    <div class="title">广州市招商办南沙自贸易区招商大会</div>
    <div class="sub-title">活动信息</div>
    <div class="activity-info">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">活动状态：</div>
            <div class="value">{{ infoList.status == 1 ? '未开始' : infoList.status == 2 ? '进行中' : '已结束' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">招商阶段：</div>
            <div class="value">{{ infoList.phaseStatus == 0 ? '筹备阶段' : infoList.status == 1 ? '拟策阶段' : '公开招商阶段' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">招商地区：</div>
            <div class="value">{{ infoList.province }}{{ infoList.city }}{{ infoList.area }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">已报名人数：</div>
            <div class="value">{{ infoList.activityCount }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">报名审核：</div>
            <div class="value">{{ infoList.auditStatus == 0 ? '无需审核' : '需审核' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">报名时间：</div>
            <div class="value">{{ infoList.applyStartTime | dateFormat }} ~ {{infoList.applyEndTime | dateFormat}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">参加人数：</div>
            <div class="value">{{ infoList.activityCount }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">扩展功能：</div>
            <div class="value">
              <span style="margin-right:2px;" v-if="infoList.extraSeat == 1">座位表,</span>
              <span style="margin-right:2px;"  v-if="infoList.extraSignin == 1">签到,</span>
              <span v-if="infoList.extraSignout == 1">签退</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">报名时间：</div>
            <div class="value">{{ infoList.activityStartTime | dateFormat }} ~ {{infoList.activityEndTime | dateFormat}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">活动类型：</div>
            <div class="value">{{ infoList.applyMode == 1 ? '线上活动' : infoList.status == 2 ? '线下活动' : '线上线下活动' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">直播间链接类型：</div>
            <div class="value">{{ infoList.zhiboAddressType == 1 ? '云会播小程序' : 'H5链接' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">直播间链接：</div>
            <div class="value">{{ infoList.zhiboAddress  || '--'}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ">
            <div class="label">活动地址：</div>
            <div class="value">{{ infoList.addressInfo || '--'}}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="grid-content">
      <div class="label">类型摘要：</div>
      <div class="value" >
         <div class="tags" v-if="infoList.labels">
            <div class="tags-block" v-for="(item,index) in infoList.labels" :key="index">#{{item.label}} <span v-if="infoList.labels.length -1 != index">,</span></div>
          </div>
      </div>
    </div>

    <div class="grid-content">
      <div class="label">活动简介：</div>
      <div class="value" v-html="infoList.introduce"></div>
    </div>

    <div class="grid-content">
      <div class="label">活动头图：</div>
      <div class="value"><img :src="infoList.headImage" alt=""></div>
    </div>

    <div class="grid-content">
      <div class="label">活动分享图：</div>
      <div class="value"><img :src="infoList.listImage" alt=""></div>
    </div>

    <div class="grid-content">
      <div class="label" style="margin-top: 10px;">招商附件：</div>
      <div class="value">
        <div v-for="(item,index) in infoList.attachment" :key="index"><el-button type="text">{{item.fileName}}</el-button></div>
      </div>
    </div>

  </div>
</template>

<script>
import { getEcActivity } from '@/api/attract'
export default {
  name: 'ActivityDetail',
  data() {
    return {
      infoList: {}, 
    }
  },
  computed: {
    activeId() { // 活动ID
      return this.$route.params.activeId || ''
    },
  },
  created(){
    this.fetchData()
  },
  methods:{
    async fetchData(){
      const params = {
        id:this.activeId
      };
      let res = await getEcActivity(params);
      if (res.state === 1) {
        this.infoList = res.data
      } else {
        this.$message({
          message: res.msg,
          type: 'success'
        })
      }
    }
  }
}
</script>

<style  lang="scss">
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
  .tags{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #000;
    padding: 10px;
    .tags-block{
      margin:0 8px 0px 0;
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
