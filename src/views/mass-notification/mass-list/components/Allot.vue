<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <el-dialog
      title="分配短信"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div class="containers">
        <div>请配置分配短信条数</div>
        <div class="container-top">
          <div>分配短信条数</div>
          <div class="input"><el-input v-model="formObj.num" maxlength="5" onkeyup="value=value.replace(/[^0-9]/g,'')" size="mini" placeholder="请分配短信" @change="onChange" /></div>
          <div>条</div>
        </div>
        <div class="hit">商协会短信总数：{{ smsDistributionSum }}  商协会短信剩余数：{{ smsRemainSum }}</div>
      </div>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  batchDistributionNum
} from '@/api/mass-notification'
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      formObj: {
        ckeys: [], // 商会ckey集合
        num: null, // 分配数量
        channelTypeId: 1
      },
      smsRemainSum: 0, // 剩余数
      smsDistributionSum: 0, // 总数
    }
  },
  methods: {
    async show(row) {
      this.formObj.ckeys.push(row.ckey)
      this.smsRemainSum = row.smsRemainSum || 0
      this.smsDistributionSum = row.smsDistributionSum || 0
      this.dialogVisible = true
    },
    // 取消
    handleClose() {
      this.dialogVisible = false
      this.formObj = {
        ckeys: [],
        num: null,
        channelTypeId: 1
      }
      this.smsRemainSum = 0
      this.smsDistributionSum = 0
    },
    onChange() {
      if (this.formObj.num > 50000) this.formObj.num = 50000
    },
    async handleSave() {
      if (this.formObj.num === '') return this.$message.error('请输入分配短信条数')
      this.formObj.num = Number(this.formObj.num)
      console.log(this.formObj)
      this.loading = true
      const res = await batchDistributionNum(this.formObj)
      if (res.state === 1) {
        this.$message.success('操作成功')
        this.handleClose()
      } else {
        this.$message.error(res.msg)
      }
      this.loading = false
    }
  }
}
</script>
<style scoped lang="scss">
.containers{
  .hit{
    color: #c0c0c0;
  }
}
.dialog-footer{
  margin-top: 40px;
  width: 100%;
  // text-align: center;
}
.container-top{
  display: flex;
  align-items: center;
  margin: 15px 0;

  .input{
    width: 100px;
    margin-left: 15px;
    margin-right: 4px;
  }
}
</style>
