<template>
  <el-dialog title="社会组织详情" :visible.sync="visible" width="70%" @close="close">
    <main v-loading="loading">
      <el-form ref="form" :model="form" label-width="180px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="社会组织名称：" prop="name">
              <el-input v-show="isEdit" v-model="form.name" placeholder="请输入社会组织名称" />
              <span v-show="!isEdit">{{ form.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="认证状态：" prop="auditStatus">
              <span>{{ form.auditStatus === 1 ? '已认证': '未认证' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="统一社会信用代码：" prop="socialCode">
              <el-input v-show="isEdit" v-model.trim="form.socialCode" placeholder="请输入统一社会信用代码" />
              <span v-show="!isEdit">{{ form.socialCode }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地区：" prop="city">
              <el-cascader
                v-show="isEdit"
                v-model="form.city"
                separator="-"
                :options="areaOptions"
                :props="{ expandTrigger: 'hover', value: 'code', label: 'name'}"
              />
              <span v-show="!isEdit">{{ form.provinceName ? form.provinceName + form.cityName : form.cityName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="办公地址：" prop="address">
              <el-input v-show="isEdit" v-model="form.address" placeholder="请输入办公地址" />
              <span v-show="!isEdit">{{ form.address }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会长姓名：" prop="president">
              <el-input v-show="isEdit || isInOrganEdit" v-model="form.president" placeholder="请输入会长姓名" />
              <span v-show="!isEdit && !isInOrganEdit">{{ form.president }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="组织状态：" prop="status">
              <el-select v-if="isEdit" v-model="form.status" placeholder="请选择组织状态">
                <el-option
                  v-for="state in organizationState"
                  :key="state.value"
                  :label="state.label"
                  :value="state.value"
                />
              </el-select>
              <div v-show="!isEdit">
                <span>{{ orgStateObj[form.status] }}</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成立时间：" prop="establishTime">
              <el-date-picker
                v-show="isEdit"
                v-model="form.establishTime"
                type="date"
                value-format="timestamp"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                :clearable="false"
              />
              <span v-show="!isEdit">{{ form.establishTime | dateFormat2 }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织类型：" prop="orgType">
              <el-select v-if="isEdit" v-model="form.orgType" placeholder="请选择组织类型">
                <el-option
                  v-for="state in organizationType"
                  :key="state.value"
                  :label="state.label"
                  :value="state.value"
                />
              </el-select>
              <div v-show="!isEdit">
                <span> {{ orgTypeObj[form.orgType] }}</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织标识：" prop="orgIdentity">
              <el-select v-if="isEdit" v-model="form.orgIdentity" placeholder="请选择组织类型">
                <el-option
                  v-for="state in organizationMarker"
                  :key="state.value"
                  :label="state.label"
                  :value="state.value"
                />
              </el-select>
              <div v-show="!isEdit">
                <span>{{ orgMarkerObj[form.orgIdentity] }}</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="导入方式：" prop="dataSource">
              <span>{{ dataSourceObj[form.dataSource] }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人：" prop="contactName">
              <span>{{ form.contactName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人手机号：" prop="phone">
              <span>{{ form.phone }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="认证时间：" prop="auditedTs">
              <span>{{ form.auditedTs | dateFormat2 }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入驻来源：" prop="settledSource">
              <span>{{ inSourceObj[form.settledSource] }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社会组织logo：" prop="systemLogo" class="">
              <el-image v-show="form.systemLogo" :src="form.systemLogo" class="system_logo" :preview-src-list="[form.systemLogo]" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社会团体法人登记证：" prop="license">
              <el-image v-show="form.license" :src="form.license" class="avatar" :preview-src-list="[form.license]" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="footer">
        <el-button type="primary" @click="visible = false">关闭</el-button>
        <el-button v-show="!isEdit&& !isInOrganEdit" type="primary" @click="toEdit">编辑</el-button>
        <el-button v-show="isEdit || isInOrganEdit" type="primary" @click="submit">确定</el-button>
      </div>
    </main>
  </el-dialog>
</template>
<script>
import { updateOrganization, OrganizationDetail } from '@/api/chamber/directoryOrganizations'
import { organizationType, orgTypeObj, organizationState, orgStateObj, organizationMarker, orgMarkerObj, dataSourceObj, inSourceObj } from '../../state'
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
        cityName: '',
        contactName: ''
      },
      // 组织类型
      organizationType,
      orgTypeObj,
      // 组织状态
      organizationState,
      orgStateObj,
      // 组织标识
      organizationMarker,
      orgMarkerObj,
      // 数据来源
      dataSourceObj,
      // 入驻来源
      inSourceObj,
    }
  },
  methods: {
    init(data) {
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
          const { auditedTs, establishTime } = this.form
          this.form.auditedTs = auditedTs === null ? null : parseInt(auditedTs)
          this.form.establishTime = establishTime === null ? null : parseInt(establishTime)
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
            } else {
              this.$message.error(response.msg)
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
  .footer{
    text-align: center;
  }
</style>
