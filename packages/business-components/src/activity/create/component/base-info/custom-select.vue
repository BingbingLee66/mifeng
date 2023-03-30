<template>
  <div class="select-wrap">
    <div v-if="!value.length" class="no-data">请选择活动类型，最多5个</div>
    <div v-for="(item, index) in value" :key="item.labelId" class="select-item">
      {{ item.label }}
      <close-circle-outlined class="close" @click.stop="onDel(index, $event)" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash'

export default defineComponent({
  name: 'CustomSelect',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const onDel = (index, evt) => {
      const tempVal = cloneDeep(props.value)
      tempVal.splice(index, 1)
      emit('update:value', tempVal)
      evt.stopPropagation()
    }

    return {
      onDel
    }
  }
})
</script>

<style scoped lang="scss">
.select-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 100%;
  cursor: pointer;

  .no-data {
    color: #a5a7a5;
  }

  .select-item {
    display: flex;
    align-items: center;
    padding: 0 6px;
    border: 1px solid #e9e9eb;
    color: #909399;
    margin: 0 6px 3px 0;
    height: 28px;
    cursor: default;
  }

  .close {
    margin-left: 6px;
    cursor: pointer;
  }
}
</style>
