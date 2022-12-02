<template>
  <div>
    <el-dialog title="详情" :visible.sync="freeVisible" width="30%" @before-close="close">

      <div class="msg-view">
        <div>是否确定冻结该商会的账号?</div>
        <div style="margin:10px 0px">冻结后，该商会无法登录商会后台，但是不会影响商会在前台的显示</div>
        <el-input
          v-model.trim="freezeReason"
          type="textarea"
          placeholder="请填写冻结的原因，50字以内"
          maxlength="50"
          show-word-limit
        />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click.native="close">取消</el-button>
        <el-button type="primary" @click="chamberStatusUpdateFunc">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { chamberStatusUpdate } from '@/api/chamber/manager'
export default {
  props: ['freeVisible'],
  data() {
    return {
      freezeReason: null,
      status: null,
      ckey: null
    }
  },
  methods: {

    // 展示
    show(status, ckey) {
      this.status = status
      this.ckey = ckey
    },
    // 关闭
    close() {
      this.$emit('update:freeVisible', false)
      this.freezeReason = null
    },
    // 更新商会状态
    async chamberStatusUpdateFunc() {
      const { ckey, freezeReason, status } = this
      if (!freezeReason) { this.$message.warning(('请填写冻结原因')); return }
      const res = await chamberStatusUpdate({ ckey, freezeReason, status: +!status })
      if (res.state === 1) { this.$message.success('冻结成功'); this.close(); this.$emit('updateSuccess', ckey) }
    }
  }
}
</script>
<style lang="scss" scoped>
.msg-view {
  margin-left: 58px;
}
.audit-result-view {
  margin-left: 50px;

  .linemargin {
    margin-bottom: 5px;
  }
}

.th_title {
  width: 100px;
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  margin: 0 30px;
  padding: 20px 0 !important;
}

.header-title {
  .title-name {
    color: #4d82f3;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
  }
}

.updateImg {
  width: 50px;
  height: 50px;
  vertical-align: middle;
}
</style>
