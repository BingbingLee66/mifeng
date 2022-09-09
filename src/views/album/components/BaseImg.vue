<template>
  <div class="img-item" @click="$emit('click',$event)">
    <img :src="img.middleImg || img.img">
    <div class="img-name">{{ img.fileName }}</div>
    <el-tag v-if="tag.name" class="img-tag" effect="dark" size="mini" v-bind="tag" @click.stop="$emit('tagClick')">{{ tag.name }}</el-tag>
    <slot />
    <div class="flex-x" @click.stop>
      <el-image v-if="operations.includes('preview')" ref="previewer" style="margin-right:10px;" :preview-src-list="[img.img]">
        <el-button slot="error" type="text" @click="$refs.previewer.showViewer=true">查看大图</el-button>
      </el-image>
      <el-button v-if="operations.includes('cover')" type="text" @click="setCover">设为封面</el-button>
    </div>

  </div>
</template>

<script>
import { setAlbumCover } from '@/api/album'

export default {
  components: {},
  props: {
    img: {
      type: Object,
      default() {
        return {}
      }
    },
    tag: {
      type: Object,
      default() {
        return {
          name: ''
        }
      }
    },
    operations: {
      type: Array,
      default() {
        // preview | cover
        return []
      }
    },
  },
  data() { return {} },
  methods: {
    async setCover() {
      const { state, msg } = await setAlbumCover({
        flag: 1,
        imgId: this.img.id
      })
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) this.$emit('coverChange')
    }
  },
}
</script>

<style lang="scss" scoped>
.img-item {
  position: relative;
  width: 200px;

  > img {
    width: 200px;
    height: 200px;
    object-fit: cover;
  }

  .img-name {
    width: 200px;
    @include ellipsis(1);
  }

  .img-tag {
    position: absolute;
    right: 4px;
    top: 176px;
  }
}
</style>
