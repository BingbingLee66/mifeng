<template>
  <div class="select-wrap">
    <div v-if="!value.length" class="no-data">请选择活动类型，最多5个</div>
    <div v-for="(item, index) in value" :key="item.value" class="select-item">
      {{ item.label }}
      <i class="el-icon-error close" @click="onDel(index, $event)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomSelect',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onDel(index, evt) {
      this.value.splice(index, 1)
      this.$emit('input', this.value)
      evt.stopPropagation()
    }
  }
}
</script>

<style scoped lang="scss">
.select-wrap {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 6px 10px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  width: 100%;
  cursor: pointer;

  .no-data {
    color: #a5a7a5;
  }

  .select-item {
    display: flex;
    align-items: center;
    padding:0 6px;
    border: 1px solid #e9e9eb;
    color: #909399;
    margin-right: 6px;
    height: 28px;
    cursor: default;
  }

  .close {
    margin-left: 6px;
    cursor: pointer;
  }

}
</style>
