<template>
  <el-dialog :visible.sync="entryVisible" :title="title">
    <el-input v-model="keywordFilter.encyclopediaName" placeholder="请输入关键字" @input="inputHandler" />
    <h2>最近推荐</h2>
    <div class="c-entry-list">
      <div v-for="item in recommendList" :key="item.id" class="c-entry-list__item">
        <div class="c-eli__relative">
          <el-checkbox
            v-model="item.check"
            class="c-eli__checkbox"
            @change="(value) => checkboxChange(value, item.encyclopediaId)"
          />
          <el-image
            style="width: 80px; height: 80px"
            :src="item.coverUrl"
            fit="cover"
          />
        </div>
        <div>{{ item.encyclopediaName }}</div>
      </div>
      <div v-if="!recommendList.length">暂无相关推荐</div>
    </div>
    <div>
      <h2>商会相关</h2>
      <div class="c-entry-list">
        <div v-for="item in chamberList" :key="item.id" class="c-entry-list__item">
          <div class="c-eli__relative">
            <el-checkbox
              v-model="item.check"
              class="c-eli__checkbox"
              @change="(value) => checkboxChange(value, item.encyclopediaId)"
            />
            <el-image
              style="width: 80px; height: 80px"
              :src="item.coverUrl"
              fit="cover"
            />
          </div>
          <div>{{ item.encyclopediaName }}</div>
        </div>
        <div v-if="!chamberList.length">暂无商会相关数据</div>
      </div>
    </div>
    <el-button v-if="chamberList.length" type="text" class="m-auto">点击展开更多</el-button>
    <div v-if="otherList.length">
      <h2>其他</h2>
      <div class="c-entry-list">
        <div v-for="item in otherList" :key="item.id" class="c-entry-list__item">
          <div class="c-eli__relative">
            <el-checkbox
              v-model="item.check"
              class="c-eli__checkbox"
              @change="(value) => checkboxChange(value, item.encyclopediaId)"
            />
            <el-image
              style="width: 80px; height: 80px"
              :src="item.coverUrl"
              fit="cover"
            />
          </div>
          <div>{{ item.encyclopediaName }}</div>
        </div>
      </div>
    </div>
    <el-button v-if="otherList.length && otherTotal > otherList.length" type="text" class="m-auto" @click="loadMore">
      点击展开更多
    </el-button>
    <div class="c-entry-button">
      <el-button type="primary" @click="sureHandler()">确认</el-button>
      <el-button @click="closeHandler()">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { recommendLexicalRecently, queryChamberLexical, queryEntryList } from '@/api/bossin'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    entryInfo: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      recommendList: [],
      chamberList: [],
      otherList: [],
      recommendFilter: {
        ckey: '',
        limit: 10,
        page: 1
      },
      keywordFilter: {
        encyclopediaName: '',
        limit: 10,
        page: 1
      },
      otherTotal: 0,
      selectionKey: {}
    }
  },
  computed: {
    entryVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    entryVisible(val) {
      if (val) {
        if (this.entryInfo.selectionData.length) this.setSelectionMap()
        this.recommendList = []
        this.chamberList = []
        this.otherList = []
        this.queryRecommendList()
        this.queryChamberList()
        this.inputHandler()
      }
    }
  },
  methods: {
    setSelectionMap() {
      this.entryInfo.selectionData.forEach(item => {
        this.selectionKey[item.encyclopediaId] = true
      })
    },
    async queryRecommendList() {
      const { data } = await recommendLexicalRecently({
        ...this.recommendFilter,
        ckey: this.entryInfo.ckey
      })
      this.recommendList = data.records.map(item => {
        return {
          ...item,
          check: !!this.selectionKey[item.encyclopediaId]
        }
      })
    },
    async queryChamberList() {
      const { data } = await queryChamberLexical({
        ...this.recommendFilter,
        ckey: this.entryInfo.ckey
      })
      if (data.chamberEntry) {
        this.chamberList = [data.chamberEntry]
      }
      this.chamberList = this.chamberList.concat(data.memberEntry.records)
      this.chamberList = this.chamberList.map(item => {
        return {
          ...item,
          check: !!this.selectionKey[item.encyclopediaId]
        }
      })
    },
    async inputHandler() {
      this.keywordFilter.page = 1
      this.searchList()
    },
    async searchList() {
      const { data } = await queryEntryList(this.keywordFilter)
      this.otherTotal = data.total
      const checkData = data.records.map(item => {
        return { ...item, check: !!this.selectionKey[item.encyclopediaId] }
      })
      if (this.keywordFilter <= 1) {
        this.otherList = checkData
      } else {
        this.otherList = this.otherList.concat(checkData)
      }
    },
    loadMore() {
      this.keywordFilter.page++
      this.searchList()
    },
    closeHandler() {
      this.visible = false
    },
    sureHandler() {
      const encyclopediaIds = []
      for (const key in this.selectionKey) {
        if (this.selectionKey[key]) {
          encyclopediaIds.push(key)
        }
      }
      this.$emit('sure-handler', encyclopediaIds)
    },
    checkboxChange(value, encyclopediaId) {
      this.selectionKey[encyclopediaId] = value
    }
  }
}
</script>
<style lang="scss" scoped>
.c-entry-list{
  display: flex;
  flex-wrap: wrap;
}
.c-entry-list__item {
  width: 20%;
  padding: 0 5px;
  margin-bottom: 10px;
  text-align: center;
  .img{
    object-fit: cover;
  }
}
.c-eli__relative{
  position: relative;
  width: 80px;
  height: 90px;
  margin: auto;
}
.c-eli__checkbox{
  position: absolute;
  right: -15px;
  top: 0;
}
.c-entry-button {
  margin-top: 10px;
  text-align: center;
  .el-button {
    width: 150px;
  }
}
.c-recent-list {
  display: flex;
}
.c-recent-item{
  position: relative;
  margin-right: 10px;
  .c-recent-item__checkbox {
    position: absolute;
    right: 0;
    top: 0;
  }
}
.c-recent-item__tag {
  padding: 8px 15px 0 8px;
  box-sizing: content-box;
}

.m-auto {
  display: block;
  margin: auto;
}
</style>
