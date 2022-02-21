
<template>
  <div >
    <!-- <span>视频组件</span> -->
   <div id="videoContent"></div>
  </div>
</template>
<script>
import { getSts } from '@/api/vod/vod';
export default {
  name: "videoComponent",
  data() {
    return {
      videoKey:null,
      vabled:false,
      createPlayer:null
    };
  },
  props: ["vid","height"], // 接收父组件的内容
 
  mounted() {
   this.renderVideo()
  },
  methods: {
    /**
     * 渲染视频
     */
    renderVideo() {
      getSts().then(response => {
        this.videoKey = response.data
        // 存在视频必须看完视频后才能点击审核
        this.vabled = true;
        console.log('vid',this.vid);
        console.log('height',this.height)
        this.videoPlayer = this.$createPlayer('videoContent', this.videoKey.accessKeyId, this.videoKey.accessKeySecret, this.videoKey.securityToken, this.videoKey.region, this.vid, this.height)
        this.videoPlayer.on('ended', (e) => {
          this.vabled = false
        })
      })
    },
     closeDia() {
        this.videoPlayer.dispose()
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>