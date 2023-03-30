<template>
  <div class="flex flex-wrap">
    <div v-for="(item, index) in entryList" :key="item.encyclopediaId" class="entry-item">
      <div class="entry-image">
        <div class="close-icon-box" @click="removeHandler(index)">
          <close-outlined />
        </div>
        <a-image
          :width="80"
          :height="80"
          :src="item.coverUrl"
          fallback="https://ysh-cdn.kaidicloud.com/test/profile/ysh_default_avatar.png"
        />
      </div>
      <div class="entry-name">{{ item.encyclopediaName }}</div>
      <div class="text-center">
        <ArrowLeftOutlined v-if="index !== 0" class="right-arrow mr-2" @click="leftHandler(index)" />
        <ArrowRightOutlined v-if="index !== entryList.length - 1" class="right-arrow" @click="rightHandler(index)" />
      </div>
    </div>
    <a-button type="primary" @click="addEntry()"><plus-outlined /></a-button>
  </div>
</template>
<script setup>
defineProps({
  entryList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['remove-entry', 'add-entry', 'left-handler', 'right-handler'])
const removeHandler = index => {
  emit('remove-entry', index)
}
const addEntry = () => {
  emit('add-entry')
}
const leftHandler = index => {
  emit('left-handler', index)
}
const rightHandler = index => {
  emit('right-handler', index)
}
</script>
<style lang="scss" scoped>
.entry-item {
  max-width: 140px;
  margin: 0 20px 10px 0;
  .entry-image {
    position: relative;
    width: 80px;
    height: 80px;
    margin: auto;
  }
  .close-icon-box {
    position: absolute;
    right: -12px;
    top: -9px;
    z-index: 5;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    color: black;
    text-align: center;
    cursor: pointer;
  }
  .entry-name {
    margin: 5px 0;
    text-align: center;
    color: #222;
    line-height: 20px;
  }
}
.right-arrow {
  width: 21px;
  height: 21px;
  border: 1px solid #222;
  border-radius: 50%;
  line-height: 21px;
  font-size: 12px;
}
:deep(.ant-image-img) {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}
</style>
