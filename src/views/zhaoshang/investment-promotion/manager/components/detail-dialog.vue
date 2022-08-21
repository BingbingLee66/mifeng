<template>
  <el-dialog
    :visible="visible"
    title="招商办详情"
    width="50%"
    @close="close"
  >
     <el-row>
      <el-col :offset="2" :span="6">账号名称：</el-col>
      <el-col :span="10">{{ detailObj.invesName }}</el-col>
    </el-row>
    <el-row>
      <el-col :offset="2" :span="6">招商办名称：</el-col>
      <el-col :span="10">{{ detailObj.name }}</el-col>
    </el-row>
    <el-row>
      <el-col :offset="2" :span="6">招商办logo：</el-col>
      <el-col :span="10">
        <img
          :src="
            detailObj.logoUrl
              ? detailObj.logoUrl
              : 'https://ysh-sh.oss-cn-shanghai.aliyuncs.com/prod/png/default_avatar.png'
          "
          alt=""
          style="width: 88px; height: 88px; border-radius: 50%"
        >
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="2" :span="6">联系人姓名：</el-col>
      <el-col :span="10">{{ detailObj.contactUser }}</el-col>
    </el-row>
    <el-row>
      <el-col :offset="2" :span="6">联系人手机号：</el-col>
      <el-col :span="10">{{ detailObj.contactPhone }}</el-col>
    </el-row>
    <el-row>
      <el-col :offset="2" :span="6">地区：</el-col>
      <el-col :span="10">{{ detailObj.area }}</el-col>
    </el-row>
    <el-row>
      <el-col :offset="2" :span="6">办公地址：</el-col>
      <el-col :span="10">{{ detailObj.address }}</el-col>
    </el-row>
    <el-row>
      <el-col :offset="2" :span="6">推荐人：</el-col>
      <el-col v-if="detailObj.referrer" :span="10">{{ detailObj.referrer }}</el-col>
      <el-col v-if="!detailObj.referrer" :span="10">无</el-col>
    </el-row>
    <el-row>
      <hr>
    </el-row>
    <el-row>
      <el-col :offset="2" :span="6">创建时间：</el-col>
      <el-col :span="10">{{ detailObj.createdTs }}</el-col>
    </el-row>
    <el-row>
      <el-col :offset="2" :span="6">操作人：</el-col>
      <el-col :span="10">{{ detailObj.operatorName }}</el-col>
    </el-row>
    <el-row>
      <el-col :offset="20" :span="2">
        <el-button v-dbClick type="primary" @click.native="close">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getInfoDetails } from '@/api/attract'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null,
    }
  },
  data() {
    return {
      detailObj: {},
    }
  },
  watch: {
    visible(n) {
      if (!n) return
      // TODO 获取详情逻辑
      getInfoDetails(this.id).then(response => {
        this.detailObj = response.data
      })
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
