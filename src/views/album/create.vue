<template>
  <div class="wrap">
    <h2>创建直播相册</h2>
    <el-form ref="form" class="form" :model="formModel" :rules="formRules" label-width="120px">
      <el-form-item label="相册名称" prop="albumName">
        <el-input v-model="formModel.albumName" :maxlength="60" />
      </el-form-item>
      <el-form-item label="相册介绍" prop="introduce">
        <el-input v-model="formModel.introduce" type="textarea" :maxlength="200" show-word-limit :autosize="{minRows:3}" resize="none" />
      </el-form-item>
      <el-form-item label="关联业务" prop="name">
        <el-select v-model="formModel.type">
          <el-option label="无" :value="0" />
          <el-option label="活动" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formModel.type === 2" label="关联活动" prop="businessId">
        <el-select v-model="formModel.businessId">
          <el-option v-for="item of businessList" :key="item.id" :label="item.activeName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="ckey" label="观看权限">
        <el-radio
          v-for="item of watchLimitOptions"
          :key="item.value"
          v-model="formModel.watchLimitType"
          :label="item.value"
          @change="onLimitTypeChange"
        >
          {{ item.name }}
        </el-radio>
      </el-form-item>
      <el-form-item v-if="formModel.watchLimitType === 2" label="会内部门" prop="limitData">
        <el-cascader
          v-model="limitDatas"
          :style="{width: '100%'}"
          :options="departmentOptions"
          :props="{ multiple:true}"
          collapse-tags
        />
      </el-form-item>
      <el-form-item v-else-if="formModel.watchLimitType === 3" label="会内职务" prop="limitData">
        <el-select v-model="limitDatas" multiple placeholder="请选择">
          <el-option
            v-for="item in postOptions"
            :key="item.id"
            :label="item.postName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template #label>
          <div>前台相册管理</div>
          <div class="desc">最多5位</div>
        </template>
        <div v-for="item of albumAdminPhones" :key="item">
          {{ item }}
          <el-button type="text" style="color:red;" @click="albumAdminPhones = albumAdminPhones.filter(v => v!==item)">删除</el-button>
        </div>
        <el-button type="text" @click="addAlbumAdminUser">+添加上传人员</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="isPreview = true">预览</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </el-form-item>
    </el-form>

    <AlbumPreview v-model="isPreview" />
  </div>
</template>

<script>
import { getActivityList, saveAlbum } from '@/api/album'
import { getDepartmentList } from '@/api/org-structure/org'
import { getList } from '@/api/member/post'

export default {
  components: {
    AlbumPreview: () => import('./components/AlbumPreview')
  },
  props: {},
  data() {
    const formModel = {
      albumName: '',
      introduce: '',
      type: 0,
      businessId: undefined,
      albumAdminUser: '',
      watchLimitType: 0,
      limitData: ''
    }
    return {
      formModel,
      formRules: {
        albumName: [
          { required: true, message: '活动名称不能为空', trigger: 'blur' },
        ],
        businessId: [
          {
            required: true,
            validator(rule, value, callback) {
              if (formModel.type === 2 && !value) return callback(new Error('关联活动不能为空'))
              callback()
            },
            trigger: 'change'
          }
        ],
        limitData: [
          {
            required: true,
            validator(rule, value, callback) {
              if (formModel.watchLimitType === 2 && !value) return callback(new Error('会内部门不能为空'))
              if (formModel.watchLimitType === 3 || !value) return callback(new Error('会内职位不能为空'))
              callback()
            },
            trigger: 'change'
          }
        ]
      },
      businessList: [
        { activeName: '无', id: undefined },
        { activeName: '阿达', id: 1 }
      ],
      isPreview: false,
      watchLimitOptions: [
        { name: '无限制', value: 0 },
        { name: '限制商会会员', value: 1 },
        { name: '限制商会部分部门', value: 2 },
        { name: '限制商会部分职位', value: 3 },
      ],
      departmentOptions: [],
      departmentMap: {},
      postOptions: []
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey
    },
    albumAdminPhones: {
      get() {
        const { albumAdminUser } = this.formModel
        return albumAdminUser ? albumAdminUser.split(',') : []
      },
      set(phones) {
        this.formModel.albumAdminUser = phones.join(',')
      }
    },
    limitDatas: {
      get() {
        const { formModel: { watchLimitType, limitData }, departmentMap } = this
        // 部门限制
        if (watchLimitType === 2) {
          return limitData.split(',').reduce((arr, id) => {
            const cur = departmentMap[id]
            if (cur && !cur.children) {
              arr.push(this.findParentDepartmentsById(id))
            }
            return arr
          }, [])
        }
        // 职位限制
        if (watchLimitType === 3) {
          return limitData ? limitData.split(',').map(v => +v) : []
        }
        return []
      },
      set(limitDatas) {
        const { formModel: { watchLimitType }} = this
        let limitData = ''
        // 部门限制
        if (watchLimitType === 2) {
          limitData = [...new Set(limitDatas.reduce((prev, cur) => [...prev, ...cur], []))].join(',')
        }
        // 职位限制
        if (watchLimitType === 3) {
          limitData = limitDatas.join(',')
        }
        this.formModel.limitData = limitData
      }
    },
  },
  watch: {
    'formModel.watchLimitType': {
      handler(watchLimitType) {
        if (watchLimitType === 2) this.queryDepartmentOptions()
        if (watchLimitType === 3) this.queryPostOptions()
      },
      immediate: true
    }
  },
  created() {
    this.queryBusinessList()
  },
  methods: {
    async queryBusinessList() {
      const { data } = await getActivityList()
      this.businessList = data
    },
    async queryDepartmentOptions() {
      if (this.departmentOptions.length) return
      const { data: { data = [] } = {}} = await getDepartmentList({ ckey: this.ckey, parentId: 0 })
      this.departmentOptions = data[0].departmentRespList || []
      this.departmentMap = {}
      this.travelDepartment(this.departmentOptions)
    },
    travelDepartment(list) {
      list.forEach(v => {
        this.departmentMap[v.id] = v
        v.value = v.id
        v.label = v.departmentName
        if (v.departmentRespList.length) {
          v.children = v.departmentRespList
          this.travelDepartment(v.departmentRespList)
        }
      })
    },
    findParentDepartmentsById(id, res = []) {
      const cur = this.departmentMap[id]
      if (!cur) return res
      res.unshift(id)
      return this.findParentDepartmentsById(cur.parentId, res)
    },
    async queryPostOptions() {
      if (this.postOptions.length) return
      const { data: { data = [] } = {}} = await getList({ ckey: this.ckey })
      this.postOptions = data
    },
    onLimitTypeChange(e) {
      this.formModel.limitData = ''
    },
    async addAlbumAdminUser() {
      const { albumAdminPhones } = this
      const { value } = await this.$prompt('', '添加人员', {
        confirmButtonText: '确认',
        cancelButtonText: '返回',
        inputValidator(value = '') {
          value = value && value.trim()
          if (!value) return '手机号不能为空'
          if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value)) return '手机号格式不正确'
          if (albumAdminPhones.includes(value)) return '手机号已存在'
        }
      })
      this.albumAdminPhones = [...albumAdminPhones, value]
    },
    async onSave() {
      await this.$refs.form.validate()
      const { formModel, ckey } = this
      const { state } = await saveAlbum({
        ...formModel,
        ckey
      })
      if (state === 1) 1 // TODO
    }
  },
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 0 20px;

  .form {
    max-width: 750px;
  }

  .desc {
    font-size: 12px;
    color: #999;
    line-height: 18px;
  }
}
</style>
