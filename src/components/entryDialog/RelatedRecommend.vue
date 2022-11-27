<template>
  <div class="entry-list">
    <div v-for="(item, index) in entryList" :key="item.encyclopediaId" class="entry-item">
      <div class="entry-image">
        <div class="close-icon-box" @click="removeHandler(index)">
          <i class="el-icon-error" />
        </div>
        <el-image :src="item.coverUrl" fit="cover" style="width: 80px; height: 80px" />
      </div>
      <div class="entry-name">{{ item.encyclopediaName }}</div>
      <div class="entry-polysemant">{{ item.polysemant }}</div>
    </div>
    <div class="entry-add" @click="addEntry()">+</div>
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
  flex-wrap: wrap;
}
.entry-item{
  max-width: 120px;
  margin: 0 20px 10px 0;
  .entry-image{
    position: relative;
    width: 80px;
    height: 80px;
    margin: auto;
  }
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
  .entry-name {
    margin: 5px 0;
    text-align: center;
    color: #222;
  }
  .entry-polysemant{
    text-align: center;
    font-size: 12px;
    color: #666
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
  line-height: 36px;
  cursor: pointer;
}
</style>
