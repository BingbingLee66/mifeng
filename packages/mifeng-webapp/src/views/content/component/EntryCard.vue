<template>
  <div class="entry-title font-bold">{{ title }}</div>
  <div class="flex flex-wrap max-h-80 overflow-auto">
    <div v-for="item in lists" :key="item.id" class="c-entry-list__item">
      <div class="c-eli__relative">
        <div class="image-name">
          <a-image
            :width="50"
            :height="50"
            :src="item.coverUrl"
            fallback="https://ysh-cdn.kaidicloud.com/test/profile/ysh_default_avatar.png"
          />
          <div class="ml-4">
            <div class="entry-name">{{ item.encyclopediaName }}</div>
            <template v-if="item.orgPositionInfo && item.orgPositionInfo.length">
              <div
                v-for="org in item.orgPositionInfo"
                :key="org.position + org.organizationName"
                class="entry-position"
              >
                {{ org.position }} {{ showOrganizationName ? '| ' + org.organizationName : '' }}
              </div>
            </template>
          </div>
        </div>
        <a-checkbox
          v-model:checked="item.check"
          class="c-eli__checkbox"
          @change="value => checkboxChange(value, item)"
        />
      </div>
      <div class="entry-polysemant">{{ item.polysemant }}</div>
    </div>
    <div v-if="!lists.length" class="no-data-text">暂无{{ title }}数据</div>
  </div>
  <a-pagination
    class="text-right page-box"
    v-if="lists && lists.length"
    v-model:current="filterInfo.page"
    :pageSize="filterInfo.limit"
    :total="total"
    show-size-changer
    :show-total="total => `共 ${total} 条`"
    @change="handleCurrentChange"
    @showSizeChange="onShowSizeChange"
  />
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  lists: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  filterInfo: {
    type: Object,
    default: () => {}
  },
  showOrganizationName: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['checkboxChange', 'onChange', 'onShowSizeChange', 'update:filterInfo'])

const filterInfo = computed({
  get: () => props.filterInfo,
  set: val => emit('update:filterInfo', val)
})

const checkboxChange = (event, item) => {
  emit('checkboxChange', event.target.checked, item)
}

const handleCurrentChange = page => {
  emit('onChange', page)
}

const onShowSizeChange = (current, pageSize) => {
  emit('onShowSizeChange', pageSize)
}
</script>
<style lang="scss" scoped>
.entry-title {
  padding: 20px 0 16px 0;
  font-size: 14px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
  line-height: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
}
.c-entry-list__item {
  width: 210px;
  padding: 12px;
  margin: 0 16px 10px 0;
  border-radius: 8px;
  background: #f7f7f7;
  .img {
    object-fit: cover;
  }
  .entry-name {
    width: 120px;
    color: #222;
    font-size: 16px;
    font-weight: bold;
  }
  .entry-position {
    width: 135px;
    margin-top: 2px;
    font-size: 14px;
    color: #666;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .entry-polysemant {
    margin-top: 8px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.35);
    line-height: 20px;
  }
  .text-black {
    color: #222;
  }
}
.c-eli__relative {
  display: flex;
  justify-content: space-between;
  position: relative;
  .image-name {
    display: flex;
    align-items: center;
    .ml-4 {
      margin-left: 8px;
    }
  }
}
.c-eli__checkbox {
  position: absolute;
  right: 0px;
  top: 0;
}
.page-box {
  margin-top: 20px;
}
:deep(.ant-image-img) {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}
</style>
