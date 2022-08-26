<template>
  <div class="containers">
    <el-form>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="(item, index) in labelList" :key="index" :label="item.n" :value="item.type"></el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 接收人 -->
      <ReceiveForm :receive-list="receiveList" />
    </el-form>
  </div>
</template>

<script>
import { labelType, receiveType } from '../util/label'
import ReceiveForm from './components/receiveForm.vue'
export default {
  name: 'Create',
  components: { ReceiveForm },

  data() {
    return {
      labelList: [],
      receiveList: [],
      form: {
        // 类型
        type: 1,
        receive: 1
      }
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
    /** 父子组件交互 */
    /** 工具 */
    restTypeData() {
      const { ckey } = this
      // 判断是否是总后台 类型：总后台显示1和3的show类型
      this.labelList = ckey ? labelType.filter(item => item.show !== 1) : labelType.filter(item => item.show !== 2)
      this.receiveList = ckey
        ? receiveType.filter(item => item.show !== 1)
        : receiveType.filter(item => item.show !== 2)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-form-item {
  margin-bottom: 0px;
}
.containers{
  padding:20px 0px 0px 30px
}
</style>
