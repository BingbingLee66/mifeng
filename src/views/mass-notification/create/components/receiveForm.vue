<template>
  <div>
    <el-form :model="form">
      <el-form-item label="接收人" prop="receive">
        <el-radio-group v-model="form.receive">
          <el-radio v-for="(item, index) in receiveList" :key="index" :label="item.type">{{ item.n }}</el-radio>
        </el-radio-group>
        <!-- 本商会会员 -->
        <div v-if="form.receive === 5" class="select">
          <span>已选14人</span>
          <el-button class="btn" type="primary" size="mini" plain>查看</el-button>
        </div>
        <!-- 指定职位 -->
        <el-select v-if="form.receive === 2" v-model="form.position" class="my-input"  multiple placeholder="请选择">
          <el-option v-for="(item,index) in options" :key="index"  :value="item.name"> {{item.name}}({{item.count}})</el-option>
        </el-select>
      </el-form-item>
      <receiveDialog v-if="false" />
    </el-form>
  </div>
</template>

<script>
import receiveDialog from '../../components/common/receiveDialog'
export default {
  name: 'ReceiveForm',
  components: { receiveDialog },
  props: ['receiveList'],
  data() {
    return {
      form: {
        receive: null
      },
      // 会内职位
      options: [{ name: '会长', count: 33 }, { name: '学生', count: 93 }]
    }
  },
  created() {
    this.form.receive = this.receiveList[0].type
  },
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-form-item {
  margin-bottom: 0px;
}
.btn {
  height: 30px;
}
.select {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: 40px;
  width: 500px;
  padding: 0px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.my-input{
  width: 500px;
   display: flex;
}
</style>
