<template>
  <section class="app-main">
    <transition  name="fade-transform" mode="out-in">
      <div class="app-transition">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </div>
    </transition>
    <div class="operation" v-if="hadGuide" @click="onSkip">
      <i class="el-icon-s-management" />
      <div class="operation-con">操作指引</div>
    </div>
  </section>
</template>

<script>
  export default {
    name: "AppMain",
    data() {
      return {
        data:[],
        router:'',
        menu1Id:'',
        menu2Id:'',
        guideId:null,  // ==  null ：有多个视频   否则只有一个视频  
        hadGuide:false,  // 是否显示操作指引
      };
    },
    computed: {
      cachedViews() {
        return this.$store.state.tagsView.cachedViews;
      },
      key() {
        return this.$route.fullPath;
      },
    },
    watch: {
      key:{
        handler:function (newVal, oldVal) {
          this.router = this.$route
          this.traversal()
          console.log('333333333', this.router)
        },
        deep:true
      },
    },
    mounted() {
      this.data = this.$store.state.menu.addRoutes
      this.router = this.$route
      this.traversal()
    },
    methods: {
      traversal(){
        this.hadGuide = false;
        this.data.forEach((v)=>{
          v.children.forEach((j)=>{
              if(j.path == this.router.fullPath && j.hadGuide == true){
                this.$message.error('请选择数据')
                this.menu1Id = v.id,
                this.menu2Id = j.id,
                this.hadGuide = true
                this.guideId = j.guideId
                return 
              }
          })
        })
      },
      // 点击操作指引
      onSkip(){
        console.log(this.menu1Id,this.menu2Id)
        if( this.guideId == null) {
          this.$router.push({
            path: this.router.path,
          })
        } else {
          this.$router.push({
            name: '操作指引详情',
            params: {
              'detailsId':this.guideId 
            }
          })
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 100px);
    width: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
  }
  .app-transition{
    width: 97%;
  }
  .fixed-header + .app-main {
    padding-top: 50px;
  }

  .hasTagsView {
    .app-main {
      /* 84 = navbar + tags-view = 50 + 34 */
      min-height: calc(100vh - 84px);
    }

    .fixed-header + .app-main {
      padding-top: 84px;
    }
  }
  .operation{
    width:3%;
    height: 100%;
    padding: 20px 0;
    text-align: center;
  
    line-height: 22px;
    cursor: pointer;
  }

  .operation-con{
    font-size: 12px;
  }
  .el-icon-s-management{
    color: #409eff;
    font-size: 50px;
  }
</style>

