<template>
  <div class="entry-list">
    <div v-for="(item, index) in entryList" :key="item.encyclopediaId" class="entry-item">
      <div class="close-icon-box" @click="removeHandler(index)">
        <i class="el-icon-error" />
      </div>
      <el-image :src="item.coverUrl" fit="cover" style="width: 80px; height: 80px" />
    </div>
    <div class="entry-add" @click="addEntry()">
      +
    </div>
  </div>
</template>
<script>
export default {
  props: {
    entryList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    removeHandler(index) {
      this.$emit('remove-entry', index)
    },
    addEntry() {
      this.$emit('add-entry')
    }
  }
}
</script>
<style lang="scss" scoped>
.entry-list{
  display: flex;
}
.entry-item{
  position: relative;
  margin-right: 20px;
  .close-icon-box{
    position: absolute;
    right: -12px;
    top: -9px;
    z-index: 5;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    color: black;
    font-size: 20px;
    line-height: 20px;
    cursor: pointer;
  }
}
.entry-add{
  width: 40px;
  height: 40px;
  border: 3px solid #222;
  border-radius: 8px;
  font-size: 40px;
  color: #222;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
}
</style>
