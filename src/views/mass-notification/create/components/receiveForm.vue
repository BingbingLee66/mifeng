<template>
  <div>
     <el-form>
      <el-form-item label="接收人" prop="receive">
       <el-radio-group v-model="form.receive">
        <el-radio v-for="(item,index) in receiveList" :key="index" :label="item.n" :value="item.type"></el-radio>
       </el-radio-group>
     </el-form-item>
     <receiveDialog/>
    </el-form>
  </div>
</template>

<script>
import receiveDialog from '../../components/common/receiveDialog'
export default {
  name: 'ReceiveForm',
  components: { receiveDialog },
  props: ['receiveList'],
  data(){return {
    form: {
      receive: null
    }
  }},
  created(){
    // console.log('组件receiveList', this.receiveList)
  },
  methods: {
    
  }

}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
.el-form-item{
  margin-bottom:0px
}

</style>

