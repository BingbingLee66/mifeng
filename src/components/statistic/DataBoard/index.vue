<template>
  <div class="data-board">
    <div class="data-title">
      <span class="title">{{ title }}</span>
      <span class="text-btn-style" @click="showMeaning=true">数据定义</span>
    </div>
    <div class="data-card">
      <template v-for="(v,i) of list">
        <div :key="`cell${i}`" class="card-cell">
          <span class="card-value">{{ v.value }}</span>
          <span class="card-name">{{ v.name }}</span>
        </div>
        <div v-if="i < list.length - 1 && !v.hideBorder" :key="`line${i}`" class="line" />
      </template>
    </div>

    <el-dialog title="数据定义" :visible.sync="showMeaning" width="600px">
      <div class="meaning-wrap">
        <div v-for="(v,i) of defineList" :key="`meaning${i}`" class="meaning-item">
          <div class="tit">{{ v.title }}</div>
          <div class="sub" v-html="v.text" />
        </div>
      </div>
      <div class="footer">
        <el-button type="primary" @click="showMeaning=false">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    defineList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      showMeaning: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.data-title {
  height:20px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.title {
  font-weight: 600;
  font-size: 18px;
  float: left;
}
.data-card {
  width: 100%;
  height: 120px;
  border-radius: 2px;
  border: 1px solid #ccc;
  display: flex;
}

.card-cell {
  height: 100%;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-value{
  margin-bottom: 10px;
  color: #008000;
  font-weight: 600;
}

.line {
  &::after {
    content: '';
    display: block;
    width: 1px;
    height: 100%;
    border-right: 1px solid #ccc;
  }
}

.footer {
  text-align: center;
}

</style>
