<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <el-dialog
      title="批量分配短信"
      :visible.sync="showAllocation"
      width="40%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="app-container">

        <div>1、请选择模板应用商协会 (选择后，以下商协会可使用此模板)</div>
        <div class="container-top">
          <div clear="container-sel"> <el-input v-model="name" clearable placeholder="请输入内容" /></div>
          <el-button type="primary" @click="query">
            查询
          </el-button>
          <div>已选 <span class="container-choice">{{ formObj.ckeys.length }}</span>个商协会</div>
        </div>
        <!-- 商协会 -->
        <div class="business">
          <el-checkbox-group
            v-model="formObj.ckeys"
            class="country-group"
          >
            <div class="group-box">
              <el-checkbox
                v-for="country in originOpt"
                :key="country.ckey"
                class="country-group-item"
                :label="country.ckey"
              > {{ country.name }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>

        <div>2、请配置分配短信条数（改配置仅对所选商协会应用）</div>
        <div class="container-top">
          <div>分配短信条数</div>
          <div class="input"><el-input v-model="formObj.num" maxlength="5" onkeyup="value=value.replace(/[^0-9]/g,'')" size="mini" placeholder="请分配短信" @change="onChange" /></div>
          <div>条</div>
        </div>
        <div class="container-top">
          <div>总分配短信条数</div>
          <div class="input"><el-input v-model="maxNum" disabled size="mini" /></div>
          <div>条</div>
        </div>
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
  distributionChambers,
  batchDistributionNum
} from '@/api/mass-notification'
export default {
  props: {
    showAllocation: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formObj: {
        ckeys: [],
        num: null,
        channelTypeId: 1
      },
      // maxNum: '',
      name: '',
      originOpt: [], // 商协会
      loading: false
    }
  },
  computed: {
    maxNum: {
      get() {
        return this.formObj.ckeys.length * this.formObj.num || 0
      },
      set(v) {
        this.maxNum = v
      }

    }
  },
  watch: {
    showAllocation(n) {
      if (!n) return
      this.query()
    },
  },

  methods: {
    // 取消
    handleClose() {
      this.formObj = {
        ckeys: [],
        num: null,
        channelTypeId: 1
      }
      this.maxNum = 0
      this.originOpt = []
      this.loading = false
      this.$emit('update:showAllocation', false)
    },
    // 确定
    async handleSave() {
      if (!this.formObj.ckeys.length) return this.$message.error('请选择商协会')
      if (this.formObj.num === '') return this.$message.error('请输入分配短信条数')
      this.formObj.num = Number(this.formObj.num)
      this.loading = true
      const res = await batchDistributionNum(this.formObj)
      if (res.state === 1) {
        this.$message.success('操作成功')
        this.handleClose()
      } else {
        this.$message.error(res.msg)
      }
      this.loading = false
    },
    onChange() {
      if (this.formObj.num > 50000) this.formObj.num = 50000
    },
    // 查询
    async query() {
      const parmas = {
        name: this.name
      }
      const res = await distributionChambers(parmas)
      this.originOpt = res.data
    }
  }
}
</script>
<style scoped lang="scss">
.container-top{
  display: flex;
  align-items: center;
  margin: 15px 0;
  .container-sel{
    margin-right: 30px;
  }
  .container-choice{
    color: #4daaff;
  }

  .input{
    width: 100px;
    margin-left: 15px;
    margin-right: 4px;
  }
}
.business{
  max-height: 350px;
  overflow-y: auto;
  width: 100%;
  padding: 10px 0;
  margin-bottom: 30px;
  .el-checkbox{
    display: block !important;
  }
}
.dialog-footer{
  margin-top: 10px;
  width: 100%;
  text-align: center;
}
.el-button--primary{
  margin: 0 20px;
}
</style>
