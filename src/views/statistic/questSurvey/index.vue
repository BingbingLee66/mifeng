<template>
  <div class="wrap">
    <el-tabs :value="activeName" @tab-click="onTabClick">
      <el-tab-pane v-for="item in tabList" :key="item.n" :label="item.l" :name="item.n" />
    </el-tabs>
    <div class="board flex-x">
      <div v-for="(item,index) in defineList" :key="index" :style="{'border-right':(index+1)%3===0 ? '' :'1px solid #E8E8E8FF'}" class="flex-y-center-center board-item">
        <span class="title">{{ item.title }}</span>
        <span>{{ item.val }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      // 数据定义列表
      defineList: [
        { title: '累计发布问卷', name: 'questionnaireSum', val: 12 },
        { title: '累计回收答卷', name: 'recycleAnswerSum', val: 12 },
        { title: '覆盖人数', name: 'overrideUserSum', val: 12 }
      ],
      tabList: [
        { l: '总览', n: 'statistic' },
        { l: '问卷', n: 'quest' }
      ],

      // tab切换值
      activeName: 'Platform',

      // 页面选项
      pageOptions: [],
      // 激活活跃看板数据源
      activateData: {}
    }
  },

  created() {},

  methods: {
    // tab-切换
    onTabClick({ name }) {
      console.log('name', name)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 0 20px;
}
.board {
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  background: #ffffff;
  border-radius: 2px;
  .board-item {
    padding: 24px 0px;
    width: 33%;
    .title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
}
</style>
