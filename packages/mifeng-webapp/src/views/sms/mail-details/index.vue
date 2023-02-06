<template>
  <Panel>
    <div class="content">
      <div class="box-left" v-html="info.content" />
      <div v-if="info.imgs && info.imgs.length" class="box-right">
        <div>活动二维码</div>
        <a-image
          style="width: 120px; height: 120px; margin-top: 10px"
          :src="info.imgs[0]"
          :preview="{ visible: false }"
          @click="visible = true"
        />
        <div style="display: none">
          <a-image-preview-group :preview="{ visible, onVisibleChange: vis => (visible = vis) }">
            <a-image v-for="(item, index) in info.imgs" :src="item" :key="index" />
          </a-image-preview-group>
        </div>
      </div>
    </div>
  </Panel>
</template>
<script>
import { stationMailDetail } from '@/api/mass-notification/index'
import { useRoute } from 'vue-router'
import { reactive, ref } from 'vue'
export default {
  setup() {
    const route = useRoute()
    const info = reactive({ content: '', imgs: [] })
    const fetchData = async () => {
      const params = { id: route.query.id || '' }
      const {
        data: { content, imgs }
      } = await stationMailDetail(params)
      info.content = content
      info.imgs = imgs || []
    }
    fetchData()
    return { info, visible: ref(false) }
  }
}
</script>
<style lang="scss" scoped>
.content {
  display: flex;

  .box-left {
    max-width: 70%;
  }
  .box-right {
    margin-left: 40px;
    text-align: center;
  }
}
</style>
