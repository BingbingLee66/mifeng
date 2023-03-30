<template>
  <a-modal v-model:visible="modalVisible" title="已添加词条" width="70%" @ok="sureHandler" @cancel="closeHandler">
    <RelatedRecommend
      :entry-list="entryList"
      @remove-entry="removeHandler"
      @add-entry="addEntry"
      @left-handler="leftHandler"
      @right-handler="rightHandler"
    />
  </a-modal>
</template>
<script>
import { defineComponent, computed, defineAsyncComponent, ref, reactive, watch } from 'vue'
import { queryRelatedEntryList } from '@business/common/src/content/api/bossin'
export default defineComponent({
  components: {
    RelatedRecommend: defineAsyncComponent(() => import('@business/components/src/content/relateRecommend.vue'))
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    entryInfo: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['update:visible', 'add-entry', 'sure-handler', 'close'],
  setup(props, { emit }) {
    const modalVisible = computed({
      get() {
        return props.visible
      },
      set(value) {
        emit('update:visible', value)
      }
    })
    watch(
      () => props.visible,
      val => {
        if (val) {
          entryList.value = []
          queryRelatedList()
        }
      }
    )
    const entryList = ref([])
    const filterInfo = reactive({
      page: 1,
      limit: 100
    })
    const queryRelatedList = async () => {
      const { data } = await queryRelatedEntryList({
        contentId: props.entryInfo.id,
        contentType: props.entryInfo.contentType,
        ...filterInfo
      })
      entryList.value = data.records.map(item => {
        return {
          ...item,
          check: true
        }
      })
      console.log(entryList)
    }
    const removeHandler = index => {
      entryList.value.splice(index, 1)
    }
    const addEntry = () => {
      closeHandler()
      emit('add-entry', entryList.value)
    }
    const closeHandler = () => {
      emit('close')
    }
    const sureHandler = () => {
      const encyclopediaIds = entryList.value.map(items => items.encyclopediaId)
      emit('sure-handler', encyclopediaIds)
    }
    const leftHandler = index => {
      const current = entryList.value.splice(index, 1)[0]
      entryList.value.splice(index - 1, 0, current)
    }
    const rightHandler = index => {
      const current = entryList.value.splice(index, 1)[0]
      entryList.value.splice(index + 1, 0, current)
    }
    return {
      modalVisible,
      entryList,
      sureHandler,
      rightHandler,
      removeHandler,
      leftHandler,
      closeHandler,
      addEntry
    }
  }
})
</script>
<style lang="scss" scoped>
.m-preview-wrap {
  width: 100%;
  height: 80vh;
}

.m-preview-area {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0 auto;
  border: 1px solid #d9dde2;
  overflow-y: auto;
}

.m-article-remark {
  font-size: 19px;
  font-weight: 500;
  margin: 0px 20px;
}

.m-article-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin: 20px 40px 20px 40px;
}

.m-article-content {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.8;
  //margin: 20px;
}

::-webkit-scrollbar {
  width: 0px;
}

.m-preview-area img {
  width: 100% !important;
  height: auto !important;
}
</style>
