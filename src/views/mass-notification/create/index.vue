<template>
  <div class="containers">
    <el-form :rules="rules">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="(item, index) in labelList" :key="index" :label="item.n" :value="item.type"></el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 接收人 -->
      <ReceiveForm :ckey="ckey" :receive-list="receiveList" />
      <!-- 发送方式 -->
      <el-form-item label="发送方式" prop="sendType">
        <el-radio-group v-model="form.sendType">
          <el-radio label="1">立即发送</el-radio>
          <el-radio label="2 ">定时发送</el-radio>
          <el-date-picker v-if="form.sendType == 2" v-model="sendTime" type="datetime" placeholder="请选择发送时间">
          </el-date-picker>
        </el-radio-group>
      </el-form-item>
      <!-- 同步渠道 -->
      <el-form-item label="同步渠道" prop="synchChannels">
        <el-checkbox-group v-model="form.synchChannels">
          <div class="synch-channels">
            <div v-for="item in synchChannels " :key="item.id">
              <el-checkbox :label="item">{{item.label}}</el-checkbox>
              <el-select v-model="item.selectActivity" class="select"  placeholder="选择模板">
                <el-option v-for="item2 in item.templateList" :key="item2.id" :label="item2.name" :value="item2.id"></el-option>
              </el-select>
            </div>
          </div>
        </el-checkbox-group>
      </el-form-item>
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
        // 接收人
        receive: 1,
        // 发送方式
        sendType: '1',
        // 同步渠道
        synchChannels: []
      },
      synchChannels: [
        { label: '短信', templateList: [{ name: '活动1', id: 1 }], id: 1, selectActivity: 1 },
        { label: '微信订阅消息', templateList: [], id: 2, selectActivity: null },
        { label: 'APP通知', templateList: [], id: 3, selectActivity: null }
        
      ],
      sendTime: '',
      rules: {
        type: [{ required: true, message: '请选择', trigger: 'blur' }],
        synchChannels: [{ required: true, message: '请选择', trigger: 'blur' }],
        sendType: [{ required: true, message: '请选择', trigger: 'blur' }]
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
.containers {
  padding: 20px 0px 0px 30px;
}
.synch-channels {
  display: flex;
  flex-direction: column;
}
.select{
width: 400px;
}
.el-checkbox{
  width: 130px;
}
</style>
