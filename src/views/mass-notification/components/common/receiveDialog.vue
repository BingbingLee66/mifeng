<template>
  <div>
    <kdDialog ref="kdDialog" :custom-footer="true" :center="true" :dialog-visible="true" :dialog-title="dialogTitle">
      <div slot="content">

      </div>
      <div slot="customFooter">
         <el-button type="primary" @click="save">我知道了</el-button>
      </div>
    </kdDialog>
  </div>

 
</template>

<script>
import kdDialog from '@/components/common/kdDialog'
export default {
  name: 'ReceiveDialog',
  comments: { kdDialog },
  data(){return {
    dialogTitle: '接收人'
  }},
  created(){
    // console.log('组件receiveList', this.receiveList)
  
  },
 

}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
.el-form-item{
  margin-bottom:0px
}


</style>

