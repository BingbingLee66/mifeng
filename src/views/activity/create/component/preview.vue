<template>
  <div class="preview-container flex-x-center-center" v-if="detailVisible">
    <div class="right">
      <!-- 头部图片 -->
      <div class="right-out">活动详情</div>
      <img src="@/assets/img/close.png" class="my-close" @click="hide"/>
      <img class="right-bg" src="@/assets/img/phone.png" />
      <div class="right-content ">
        <div class="right-top">
         <img
            v-if="formObj.headImage"
            :src="formObj.headImage"
            class="pic"
          />
      </div>
        <div class="content">
        
          <!-- 标题 -->
          <div class="active-title"> 
            <div class="title-left" >{{formObj.activityName}}</div>
            <div class="title-right">
              <div><i class="el-icon-share"></i></div>
              <div style=" color: #c62134;font-size:12px;">分享</div>
            </div>
          </div>
          <!-- 时间 -->
          <div class="active-Date">
            <div class="Date-info">
              <div class="info-apply">
                <div class="apply-dian">·</div>
                报名时间:
                </div>
              <div v-show="applyDate.length">
                <span>{{applyDate[0]}}</span>
                <span>~</span>
                <span>{{applyDate[1]}}</span>
              </div>
            </div>
            <div class="Date-info">
              <div class="info-apply">
                 <div class="apply-dian" style="color:#bc822c">·</div>
                活动时间:
              </div>
              <div v-show="date.length">
                <span>{{date[0]}}</span>
                <span>~</span>
                <span>{{date[1]}}</span>
              </div>
            </div>
            <div class="Date-info">
              <div class="info-apply">
                 <div class="apply-dian" style="color:#dc5015">·</div>
                活动地点:
              </div>
              <div class="info-site">{{formObj.province + formObj.city +formObj.area + formObj.addressInfo}}</div>
            </div>
          </div>
          <div class="active-middle">
            <!-- 账户详情 -->
            <div class="active-data">
              <div class="active-left">
                  <img class="active-avatar" :src="systemLogo ? systemLogo : imgUrl">
              </div>
              <div class="active-right">
                <div class="right-cham">{{ chamberName ? chamberName : '凯迪云商会总后台管理系统' }}</div>
                <div class="right-member">已入驻200名会员</div>
              </div>
            </div>
             <img src="https://ysh-cdn.kaidicloud.com/prod/png/active.png" class="pic"  />
          </div>
          <div class="active-introduce">活动介绍</div>

           <div class="phone-article-content" id="my-phone-article-content" v-html="formObj.introduce"></div>
        </div>
       
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import imgUrl from '@/assets/img/avatar.gif'
export default {
  components: {},
  data() {
    return {
      detailVisible: false,
      formObj:{},
      activeName:'1',
      applyDate:[], //报名时间：
      date:[], //活动时间：
      imgUrl:imgUrl,
    };
  },
  computed: {
    ...mapGetters(['chamberName', 'systemLogo'])
  },
  methods: {
      async open(formObj){
        this.applyDate = []
        this.date = []
        this.formObj = formObj
        if(formObj.applyDate.length > 0){
          this.applyDate.push(this.getYMDHMS(formObj.applyDate[0]))
          this.applyDate.push(this.getYMDHMS(formObj.applyDate[1]))
        }
         
        if(formObj.date.length > 0){
          this.date.push(this.getYMDHMS(formObj.date[0]))
          this.date.push(this.getYMDHMS(formObj.date[1]))
        }
        this.show()
        
      }, 

      //时间戳转年月日时分秒
      getYMDHMS (timestamp) {
         timestamp = Number(timestamp)
          let time = new Date(timestamp)
          let year = time.getFullYear()
          let month = time.getMonth() + 1
          let date = time.getDate()
          let hours = time.getHours()
          let minute = time.getMinutes()
          let second = time.getSeconds()

          if (month < 10) { month = '0' + month }
          if (date < 10) { date = '0' + date }
          if (hours < 10) { hours = '0' + hours }
          if (minute < 10) { minute = '0' + minute }
          if (second < 10) { second = '0' + second }
          return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
      },
      show(){
          this.detailVisible=true;
          console.log('chamberName',this.chamberName,this.systemLogo)
      },
      hide(){
           this.detailVisible=false;
      },

  },
};
</script>
<style lang="scss" >

.preview-container {
  background-color: rgba(0, 0, 0, 0.447058823529412);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1001;


  .right-bg,
  .right-content,
  .right {
    width: 400px;
    height: 740px;
    position: absolute;
  }
  .right {
    position: relative;

    .my-close{
        width: 40px;
        height: 40px;
        position: absolute;
        right: -26px;
          z-index: 102;
    }
  }
  .right-top{
    width: 84%;
    height: 180px;
    text-align: center;
    margin-left: 37px;

  }
  .pic{
    width: 100%;
    height: 100%;
  }
  .right-out{
    position: absolute;
    top: 8%;
    right: 38%;
    width: 90px;
    height: 42px;
    background: #fff;
    z-index: 110;
    line-height: 42px;
    text-align: center;
  }
  .right-bg {
    z-index: 101;
  }
  .right-content {
      margin-top: 110px ;
    //   padding: 0px 26px;
      height: 600px;
      overflow-y: scroll;
      overflow-x: visible;
     z-index: 102;
    .content{
        padding: 0px 30px 0px 40px;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      line-height: 60rpx;
    }
    .date{
      margin-top: 14px;
    }
    .content-html{
        margin-top: 10px;
        overflow: hidden;
    }
  }
   
  .phone-article-content {
    width: 100%;
    position: relative;
    font-size: 14px;
    font-weight: 500;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    border: none !important;
  }


  #my-phone-article-content{
    width: 100%;
    position: relative;
    font-size: 14px;
    font-weight: 500;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    border: none !important;
  }
  #my-phone-article-content img{
      max-width: 100% ;
    height: auto !important;
    max-height: 100% !important;
  }
  // .phone-article-content>p>img {
  //   width: 100% !important;
  //   height: auto !important;
  //   max-height: 100% !important;
  // }
  .phone-article-content img{
      max-width: 100% ;
    height: auto !important;
    max-height: 100% !important;
  }

  .active-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    margin-top: 10px;
    // border-bottom: 2px solid #f5f5f5;
    .title-left{
      width: 85%;
      font-size: 17px;
    }
    .title-right{
      width: 15%;
      text-align: center;
      .el-icon-share{
        color: #a4a4a4;
      }
    }
  }
  .active-Date{
    margin-top: 10px;
    border-bottom: 2px solid #f5f5f5;
    padding-bottom: 10px;
    font-size: 12px;
    .Date-info{
      display: flex;
      align-items: center;
      // justify-content: space-between;
      color: #888;
      margin-bottom: 5px;
   
      .info-apply{
        color: #323232;
        margin-right: 10px;
        position: relative;
        margin-left: 10px;
        .apply-dian{
          position: absolute;
          color: #27bc76;
          font-size: 30px;
          top: -72%;
          left: -21%;
        }
      }
      .info-site{
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        width: 70%;
      }

    }
  }
  .active-middle{
    width: 100%;
    height: 135px;
    position: relative;
    .active-data{
      position: absolute;
      top: 58%;
      left: 8px;
      width: 225px;
      height: 50px;
      background: #fff;
      display: flex;
      align-items: center;
      .active-left{
        width: 40px;
        height: 40px;
        border-radius: 10px;
        .active-avatar{
          width: 100%;
          height: 100%;
        }
      }
      .active-right{
        font-size: 12px;
        margin-left: 5px;
        .right-cham{
          font-weight: 700;
          margin-bottom: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 175px;
        }
        .right-member{
          color: #c5c2c6;
          transform: scale(0.8);
          margin-left: -20px;
        }
      }
    }
  }
  .active-introduce{
    color: #c62134;
    font-size: 12px;
    font-weight: 700;
    margin-left: 10px;
  }
}

</style>
