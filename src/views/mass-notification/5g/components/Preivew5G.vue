<template>
  <el-dialog :visible="visible" title="预览" width="404px" center v-bind="$attrs" v-on="$listeners">
    <SimulatePhone v-loading="loading">
      <div class="card">{{ template.templateName }}</div>
      <div v-for="(item,index) of template.extend.params" :key="index" class="card">

        <template v-if="item.type === 'image'">
          <img style="width:100%" :src="item.value">
        </template>
        <template v-else-if="item.type === 'video'">
          <video style="width:100%" :src="item.value" controls />
        </template>
        <template v-else-if="item.type === 'audio'">
          <AudioPlayBar :src="item.value" />
        </template>
        <template v-else-if="item.type === 'activity' || item.type === 'article'">
          <el-link type="primary" @click="$copyText(item.value.url).then(() => $message.success('复制成功'))"> {{ item.value.url }}</el-link>
        </template>

        <template v-else>
          {{ item.value }}
        </template>
      </div>
    </SimulatePhone>
    <el-button slot="footer" type="primary" @click="$emit('update:visible',false)">关闭</el-button>
  </el-dialog>
</template>

<script>
import { get5GTemplateDetail } from '@/api/mass-notification'
export default {
  components: {
    SimulatePhone: () => import('./SimulatePhone'),
    AudioPlayBar: () => import('./AudioPlayBar')
  },
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    templateId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      template: { extend: { params: [] } },
      loading: false
    }
  },
  watch: {
    templateId: {
      handler() {
        this.template = { extend: { params: [] } }
        this.fetchData()
      },
      immediate: true
    }
  },
  methods: {
    async fetchData() {
      const { templateId } = this
      if (!templateId) return
      this.loading = true
      try {
        const { data } = await get5GTemplateDetail(templateId)
        this.template = data
      } finally {
        this.loading = false
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.card {
  padding: 3px;
  background-color: #eee;
  border-radius: 5px;
  margin-bottom: 8px;
  line-height: 18px;
}
</style>
