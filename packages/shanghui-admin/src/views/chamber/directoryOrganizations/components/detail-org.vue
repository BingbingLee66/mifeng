<template>
  <a-modal title="社会组织详情" :visible="detailVisible" width="800px" @cancel="close" :footer="null">
    <main>
      <a-form ref="forms" :model="form">
        <a-row type="flex" justify="center" align="top">
          <a-col :span="12">
            <a-form-item label="社会组织名称：" name="name">
              <span> {{ form.name }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="入驻状态：" name="auditStatus">
              <span> {{ form.auditStatus === 1 ? '已入驻' : '待入驻' }}</span>
            </a-form-item>
          </a-col>

          <a-col :span="12" class="mt-s">
            <span>统一社会信用代码：{{ form.socialCode }}</span>
          </a-col>
          <a-col :span="12">
            <a-form-item label="组织状态：" name="status">
              <a-select
                v-if="isEdit"
                v-model:value="form.status"
                :options="organizationState"
                placeholder="请选择组织状态"
              >
              </a-select>
              <div v-show="!isEdit">
                <span>{{ orgStateObj[form.status] || '--' }}</span>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="地区：" name="provinceName">
              <span>{{ form.provinceName ? form.provinceName + form.cityName : form.cityName }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="信用状态：" name="codestatus">
              <a-select
                v-if="isEdit"
                v-model:value="form.creditStatus"
                :options="codestatusOptions"
                placeholder="请选择信用状态"
              >
              </a-select>
              <div v-show="!isEdit">
                <span>{{ orgStatusOptions[form.creditStatus] || '--' }}</span>
              </div>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="办公地址：" name="address">
              <span>{{ form.address }}</span>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="成立时间：" name="establishTime">
              <a-date-picker
                v-show="isEdit"
                v-model:value="form.establishTime"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                :clearable="false"
              />
              <span v-show="!isEdit">{{
                !!form.establishTime ? dayjs(Number(form.establishTime)).format('YYYY-MM-DD') : '--'
              }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="组织类型：" name="orgType">
              <a-select
                v-if="isEdit"
                v-model:value="form.orgType"
                :options="organizationType"
                placeholder="请选择组织类型"
              >
              </a-select>
              <div v-show="!isEdit">
                <span> {{ orgTypeObj[form.orgType] || '--' }}</span>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="组织类型：" name="orgIdentity">
              <a-select
                v-if="isEdit"
                v-model:value="form.orgIdentity"
                :options="organizationMarker"
                placeholder="请选择组织类型"
              >
              </a-select>
              <div v-show="!isEdit">
                <span> {{ orgMarkerObj[form.orgIdentity] || '--' }}</span>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="录入方式：" name="dataSource">
              <span>{{ dataSourceObj[form.dataSource] || '' }}</span>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item label="业务范围：" name="params">
              <a-textarea
                v-if="isEdit || isInOrganEdit"
                v-model:value="form.params"
                auto-size
                placeholder="请输入业务范围"
              />
              <span v-show="!isEdit && !isInOrganEdit">{{ form.params || '--' }}</span>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item label="主要人员">
              <div v-if="form.chamberPersons == null">暂无主要人员</div>
            </a-form-item>
          </a-col>
          <template v-for="(item, index) in form.chamberPersons" :key="index">
            <a-col :span="12">
              <a-form-item label="姓名" name="president">
                <span>{{ form.chamberPersons[index].name }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="职务" name="president">
                <span>{{ form.chamberPersons[index].position }}</span>
              </a-form-item>
            </a-col>
          </template>

          <a-col :span="12">
            <a-form-item label="法定代表人：" name="legalPerson">
              <span v-show="isEdit">
                <a-input v-model="form.legalPerson" placeholder="请输入法定代表人" />
              </span>
              <span v-show="!isEdit">{{ form.legalPerson }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="会长姓名" name="president">
              <span>{{ form.president }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人姓名：" name="contactName">
              <span>{{ form.contactName }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人手机号：" name="phone">
              <span>{{ form.phone }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="入驻时间：" name="auditedTs">
              <span>{{ form.auditedTs }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="入驻来源：" name="settledSource">
              <span>{{ inSourceObj[form.settledSource] || '' }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="社会组织logo：" name="systemLogo">
              <div v-show="form.systemLogo">
                <a-image :src="form.systemLogo" class="system_logo" />
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="社会团体法人登记证：" name="license">
              <div v-show="form.license">
                <a-image :src="form.license" class="avatar" />
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="footer">
        <a-button type="primary" class="mr-2" @click="close">关闭</a-button>
        <a-button v-show="!isEdit && !isInOrganEdit" type="primary" @click="toEdit">编辑</a-button>
        <a-button v-show="isEdit || isInOrganEdit" type="primary" :loading="loading" @click="submit">确定</a-button>
      </div>
    </main>
  </a-modal>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import {
  inSourceObj,
  orgStatusOptions,
  orgStateObj,
  organizationState,
  organizationType,
  orgTypeObj,
  codestatusOptions,
  orgMarkerObj,
  dataSourceObj,
  organizationMarker
} from '@/constant/chamber'
import { updateOrganization, OrganizationDetail } from '@/api/chamber/directoryOrganizations'
import dayjs from 'dayjs'
const props = defineProps({
  detailVisible: {
    type: Boolean,
    default: false
  },
  orgId: {
    type: Number,
    default: NaN
  }
})
const isEdit = ref(false)
const isInOrganEdit = ref(false)
const forms = ref()
const form = reactive({
  id: '',
  name: '',
  socialCode: '',
  address: '',
  president: '',
  status: '',
  establishTime: '',
  orgType: '',
  orgIdentity: '',
  phone: '',
  auditedTs: '',
  systemLogo: '',
  license: '',
  provinceName: '',
  cityName: '',
  contactName: '',
  codestatus: '',
  params: '',
  chamberPersons: '',
  auditStatus: ''
})
const emit = defineEmits(['closeDetailDialog'])
const toEdit = () => {
  form.auditStatus === 1 ? (isInOrganEdit.value = true) : (isEdit.value = true)
}
const loading = ref(false)
const submit = async () => {
  loading.value = true
  const obj = {
    business: form.params
  }
  const params = {}
  Object.assign(params, form)
  params.params = JSON.stringify(obj)
  params.establishTime = +new Date(form.establishTime)
  await updateOrganization(params)
  isInOrganEdit.value = false
  isEdit.value = false
  loading.value = false
}
const close = () => {
  isInOrganEdit.value = false
  isEdit.value = false
  emit('closeDetailDialog')
}
watch(
  () => props.orgId,
  async newVal => {
    loading.value = true
    const hide = message.loading('加载中', 0)
    const res = await OrganizationDetail(newVal)
    await hide()
    Object.assign(form, res.data)
    if (form.params !== null) form.params = JSON.parse(form.params).business
    loading.value = false
  }
)
</script>

<style scoped>
.mt-s {
  margin-top: 4px;
}
</style>
