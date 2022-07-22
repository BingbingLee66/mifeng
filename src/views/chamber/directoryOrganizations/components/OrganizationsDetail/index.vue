<template>
  <el-dialog title="社会组织详情" :visible.sync="visible" width="70%" center @close="close">
    <el-form ref="form" :model="form" label-width="150px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="社会组织名称" prop="name">
            <el-input v-show="isEdit" v-model="form.name" placeholder="请输入社会组织名称" />
            <span v-show="!isEdit">{{ form.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="认证状态" prop="auditStatus">
            <span>{{ form.auditStatus === 1 ? '已认证': '待入驻' }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="统一社会信用代码" prop="socialCode">
            <el-input v-show="isEdit" v-model="form.socialCode" placeholder="请输入统一社会信用代码" />
            <span v-show="!isEdit">{{ form.socialCode }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地区" prop="city">
            <el-cascader
              v-show="isEdit"
              v-model="form.city"
              clearable
              separator="-"
              :options="areaOptions"
              :props="{ expandTrigger: 'hover', value: 'code', label: 'name'}"
            />
            <span v-show="!isEdit">{{ form.provinceName ? form.provinceName + form.cityName : form.cityName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="办公地址" prop="address">
            <el-input v-show="isEdit" v-model="form.address" placeholder="请输入办公地址" />
            <span v-show="!isEdit">{{ form.address }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="会长姓名" prop="president">
            <el-input v-show="isEdit || isInOrganEdit" v-model="form.president" placeholder="请输入会长姓名" />
            <span v-show="!isEdit && !isInOrganEdit">{{ form.president }}</span>
          </el-form-item>
        </el-col>
        </el-col></el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="组织状态" prop="status">
            <el-select v-if="isEdit" v-model="form.status" placeholder="请选择组织状态">
              <el-option
                v-for="state in organizationState"
                :key="state.value"
                :label="state.label"
                :value="state.value"
              />
            </el-select>
            <span v-show="!isEdit">{{ form.status === 1 ? '正常' : form.status === 4 ? '活动异常名录': '严重违法失信名单' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成立时间" prop="establishTime">
            <el-date-picker
              v-show="isEdit"
              v-model="form.establishTime"
              type="date"
              value-format="timestamp"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
            />
            <span v-show="!isEdit">{{ parseInt(form.establishTime) | dateFormat2 }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织类型" prop="orgType">
            <el-select v-if="isEdit" v-model="form.orgType" placeholder="请选择组织类型">
              <el-option
                v-for="state in organizationType"
                :key="state.value"
                :label="state.label"
                :value="state.value"
              />
            </el-select>
            <span v-show="!isEdit">{{ form.status === 1 ? '社会团体' : form.status === 3 ? '基金会': '民办非企业单位' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织标识" prop="orgIdentity">
            <el-select v-if="isEdit" v-model="form.orgIdentity" placeholder="请选择组织类型">
              <el-option
                v-for="state in organizationMarker"
                :key="state.value"
                :label="state.label"
                :value="state.value"
              />
            </el-select>
            <div v-show="!isEdit">
              <span v-if="form.orgIdentity === 1">行业协会商会</span>
              <span v-else-if="form.orgIdentity === 2">志愿服务组织</span>
              <span v-else-if="form.orgIdentity === 3">慈善组织</span>
              <span v-else>公开募捐资格</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="导入方式" prop="sort">
            <span v-if="form.dataSource === 1">页面录入</span>
            <span v-else-if="form.dataSource === 2">导入</span>
            <span v-else>抓取</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="president">
            <span>{{ form.president }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人手机号" prop="phone">
            <span>{{ form.phone }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="认证时间" prop="auditedTs">
            <span>{{ parseInt(form.auditedTs) | dateFormat2 }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="认证方法" prop="sort">
            <span v-if="form.settledSource === 1">小程序</span>
            <span v-else-if="form.settledSource === 2">后台录入</span>
            <span v-else-if="form.settledSource === 3">小程序名录</span>
            <span v-else-if="form.settledSource === 4">app</span>
            <span v-else>APP名录</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="社会组织logo" prop="systemLogo" class="">
            <el-image :src="form.systemLogo" class="system_logo" :preview-src-list="[form.systemLogo]" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="社会团体法人登记证" prop="license">
            <el-image :src="form.license" class="avatar" :preview-src-list="[form.license]" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer">
      <el-button type="primary" @click="visible = false">关闭</el-button>
      <el-button v-show="!isEdit&& !isInOrganEdit" type="primary" @click="toEdit">编辑</el-button>
      <el-button v-show="isEdit || isInOrganEdit" type="primary" @click="submit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { updateOrganization, OrganizationDetail } from '@/api/chamber/directoryOrganizations'
import { formatDate } from '@/utils/date'
import { getAreaTree } from '@/api/area'
export default {
  data() {
    return {
      visible: false,
      isEdit: false,
      isInOrganEdit: false,
      loading: false,
      formatDate,
      areaOptions: [],
      form: {
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
        cityName: ''
      },
      organizationType: [
        { label: '社会团体', value: 1 },
        { label: '民办非企业单位', value: 2 },
        { label: '基金会', value: 3 },
      ],
      organizationState: [
        { label: '正常', value: 1 },
        { label: '注销', value: 4 },
        { label: '撤销', value: 5 },
      ],
      organizationMarker: [
        { label: '行业协会商会', value: 1 },
        { label: '志愿服务组织', value: 2 },
        { label: '慈善组织', value: 3 },
        { label: '公开募捐资格', value: 4 },
      ],
      rules: {
        name: [
          { required: true, message: '社会组织名称不能为空', trigger: 'blur' },
        ],
        socialCode: [
          { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '办公地址不能为空', trigger: 'blur' },
        ],
        president: [
          { required: true, message: '会长姓名不能为空', trigger: 'blur' },
        ],
        status: [
          { required: true, type: 'number', message: '请选择组织状态', trigger: 'change' },
        ],
        establishTime: [
          { required: true, message: '请选择成立时间', trigger: 'change' },
        ],
        orgType: [
          { required: true, message: '请选择组织类型', trigger: 'change' },
        ],
        orgIdentity: [
          { required: true, message: '请选择组织标识', trigger: 'change' },
        ],

      }
    }
  },
  methods: {
    init(data) {
      console.log(data)
      this.visible = true
      this.form.id = data.id
      this.getInfo()
      if (!this.areaOptions.length) {
        this.getAreaList()
      }
    },
    // 获取地区信息
    async getAreaList() {
      const { data } = await getAreaTree({ level: 2 })
      if (data) {
        data.forEach(p => {
          p.children.forEach(c => (c.children = undefined))
        })
        this.areaOptions = data
      }
    },
    getInfo() {
      this.loading = true
      OrganizationDetail(this.form.id).then((res) => {
        const { state, data, msg } = res
        if (state === 1) {
          this.form = data
        } else {
          this.$message.error(msg)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.loading) return
          const { city } = this.form
          const data = { ...this.form }
          if (Array.isArray(city)) {
            data.city = city[1]
            data.province = city[0]
          }
          this.loading = true
          updateOrganization(data).then(response => {
            if (response.state === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.$emit('refresh')
              this.visible = false
              this.close()
            }
          }).finally(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    toEdit() {
      // 根据入驻状态显示可不同编辑内容
      this.form.auditStatus === 1 ? this.isInOrganEdit = true : this.isEdit = true
    },
    close() {
      this.isEdit = false
      this.isInOrganEdit = false
      this.form.provinceName = ''
      this.form.cityName = ''
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
  .avatar {
    width: 180px;
    height: 100px;
    display: block;
    border-radius: 6px;
  }

  .system_logo {
    width: 88px;
    height: 88px;
    display: block;
    object-fit: cover;
    border-radius: 50%;
  }
</style>
