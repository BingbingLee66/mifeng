<template>
  <div class="preview-container flex-x-center-center" v-if="detailVisible">
    <div class="left flex-y-center">
      <span class="left-hd">扫码查看手机效果</span>
      <div class="flex-y">
        <span>与实际手机显示效果</span>
        <span>有微小差异, 请扫码查看</span>
      </div>
      <img
        class="er-code"
        :src="url"
      />
    </div>
    <div class="right">
      <div class="right-out"></div>
      <img src="@/assets/img/close.png" class="my-close" @click="hide"/>
      <img class="right-bg" src="@/assets/img/phone.png" />
      <div class="right-content ">
          <div class="content">
              <div class="title" >
          {{title}}
        </div>
        <div class="date flex-x-between-center">
            <span>文章出处</span>
             <span>{{ systemTime }}</span>
        </div>
        <div style="margin-top:15px;">
          <videoComponent ref="videoRef" v-if="vid" :vid="vid" height="330px"/>
        </div>
        
        <div class="phone-article-content" id="my-phone-article-content" v-html="htmlObj"> 
        </div>
          </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import {previewArticle} from '@/api/content/article.js'
import videoComponent from '@/components/video/index'
export default {
  components: {videoComponent},
  data() {
    return {
      // 状态
      reject: null,
      reslove: null,
      detailVisible: false,
      //标题
      title:'',
      htmlObj:'',
      //文章预览id
      articlePreviewId:null,
      //小程序码
      url:null,
      // 当前  年月日
      systemTime:'',
      vid:'', // 视频id
      videoCoverURL:'', // 视频封面
    };
  },
  methods: {
      async open(id,title,htmlObj,vid,videoCoverURL){
          this.articlePreviewId = id
          this.title=title;
          this.htmlObj=htmlObj;
          this.vid = vid || '';
          this.videoCoverURL = videoCoverURL || '';
          this.previewArticleFunc()
          this.getDate()
          this.show()
          await this.$nextTick()
          if(this.vid) this.$refs['videoRef'].show(this.vid);
          
      }, 
      getDate(){
        let nowDate = new Date()
				let date = {
				  year: nowDate.getFullYear(),
				  month: nowDate.getMonth() + 1,
				  date: nowDate.getDate()
				}
				if (parseInt(date.date) < 10) {
				  date.date = '0' + date.date
				}
				this.systemTime = date.year + '年' + date.month + '月' + date.date + '日'
      },
      show(){
          this.detailVisible=true;
      },
      hide(){
           this.detailVisible=false;
      },
      /**请求 */
      previewArticleFunc(){
          let params={
            articlePreviewId:this.articlePreviewId,
            content:this.htmlObj,
            title:this.title,
            videoCoverURL:this.videoCoverURL,
            vid:this.vid
          }

          previewArticle(params).then(res=>{
              if(res.state===1){
                  let data=res.data;
                  this.articlePreviewId=data.articlePreviewId ? data.articlePreviewId  :null;
                  this.url=data.url
              }

          })
      }
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
  z-index: 100;
  .left {
    font-size: 16px;
    margin-right: 50px;

    color: #555555;
    .left-hd {
      color: #1890ff;
      font-size: 20px;
      margin-bottom: 15px;
    }
    width: 300px;
    height: 365px;
    background-color: #fff;
    padding: 30px 30px;
    .er-code {
      width: 200px;
      height: 200px;
      margin-top: 10px;
    }
  }

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
  .right-out{
    position: absolute;
    top: 8%;
    right: 8%;
    width: 90px;
    height: 42px;
    background: #fff;
    z-index: 1000;
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
}
// ::-webkit-scrollbar {

// // background: red;

// width: 10px;

// height: 10px;

// }

// .content-html img{
//     width: auto;
//      height: auto ;
// }
// .content-html>p>img {
//   width: 100% !important;
 
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
</style>
