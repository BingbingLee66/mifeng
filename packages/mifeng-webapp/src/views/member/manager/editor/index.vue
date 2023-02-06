<template>
  <Panel>
    <a-form
      ref="formRef"
      name="custom-validation"
      :model="formState"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 8 }"
      @finish="handleFinish"
    >
      <a-form-item :wrapper-col="{ offset: 6, span: 8 }">
        <h3 class="form_title">入会信息</h3>
      </a-form-item>

      <a-form-item label="入会类型">
        <a-radio-group v-model:value="formState.type">
          <a-radio :value="TYPE.TEAM">企业入会</a-radio>
          <a-radio :value="TYPE.PERSON">个人入会</a-radio>
          <a-radio :value="TYPE.ORGANIZATION">社会组织</a-radio>
        </a-radio-group>
      </a-form-item>

      <div v-if="formState.type === TYPE.ORGANIZATION">
        <a-form-item
          label="社会组织名称："
          name="companyName"
          :rules="[{ required: true, message: '社会组织名称不能为空', trigger: 'blur' }]"
        >
          <a-input v-model:value="formState.companyName" :max-length="200" />
        </a-form-item>

        <a-form-item label="社会组织logo：" name="socialOrganizationLogo">
          <ImageUploader
            :limit="1"
            :value="formState.socialOrganizationLogo ? [{ url: formState.socialOrganizationLogo }] : []"
            @uploaded="formState.socialOrganizationLogo = $event.length ? $event[0].url : ''"
          />
        </a-form-item>

        <a-form-item
          label="联系人姓名："
          name="contactName"
          :rules="[{ required: true, message: '请输入联系人姓名', trigger: 'blur' }]"
        >
          <a-input v-model:value="formState.contactName" placeholder="请输入联系人姓名" :max-length="20" />
        </a-form-item>

        <a-form-item
          label="联系人电话："
          name="contactPhone"
          :rules="[
            { required: true, message: '联系人电话不能为空', trigger: 'blur' },
            { validator: checkPhone, trigger: ['change', 'blur'] }
          ]"
        >
          <a-input v-model:value="formState.contactPhone" placeholder="请输入联系电话" />
        </a-form-item>
      </div>
      <div v-else-if="formState.type === TYPE.TEAM">
        <a-form-item
          label="企业名称："
          name="companyName"
          :rules="[{ required: true, message: '企业名称不能为空', trigger: 'blur' }]"
        >
          <a-input v-model:value="formState.companyName" :max-length="200" />
        </a-form-item>

        <a-form-item
          label="联系人姓名："
          name="contactName"
          :rules="[{ required: true, message: '请输入联系人姓名', trigger: 'blur' }]"
        >
          <a-input v-model:value="formState.contactName" placeholder="请输入联系人姓名" :max-length="20" />
        </a-form-item>

        <a-form-item
          label="联系人电话："
          name="contactPhone"
          :rules="[
            { required: true, message: '联系人电话不能为空', trigger: 'blur' },
            { validator: checkPhone, trigger: ['change', 'blur'] }
          ]"
        >
          <a-input v-model:value="formState.contactPhone" placeholder="请输入联系电话" />
        </a-form-item>
      </div>
      <div v-else>
        <a-form-item
          label="姓名："
          name="name"
          :rules="[{ required: true, message: '姓名不能为空 ', trigger: 'blur' }]"
        >
          <a-input v-model:value="formState.name" :max-length="100" />
        </a-form-item>

        <a-form-item
          label="手机号："
          name="phone"
          :rules="[
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { validator: checkPhone, trigger: ['change', 'blur'] }
          ]"
        >
          <a-input v-model:value="formState.phone" />
        </a-form-item>
      </div>

      <a-form-item label="会内职位" name="memberPostId">
        <a-select
          v-model:value="formState.memberPostId"
          placeholder="请选择会内职位"
          :options="memberPostOptions"
        ></a-select>
      </a-form-item>

      <a-form-item label="所在部门" name="departmentId">
        <a-tree-select
          v-model:value="formState.departmentId"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择部门"
          allow-clear
          multiple
          :tree-data="departmentOptions"
          :field-names="{ value: 'id', label: 'departmentName', children: 'departmentRespList' }"
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 6, span: 8 }">
        <h3 class="form_title">其他信息</h3>
      </a-form-item>

      <a-form-item label="入会时间">
        <a-date-picker v-model:value="formState.joinedTs" valueFormat="YYYY-MM-DD" />
      </a-form-item>

      <a-form-item v-if="formState.type === TYPE.TEAM" label="营业执照">
        <a-upload
          v-model:file-list="fileList"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          action="/"
          :before-upload="beforeUpload"
          :maxCount="1"
          :multiple="false"
          :customRequest="uploadLicenseImage"
        >
          <img v-if="formState.license" class="license-img" :src="formState.license" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="uploadLoading"></loading-outlined>
            <plus-outlined v-else style="font-size: 20px"></plus-outlined>
          </div>
        </a-upload>
      </a-form-item>

      <a-form-item v-if="formState.type === TYPE.TEAM" label="企业职位">
        <a-select
          v-model:value="formState.companyPositionId"
          placeholder="请选择企业职位"
          :options="positionOptions"
        ></a-select>
      </a-form-item>

      <a-form-item v-if="formState.identityVOList.length" :wrapper-col="{ offset: 6, span: 8 }">
        <h3 class="form_title">身份信息</h3>
      </a-form-item>

      <div v-if="formState.identityVOList.length > 0">
        <div v-for="(item, index) in formState.identityVOList" :key="index">
          <a-form-item :label="item.type === 1 ? '企业：' : '机构：'">
            <a-input :value="item.unit" max-length="200" disabled />
          </a-form-item>
          <a-form-item label="职务：">
            <a-input :value="item.post" disabled />
          </a-form-item>
        </div>
      </div>
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">保存</a-button>
        <a-button
          class="ml20"
          @click="
            () => {
              $router.go(-1)
            }
          "
          >取消</a-button
        >
      </a-form-item>
    </a-form>
  </Panel>
</template>

<script>
import { defineComponent, inject, onMounted, reactive, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { getMemberOptions } from '@/api/member/post'
import { getDepartmentList } from '@/api/org-structure/org'
import { add, update, uploadLicense, getPositionOptions, memberMe } from '@/api/member/manager'
import { checkPhone } from '@/utils/validate'
import memberConstant from '@/constant/member-manager'

export default defineComponent({
  components: { PlusOutlined, LoadingOutlined },
  setup() {
    const ckey = inject('ckey')
    const { TYPE } = memberConstant
    const formRef = ref()
    const formState = reactive({
      type: TYPE.TEAM, // 入会类型
      name: '', // 会员姓名
      phone: '', // 会员手机号
      companyName: '', // 企业名称
      contactPhone: '', // 联系人电话
      departmentId: [], // 所在部门
      memberPostId: '', // 会内职位
      contactName: '', // 联系人姓名
      joinedTs: '', // 入会时间
      license: '', // 营业执照
      companyPositionId: '', // 企业职位
      identityVOList: [], // 身份信息
      socialOrganizationLogo: '' // 社会组织logo
    })
    const stateData = reactive({
      memberPostOptions: [],
      departmentOptions: [],
      positionOptions: []
    })
    const fetchOptions = async () => {
      const {
        data: { data: memberPostOptions }
      } = await getMemberOptions({ ckey: ckey.value })
      stateData.memberPostOptions = [...memberPostOptions]

      const {
        data: { data: departmentOptions }
      } = await getDepartmentList({
        ckey: ckey.value,
        parentId: 0
      })
      stateData.departmentOptions = [...departmentOptions[0].departmentRespList]

      const {
        data: { data }
      } = await getPositionOptions()
      stateData.positionOptions = [...data]
    }

    const beforeUpload = file => {
      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
        message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 50) {
        message.error('上传图片大小不能超过 50MB!')
        return false
      }
    }
    /**
     * 上传营业执照
     * @param {*} content
     */
    const uploadLoading = ref(false)
    const fileList = ref([])
    const uploadLicenseImage = async content => {
      uploadLoading.value = true
      try {
        const formData = new FormData()
        formData.append('file', content.file)
        const { data } = await uploadLicense(formData)
        formState.license = data.filePath
        uploadLoading.value = false
      } catch {
        uploadLoading.value = false
      }
    }

    const route = useRoute()
    const router = useRouter()
    const memberId = route.query.memberId || ''
    const fetchData = async () => {
      const { data } = await memberMe({ memberId })
      const resData = data.data
      Object.assign(formState, {
        ...resData,
        departmentId: data.departmentId?.length && data.departmentId.split(',')
      })
    }
    if (memberId) {
      fetchData()
    }

    const handleFinish = () => {
      const params = {
        ...formState,
        id: memberId,
        ckey: ckey.value,
        phone: formState.type === TYPE.TEAM ? formState.contactPhone : formState.phone,
        departmentId: (formState.departmentId?.length && formState.departmentId.join(',')) || ''
      }
      ;(memberId ? update : add)(params).then(() => {
        formRef.value && formRef.value.resetFields()
        router.push({ path: '/member/manager' })
      })
    }

    onMounted(() => {
      fetchOptions()
    })

    return {
      TYPE,
      checkPhone,
      formRef,
      formState,
      beforeUpload,
      uploadLicenseImage,
      uploadLoading,
      fileList,
      ...toRefs(stateData),
      handleFinish
    }
  }
})
</script>

<style lang="scss" scoped>
.form_title {
  font-size: 18px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  display: flex;
  align-items: center;
  font-weight: 700;
  margin-top: 20px;
  &::before {
    content: '';
    display: block;
    width: 3px;
    background: #f4c820;
    height: 20px;
    margin-right: 5px;
  }
}

:deep(.avatar-uploader) > .ant-upload,
.license-img {
  width: 180px;
  height: 100px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
