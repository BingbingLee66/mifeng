<template>
  <el-dialog :visible.sync="selectionVisible" title="已添加的词条">
    <RelatedRecommend :entry-list="entryList" @remove-entry="removeHandler" @add-entry="addEntry" />
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
      this.selectionVisible = false
    },
    sureHandler() {
      const encyclopediaIds = this.entryList
        .map(items => items.encyclopediaId)
      this.$emit('sure-handler', encyclopediaIds)
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
.c-entry-button {
  margin-top: 10px;
  text-align: center;
  .el-button {
    width: 150px;
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
