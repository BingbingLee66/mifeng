<template>
  <Panel>
    <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }" :rules="rules" @finish="save">
      <a-form-item label="入会类型">
        <a-radio-group v-model:value="formState.type">
          <a-radio value="community">企业/团体入会</a-radio>
          <a-radio value="personal">个人入会</a-radio>
        </a-radio-group>
      </a-form-item>
      <div v-if="formState.type === 'community'">
        <a-form-item label="企业名称：" name="companyName">
          <a-input v-model:value="formState.companyName" :max-length="200" />
        </a-form-item>
        <a-form-item label="联系人姓名：" name="contactName">
          <a-input v-model:value="formState.contactName" placeholder="请输入联系人姓名" :max-length="20" />
        </a-form-item>
        <a-form-item label="联系人电话：" name="contactPhone">
          <a-input v-model:value="formState.contactPhone" placeholder="请输入联系电话" />
        </a-form-item>
      </div>
      <div v-else>
        <a-form-item label="姓名：" name="name">
          <a-input v-model:value="formState.name" :max-length="100" />
        </a-form-item>
        <a-form-item label="手机号：" name="phone">
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
      <a-form-item label="所在部门">
        <a-tree-select
          v-model:value="departmentCas"
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
      <a-form-item class="form-footer">
        <a-button type="primary" html-type="submit">保存</a-button>
        <a-button @click="goBack">取消</a-button>
      </a-form-item>
    </a-form>
  </Panel>
</template>

<script>
import { inject, reactive, ref } from 'vue'
import { getMemberOptions } from '@/api/member/post'
import { getDepartmentList } from '@/api/org-structure/org'
import { add } from '@/api/member/manager'
import { useRouter, useRoute } from 'vue-router'
export default {
  setup() {
    const formInfo = addForm()
    return { ...formInfo }
  }
}
function addForm() {
  const formState = reactive({
    type: 'community',
    name: '',
    phone: '',
    companyName: '',
    contactPhone: '',
    departmentId: '',
    memberPostId: '',
    contactName: '',
    ckey: ''
  })
  const checkPhone = (rule, value) => {
    if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value)) {
      return Promise.reject(new Error('手机号码格式不正确'))
    } else {
      return Promise.resolve()
    }
  }
  const rules = {
    companyName: [
      {
        required: true,
        message: '企业名称不能为空',
        trigger: 'blur'
      }
    ],
    companyLogo: [
      {
        required: true,
        message: '公司logo必须上传',
        trigger: 'blur'
      }
    ],
    contactPhone: [
      {
        required: true,
        message: '联系人电话不能为空',
        trigger: 'blur'
      },
      {
        validator: checkPhone,
        trigger: 'change'
      }
    ],
    name: [
      {
        required: true,
        message: '姓名不能为空',
        trigger: 'blur'
      }
    ],
    phone: [
      {
        required: true,
        message: '手机号码不能为空',
        trigger: 'blur'
      },
      {
        validator: checkPhone,
        trigger: 'change'
      }
    ],
    contactName: [
      {
        required: true,
        message: '请输入联系人姓名',
        trigger: 'blur'
      }
    ],
    memberPostId: [
      {
        required: true,
        message: '请选择会内职位',
        trigger: 'change'
      }
    ]
  }
  const memberPostOptions = ref([])
  // 拉取会内职位
  const ckey = inject('ckey')
  const getMemberType = async () => {
    const params = {
      ckey: ckey.value
    }
    const {
      data: { data }
    } = await getMemberOptions(params)
    memberPostOptions.value = data
  }
  const departmentOptions = ref([])
  const departmentCas = ref([])
  const getdepartmentType = async () => {
    const params = {
      ckey: ckey.value,
      parentId: 0
    }
    getDepartmentList(params).then(res => {
      const {
        data: { data }
      } = res
      departmentOptions.value = data[0].departmentRespList
    })
  }
  const router = useRouter()
  const route = useRoute()
  const save = () => {
    if (formState.type === 'community') {
      formState.type = 1
      formState.phone = formState.contactPhone
    } else formState.type = 0
    formState.departmentId = departmentCas.value.join(',')
    formState.ckey = ckey.value
    add(formState).then(() => {
      router.go(-1)
    })
  }
  const goBack = () => {
    router.go(-1)
  }
  const init = () => {
    const {
      query: { sign, allParentId }
    } = route
    if (sign) {
      if (typeof allParentId === 'number') {
        departmentCas.value.push(allParentId)
        formState.departmentId = allParentId
      } else {
        let arr = allParentId.split(',')
        arr.shift()
        arr = arr.map(i => parseInt(i, 0))
        departmentCas.value = arr
        const did = [...arr].pop()
        formState.departmentId = did
      }
    }
    getMemberType()
    getdepartmentType()
  }
  init()
  return { goBack, formState, rules, memberPostOptions, departmentOptions, departmentCas, save }
}
</script>
<style lang="scss" scoped>
.form-footer {
  text-align: center;
  button {
    margin: 0 10px;
  }
}
</style>
