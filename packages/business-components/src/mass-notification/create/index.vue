<template>
  <Panel>
    <a-spin :spinning="fetchLoading">
      <a-form :model="formState" @finish="onSubmit">
        <a-form-item label="通知类型" name="type">
          <a-radio-group
            v-model:value="formState.type"
            :options="isMIfeng ? NOTICE_MIFENG_TYPE_OPTIONS_NOALL : NOTICE_ADMIN_TYPE_OPTIONS"
          />
        </a-form-item>
        <a-form-item label="通知对象">
          <template v-if="isQuestionnaire">
            <div v-if="isMIfeng">
              <a-radio-group
                class="mt5"
                :value="isPhoneCustom"
                :options="[
                  { label: '本会会员', value: false },
                  { label: '非本会会员', value: true }
                ]"
                @change="
                  formState.receive = $event.target.value ? RECEIVER_TYPE.PHONE_CUSTOM : RECEIVER_TYPE.MEMBER_SELF
                "
              />
            </div>
            <div v-if="(!isMIfeng && isPhoneCustom) || !isPhoneCustom">
              <a-radio-group
                v-model:value="formState.receive"
                :options="isMIfeng ? RECEIVE_MIFENG_TYPE_OPTIONS : RECEIVE_ADMIN_TYPE_OPTIONS_DISABLE"
              />
            </div>
          </template>
          <a-radio-group
            v-else
            v-model:value="formState.receive"
            :options="isMIfeng ? RECEIVE_MIFENG_TYPE_OPTIONS : RECEIVE_ADMIN_TYPE_OPTIONS_DISABLE"
          />
        </a-form-item>
        <div v-if="isPhoneCustom" style="margin-top: -20px" class="mb20">
          <a-form-item label="接收号码" name="receiverList_phone" :rules="customPhoneRules">
            <CustomPhones v-model:value="receiverList" v-model:type="formState.receiverList_phone_type" />
          </a-form-item>
        </div>
        <!-- 接收人相关:本商会会员 -->
        <div v-else style="margin-top: -20px" class="mb20">
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
            <a-spin :spinning="seletedNum.loading">
              <a-tag color="success">已选{{ seletedNum.num }}人</a-tag>
              <a-button class="ml20" type="primary" @click="receiverDialogVisible = true">{{
                [
                  RECEIVER_TYPE.MEMBER_SPECIFY,
                  RECEIVER_TYPE.CLERK_BACKGROUND,
                  RECEIVER_TYPE.CLERK_FRONT,
                  RECEIVER_TYPE.DESIGNATE_SELF
                ].includes(formState.receive)
                  ? '选择'
                  : '查看'
              }}</a-button>
            </a-spin>
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
        <a-form-item
          v-if="formState.type === NOTIFICATION_TYPE.CLASS"
          name="associationId"
          label="选择课程"
          :rules="[{ required: true, message: '请选择课程' }]"
        >
          <a-select
            v-model:value="formState.associationId"
            placeholder="请选择课程"
            :options="courseList"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            style="width: 300px"
            :field-names="{ label: 'name', value: 'id' }"
          />
        </a-form-item>
        <!-- 关联活动详情  为活动通知或招商活动的时候显示-->
        <div v-if="isACTIVITY || isINVESTMENT" class="label-item">
          <div class="title-hd">关联活动详情 <span>（必填，配置会内通知"立即进入活动详情"跳转页）</span></div>
          <a-form-item name="activityData" :rules="[{ required: true, message: '请选择活动' }]">
            <a-tag
              color="orange"
              v-model:value="formState.activityData"
              v-if="formState.activityData && formState.activityData.activityName"
              closable
              @close="formState.activityData = null"
            >
              {{ formState.activityData.activityName }}
            </a-tag>
            <a-image
              class="pr10"
              v-if="formState.activityData && formState.receive === RECEIVER_TYPE.CLERK_BACKGROUND"
              :src="formState.activityData.qrCode"
              :width="100"
              :height="100"
            ></a-image>
            <a-button type="primary" @click="activityVisible = true">选择活动</a-button>
          </a-form-item>
          <activityDialog
            v-model:visible="activityVisible"
            @addActivity="
              value => {
                formState.activityData = value
              }
            "
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
        <div v-if="isMIfeng && formState.type === NOTIFICATION_TYPE.POSTER" class="label-item">
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

        <!-- 关联问卷选择 -->
        <div v-if="isQuestionnaire" class="label-item">
          <div class="title-hd">关联问卷</div>
          <a-form-item name="questionnaire" :rules="[{ required: true, message: '请选择问卷' }]">
            <a-tag
              color="orange"
              v-model:value="formState.questionnaire"
              v-if="formState.questionnaire"
              closable
              @close="formState.questionnaire = null"
            >
              {{ formState.questionnaire.title }}
            </a-tag>
            <a-button type="primary" @click="questionnaireVisible = true">选择问卷</a-button>
            <a-form-item-rest>
              <QuestionnaireSelector v-model:value="formState.questionnaire" v-model:visible="questionnaireVisible" />
            </a-form-item-rest>
          </a-form-item>
        </div>

        <!-- 同步渠道 -->
        <div class="title-hd">
          推送平台 <span> ( {{ isCustomNotice ? '选填' : '必填' }}，可多选) </span>
        </div>
        <a-form-item v-if="!isFiveG && !isBackGound" name="synchChannels" :rules="synchChannelRules">
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
                    剩余短信{{ item.templateList[0].remainSum }}条
                  </span>
                </span>
              </div>
            </div>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item v-else-if="isBackGound" name="synchChannels">
          <a-form-item
            label="站内信标题"
            name="introduceTitle"
            :rules="[
              {
                required: true,
                message: '请输入站内信标题'
              }
            ]"
          >
            <a-input
              style="width: 40%"
              v-model:value="formState.introduceTitle"
              placeholder="请输入站内信标题"
              show-count
              :maxlength="50"
            ></a-input>
          </a-form-item>
          <a-form-item
            label="站内信"
            name="introduce"
            :rules="[
              {
                required: true,
                message: '请输入站内信'
              }
            ]"
          >
            <WangEditor
              v-model:content="formState.introduce"
              :imgUploadOption="imgUploadOption"
              :needLink="true"
              :imgUploadUrl="imgUploadUrl"
            ></WangEditor>
          </a-form-item>
        </a-form-item>
        <a-form-item
          v-else
          label="5G彩信"
          name="activityChannels"
          :rules="[{ required: true, message: '请选择需要发送的智信模板' }]"
        >
          <a-select
            v-model:value="formState.activityChannels[0]"
            placeholder="请选择模板"
            :options="synchChannels[0]?.templateList"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            style="width: 300px"
            :field-names="{ label: 'name', value: 'id' }"
          />
          <span style="margin-left: 8px">
            <a-button v-if="formState.activityChannels" @click="show5GTemplate(formState.activityChannels[0])">
              预览
            </a-button>
          </span>
          <slot name="Preview5G" :FiveG="FiveG"></slot>
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
      @receiverChange="receiverChange"
      @seletedNumChange="seletedNumChange"
    ></ReceiverDialog>
  </Panel>
</template>

<script setup>
import activityDialog from './components/activityDialog.vue'
import {
  selectTemplateList,
  selectTemplateListAdmin,
  getNoticeTemplateSetDetailById,
  memberPostList as getMemberPostList
} from '@business/common/src/mass-notification/api/index'
import { queryCourseList } from '@business/common/src/bossin/api'
import { useFetchDetail } from './use/useFetchData'
import { useSubmitData } from './use/useSubmitData'
import { usePosterList } from './use/usePoster'
import { useRoute } from 'vue-router'
import ReceiverDialog from '../ReceiverDialog'
import Preview from '../templateLibrary/components/Preview'
import { Tag as ATag, Modal, Message, TreeSelect } from 'ant-design-vue'
import { ref, reactive, inject, watch, computed, defineAsyncComponent, onMounted } from 'vue'
import { getDepartmentList } from '@business/common/src/org-structure/org'
import {
  RULE_STRING,
  NOTIFICATION_TYPE,
  NOTICE_MIFENG_TYPE_OPTIONS,
  NOTICE_ADMIN_TYPE_OPTIONS,
  RECEIVER_TYPE,
  RECEIVE_MIFENG_TYPE_OPTIONS,
  RECEIVE_ADMIN_TYPE_OPTIONS,
  SEND_TYPE_OPTIONS,
  SEND_TYPE,
  IMG_MAXLEN,
  SYNC_CHANNELS_ID,
  SYNC_CHANNELS_ID_MAP
} from '@business/common/src/mass-notification/constant/mass-notification'
import { phoneNumberReg } from '@business/common/src/mass-notification/constant/regExp'
import ImageUploader from '@business/components/src/upload/image-uploader/index'
import WangEditor from '@business/components/src/wangeditor/WangEditor.vue'

const ckey = inject('ckey')
const isMIfeng = computed(() => {
  return ckey.value !== null
})
const CustomPhones = defineAsyncComponent(() => import('./components/CustomPhones'))
const QuestionnaireSelector = defineAsyncComponent(() => import('./components/QuestionnaireSelector'))
const questionnaireVisible = ref(false)

const route = useRoute()

const NOTICE_MIFENG_TYPE_OPTIONS_NOALL = computed(() =>
  NOTICE_MIFENG_TYPE_OPTIONS.filter(item => item.value !== NOTIFICATION_TYPE.ALL)
)
const RECEIVE_ADMIN_TYPE_OPTIONS_DISABLE = computed(() => {
  return RECEIVE_ADMIN_TYPE_OPTIONS.map(item => {
    if (item.label === '秘书处后台') {
      item.disabled = [NOTIFICATION_TYPE.CUSTOM, NOTIFICATION_TYPE.FIVEG, NOTIFICATION_TYPE.QUESTIONNAIRE].includes(
        formState.type
      )
    }
    return item
  })
})
/** 自定义通知 */
const isCustomNotice = computed(() => formState.type === NOTIFICATION_TYPE.CUSTOM)
/** 邀请入会 */
const isInvitation = computed(() => formState.type === NOTIFICATION_TYPE.INVITATION)
/** 招商活动 */
const isINVESTMENT = computed(() => formState.type === NOTIFICATION_TYPE.INVESTMENT)
/** 活动通知  */
const isACTIVITY = computed(() => formState.type === NOTIFICATION_TYPE.ACTIVITY)
/** 问卷调查  */
const isQuestionnaire = computed(() => formState.type === NOTIFICATION_TYPE.QUESTIONNAIRE)
/** 5G彩信通知  */
const isFiveG = computed(() => formState.type === NOTIFICATION_TYPE.FIVEG)

/** 接收人：指定部门 */
const isDEPARMENT = computed(() => formState.receive === RECEIVER_TYPE.DEPARMENT_SPECIFY)
/** 接收人：指定职位 */
const isPOSITION = computed(() => formState.receive === RECEIVER_TYPE.POSITION_SPECIFY)
/** 接收人：非本会会员 */
const isPhoneCustom = computed(() => formState.receive === RECEIVER_TYPE.PHONE_CUSTOM)
/** 接收人：秘书处后台 */
const isBackGound = computed(() => formState.receive === RECEIVER_TYPE.CLERK_BACKGROUND)

const formState = reactive({
  type: isMIfeng.value ? NOTIFICATION_TYPE.PAYMENT : NOTIFICATION_TYPE.ACTIVITY,
  receive: RECEIVER_TYPE.ALL,
  imgs: [],
  sendType: 1,
  posterId: route.query.posterId || '',
  receiverList_member: [],
  receiverList_department: [],
  receiverList_position: [],
  receiverList_phone: [],
  receiverList_phone_type: 'input',
  /** 选中的渠道模板 */
  activityChannels: [],
  activityData: null,
  questionnaire: null // 关联问卷
})

// 自定义手机号规则
const customPhoneRules = [
  {
    required: true,
    trigger: ['blur', 'change'],
    async validator(rule, value) {
      if (formState.receiverList_phone_type !== 'input') return
      if (!value.length) return Promise.reject(new Error('请输入手机号'))
      await value.reduce(async (promise, phone) => {
        await promise
        if (phone && +phone && phoneNumberReg.test(phone)) return
        return Promise.reject(new Error(`"${phone}"格式有误。请输入正确的号码，多个手机号请换行隔开`))
      }, Promise.resolve())
    }
  }
]

const synchChannelRules = [
  {
    async validator(rule, value) {
      if (isCustomNotice.value) return
      if (!value.length) return Promise.reject(new Error('请勾选渠道并选择模板'))
      await value.reduce(async (promise, channelTypeId) => {
        await promise
        if (formState.activityChannels[channelTypeId]) return Promise.resolve()
        return Promise.reject(new Error(`请选择${SYNC_CHANNELS_ID_MAP.get(channelTypeId)}渠道模板`))
      }, Promise.resolve())
    }
  }
]

/** 富文本编辑器图片上传 */
const imgUploadUrl = process.env.VUE_APP_BASE_URL + '/api/ecservice/upload/richhtml-custom-img-upload'
const imgUploadOption = {
  uploadFileName: 'upload',
  imgUploadUrl,
  // 图片上传并返回了结果，想要自己把图片插入到编辑器中
  // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
  customInsertFunc: (insertImg, result) => {
    insertImg(result.data.filePath)
  }
}

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
const activityVisible = ref(false)
/**  点击预览渠道 */
const showTemplate = async (id, type) => {
  const { data } = await getNoticeTemplateSetDetailById({ id })
  previewModal.infoData = data
  previewModal.visible = true
  previewModal.type = type
}

const FiveG = reactive({
  visible: false
})
/**  点击5G预览渠道 */
const show5GTemplate = async id => {
  synchChannels.value[0]?.templateList.forEach(item => {
    if (item.id === id) FiveG.id = item.ntId
  })
  FiveG.visible = true
}

const synchChannels = ref()
const receiverDialogVisible = ref(false)

/** 外部传入默认类型 */
if (route.query.type) {
  formState.type = Number(route.query.type)
}

if (route.query.questionnaireId) {
  const { questionnaireId, questionnaireTitle } = route.query
  formState.questionnaire = { id: questionnaireId, title: questionnaireTitle }
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
      case RECEIVER_TYPE.PHONE_CUSTOM:
        list = formState.receiverList_phone
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
      case RECEIVER_TYPE.PHONE_CUSTOM:
        formState.receiverList_phone = val
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
  const { imgs, receiverList_phone_type, receiverList_phone } = formState
  if (imgs.length > IMG_MAXLEN && isCustomNotice.value) {
    Message.error(`最多上传${IMG_MAXLEN}张照片,你已上传${imgs.length}张`)
    return
  }
  if (receiverList_phone_type === 'import' && !receiverList_phone.length) {
    Message.error('您上传的文件中没有手机号')
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
const getTemplateUtil = async () => {
  const getTemplateList = async channelTypeId => {
    const noticeTypeId = formState.type
    const fetchApi = {
      0: selectTemplateListAdmin,
      1: selectTemplateList
    }[ckey.value ? 1 : 0]
    const { data } = await fetchApi({ channelTypeId, noticeTypeId, ckey: ckey.value })

    if (isFiveG.value) {
      formState.synchChannels = [channelTypeId]
      synchChannels.value = [{ label: '5G彩信', templateList: data || [], id: channelTypeId }]
    } else {
      synchChannels.value.push({
        label: SYNC_CHANNELS_ID_MAP.get(channelTypeId),
        templateList: data,
        id: channelTypeId
      })
    }
  }
  // 初始化
  synchChannels.value = []
  // 邀请入会 | 问卷调查只有短信1，其他都是三个渠道
  if (isFiveG.value) {
    await getTemplateList(SYNC_CHANNELS_ID.MMS)
    return
  }
  await getTemplateList(SYNC_CHANNELS_ID.NOTE)
  if (isInvitation.value || isQuestionnaire.value) return
  await getTemplateList(SYNC_CHANNELS_ID.APP)
  await getTemplateList(SYNC_CHANNELS_ID.SUBSCRIBE)
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
// 获取课程列表
const courseList = ref()
const getCourseList = async name => {
  const query = {
    page: 1,
    limit: 100,
    courseName: name
  }
  const { data } = await queryCourseList(query)
  courseList.value = data.records
}

const receiverChange = val => {
  receiverList.value = val
}

// 解决编辑时回显和type改变置空已选渠道数据冲突
let firstFetch = false
watch(
  () => formState.type,
  val => {
    if (!firstFetch) {
      // 置空已选渠道数据
      formState.activityChannels = []
      formState.synchChannels = isQuestionnaire.value ? [SYNC_CHANNELS_ID.NOTE] : []
      formState.activityData = null
      formState.receive = isMIfeng.value ? RECEIVER_TYPE.MEMBER_SELF : RECEIVER_TYPE.ALL
    } else {
      firstFetch = false
    }
    // 重新请求同步渠道数据
    getTemplateUtil()
    if (val === NOTIFICATION_TYPE.CLASS) {
      getCourseList()
    }
  },
  { immediate: true }
)
onMounted(() => {
  if (isMIfeng.value) {
    getDepartmentListFunc()
    getMemberPostListFunc()
  }
})

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
