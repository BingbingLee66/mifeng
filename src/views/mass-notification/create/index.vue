<template>
  <div class="containers">
    <el-form ref="indexFormRef" :rules="rules" :model="form">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="(item, index) in labelList" :key="index" :label="item.type">{{ item.n }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 接收人 -->
      <ReceiveForm ref="receiveForm" :ckey="ckey" :activity-type="form.type" :receive="form.receive" :receive-list="receiveList" @receiveChange="receiveChange" />
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
          {{ tag.activityName }}
        </el-tag>
        <el-button size="small " type="primary " @click="selectActivity">选择活动</el-button>
      </div>
      <!-- 通知详情  为自定义通知的时候显示-->

      <div v-if="form.type === 5" class="label-item">
        <div class="title-hd">通知详情 <span>(必填将推送到小程序/APP的会内通知) </span></div>
        <el-form-item label="消息标题" prop="title" style="margin-bottom:20px">
          <el-input
            v-model="form.title"
            placeholder="请输入消息标题"
            class="detail-input"
            type="text"
            maxlength="60"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="消息内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            placeholder="请输入言简意赅的内容"
            maxlength="5000"
            style="width: 600px"
            show-word-limit
          />
        </el-form-item>
        <!-- 图片 -->
        <div>
          <div class="img-msg">图片（选填）</div>
          <div class="img-containers">
            <div v-for="item in form.imgs" :key="item" class="img-list">
              <img class="img" :src="item">
              <div class="hover-msg">
                <div>
                  <i class="el-icon-zoom-in preview" @click="preview(item)" />
                  <i class="el-icon-delete close" @click="deleteImg(item)" />
                </div>
              </div>
            </div>

            <el-upload
              v-if="form.imgs.length < 9"
              action="/"
              class="uploader"
              :show-file-list="false"
              :on-remove="handleRemove"
              :before-upload="function(file) { return beforeAvatarUpload(file)} "
              :http-request="function(content) { return upload(content) }"
            >
              <div class="upload-msg">
                <i class="el-icon-plus" />
                <span>上传图片</span>
                <span>({{ form.imgs.length }} /9)</span>
              </div>
            </el-upload>
          </div>
        </div>
      </div>

      <!-- 同步渠道 -->
      <div class="title-hd">同步渠道 <span>(选填，可多选) </span></div>
      <el-form-item label="">
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
                />

              </el-select>
              <span style="margin-left:8px"><el-button v-if="item.selectActivity" @click="showTemplate(item)">预览</el-button> <span v-if="item.templateList.length>0 &&ckey" class="remain-sum"> 剩余短信{{ item.templateList[0].remainSum }}条</span></span>
            </div>
          </div>
        </el-checkbox-group>
      </el-form-item>
      <!-- 发送方式 -->
      <el-form-item label="发送方式" prop="sendType">
        <el-radio-group v-model="form.sendType">
          <el-radio label="1">立即发送</el-radio>
          <el-radio label="2">定时发送</el-radio>
          <el-date-picker v-if="form.sendType == 2" v-model="form.sendTs" type="datetime" value-format="timestamp" placeholder="请选择发送时间" />
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
    <!-- 通知发送规则dialog -->
    <kdDialog ref="kdDialog" :custom-footer="true" dialog-title="通知发送规则" :center="true">
      <div slot="content">
        规则说明，文案先找业务定一下
      </div>
      <el-button slot="customFooter" type="primary" @click="hideSendRule">我知道啦</el-button>
    </kdDialog>
    <!-- 图片预览dialog -->
    <kdDialog ref="imgDialog" :custom-footer="true" dialog-title="图片预览" :center="true">
      <div slot="content">
        <img :src="currentImg" class="preview-img">
      </div>
      <!-- <el-button slot="customFooter" type="primary" @click="hideSendRule">我知道啦</el-button> -->
    </kdDialog>
    <!-- 选择活动dialog -->
    <activityDialog

      ref="activityDialogRef"
      :activity-list="activityList"
      :activity-type="form.type"
      @addActivity="
        function addActivity(val) {
          activityList = val
        }
      "
    />
    <!-- 模板预览dialog -->
    <kdDialog ref="previewDialog" dialog-title="预览" :custom-footer="true" :center="true">
      <div slot="content">
        <div class="preview">
          <detailsApp v-if="showApp && currentShowType === 3" :info-date="infoData" />
          <detailsNote v-if="showNote && currentShowType === 1" :info-date="infoData" />
          <detailsSubscribe v-if="showSubscribe && currentShowType === 2" :variable-attributes="subscribeComputed" />
        </div>
      </div>
      <el-button slot="customFooter" type="primary" @click="hidePreviewDialog">我知道啦</el-button>
    </kdDialog>

  </div>
</template>

<script>
import { labelType, receiveType } from '../util/label'
import { uploadFile } from '@/api/content/article'
import { selectTemplateList, getNoticeTemplateSetDetailById, selectTemplateListAdmin, sendMsg } from '@/api/mass-notification/index'
import ReceiveForm from './components/receiveForm.vue'
import kdDialog from '@/components/common/kdDialog'
import activityDialog from './components/activityDialog.vue'
export default {
  name: 'Create',
  components: { ReceiveForm, kdDialog, activityDialog,
    detailsApp: () => import('../templateLibrary/components/details-app'),
    detailsNote: () => import('../templateLibrary/components/details-note'),
    detailsSubscribe: () => import('../templateLibrary/components/details-subscribe'), },

  data() {
    return {
      // 当前id,仅编辑时有效
      id: null,
      ckey: null,
      labelList: [],
      receiveList: [],
      form: {
        // 类型
        type: 2,
        // 接收人
        receive: 1,
        // 发送方式
        sendType: '1',
        // 同步渠道
        synchChannels: [],
        agreeRule: false,
        sendTs: '',
        receiverRemove: 2,

        // 自定义通知相关
        title: '', // 消息标题
        content: '', // 消息内容
        imgs: [] // 图片
      },
      synchChannels: [
        { label: '短信', templateList: [], id: 1 },
        { label: '微信订阅消息', templateList: [], id: 2 },
        { label: 'APP通知', templateList: [], id: 3 }
      ],

      rules: {
        type: [{ required: true, message: '请选择', trigger: 'blur' }],
        // synchChannels: [
        //   // { required: true, message: '请选择', trigger: 'blur' },
        //  { validator: validateSynchChannels, trigger: 'blur' }],
        sendType: [{ required: true, message: '请选择', trigger: 'blur' }],
        title: [{ required: true, message: '请填写', trigger: 'blur' }],
        content: [{ required: true, message: '请填写', trigger: 'blur' }]
      },
      // 显示活动弹框
      showActivityDialog: true,
      // 已选活动列表
      activityList: [],
      // 当前正在预览的图片
      currentImg: '',
      // 当前正在预览的模板类型
      currentShowType: 1,
      // showApp通知
      showApp: false,
      // show短信
      showNote: false,
      // show 订阅消息
      showSubscribe: false,
      infoData: null

    }
  },
  computed: {
    subscribeComputed() {
      const { infoData } = this
      return infoData && infoData.keyValueNoticeTemplateSetVo && infoData.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList
    }
  },
  watch: {
    'form.type'() {
      this.activityList = []
      // 置空活动表格已选
      this.$refs['activityDialogRef'].$refs['table'] && this.$refs['activityDialogRef'].$refs['table'].cancelSelect()
    }
  },
  created() {
    const { ckey } = this.$store.getters
    this.ckey = ckey
    this.restTypeData()
    //
    this.id = this.$route.query.id || null
    console.log('this.$route.params.id', this.$route.query.id)

    // 除了邀请入会只有短信1，其他都是三个渠道
    if (this.form.type === 4) {
      this.selectTemplateListFunc(1)
    } else {
      // 请求每次只能请求一种，所以要请求3次
      for (let i = 1; i < 4; i++) {
        this.selectTemplateListFunc(i)
      }
    }
  },
  methods: {
    /** 请求 */
    async selectTemplateListFunc(channelTypeId) {
      // 拉取总后台
      let API = selectTemplateListAdmin
      // 商会后台
      const {
        ckey,
        form: { type: noticeTypeId }
      } = this
      if (ckey) {
        API = selectTemplateList
      }
      const { data } = await API({ channelTypeId, noticeTypeId, ckey })
      this.synchChannels[channelTypeId - 1].templateList = data || []
    },
    //
    async send(params) {
      const res = await sendMsg(params)
      if (res.state === 1) {
        this.$message.success('操作成功')
      } else {
        this.$message.error(res.msg)
      }
    },
    // 模板设置详情
    async getNoticeTemplateSetDetailById(id) {
      console.log(id)
      const { data } = await getNoticeTemplateSetDetailById({ id })
      this.infoData = data
    },
    /** 行为操作 */
    // 关闭预览弹框
    hidePreviewDialog() {
      this.$refs['previewDialog'].hide()
    },
    // 点击预览渠道
    showTemplate(item) {
      const { selectActivity, id } = item
      this.$refs['previewDialog'].show()
      if (id === 1) {
        this.currentShowType = 1
        this.showNote = true
      } else if (id === 2) {
        this.currentShowType = 2
        this.showSubscribe = true
      } else if (id === 3) {
        this.currentShowType = 3
        this.showApp = true
      }
      this.getNoticeTemplateSetDetailById(selectActivity)

      console.log('item', item)
    },
    // 删除已选活动
    handleClose(tag) {
      const { id } = tag
      const { activityList } = this
      activityList.splice(activityList.findIndex(item => item.id === id), 1)
      this.activityList = activityList
    },
    // 点击通知发送规则
    showSendRule() {
      this.$refs['kdDialog'].show()
    },
    // 关闭通知发送规则
    hideSendRule() {
      this.$refs['kdDialog'].hide()
    },
    // 打开选择活动弹框
    selectActivity() {
      // this.showActivityDialog = true
      this.$refs['activityDialogRef'].open()
    },
    // 点击预览图片
    preview(val) {
      this.currentImg = val
      this.$refs['imgDialog'].show()
    },
    // 点击删除图片
    deleteImg(val) {
      this.form.imgs.splice(this.form.imgs.findIndex(item => item === val), 1)
    },
    // 提交表单
    onSubmit() {
      // 先校验
      console.log('创建群发通知')
      this.extendFunc()
      if (!this.verify()) return

      this.$refs['indexFormRef'].validate(valid => {
        if (valid) {
          const { ckey, form: { type: noticeTypeId, receiverRemove, receive: receiveTypeId, sendTs, sendType } } = this
          const params = {
            receiverRemove,
            channelTypeTemplateDTOS: this.form.synchChannels.map(item => ({
              channelTypeId: item.id,
              id: item.selectActivity
            })),
            //         接收人：当接收人类型为-1、1不用传;
            // 当接收人类型为2时传职位id集合({'receiverList': []});
            // 当接收人类型为3时，传部门id集合({'receiverList': []});
            // 当接收人类型为4时，传会员id集合({'receiverList': []});
            // 当接收人类型为5时，传商会ckey集合({'receiverList': []});
            // 当接收人类型为6时，传手机号集合({'receiverList': []});
            // 关联对象：
            // 当通知类型为1、4、5时不用传
            // 当通知类型为2时，{'associationId': 活动id}
            // 当通知类型为3时，{'associationId': 招商活动id}
            // 当通知类型为5时：
            // extend:{'title':'标题','content':'内容',imgs:['图片', '图片2']}
            extend: this.extendFunc(),
            ckey, noticeTypeId, receiveTypeId, sendTs, sendType
          }
          this.send(params)

          console.log('params', params)
        } else {
          return false
        }
      })
    },
    /** 父子组件交互 */
    receiveChange(val) {
      this.form.receive = val
    },
    /** 工具 */
    // 表单提交校验
    verify() {
      const {
        form: { type, agreeRule, sendType, sendTs },
        activityList
      } = this
      // 当sendType为2时，需要填写sendTs
      if (parseInt(sendType) === 2 && sendTs.length === 0) {
        this.$message.error('请选择发送时间')
        return false
      }
      // 渠道必填  现在为选填了
      // if (!synchChannels.length > 0) {
      //   this.$message.error('请选择同步渠道')
      //   return false
      // } else {
      //   let flag = false
      //   for (let item of synchChannels) {
      //     if (!item.selectActivity) {
      //       flag = true
      //       this.$message.error('请选择模板')
      //       break
      //     }
      //   }
      //   if (flag) return flag
      // }
      // 同意发送规则
      if (!agreeRule) {
        this.$message.error('请同意发送规则')
        return false
      }
      // 活动通知 、招商活动 已选活动列表必须大于0
      if (type === 2 || type === 3) {
        if (!activityList.length > 0) {
          this.$message.error('请选择关联活动详情')
          return false
        }
      } else if (type === 5) {
        // 自定义通知
      }

      // if(receive === -1){

      // }else if(receive === 6){

      // }
      return true
    },
    // extend扩展字段
    extendFunc() {
      const { form: { receive, type }, activityList } = this
      let obj = {}
      console.log('this.$refs[receiveForm].$data.form.department', this.$refs['receiveForm'].$data)
      const refData = this.$refs['receiveForm'].$data
      switch (receive) {
        case 2:
          // 职位id集合  todo 改为对象数组 {id：1，name:'aaa'}
          obj['receiverList'] = refData.form.position
          break
        case 3:
          // 传部门id集合  todo 改为对象数组 {id：1，name:'aaa'}
          obj['receiverList'] = refData.form.department.map(v => v.id)
          break
        case 4:
          // 会员id集合
          obj['receiverList'] = refData.selectMemberList.map(v => v.id)
          break
        case 5:
          // 商会ckey集合
          obj['receiverList'] = refData.selectMemberList.map(v => v.ckey)
          break
        case 6:
          // 手机号集合
          obj['receiverList'] = refData.form.phones.split('\n')
          break
        default:
      }
      // 当通知类型为2时，{'associationId': 活动id},当通知类型为3时，{'associationId': 招商活动id}
      if (type === 2 || type === 3) {
        obj['associationId'] = activityList[0] && activityList[0].id
      }
      if (type === 5) {
        const { form: { title, content, imgs } } = this
        const foo = { title, content, imgs }
        obj = Object.assign(obj, foo)
      }
      console.log('obj', obj)
      return obj
    },
    restTypeData() {
      const { ckey } = this
      // 判断是否是总后台 类型：总后台显示1和3的show类型
      this.labelList = ckey ? labelType.filter(item => item.show !== 1) : labelType.filter(item => item.show !== 2)
      this.receiveList = ckey
        ? receiveType.filter(item => item.show !== 1)
        : receiveType.filter(item => item.show !== 2)

      // 给type receive一个默认值
      this.form.type = this.labelList[0].type
      this.form.receive = this.receiveList[0].type
      console.log('父组件的create')
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
    async upload(content) {
      try {
        const formData = new FormData()
        formData.append('file', content.file)
        const res = await uploadFile(formData, 'notice')
        if (res.state === 1) {
          this.form.imgs.push(res.data)
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
// .preview{
//   position: fixed;
//   top: 20px;
//   right: 30%;
// }
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
/deep/ .el-form-item__error {
  left: 77px;
}

.upload-msg {
  display: flex;
  flex-direction: column;
  align-content: center;
  margin-top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
}
.img-msg {
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
    cursor: pointer;
  }

  .hover-msg {
    // display: none;
    position: absolute;
    top: 0px;
    right: 0;
    width: 148px;
    height: 148px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
    text-align: center;
    line-height: 148px;
    display: none;
    .preview,
    .close {
      color: white;
    }
  }
  .img-list:hover .hover-msg {
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
.preview-img {
  width: 100%;
  height: 100%;
}
.label-item {
  margin-bottom: 20px;
}
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
.remain-sum{
  color: #F5222D;
  font-size: 14px;
  margin-left: 8px;
}
</style>
