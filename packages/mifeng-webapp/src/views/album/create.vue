<template>
  <div class="p-albumCreate">
    <Panel>
      <AForm
        ref="formRef"
        :model="formState"
        name="basic"
        :label-col="{ span: 3 }"
        :wrapperCol="{ span: 12 }"
        autocomplete="off"
        @finish="onSave"
      >
        <AFormItem label="图片直播名称" name="albumName" :rules="[{ required: true, message: '相册名称不能为空' }]">
          <a-input v-model:value="formState.albumName" placeholder="限60字内" :maxlength="60" />
        </AFormItem>
        <AFormItem label="图片直播介绍" name="introduce">
          <a-textarea v-model:value="formState.introduce" :maxlength="200" showCount :autoSize="{ minRows: 3 }" />
        </AFormItem>
        <AFormItem label="关联业务" name="type">
          <a-select v-model:value="formState.type" style="width: 300px" placeholder="请选择">
            <a-select-option :value="0">无</a-select-option>
            <a-select-option :value="2">活动</a-select-option>
          </a-select>
        </AFormItem>
        <AFormItem
          v-if="formState.type === 2"
          label="关联活动"
          name="businessId"
          :rules="[
            {
              required: true,
              validator: (rule, value) => {
                if (formState.type === 2 && !value) return Promise.reject('关联活动不能为空')
                return Promise.resolve()
              },
              trigger: 'change'
            }
          ]"
        >
          <a-select
            v-model:value="formState.businessId"
            show-search
            placeholder="请选择"
            :filter-option="(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0"
            style="width: 300px"
            :options="businessList"
          />
        </AFormItem>
        <AFormItem style="min-height: 50px">
          <template #label>
            <div>前台图片管理</div>
            <div class="desc">最多5位</div>
          </template>
          <div v-for="item of albumAdminPhones" :key="item">
            {{ item }}
            <a-button type="link" style="color: red" @click="delAlbumAdminUser(item)">删除</a-button>
          </div>
          <a-button v-if="albumAdminPhones.length < 5" type="link" @click="addUserModal.visible = true"
            >+添加上传人员</a-button
          >
        </AFormItem>
        <AFormItem :wrapper-col="{ offset: 2 }">
          <AButton @click="isPreview = true" class="mr10">预览</AButton>
          <AButton type="primary" html-type="submit" :loading="submitLoading">确认</AButton>
        </AFormItem>

        <!-- <el-form-item v-if="ckey" label="观看权限">
        <el-radio
          v-for="item of watchLimitOptions"
          :key="item.value"
          v-model="formModel.watchLimitType"
          :label="item.value"
          @change="onLimitTypeChange"
        >
          {{ item.name }}
        </el-radio>
      </el-form-item> -->
        <!-- <el-form-item v-if="formModel.watchLimitType === 2" key="department" label="会内部门" prop="limitData" :rules=[
          {
            required: true,
            validator: (rule, value, callback) => {
              const { watchLimitType } = this.formModel
              if (watchLimitType === 2 && !value) return callback(new Error('会内部门不能为空'))
              if (watchLimitType === 3 && !value) return callback(new Error('会内职位不能为空'))
              callback()
            },
            trigger: 'change'
          }
        ]>
        <el-cascader
          v-model="limitDatas"
          :style="{width: '100%'}"
          :options="departmentOptions"
          :props="{ multiple:true}"
          collapse-tags
        />
      </el-form-item>
      <el-form-item v-else-if="formModel.watchLimitType === 3" key="post" label="会内职务" prop="limitData">
        <el-select v-model="limitDatas" multiple placeholder="请选择">
          <el-option
            v-for="item in postOptions"
            :key="item.id"
            :label="item.postName"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->
      </AForm>
      <a-modal v-model:visible="addUserModal.visible" title="添加人员" width="40%" :footer="null">
        <AForm ref="modalFormRef" :model="addUserModal" autocomplete="off" @finish="addAlbumAdminUser">
          <AFormItem
            label=""
            name="inputVal"
            :rules="[
              { required: true, message: '手机号不能为空' },
              {
                validator: (rule, value) => {
                  if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value))
                    return Promise.reject('手机号格式不正确')
                  if (albumAdminPhones.includes(value)) return Promise.reject('手机号已存在')
                  return Promise.resolve()
                },
                trigger: 'change'
              }
            ]"
          >
            <a-input v-model:value.trim="addUserModal.inputVal" placeholder="请输入手机号" />
          </AFormItem>
          <AFormItem style="text-align: right">
            <AButton @click="addUserModal.visible = false" class="mr10">返回</AButton>
            <AButton type="primary" html-type="submit">确认</AButton>
          </AFormItem>
        </AForm>
      </a-modal>
    </Panel>
    <AlbumPreview v-model:visible="isPreview" :album="formState" />
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { defineComponent, reactive, computed, ref, watch, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getActivityList, saveAlbum, getAlbumInfo } from '@/api/album'
import AlbumPreview from './components/AlbumPreview'
/* const watchLimitOptions = [
  { name: '无限制', value: 0 },
  { name: '限制商会会员', value: 1 },
  { name: '限制商会部分部门', value: 2 },
  { name: '限制商会部分职位', value: 3 }
] */
export default defineComponent({
  name: 'AlbumCreate',
  components: { AlbumPreview },
  setup() {
    const formState = reactive({
      albumName: '',
      introduce: '',
      type: 0,
      businessId: undefined,
      albumAdminUser: '',
      watchLimitType: 0,
      limitData: ''
    })
    /*  const departmentOptions= ref([])
    const departmentMap=ref({})
    const postOptions=ref([]) */
    const isPreview = ref(false)
    const ckey = inject('ckey')
    const businessList = ref([])
    const router = useRouter()
    const route = useRoute()
    const submitLoading = ref(false)
    const addUserModal = reactive({
      visible: false,
      inputVal: null
    })
    const albumAdminPhones = computed({
      get() {
        const { albumAdminUser } = formState
        return albumAdminUser ? albumAdminUser.split(',') : []
      },
      set(phones) {
        formState.albumAdminUser = phones.join(',')
      }
    })
    watch(
      () => formState.type,
      newV => {
        if (newV === 2) queryBusinessList()
      },
      { immediate: true }
    )
    /*  watch(
      () => formState.watchLimitType,
      watchLimitType => {
        if (watchLimitType === 2) queryDepartmentOptions()
        if (watchLimitType === 3) queryPostOptions()
      },
      { immediate: true }
    ) */
    /* const limitDatas = computed({
      get() {
        const { watchLimitType, limitData } = formState
        // 部门限制
        if (watchLimitType === 2 && limitData) {
          return limitData.split(',').reduce((arr, id) => {
            const cur = departmentMap.value[id]
            if (cur && !cur.children) {
              arr.push(findParentDepartmentsById(id))
            }
            return arr
          }, [])
        }
        // 职位限制
        if (watchLimitType === 3 && limitData) {
          return limitData.split(',').map(v => +v)
        }
        return []
      },
      set(limitDatas) {
        const { watchLimitType } = formState
        let limitData = ''
        // 部门限制
        if (watchLimitType === 2) {
          limitData = [...new Set(limitDatas.reduce((prev, cur) => [...prev, ...cur], []))].join(',')
        }
        // 职位限制
        if (watchLimitType === 3) {
          limitData = limitDatas.join(',')
        }
        formState.limitData = limitData
      }
    }) */
    /*  const  queryDepartmentOptions=async() =>{
      if (departmentOptions.value.length) return
      const { data: { data = [] } = {}} = await getDepartmentList({ ckey: this.ckey, parentId: 0 })
      departmentOptions.value = data[0].departmentRespList || []
      departmentMap.value = {}
      travelDepartment(departmentOptions.value)
    }
    const travelDepartment=(list)=> {
      list.forEach(v => {
        departmentMap.value[v.id] = v
        v.value = v.id
        v.label = v.departmentName
        if (v.departmentRespList.length) {
          v.children = v.departmentRespList
          travelDepartment(v.departmentRespList)
        }
      })
    }
    const findParentDepartmentsById=(id, res = [])=> {
      const cur = departmentMap.value[id]
      if (!cur) return res
      res.unshift(id)
      return findParentDepartmentsById(cur.parentId, res)
    }
    const  queryPostOptions=async()=> {
      if (postOptions.value.length) return
      const { data: { data = [] } = {}} = await getList({ ckey: ckey.value })
      postOptions.value = data
    }
    const onLimitTypeChange=(e) =>{
      formState.limitData = ''
    } */
    const queryBusinessList = async () => {
      if (businessList.value.length) return
      const { data } = await getActivityList()
      businessList.value = data.map(item => ({ value: item.id, label: `${item.activityName}（ID：${item.id}）` }))
    }
    const queryAlbumInfo = async () => {
      if (!route.query.id) return
      const { data } = await getAlbumInfo(route.query)
      console.log(data)
      Object.assign(formState, data)
    }
    const addAlbumAdminUser = async () => {
      addUserModal.visible = false
      albumAdminPhones.value = [...albumAdminPhones.value, addUserModal.inputVal]
      addUserModal.inputVal = null
    }
    const onSave = async () => {
      submitLoading.value = true
      await saveAlbum({
        ...formState,
        introduce: (formState.introduce || '').replace(/[\s]+/g, ' ').trim(),
        ckey: ckey.value
      })
      submitLoading.value = false
      router.push('/album/list')
    }
    const delAlbumAdminUser = item => {
      Modal.confirm({
        title: '删除后无法恢复',
        content: '是否继续删除？',
        okText: '确认删除',
        onOk: () => {
          albumAdminPhones.value = albumAdminPhones.value.filter(v => v !== item)
        }
      })
    }
    queryAlbumInfo()
    return {
      formState,
      businessList,
      Promise,
      albumAdminPhones,
      addAlbumAdminUser,
      delAlbumAdminUser,
      addUserModal,
      onSave,
      isPreview,
      submitLoading
    }
  }
})
</script>

<style lang="scss" scoped>
.desc {
  font-size: 12px;
  color: #999;
  line-height: 18px;
  position: absolute;
  top: 30px;
  right: 12px;
}
</style>
