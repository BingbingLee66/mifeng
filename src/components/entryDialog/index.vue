<template>
  <el-dialog :visible.sync="entryVisible" :title="title" :before-close="closeHandler">
    <el-input v-model="keywordFilter.encyclopediaName" placeholder="请输入关键字" @input="inputHandler" />
    <h2>最近推荐</h2>
    <div class="c-entry-list">
      <div v-for="item in recommendList" :key="item.id" class="c-entry-list__item">
        <div class="c-eli__relative">
          <el-checkbox
            v-model="item.check"
            class="c-eli__checkbox"
            @change="(value) => checkboxChange(value, item)"
          />
          <el-image
            style="width: 80px; height: 80px"
            :src="item.coverUrl"
            fit="cover"
          >
            <div slot="error" class="image-slot">
              <img :src="defaultImage" width="80" height="80" alt="">
            </div>
          </el-image>
        </div>
        <div class="entry-name">{{ item.encyclopediaName }}</div>
        <div class="entry-polysemant">{{ item.polysemant }}</div>
      </div>
      <div v-if="!recommendList.length">暂无相关推荐</div>
    </div>
    <el-button
      v-if="recommendList.length && recommendTotal > recommendList.length"
      type="text"
      class="m-auto"
      @click="queryRecommendList(true)"
    >
      点击展开更多
    </el-button>
    <div>
      <h2>商会相关</h2>
      <div class="c-entry-list">
        <div v-for="item in chamberList" :key="item.id" class="c-entry-list__item">
          <div class="c-eli__relative">
            <el-checkbox
              v-model="item.check"
              class="c-eli__checkbox"
              @change="(value) => checkboxChange(value, item)"
            />
            <el-image
              style="width: 80px; height: 80px"
              :src="item.coverUrl"
              fit="cover"
            >
              <div slot="error" class="image-slot">
                <img :src="defaultImage" width="80" height="80" alt="">
              </div>
            </el-image>
          </div>
          <div class="entry-name">{{ item.encyclopediaName }}</div>
          <div class="entry-polysemant">{{ item.polysemant }}</div>
        </div>
        <div v-if="!chamberList.length">暂无商会相关数据</div>
      </div>
    </div>
    <el-button
      v-if="chamberList.length && chamberTotal > chamberList.length"
      type="text"
      class="m-auto"
      @click="queryChamberList(true)"
    >
      点击展开更多
    </el-button>
    <div v-if="otherList.length">
      <h2>其他</h2>
      <div class="c-entry-list">
        <div v-for="item in otherList" :key="item.id" class="c-entry-list__item">
          <div class="c-eli__relative">
            <el-checkbox
              v-model="item.check"
              class="c-eli__checkbox"
              @change="(value) => checkboxChange(value, item)"
            />
            <el-image
              style="width: 80px; height: 80px"
              :src="item.coverUrl"
              fit="cover"
            >
              <div slot="error" class="image-slot">
                <img :src="defaultImage" width="80" height="80" alt="">
              </div>
            </el-image>
          </div>
          <div class="entry-name">{{ item.encyclopediaName }}</div>
          <div class="entry-polysemant">{{ item.polysemant }}</div>
        </div>
      </div>
    </div>
    <el-button
      v-if="otherList.length && otherTotal > otherList.length"
      type="text"
      class="m-auto"
      @click="loadMore"
    >
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
        limit: 10,
        page: 1
      },
      chamberFilter: {
        limit: 10,
        page: 1
      },
      keywordFilter: {
        encyclopediaName: '',
        limit: 10,
        page: 1
      },
      recommendTotal: 0,
      chamberTotal: 0,
      otherTotal: 0,
      selectionKey: {},
      lastEncyclopediaName: '',
      timer: 0,
      defaultImage: 'https://ysh-cdn.kaidicloud.com/test/profile/ysh_default_avatar.png'
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
        this.initData()
        if (this.entryInfo.selectionData.length) this.setSelectionMap()
        this.queryRecommendList()
        this.queryChamberList()
        this.inputHandler()
      }
    }
  },
  methods: {
    initData() {
      const data = this.$options.data()
      this.selectionKey = data.selectionKey
      this.timer = 0
      this.recommendFilter = data.recommendFilter
      this.keywordFilter = data.keywordFilter
      this.chamberFilter = data.chamberFilter
      this.recommendTotal = data.recommendTotal
      this.chamberTotal = data.chamberTotal
      this.otherTotal = data.otherTotal
      this.recommendList = []
      this.chamberList = []
      this.otherList = []
    },
    setSelectionMap() {
      this.entryInfo.selectionData.forEach(item => {
        this.selectionKey[item.encyclopediaId] = item
      })
    },
    async queryRecommendList(loadMore = false) {
      if (loadMore) this.recommendFilter.page++
      try {
        const { data } = await recommendLexicalRecently({
          ...this.recommendFilter,
          ckey: this.entryInfo.ckey
        })
        if (!data) return
        this.recommendTotal = data.total || 0
        const checkData = data.records.map(item => {
          const selectItem = this.selectionKey[item.encyclopediaId]
          return {
            ...item,
            check: selectItem ? !!selectItem.check : false
          }
        })
        if (this.recommendFilter.page <= 1) {
          this.recommendList = checkData
        } else {
          this.recommendList = this.recommendList.concat(checkData)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async queryChamberList(loadMore = false) {
      if (loadMore) this.chamberFilter.page++
      try {
        const { data } = await queryChamberLexical({
          ...this.chamberFilter,
          ckey: this.entryInfo.ckey
        })
        if (!data) return
        this.chamberTotal = data.total || 0
        let checkData = []
        if (data.chamberEntry) {
          checkData = [data.chamberEntry]
        }
        checkData = checkData.concat(data.memberEntry.records)
        checkData = checkData.map(item => {
          const selectItem = this.selectionKey[item.encyclopediaId]
          return {
            ...item,
            check: selectItem ? !!selectItem.check : false
          }
        })

        if (this.chamberFilter.page <= 1) {
          this.chamberList = checkData
        } else {
          this.chamberList = this.chamberList.concat(checkData)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async inputHandler() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.keywordFilter.page = 1
        this.searchList()
      }, 300)
    },
    async searchList() {
      const { data } = await queryEntryList(this.keywordFilter)
      this.otherTotal = data.total
      const checkData = data.records.map(item => {
        const selectItem = this.selectionKey[item.encyclopediaId]
        return {
          ...item,
          check: selectItem ? !!selectItem.check : false
        }
      })
      if (this.keywordFilter.page <= 1) {
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
      this.$emit('close')
    },
    sureHandler() {
      const encyclopediaIds = []
      const originIds = []
      if (Object.keys(this.selectionKey).length > 15) {
        return this.$message.error('最多选择15个词条关联')
      }
      for (const key in this.selectionKey) {
        if (this.selectionKey[key].check) {
          encyclopediaIds.push(this.selectionKey[key].encyclopediaId)
          originIds.push(this.selectionKey[key])
        }
      }
      this.$emit('sure-handler', encyclopediaIds, originIds)
    },
    checkboxChange(value, item) {
      this.selectionKey[item.encyclopediaId] = item
      this.selectionKey[item.encyclopediaId].check = value
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
