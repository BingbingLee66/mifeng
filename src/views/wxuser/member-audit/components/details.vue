<template>
  <div>
    <el-dialog
      title="身份审核详情"
      :visible.sync="detailsVisible"
      width="50%"
      :before-close="close"
    >
      <div>
        <el-row>
          <div class="title">申请信息</div>
          <el-col class="mb-10" :span="12">用户名：    {{ detail.uname }}</el-col>
          <el-col class="mb-10" :span="12">用户账号：    {{ detail.userName }}</el-col>
          <el-col class="mb-10" :span="12">申请来源：  {{ detail.source === 1?'微信小程序':'app' }}</el-col>
          <el-col class="mb-10" :span="12">审核状态： {{ detail.auditStatus === 0?'审核中':detail.auditStatus === 1?'通过':'未通过' }}</el-col>
        </el-row>
        <el-row>
          <div class="title">认证信息</div>
          <el-col class="mb-10" :span="12">公司名称/机构名称：  {{ detail.unit }}</el-col>
          <el-col class="mb-10" :span="12">职务名称： {{ detail.post }}</el-col>
          <el-col class="mb-10" :span="12">所属行业： <span v-for="(item,index) in detail.trades" :key="index"> {{ item.typeName }}</span></el-col>
          <el-col class="mb-10" :span="12">公司地址： {{ detail.address }}</el-col>
          <el-col class="mb-10" :span="12">姓名： {{ detail.name }}</el-col>
          <el-col class="mb-20" :span="12">身份证号： {{ detail.idcard }}</el-col>
          <div class="mb-10">
            {{ detail.type === 0 ?'未知':detail.type === 1 ?'法人身份认证' : detail.type === 2 ?'企业微信认证':detail.type === 3?'钉钉认证':detail.type===4?'工牌认证':'邀请商协会认证' }}
          </div>
          <template v-if="detail.type !== 5">
            <el-image v-for="(item,index) in detail.imgs" :key="index" :src="item" style="width: 150px;cursor: pointer;margin-left:5px;" fit="cover" @click="showDetailsImgs(item)" />
          </template>
        </el-row>
        <el-row>
          <div class="title">审核信息</div>
          <el-col class="mb-10" :span="24">身份审核结果: {{ detail.auditStatus === 0 ?'审核中':detail.auditStatus === 1?'通过':'未通过' }}</el-col>
          <el-col v-if="detail.auditStatus===2" class="mb-10" :span="24">未通过原因： {{ detail.remark }}</el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">关 闭</el-button>
        <template v-if="detail.auditStatus === 0">
          <el-button type="success" @click="pass">通 过</el-button>
          <el-button type="danger" @click="reject">拒 绝</el-button>
        </template>
      </span>
    </el-dialog>
    <!--图片明细-->
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div>
        <el-image :src="showSrc" style="width: 100%;" fit="cover" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    detailsVisible: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      showSrc: ''
    }
  },
  methods: {
    close() {
      this.$emit('detailsClose')
    },
    pass() {
      this.$emit('handleResolve')
      console.log('pass')
    },
    reject() {
      console.log('驳回')
      this.$emit('handleReject')
    },
    handleClose() {
      this.dialogVisible = false
    },
    showDetailsImgs(src) {
      this.showSrc = src
      this.dialogVisible = true
      console.log(src)
    }
  }
}
</script>

<style scoped>
.title{
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: 600;
}
.dialog-footer{
  display: flex;
  justify-content: center;
}
</style>
