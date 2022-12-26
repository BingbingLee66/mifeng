<template>
  <el-dialog :visible.sync="entryVisible" :title="title" :before-close="closeHandler">
    <el-input v-model="keywordFilter.encyclopediaName" placeholder="请输入关键字" @input="inputHandler" />
    <h2 class="c-entry-h2">最近推荐</h2>
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
        <div class="entry-position text-black">{{ item.polysemant }}</div>
        <div class="entry-position" v-html="item.position" />
      </div>
      <div v-if="!recommendList.length" class="no-data-text">暂无相关推荐</div>
    </div>
    <el-pagination
      v-if="recommendList.length && recommendTotal > recommendList.length"
      :current-page.sync="recommendFilter.page"
      :page-size="recommendFilter.limit"
      layout="prev, pager, next, jumper"
      :total="recommendTotal"
      @current-change="(page) => handleCurrentChange(page, 'recommendFilter', 'queryRecommendList')"
    />
    <div>
      <h2 class="c-entry-h2">商会相关</h2>
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
          <div class="entry-position text-black">{{ item.polysemant }}</div>
          <div class="entry-position">{{ item.position }}</div>
        </div>
        <div v-if="!chamberList.length" class="no-data-text">暂无商会相关数据</div>
      </div>
    </div>
    <el-pagination
      v-if="chamberList.length && chamberTotal > chamberFilter.limit"
      :current-page.sync="chamberFilter.page"
      :page-size="chamberFilter.limit"
      layout="prev, pager, next, jumper"
      :total="chamberTotal"
      @current-change="(page) => handleCurrentChange(page, 'chamberFilter', 'queryChamberList')"
    />
    <div v-if="otherList.length">
      <h2 class="c-entry-h2">其他</h2>
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
          <div class="entry-position text-black">{{ item.polysemant }}</div>
          <div class="entry-position" v-html="item.position" />
        </div>
      </div>
    </div>
    <el-pagination
      v-if="otherList.length && otherTotal > otherList.length"
      :current-page.sync="keywordFilter.page"
      :page-size="keywordFilter.limit"
      layout="prev, pager, next, jumper"
      :total="otherTotal"
      @current-change="(page) => handleCurrentChange(page, 'keywordFilter', 'searchList')"
    />
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
      console.log(this.entryInfo.selectionData)
      this.entryInfo.selectionData.forEach((item, index) => {
        this.selectionKey[item.encyclopediaId] = {
          ...item,
          index
        }
      })
    },
    async queryRecommendList() {
      try {
        const { data } = await recommendLexicalRecently({
          ...this.recommendFilter,
          ckey: this.entryInfo.ckey
        })
        if (!data) return
        this.recommendTotal = data.total || 0
        const checkData = data.records.map(item => {
          let position = ''
          if (item.orgPositionInfo && item.orgPositionInfo.length) {
            position = item.orgPositionInfo.splice(0, 2).map(org => {
              return org.position + ' | ' + org.organizationName
            }).join('<br>')
          }
          const selectItem = this.selectionKey[item.encyclopediaId]
          return {
            ...item,
            position,
            check: selectItem ? !!selectItem.check : false
          }
        })
        this.recommendList = checkData
      } catch (error) {
        console.log(error)
      }
    },
    async queryChamberList() {
      try {
        const { data } = await queryChamberLexical({
          ...this.chamberFilter,
          ckey: this.entryInfo.ckey
        })
        if (!data) return
        this.chamberTotal = data.memberEntry.total || 0
        let checkData = data.chamberEntry ? [data.chamberEntry] : []
        checkData = checkData.concat(data.memberEntry.records)
        checkData = checkData.map(item => {
          let position = ''
          if (item.orgPositionInfo && item.orgPositionInfo.length) {
            position = item.orgPositionInfo.map(org => org.position).join(' | ')
          }
          const selectItem = this.selectionKey[item.encyclopediaId]
          return {
            ...item,
            position,
            check: selectItem ? !!selectItem.check : false
          }
        })

        this.chamberList = checkData
      } catch (error) {
        console.log(error)
      }
    },
    async inputHandler(val) {
      if (!val) {
        this.otherList = []
        return
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.keywordFilter.page = 1
        this.searchList()
      }, 300)
    },
    async searchList() {
      if (!this.keywordFilter.encyclopediaName) return
      const { data } = await queryEntryList(this.keywordFilter)
      this.otherTotal = data.total
      const checkData = data.records.map(item => {
        const selectItem = this.selectionKey[item.encyclopediaId]
        let position = ''
        if (item.orgPositionInfo && item.orgPositionInfo.length) {
          position = item.orgPositionInfo.splice(0, 2).map(org => {
            return org.position + ' | ' + org.organizationName
          }).join('<br>')
        }
        return {
          ...item,
          position,
          check: selectItem ? !!selectItem.check : false
        }
      })
      this.otherList = checkData
    },
    closeHandler() {
      this.$emit('close')
    },
    sureHandler() {
      if (Object.keys(this.selectionKey).length > 15) {
        return this.$message.error('最多选择15个词条关联')
      }
      const originIds = Object.values(this.selectionKey).sort((a, b) => a.index - b.index).filter(item => item.check)
      const encyclopediaIds = originIds.map(item => item.encyclopediaId)
      this.$emit('sure-handler', encyclopediaIds, originIds)
    },
    checkboxChange(value, item) {
      if (!this.selectionKey[item.encyclopediaId]) {
        this.selectionKey[item.encyclopediaId] = {
          index: Object.keys(this.selectionKey).length,
          check: value,
          ...item
        }
      } else {
        this.selectionKey[item.encyclopediaId].check = value
      }
    },
    handleCurrentChange(page, filterName, queryFn) {
      this[filterName].page = page
      this[queryFn]()
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
  .entry-position{
    text-align: center;
    font-size: 12px;
    color: #666
  }
  .text-black {
    color: #222;
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
.c-entry-h2 {
  font-size: 1.5em;
  font-weight: bold;
}
.no-data-text{
  margin-bottom: 20px;
}
</style>
