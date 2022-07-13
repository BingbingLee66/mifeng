<template>
  <div>
    <div v-if="defineList.length" class="text-btn-style" @click="showMeaning=true">数据定义</div>

    <el-dialog title="数据定义" :visible.sync="showMeaning" width="650px">
      <div class="meaning-wrap">
        <div v-for="(v,i) of defineList" :key="`meaning${i}`" class="meaning-item">
          <div class="tit">{{ v.title }}</div>
          <div class="sub" v-html="v.text" />
        </div>
      </div>
      <el-button slot="footer" type="primary" @click="showMeaning=false">我知道了</el-button>
    </el-dialog>
  </div>
</template>

<script>

export default {
  components: {},
  props: {
    defineList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      showMeaning: false
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
//
</style>
