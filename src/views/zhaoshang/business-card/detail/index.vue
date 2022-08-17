<template>
  <div class="card-detail-wrap">
    <div class="avatar">
      <img :src="listData.avatar || 'https://ysh-sh.oss-cn-shanghai.aliyuncs.com/prod/png/default_avatar.png'" alt="">
    </div>
    <div class="card-detail-info">
      <div class="header">
        <div class="name">{{listData.userName}}</div>
        <div class="company">{{listData.unit}}</div>
        <div class="post">{{listData.post}}</div>
      </div>

      <div class="hr" />

      <div class="profile common">
        <div class="title">个人简介：</div>
        <div class="desc">{{listData.resume}}</div>
       
      </div>

      <div class="hr" />

      <div class="chamber common">
        <div class="title">所在商/协会：</div>
        <div class="desc" v-for="(item,index) in listData.cardChambers" :key="index">{{item.chamberName}} <el-tag size="mini">{{item.memberPost}}</el-tag></div>
      </div>

      <div class="hr" />

      <div class="identity common">
        <div class="title">身份：</div>
        <div class="identity-detail" v-for="(item,index) in listData.identitiys" :key="index">
          <div class="title">{{ item.unit }}</div>
          <div class="desc">{{ item.post }}</div>
        </div>
       
      </div>

      <div class="tag common">
        <div class="title">标签：</div>
        <div v-if="listData.tagList" class="desc">{{ listData.tagList.join('，') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getIpCardDetail } from '@/api/attract'
export default {
  name: 'BusinessCardDetail',
  data() {
    return {
      listData:{},
    }
  },
  computed: {
    cardId() { // ip名片详情,示例值(0)
      return this.$route.params.cardId || ''
    },
    type() { // 1-招商信息2-招商活动
      return this.$route.params.type || ''
    },
    targetId() { // 招商活动或招商信息id
      return this.$route.params.targetId || ''
    }
  },
  mounted() {
    console.log('cardId',this.cardId,this.type,this.targetId)
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData() {
      let params = {
        cardId:this.cardId,
        targetId : this.targetId,
        type:this.type // 1-招商信息2-招商活动
      }
      getIpCardDetail(params).then((res)=>{
        console.log('res',res)
        this.listData = res.data
        this.listData.tagList = []
        this.listData.memberLabels.forEach((v)=>{
          this.listData.tagList.push(v.memberLabelName)   
        })

      })
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
