<template>
  <Panel>
    <a-spin :spinning="fetchLoading">
      <a-form :model="formState" @finish="onSubmit">
        <a-form-item label="通知类型" name="type">
          <a-radio-group v-model:value="formState.type" :options="NOTICE_TYPE_OPTIONS_NOALL" />
        </a-form-item>
        <a-form-item label="通知对象">
          <a-radio-group v-model:value="formState.receive" :options="RECEIVE_TYPE_OPTIONS" />
        </a-form-item>
        <!-- 接收人相关 -->
        <div style="margin-top: -20px" class="mb20">
          <!-- 指定职位 -->
          <div class="mt10" v-if="isPOSITION">
            <a-select
              size="large"
              style="width: 500px"
              allow-clear
              :filterOption="(inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0"
              v-model:value="receiverList"
              placeholder="请选择职位"
              mode="multiple"
              :options="memberPostList"
            />
          </div>
          <!-- 指定部门 -->
          <div class="mt10" v-if="isDEPARMENT">
            <a-tree-select
              v-model:value="receiverList"
              size="large"
              style="width: 500px"
              show-search
              :showCheckedStrategy="TreeSelect.SHOW_ALL"
              placeholder="请选择部门"
              treeDefaultExpandAll
              multiple
              allow-clear
              treeCheckable
              :dropdown-style="{ maxHeight: '600px', overflow: 'auto' }"
              :tree-data="departmentList"
              :field-names="{
                children: 'departmentRespList',
                label: 'departmentName',
                value: 'id'
              }"
              :filterTreeNode="
                (input, option) => {
                  return option.departmentName.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              "
            ></a-tree-select>
          </div>
          <div class="receiveBox mt10" v-if="!((isDEPARMENT || isPOSITION) && !receiverList.length)">
            <a-spin :spinning="seletedNum.loading"
              ><a-tag color="success">已选{{ seletedNum.num }}人</a-tag>
              <a-button class="ml20" type="primary" @click="receiverDialogVisible = true">{{
                formState.receive === RECEIVER_TYPE.MEMBER_SPECIFY ? '选择' : '查看'
              }}</a-button></a-spin
            >
          </div>
          <a-checkbox
            class="mt10"
            style="width: 400px"
            v-model:checked="formState.receiverRemove"
            v-if="isINVESTMENT || isACTIVITY || isInvitation"
          >
            {{ isInvitation ? '接收人名单剔除已激活人员' : '接收人名单剔除未报名当前活动的会员' }}
          </a-checkbox>
        </div>

        <!-- 关联活动详情  为活动通知或招商活动的时候显示-->
        <div v-if="isACTIVITY || isINVESTMENT" class="label-item">
          <div class="title-hd">关联活动详情 <span>（必填，配置会内通知"立即进入活动详情"跳转页）</span></div>

          <a-form-item name="activityData" :rules="[{ required: true, message: '请选择活动' }]">
            <a-tag
              v-model:value="formState.activityData"
              v-if="formState.activityData && formState.activityData.activityName"
              closable
              @close="formState.activityData = null"
            >
              {{ formState.activityData.activityName }}
            </a-tag>
            <a-button type="primary " @click="$refs.activityDialogRef.open()">选择活动</a-button>
          </a-form-item>
          <activityDialog
            ref="activityDialogRef"
            v-model:value="formState.activityData"
            :activity-type="formState.type"
          />
        </div>
        <!-- 通知详情  为自定义通知的时候显示-->
        <div v-if="isCustomNotice" class="label-item">
          <div class="title-hd">通知详情 <span>(必填将推送到小程序/APP的会内通知) </span></div>
          <a-form-item label="消息标题" name="title" :rules="[{ required: true, message: '请填写消息标题' }]">
            <a-input
              v-model:value="formState.title"
              placeholder="请输入消息标题"
              style="width: 500px"
              :maxlength="60"
              show-count
            />
          </a-form-item>
          <a-form-item label="消息内容" name="content" :rules="[{ required: true, message: '请填写消息内容' }]">
            <a-textarea
              v-model:value="formState.content"
              placeholder="请输入言简意赅的内容"
              style="width: 600px"
              :maxlength="5000"
              show-count
            />
          </a-form-item>
          <a-form-item label="图片（选填）">
            <ImageUploader
              v-model:value="formState.imgs"
              multiple
              :size="20"
              :limit="IMG_MAXLEN"
              :pattern="new RegExp(/\.(?:png|jpg)$/i)"
            >
              <div v-if="formState.imgs.length < IMG_MAXLEN">
                <plus-outlined />
                <div class="ant-upload-text">上传照片</div>
                <div class="ant-upload-text">({{ formState.imgs.length }} / {{ IMG_MAXLEN }})</div>
              </div>
            </ImageUploader>
          </a-form-item>
          <!-- 图片 -->
        </div>
        <!-- 节日海报选择 -->

        <div v-if="formState.type === NOTIFICATION_TYPE.POSTER" class="label-item">
          <div class="title-hd">节日海报选择 <span>(必填，配置会内通知"立即进入活动详情"跳转页) </span></div>
          <a-form-item label="节日海报" name="posterId" :rules="[{ required: true, message: '请选择节日海报' }]">
            <a-select
              v-model:value="formState.posterId"
              show-search
              @search="handlePosterSearch"
              placeholder="请选择海报"
              :options="posterList"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              style="width: 300px"
              :field-names="{ label: 'title', value: 'id' }"
            />
          </a-form-item>
        </div>
        <!-- 同步渠道 -->
        <div class="title-hd">
          推送平台 <span> ( {{ isCustomNotice ? '选填' : '必填' }}，可多选) </span>
        </div>
        <a-form-item
          label=""
          name="synchChannels"
          :rules="[{ required: isCustomNotice ? false : true, message: '请勾选渠道并选择模板' }]"
        >
          <!-- 绑Number类型id，发请求时在组装对象 -->
          <a-checkbox-group v-model:value="formState.synchChannels" name="checkboxgroup">
            <div class="synch-channels">
              <div v-for="item in synchChannels" :key="item.id">
                <a-checkbox :value="item.id" :disabled="!item.templateList.length">{{ item.label }}</a-checkbox>
                <a-select
                  v-model:value="formState.activityChannels[item.id]"
                  class="select"
                  placeholder="选择模板"
                  :options="item.templateList"
                  :field-names="{ label: 'name', value: 'id' }"
                />
                <span style="margin-left: 8px">
                  <a-button
                    v-if="formState.activityChannels[item.id]"
                    @click="showTemplate(formState.activityChannels[item.id], item.id)"
                    >预览</a-button
                  >
                  <span
                    v-if="item.templateList.length > 0 && ckey && item.id === SYNC_CHANNELS_ID.NOTE"
                    class="remain-sum"
                  >
                    剩余短信{{ item.templateList[0].remainSum }}条</span
                  ></span
                >
              </div>
            </div>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="发送方式">
          <div class="flex-x">
            <a-radio-group v-model:value="formState.sendType" :options="SEND_TYPE_OPTIONS" />
            <a-form-item
              v-if="formState.sendType === SEND_TYPE.TIMING"
              style="height: 0px; margin-top: -5px"
              name="sendTs"
              :rules="[
                {
                  required: true,
                  message: '请选择发送时间'
                }
              ]"
            >
              <a-date-picker
                v-model:value="formState.sendTs"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                showTime
                placeholder="请选择发送时间"
              ></a-date-picker>
            </a-form-item>
          </div>
        </a-form-item>
        <a-form-item
          name="agreeRule"
          :rules="[
            {
              required: true,
              validator: async (rule, value) => {
                if (!value || !value.length) throw '请同意《通知发送规则》'
              }
            }
          ]"
        >
          <!-- 通知发送规则 -->
          <a-checkbox-group v-model:value="formState.agreeRule">
            <a-checkbox :value="true">已阅读并同意</a-checkbox>
          </a-checkbox-group>
          <a-button class="agreeRule_btn" type="link" @click="showSendRule">《通知发送规则》</a-button>
        </a-form-item>
        <a-form-item>
          <a-button size="large" class="mr20" type="primary" :loading="submitLoading" html-type="submit">发送</a-button>
          <a-button size="large">取消</a-button>
        </a-form-item>
      </a-form>
    </a-spin>

    <!-- 模板预览dialog -->
    <a-modal v-model:visible="previewModal.visible" title="预览">
      <Preview
        :infoData="previewModal.infoData"
        :type="previewModal.type"
        :variable-attributes="previewModal.subscribeComputed"
      ></Preview>
      <template #footer>
        <a-button type="primary" @click="previewModal.visible = false">我知道啦</a-button>
      </template>
    </a-modal>

    <ReceiverDialog
      v-model:visible="receiverDialogVisible"
      :id="route.query.id"
      :selectedList="receiverList"
      :type="formState.receive"
      @receiverChange="val => (receiverList = val)"
      @seletedNumChange="seletedNumChange"
    ></ReceiverDialog>
  </Panel>
</template>

<script setup>
import activityDialog from './components/activityDialog.vue'
import {
  selectTemplateList,
  getNoticeTemplateSetDetailById,
  memberPostList as getMemberPostList
} from '@/api/mass-notification/index'
import { useFetchDetail } from './use/useFetchData'
import { useSubmitData } from './use/useSubmitData'
import { usePosterList } from '@/views/content/poster/usePoster'
import { useRoute } from 'vue-router'
import ReceiverDialog from '../ReceiverDialog.vue'
import Preview from '../templateLibrary/components/Preview'
import { Tag as ATag, Modal, Message, TreeSelect } from 'ant-design-vue'
import { ref, reactive, inject, watch, computed } from 'vue'
import { getDepartmentList } from '@/api/org-structure/org'
import {
  RULE_STRING,
  NOTIFICATION_TYPE,
  NOTICE_TYPE_OPTIONS,
  RECEIVER_TYPE,
  RECEIVE_TYPE_OPTIONS,
  SEND_TYPE_OPTIONS,
  SEND_TYPE,
  IMG_MAXLEN,
  SYNC_CHANNELS_ID,
  SYNC_CHANNELS_ID_MAP
} from '@/constant/mass-notification'
const route = useRoute()

const NOTICE_TYPE_OPTIONS_NOALL = computed(() =>
  NOTICE_TYPE_OPTIONS.filter(item => item.value !== NOTIFICATION_TYPE.ALL)
)
/** 自定义通知 */
const isCustomNotice = computed(() => formState.type === NOTIFICATION_TYPE.CUSTOM)
/** 邀请入会 */
const isInvitation = computed(() => formState.type === NOTIFICATION_TYPE.INVITATION)
/** 招商活动 */
const isINVESTMENT = computed(() => formState.type === NOTIFICATION_TYPE.INVESTMENT)
/** 活动通知  */
const isACTIVITY = computed(() => formState.type === NOTIFICATION_TYPE.ACTIVITY)

/** 接收人：指定部门 */
const isDEPARMENT = computed(() => formState.receive === RECEIVER_TYPE.DEPARMENT_SPECIFY)
/** 接收人：指定职位 */
const isPOSITION = computed(() => formState.receive === RECEIVER_TYPE.POSITION_SPECIFY)

const formState = reactive({
  type: NOTIFICATION_TYPE.PAYMENT,
  receive: RECEIVER_TYPE.MEMBER_SELF,
  imgs: [],
  sendType: 1,
  posterId: route.query.posterId || '',
  receiverList_member: [],
  receiverList_department: [],
  receiverList_position: [],
  /** 选中的渠道模板 */
  activityChannels: [],
  activityData: null
})

const ckey = inject('ckey')
/** 接收人总数 */
const seletedNum = reactive({ loading: false, num: 0 })
const seletedNumChange = (val, type) => {
  if (type !== formState.receive) return
  if (val !== -1) {
    seletedNum.loading = false
    seletedNum.num = val
    return
  }
  seletedNum.loading = true
}
const previewModal = reactive({
  visible: false
})
/**  点击预览渠道 */
const showTemplate = async (id, type) => {
  const { data } = await getNoticeTemplateSetDetailById({ id })
  previewModal.infoData = data
  previewModal.visible = true
  previewModal.type = type
}

const synchChannels = ref()
const receiverDialogVisible = ref(false)

/** 外部传入默认类型 */
if (route.query.type) {
  formState.type = Number(route.query.type)
}

const query = ref({ page: 1, pageSize: 20, title: '' })
const handlePosterSearch = val => {
  query.value.title = val
}

const { list: posterList } = usePosterList(query)

// 避免切换接收人时，之前的数组丢失
const receiverList = computed({
  get() {
    let list = []
    switch (formState.receive) {
      case RECEIVER_TYPE.DEPARMENT_SPECIFY:
        list = formState.receiverList_department
        break
      case RECEIVER_TYPE.POSITION_SPECIFY:
        list = formState.receiverList_position
        break
      case RECEIVER_TYPE.MEMBER_SPECIFY:
        list = formState.receiverList_member
        break
    }
    return list
  },
  set(val) {
    switch (formState.receive) {
      case RECEIVER_TYPE.DEPARMENT_SPECIFY:
        formState.receiverList_department = val
        break
      case RECEIVER_TYPE.POSITION_SPECIFY:
        formState.receiverList_position = val
        break
      case RECEIVER_TYPE.MEMBER_SPECIFY:
        formState.receiverList_member = val
        break
    }
    // 保存当前值
    formState.receiverList = val
  }
})
// 初始化
receiverList.value = []
const memberPostList = ref([])
const departmentList = ref([])
const { handleSubmit, submitLoading } = useSubmitData(formState, departmentList, memberPostList)
const { fetchDetail, isEdit, fetchLoading } = useFetchDetail(formState, route.query.id, receiverList)

const showSendRule = () => {
  Modal.info({
    title: '通知发送规则',
    content: RULE_STRING
  })
}

const onSubmit = () => {
  if (formState.imgs.length > IMG_MAXLEN && isCustomNotice.value) {
    Message.error(`最多上传${IMG_MAXLEN}张照片,你已上传${formState.imgs.length}张`)
    return
  }
  Modal.confirm({
    title: '提示',
    content: '确认发送该通知嘛?',
    onOk() {
      handleSubmit(isEdit.value)
    }
  })
}
const getTemplateUtil = () => {
  const getTemplateList = async channelTypeId => {
    const noticeTypeId = formState.type
    const { data } = await selectTemplateList({ channelTypeId, noticeTypeId, ckey: ckey.value })

    synchChannels.value.push({
      label: SYNC_CHANNELS_ID_MAP.get(channelTypeId),
      templateList: data,
      id: channelTypeId
    })
  }
  // 初始化
  synchChannels.value = []
  // 除了邀请入会只有短信1，其他都是三个渠道
  getTemplateList(SYNC_CHANNELS_ID.NOTE)
  if (isInvitation.value) return
  getTemplateList(SYNC_CHANNELS_ID.APP)
  getTemplateList(SYNC_CHANNELS_ID.SUBSCRIBE)
}

// 拉取部门
const getDepartmentListFunc = async () => {
  const { data } = await getDepartmentList({ ckey: ckey.value, parentId: 0 })
  departmentList.value = data?.data[0]?.departmentRespList || []
}
// 拉取职位
const getMemberPostListFunc = async () => {
  const { data } = await getMemberPostList({ ckey: ckey.value })
  data.forEach(item => {
    item.label = `${item.postName}(${item.memberNum})`
    item.value = item.id
  })
  memberPostList.value = data
}
// 解决编辑时回显和type改变置空已选渠道数据冲突
let firstFetch = false
watch(
  () => formState.type,
  () => {
    if (!firstFetch) {
      // 置空已选渠道数据
      formState.activityChannels = []
      formState.synchChannels = []
      formState.activityData = null
    } else {
      firstFetch = false
    }
    // 重新请求同步渠道数据
    getTemplateUtil()
  },
  { immediate: true }
)
getDepartmentListFunc()
getMemberPostListFunc()
if (route.query.id) {
  fetchDetail()
  firstFetch = true
}
</script>

<style lang="scss" scoped>
.synch-channels {
  display: flex;
  flex-direction: column;
}
.select {
  width: 400px;
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
.remain-sum {
  color: #f5222d;
  font-size: 14px;
  margin-left: 8px;
}
.agreeRule_btn {
  :deep(span):hover {
    text-decoration: underline;
  }
  border: 0;
  padding: 0;
}
.ant-checkbox-wrapper {
  width: 120px;
  margin-bottom: 10px;
}
.receiveBox {
  border: 1px solid #dcdfe6;
  cursor: pointer;
  border-radius: 4px;
  height: 40px;
  width: 200px;
  padding: 0 10px;
  line-height: 40px;
}
</style>
