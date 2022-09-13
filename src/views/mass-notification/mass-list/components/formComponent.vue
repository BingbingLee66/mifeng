<template>
  <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
    <el-form-item v-if="activeName !== 'notification'" label="商协会名称" prop="chamberName">
      <el-autocomplete
        v-model="form.chamberName"
        class="inline-input"
        :fetch-suggestions="querySearch"
        placeholder="搜索/选择"
        @select="handleSelect"
      />
    </el-form-item>
    <template v-if="activeName !== 'template'">
      <el-form-item :label="activeName == 'notification' ? '标题' : ' 消息标题'" prop="title">
        <el-input v-model="form.title" clearable :placeholder="placeholder" />
      </el-form-item>

      <el-form-item label="通知类型" prop="notification">
        <el-select v-model="form.notification" class="select" placeholder="请选择">
          <el-option v-for="item2 in statusList" :key="item2.id" :label="item2.name" :value="item2.id" />
        </el-select>
      </el-form-item>
    </template>

    <!-- <el-form-item v-if="activeName === 'notification'" label="创建人" prop="title">
      <el-input v-model="form.title" clearable :placeholder="placeholder" />
    </el-form-item> -->

    <el-form-item v-if="activeName !== 'template'" label="发布时间" prop="activityName">
      <el-date-picker
        v-model="form.time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </el-form-item>
    <!-- 为模板管理时展示 -->
    <template v-if="activeName === 'template'">
      <el-form-item>
        <el-button type="primary" @click="onSubmit">批量配置模板</el-button>
        <el-button type="primary" @click="onSubmit">批量分配短信</el-button>
      </el-form-item>
      <div class="mass">短信总量： <span class="note">1234</span></div>
      <div class="mass">剩余短信： <span class="note">1234</span></div>
    </template>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { notificationType, massNotificationType } from '../../util/label'
export default {
  name: 'FormComponent',
  props: {
    // 活跃的tab名称
    activeName: {
      type: String,
      default: 'template'
    }
  },
  data() {
    return {
      form: {
        chamberName: '',
        title: '',
        time: [],
        // 通知类型
        notification: -1
      },
      nameList: [
        { value: '三全鲜食（北新泾店）', address: '长宁区新渔路144号' },
        { value: '三Hot honey 首尔炸鸡（仙霞路）', address: '上海市长宁区淞虹路661号' },
        { value: '新旺角茶餐厅', address: '上海市普陀区真北路988号创邑金沙谷6号楼113' },
        { value: '泷千家(天山西路店)', address: '天山西路438号' },
        { value: '胖仙女纸杯蛋糕（上海凌空店）', address: '上海市长宁区金钟路968号1幢18号楼一层商铺18-101' },
        { value: '贡茶', address: '上海市长宁区金钟路633号' }
      ],
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
    this.statusList = this.activeName === 'mass' ? notificationType : massNotificationType
  },
  methods: {
    /** 行为操作 */
    querySearch(queryString, cb) {
      const { nameList } = this
      const results = queryString ? nameList.filter(this.createFilter(queryString)) : nameList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    onSubmit() {},
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
