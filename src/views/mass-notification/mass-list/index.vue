<template>
  <div class="containers">
    <tab :tabList="tabList" @handleClick="handleClick"></tab>
    <formComponent :activeName="activeName"></formComponent>

    <!-- <kdDialog ref="kdDialog" :custom-footer="true" dialog-title="通知发送规则" :center="true" @hide="hide">
  <div slot="content">
    规则说明，文案先找业务定一下
  </div>
  <el-button slot="customFooter" type="primary" @click="hideSendRule">我知道啦</el-button>
</kdDialog> -->
  </div>
</template>

<script>
import kdDialog from '@/components/common/kdDialog'
import tab from './components/tab.vue'
export default {
  name: 'Create',
  components: { kdDialog, tab, formComponent: () => import('./components/formComponent') },

  data() {
    return {
      activeName: '',

      tabList: []
    }
  },
  created() {
    const { ckey } = this.$store.getters
    this.ckey = ckey
    this.restTypeData()
  },
  methods: {
    /** 请求 */
    /** 行为操作 */
    onSubmit() {},
    // 删除已选活动
    handleSelect() {},
    /** 父子组件交互 */
    //tab改变时
    handleClick(name) {
      this.activeName=name
      console.log('handleClick', name)
    },
    /** 工具 */

    restTypeData() {
      if (this.ckey) {
        this.tabList = [{ name: 'notification', label: '通知列表' }]
      } else {
        this.tabList = [{ name: 'mass', label: '群发管理' }, { name: 'template', label: '模板管理' }]
    
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.containers {
  padding: 20px;
}
</style>
