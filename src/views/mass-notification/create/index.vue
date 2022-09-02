<template>
  <div class="containers">
    <el-form :rules="rules">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="(item, index) in labelList" :key="index" :label="item.type">{{ item.n }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 接收人 -->
      <ReceiveForm :ckey="ckey" :receive-list="receiveList" />
      <!-- 关联活动详情  为活动通知或招商活动的时候显示-->
      <div v-if="form.type === 2 || form.type === 3" class="label-item">
        <div class="title-hd">关联活动详情 <span>（必填，配置会内通知"立即进入活动详情"跳转页）</span></div>
        <!-- <el-form-item label="关联活动详情" prop="sendType"> </el-form-item> -->
        <el-tag
          v-for="tag in activityList"
          :key="tag.id"
          class="activity-tab"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag.activityName}}
        </el-tag>
        <el-button size="small " type="primary " @click="selectActivity">选择活动</el-button>
      </div>
      <!-- 通知详情  为自定义通知的时候显示-->

      <div v-if="form.type === 5" class="label-item">
        <div class="title-hd">通知详情 <span>(必填将推送到小程序/APP的会内通知) </span></div>
        <el-form-item label="消息标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入消息标题"
            class="detail-input"
            type="text"
            maxlength="60"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="消息内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            placeholder="请输入言简意赅的内容"
            maxlength="5000"
            style="width: 600px"
            show-word-limit
          ></el-input>
        </el-form-item>
        <!-- 图片 -->
        <div >
          <div class="img-msg">图片（选填）</div>
          <div class="img-containers">
 <div v-for="item in form.imgList" :key="item" class="img-list">
            <img class="img" :src="item" />
            <div class="hover-msg">
              <div>
                <i class="el-icon-zoom-in preview" @click="preview"></i>
              <i class="el-icon-delete close" ></i>
              </div>
              
            </div>
          </div>

          <el-upload
            v-if="form.imgList.length < 9"
            action="/"
            class="uploader"
            :show-file-list="false"
            :on-remove="handleRemove"
            :before-upload="function (file) { return beforeAvatarUpload(file)}"
            :http-request="function (content) { return upload(content)} "
          >
            
            <div class="upload-msg">
              <i class="el-icon-plus"></i>
              <span>上传图片</span>
              <span>({{ form.imgList.length }} /9)</span>
            </div>
          </el-upload>
          </div>
         
        </div>
      </div>

     

      <!-- 同步渠道 -->
      <el-form-item label="同步渠道" prop="synchChannels">
        <el-checkbox-group v-model="form.synchChannels">
          <div class="synch-channels">
            <div v-for="item in synchChannels" :key="item.id">
              <el-checkbox :label="item" :disabled="!item.templateList.length > 0">{{ item.label }}</el-checkbox>
              <el-select v-model="item.selectActivity" class="select" placeholder="选择模板">
                <el-option
                  v-for="item2 in item.templateList"
                  :key="item2.id"
                  :label="item2.name"
                  :value="item2.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </el-checkbox-group>
      </el-form-item>
       <!-- 发送方式 -->
      <el-form-item label="发送方式" prop="sendType">
        <el-radio-group v-model="form.sendType">
          <el-radio label="1">立即发送</el-radio>
          <el-radio label="2 ">定时发送</el-radio>
          <el-date-picker v-if="form.sendType == 2" v-model="sendTime" type="datetime" placeholder="请选择发送时间">
          </el-date-picker>
        </el-radio-group>
      </el-form-item>
      <!-- 通知发送规则 -->
       <el-checkbox v-model="form.agreeRule">已阅读并同意</el-checkbox>
        <el-link type="primary" @click="showSendRule">《通知发送规则》</el-link> 

        <el-form-item style="margin-top:10px">
    <el-button type="primary" @click="onSubmit">发送</el-button>
    <el-button>取消</el-button>
  </el-form-item>
    </el-form>

<kdDialog ref="kdDialog" :custom-footer="true" dialog-title="通知发送规则" :center="true" >
  <div slot="content">
    规则说明，文案先找业务定一下
  </div>
  <el-button slot="customFooter" type="primary" @click="hideSendRule">我知道啦</el-button>
</kdDialog>
<activityDialog ref="activityDialogRef" @addActivity="function addActivity(val){activityList=val}" v-if="showActivityDialog"></activityDialog>
  </div>
</template>

<script>
import { labelType, receiveType } from '../util/label'
import { uploadCoverImg } from '@/api/content/article'
import ReceiveForm from './components/receiveForm.vue'
import kdDialog from '@/components/common/kdDialog'
import activityDialog from './components/activityDialog.vue'
export default {
  name: 'Create',
  components: { ReceiveForm, kdDialog, activityDialog },
  data() {
    return {
      labelList: [],
      receiveList: [],
      form: {
        // 类型
        type: 3,
        // 接收人
        receive: 1,
        // 发送方式
        sendType: '1',
        // 同步渠道
        synchChannels: [],
        agreeRule: false,

        // 自定义通知相关
        title: '', // 消息标题
        content: '', // 消息内容
        imgList: [] // 图片
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
        sendType: [{ required: true, message: '请选择', trigger: 'blur' }],
        title: [{ required: true, message: '请填写', trigger: 'blur' }],
        content: [{ required: true, message: '请填写', trigger: 'blur' }]
      },
      // 显示活动弹框
      showActivityDialog: true,
      //已选活动列表
      activityList:[]
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
    // 删除已选活动
    handleClose(tag) {
      const {id}=tag
      const {activityList}=this;
    activityList.splice(activityList.findIndex(item=>item.id===id),1)
     this.activityList=activityList
    },
    // 点击通知发送规则
    showSendRule(){
      this.$refs['kdDialog'].show()
    },
    // 关闭通知发送规则
    hideSendRule(){
      this.$refs['kdDialog'].hide()
    },
    // 打开选择活动弹框
    selectActivity(){
      // this.showActivityDialog = true
      this.$refs['activityDialogRef'].open()
    },
    // 提交表单
    onSubmit(){},
    /** 父子组件交互 */
    /** 工具 */
    restTypeData() {
      const { ckey } = this
      // 判断是否是总后台 类型：总后台显示1和3的show类型
      this.labelList = ckey ? labelType.filter(item => item.show !== 1) : labelType.filter(item => item.show !== 2)
      this.receiveList = ckey
        ? receiveType.filter(item => item.show !== 1)
        : receiveType.filter(item => item.show !== 2)
    },
    // 图片上传前校验
    beforeAvatarUpload(file, index) {
      console.log('file', file)
      this.uploadIndex = index
      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
    },
    // 上传
    async upload(content, type) {
      try {
        let formData = new FormData()
        formData.append('file', content.file)
        const res = await uploadCoverImg(formData)
        if (res.state === 1) {
          this.form.imgList.push(res.data.filePath)
        } else {
          this.$message.error(res.msg)
        }
      } catch (error) {}
    },
    handleRemove() {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.detail-input {
  width: 500px;
  // display: block;
}
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
.select {
  width: 400px;
}
.el-checkbox {
  width: 130px;
}
.el-form-item {
  margin-bottom: 10px;
}
.activity-tab {
  margin: 0px 10px 6px 0px;
}
/deep/ .el-upload {
  width: 148px;
  height: 148px;
}

.upload-msg {
  display: flex;
  flex-direction: column;
  align-content: center;
  margin-top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
}
.img-msg{
  font-size: 14px;
  margin-bottom: 10px;
}
.img-containers {
  display: flex;
  max-width: 500px;
  flex-wrap: wrap;
  .img-list {
    position: relative;
    margin: 5px;
    margin: 0px 5px 5px;
    width: 148px;
    height: 148px;
   cursor:pointer
  }
  
 
  .hover-msg {
    // display: none;
    position: absolute;
    top: 0px;
    right: 0;
     width: 148px;
    height: 148px;
 background-color: rgba(0, 0, 0, .5);
    z-index: 2;
    text-align: center;
    line-height: 148px;
    display: none;
    .preview ,.close{
     color: white;
    }
    
  }
  .img-list:hover .hover-msg{
 display: block;
  }
  
  .img {
    position: absolute;
    z-index: 1;
  }
  .uploader,
  .img {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    width: 148px;
    height: 148px;
  }
}

.label-item {
  margin-bottom: 20px;
  .title-hd {
    background-color: #f2f2f2;
    padding: 10px 5px;
    font-weight: 700;
    font-style: normal;
    font-size: 16px;
    margin-bottom: 10px;
    span {
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      color: #767676;
      margin-left: 10px;
    }
  }
}
</style>
