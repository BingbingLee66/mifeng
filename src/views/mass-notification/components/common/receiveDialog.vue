<template>
  <div>

  </div>
</template>

<script>
export default {
  name: 'receiveDialog',
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

