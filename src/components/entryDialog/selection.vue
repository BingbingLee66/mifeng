<template>
  <el-dialog :visible.sync="selectionVisible" title="已添加的词条" :before-close="closeHandler">
    <RelatedRecommend :entry-list="entryList" @remove-entry="removeHandler" @add-entry="addEntry" @left-handler="leftHandler" @right-handler="rightHandler" />
    <div class="c-entry-button">
      <el-button type="primary" @click="sureHandler()">确认</el-button>
      <el-button @click="closeHandler()">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { queryRelatedEntryList } from '@/api/bossin'
import RelatedRecommend from './RelatedRecommend.vue'
export default {
  components: {
    RelatedRecommend
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    entryInfo: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      entryList: [],
      filterInfo: {
        page: 1,
        limit: 100
      }
    }
  },
  computed: {
    selectionVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    selectionVisible(val) {
      if (val) {
        this.entryList = []
        this.queryRelatedEntryList()
      }
    }
  },
  methods: {
    async queryRelatedEntryList() {
      const { data } = await queryRelatedEntryList({
        contentId: this.entryInfo.id,
        contentType: this.entryInfo.contentType,
        ...this.filterInfo
      })
      this.entryList = data.records.map(item => {
        return {
          ...item,
          check: true
        }
      })
    },
    removeHandler(index) {
      this.entryList.splice(index, 1)
    },
    addEntry() {
      this.closeHandler()
      this.$emit('add-entry', this.entryList)
    },
    closeHandler() {
      this.$emit('close')
    },
    sureHandler() {
      const encyclopediaIds = this.entryList
        .map(items => items.encyclopediaId)
      this.$emit('sure-handler', encyclopediaIds)
    },
    leftHandler(index) {
      const current = this.entryList.splice(index, 1)[0]
      this.entryList.splice(index - 1, 0, current)
    },
    rightHandler(index) {
      const current = this.entryList.splice(index, 1)[0]
      this.entryList.splice(index + 1, 0, current)
    }
  }
}
</script>
<style lang="scss" scoped>
.c-entry-button {
  margin-top: 10px;
  text-align: center;
  .el-button {
    width: 150px;
  }
}
</style>
