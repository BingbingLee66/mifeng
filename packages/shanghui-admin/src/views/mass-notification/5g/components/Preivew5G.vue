<template>
  <div>
    <a-modal
      :visible="props.visible"
      title="预览"
      width="404px"
      @cancel="emit('update:visible', false)"
      :center="true"
      v-bind="$attrs"
    >
      <template #footer>
        <a-button type="primary" @click="() => emit('update:visible', false)">关闭</a-button>
      </template>
      <SimulatePhone>
        <div class="card">{{ template.templateName }}</div>
        <div v-for="(item, index) of template.extend.params" :key="index" class="card">
          <template v-if="item.type === 'image'">
            <img style="width: 100%" :src="item.value" />
          </template>
          <template v-else-if="item.type === 'video'">
            <video style="width: 100%" :src="item.value" controls />
          </template>
          <template v-else-if="item.type === 'audio'">
            <AudioPlayBar :src="item.value" />
          </template>
          <template v-else-if="item.type === 'activity' || item.type === 'article'">
            <a-button type="link" @click="$copyText(item.value.url).then(() => $message.success('复制成功'))">
              {{ item.value.url }}
            </a-button>
          </template>
          <template v-else>
            {{ item.value }}
          </template>
        </div>
      </SimulatePhone>
    </a-modal>
  </div>
</template>

<script setup>
import { get5GTemplateDetail } from '@/api/mass-notification'
import { ref, watch, defineAsyncComponent } from 'vue'
const SimulatePhone = defineAsyncComponent(() => import('./SimulatePhone.vue'))
const AudioPlayBar = defineAsyncComponent(() => import('./AudioPlayBar.vue'))
const emit = defineEmits(['update:visible'])
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  templateId: {
    type: String,
    default: ''
  }
})
const template = ref({ extend: { params: [] } })
const loading = ref(false)
watch(
  () => props.templateId,
  () => {
    template.value = { extend: { params: [] } }
    fetchData()
  }
)
const fetchData = async () => {
  if (!props.templateId) return
  loading.value = true
  try {
    const { data } = await get5GTemplateDetail(props.templateId)
    template.value = data
  } finally {
    loading.value = false
  }
}
</script>

<style scope lang="scss">
.card {
  padding: 3px;
  background-color: #eee;
  border-radius: 5px;
  margin-bottom: 8px;
  line-height: 18px;
}
.ant-modal-footer {
  text-align: center;
}
</style>
