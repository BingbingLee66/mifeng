<template>
  <div class="img-item" @click="$emit('click', $event)">
    <img :src="img.middleImg || img.img" />
    <div class="img-name">{{ img.fileName }}</div>
    <a-tag
      v-if="tag.name"
      class="img-tag"
      :color="tag.type"
      @click.stop="$emit('tagClick')"
      >{{ tag.name }}</a-tag
    >
    <slot />
    <div class="flex-x" @click.stop>
      <a-image
        :style="{ display: 'none' }"
        :preview="{
          visible: previewVisible,
          onVisibleChange: (value) => (previewVisible = value),
        }"
        :src="img.middleImg || img.img"
      />
      <a-button
        v-if="operations.includes('preview')"
        type="link"
        @click="previewVisible = true"
        >查看大图</a-button
      >
      <a-button
        v-if="operations.includes('cover') && editAuth"
        type="link"
        @click="setCover"
        >设为封面</a-button
      >
    </div>
  </div>
</template>

<script>
import { setAlbumCover } from "@business/common/src/album/api";
import { defineComponent, ref } from "vue";
import { Tag, Image } from "ant-design-vue";
export default defineComponent({
  components: { ATag: Tag, AImage: Image },
  props: {
    img: {
      type: Object,
      default() {
        return {};
      },
    },
    tag: {
      type: Object,
      default() {
        return {
          name: "",
        };
      },
    },
    operations: {
      type: Array,
      default() {
        // preview | cover
        return [];
      },
    },
    editAuth: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["coverChange", "click", "tagClick"],
  setup(props, { emit }) {
    const previewVisible = ref(false);
    const setCover = async () => {
      await setAlbumCover({
        flag: 1,
        imgId: props.img.id,
      });
      emit("coverChange");
    };
    return { setCover, previewVisible };
  },
});
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
    right: 0;
    top: 176px;
  }
}
</style>
