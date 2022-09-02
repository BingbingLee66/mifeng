<template>
  <div class="containers">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="mass">群发管理</el-tab-pane>
    <el-tab-pane label="配置管理" name="template">模板管理</el-tab-pane>
  </el-tabs>
  <el-form :inline="true" :model="form" class="demo-form-inline">
  <el-form-item label="商协会名称">
    <el-autocomplete
      v-model="form.chamberName"
      class="inline-input"
      :fetch-suggestions="querySearch"
      placeholder="搜索/选择"
      @select="handleSelect"
    ></el-autocomplete>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">查询</el-button>
  </el-form-item>
</el-form>

<kdDialog ref="kdDialog" :custom-footer="true" dialog-title="通知发送规则" :center="true" @hide="hide">
  <div slot="content">
    规则说明，文案先找业务定一下
  </div>
  <el-button slot="customFooter" type="primary" @click="hideSendRule">我知道啦</el-button>
</kdDialog>
  </div>
</template>

<script>
import kdDialog from '@/components/common/kdDialog'
export default {
  name: 'Create',
  components: { kdDialog },

  data() {
    return {
      form: {
        chamberName: ''

      },
      activeName: '',
      nameList: [
        { value: "三全鲜食（北新泾店）", address: "长宁区新渔路144号" },
        { value: "三Hot honey 首尔炸鸡（仙霞路）", address: "上海市长宁区淞虹路661号" },
        { value: "新旺角茶餐厅", address: "上海市普陀区真北路988号创邑金沙谷6号楼113" },
        { value: "泷千家(天山西路店)", address: "天山西路438号" },
        { value: "胖仙女纸杯蛋糕（上海凌空店）", address: "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
        { value: "贡茶", address: "上海市长宁区金钟路633号" },
      ]
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
    querySearch(queryString, cb) {
      const { nameList } = this
      const results = queryString ? nameList.filter(this.createFilter(queryString)) : nameList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 删除已选活动
 
    /** 父子组件交互 */
    /** 工具 */
   

 
    handleRemove() {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.containers{
  padding: 20PX;
}
</style>
