<template>
  <span v-if="!disable" class="lables">
    <span v-for="(item, index) in list" :key="item.id" class="lable-item" :style="itemStyle">
      {{ item[nameKey] }}
      <slot name="icon" :list="list" :item="item" :index="index">
        <close-outlined class="lable-icon" @click.stop="$emit('delete', { list, item, index })" />
      </slot>
    </span>
    <a-button v-if="list.length < limit" type="primary" size="large" @click.stop="$emit('click')"><slot /></a-button>
  </span>
  <span v-else>
    <span v-for="item in list" :key="item.id" class="lable-item lable-item__disable">
      {{ item[nameKey] }}
    </span>
  </span>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    nameKey: {
      type: String,
      default: 'name'
    },
    limit: {
      type: String || Number,
      default: Infinity
    },
    itemStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {}
  }
})
</script>
<style scoped lang="scss">
.lable-item {
  display: inline-block;
  position: relative;
  padding: 12px 20px;
  margin-right: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #409eff;
  color: #409eff;
  cursor: pointer;
  line-height: 1.15;

  &:last-child {
    margin-right: 0;
  }
}

.lable-icon {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 16px;
}
.lable-icon:hover {
  color: #fd5d5d;
  font-size: 18px;
}

.lable-item__disable {
  color: #666;
  border-color: #666;
  cursor: default;
}
</style>
