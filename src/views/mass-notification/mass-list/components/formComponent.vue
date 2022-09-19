<template>
  <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
    <el-form-item v-if="activeName !== 'notification'" label="商协会名称" prop="chamberName">
      <!-- 产品这里更改了下需求，所以改用下拉输入框 -->
      <el-select v-model="form.ckey" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in nameList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <!-- <el-autocomplete
        v-model="form.chamberName"
        class="inline-input"
        :fetch-suggestions="querySearch"
        placeholder="搜索/选择"
        @select="handleSelect"
      /> -->
    </el-form-item>
    <template v-if="activeName !== 'template'">
      <!-- <el-form-item :label="activeName == 'notification' ? '标题' : ' 消息标题'" prop="title">
        <el-input v-model="form.title" clearable :placeholder="placeholder" />
      </el-form-item> -->

      <el-form-item label="通知类型" prop="noticeTypeId">
        <el-select v-model="form.noticeTypeId" class="select" placeholder="请选择">
          <el-option v-for="(item2,index2) in statusList" :key="index2" :label="item2.name" :value="item2.id" />
        </el-select>
      </el-form-item>
    </template>

    <el-form-item v-if="activeName === 'notification'" label="创建人" prop="title">
      <el-input v-model="form.title" clearable :placeholder="placeholder" />
    </el-form-item>

    <el-form-item v-if="activeName !== 'template'" label="发布时间" prop="activityName">
      <el-date-picker
        v-model="form.time"
        value-format="timestamp"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </el-form-item>
    <!-- 为模板管理时展示 -->
    <template v-if="activeName === 'template'">
      <el-form-item>
        <el-button type="primary" @click="templateOperation(1)">批量配置模板</el-button>
        <el-button type="primary" @click="templateOperation(2)">批量分配短信</el-button>
      </el-form-item>
      <div class="mass">短信总量： <span class="note">{{ statistics.smsDistributionSum || 0 }}</span></div>
      <div class="mass">剩余短信： <span class="note">{{ statistics.smsRemainSum || 0 }}</span></div>
    </template>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { distributionChambers } from '@/api/mass-notification'
import { notificationType, massNotificationType } from '../../util/label'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'FormComponent',
  props: {
    // 活跃的tab名称
    activeName: {
      type: String,
      default: 'template'
    },
    statistics: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    } // 分配短信统计
  },
  data() {
    return {
      form: {
        ckey: '',
        // title: '',
        time: [],
        // 通知类型
        noticeTypeId: ''
      },
      nameList: [],
      placeholder: '请输入',
      statusList: []
    }
  },
  watch: {
    activeName(newVal) {
      if (newVal === 'mass') {
        this.statusList = notificationType
      } else {
        this.statusList = massNotificationType
      }
      // 清空表单内容
      this.$refs['form'].resetFields()
    }
  },
  created() {
    this.getChamberOptions()
    this.statusList = this.activeName === 'mass' ? cloneDeep(notificationType) : cloneDeep(massNotificationType)
    this.statusList[0].id = ''
  },
  methods: {
    /** 接口请求 */
    async getChamberOptions() {
      const { data } = await distributionChambers()
      this.nameList = data
    },
    // 拉取商协会列表
    /** 行为操作 */
    // querySearch(queryString, cb) {
    //   const { nameList } = this
    //   const results = queryString ? nameList.filter(this.createFilter(queryString)) : nameList
    //   // 调用 callback 返回建议列表的数据
    //   cb(results)
    // },
    // createFilter(queryString) {
    //   return restaurant => {
    //     return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    //   }
    // },
    onSubmit() {
      let params = { }
      if (this.form.time && this.form.time.length === 2) {
        params = {
          ...this.form,
          sendEndTime: this.form.time[1],
          sendStartTime: this.form.time[0]
        }
      } else {
        params = { ...this.form }
      }
      delete params.time
      this.$emit('query', params)
    },
    templateOperation(type) {
      this.$emit('templateOperation', type)
    },
    handleSelect() {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.mass {
  background-color: #f2f2f2;
  font-size: 16px;
  color: #7f7f7f;
  padding: 10px;
  display: inline-block;
  border-radius: 4px;
}
.note {
  font-size: 20px;
  font-weight: 700;
}
</style>
