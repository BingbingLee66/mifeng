<template>
  <div>
    <el-dialog
      title="数据定义"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="close"
    >
      <span>

        <div v-for="item in statisticsList" :key="item.id" class="statistics-item">
          <div class="title">{{ item.title }}</div>
          <div>{{ item.content }}</div>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">

        <el-button type="primary" @click="close">我知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { statisticsList } from '../constant'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      statisticsList
    }
  },
  created() {
    // 拉取问卷列表
  },
  methods: {
    close() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics-item{
  margin-bottom: 24px;
  .title{
    margin-bottom: 4px;
    font-weight: 600;
color: rgba(0,0,0,0.65);
  }
}

/deep/ .el-dialog__footer{
  text-align: center;
}
</style>
