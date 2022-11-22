<template>
  <el-dialog :visible.sync="entryVisible" :title="title">
    <el-input placeholder="请输入关键字" />
    <h2>最近推荐</h2>
    <div class="c-recent-list">
      <div v-for="item in lists" :key="item.id" class="c-recent-item">
        <el-checkbox v-model="item.check" class="c-recent-item__checkbox" />
        <el-tag type="info" class="c-recent-item__tag">mignzi </el-tag>
      </div>
    </div>
    <div>
      <h2>商会相关</h2>
      <div class="c-entry-list">
        <div v-for="item in lists" :key="item.id" class="c-entry-list__item">
          <div class="c-eli__relative">
            <el-checkbox v-model="item.check" class="c-eli__checkbox" />
            <img
              class="img"
              src="https://cdn.9kd.com/kdnet/f0978298c60545a595da45d4bbf5358b.jpg"
              width="80"
              height="80"
              alt=""
            >
          </div>
          <div>citiaomingzicitiaomingzicitiaomingzicitiaomingzi</div>
        </div>
      </div>
    </div>
    <el-button type="text" class="m-auto">点击展开更多</el-button>
    <div class="c-entry-button">
      <el-button type="primary">确认</el-button>
      <el-button>取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      lists: [
        {
          check: true
        }, {
          check: false
        }, {
          check: true
        }
      ]
    }
  },
  computed: {
    entryVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.c-entry-list{
  display: flex;
  flex-wrap: wrap;
}
.c-entry-list__item {
  width: 20%;
  padding: 0 5px;
  margin-bottom: 10px;
  text-align: center;
  .img{
    object-fit: cover;
  }
}
.c-eli__relative{
  position: relative;
  width: 80px;
  height: 90px;
  margin: auto;
}
.c-eli__checkbox{
  position: absolute;
  right: -15px;
  top: 0;
}
.c-entry-button {
  margin-top: 10px;
  text-align: center;
  .el-button {
    width: 150px;
  }
}
.c-recent-list {
  display: flex;
}
.c-recent-item{
  position: relative;
  margin-right: 10px;
  .c-recent-item__checkbox {
    position: absolute;
    right: 0;
    top: 0;
  }
}
.c-recent-item__tag {
  padding: 8px 15px 0 8px;
  box-sizing: content-box;
}

.m-auto {
  display: block;
  margin: auto;
}
</style>
