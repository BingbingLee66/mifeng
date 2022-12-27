<template>
  <el-dialog :visible.sync="entryVisible" :title="title" :before-close="closeHandler" class="entry-dialog" width="945px">
    <div class="p-20">
      <div>
        <el-input v-model="keywordFilter.encyclopediaName" placeholder="请输入关键字" style="width: 340px" />
        <el-button type="primary" @click="searchHandler()">搜索</el-button>
      </div>
      <h2 class="c-entry-h2">最近推荐</h2>
      <div class="c-entry-list">
        <div v-for="item in recommendList" :key="item.id" class="c-entry-list__item">
          <div class="c-eli__relative">
            <div class="image-name">
              <el-image
                style="width: 50px; height: 50px; border-radius: 4px; flex-shrink: 0"
                :src="item.coverUrl"
                fit="cover"
              >
                <div slot="error" class="image-slot">
                  <img :src="defaultImage" width="50" height="50" alt="">
                </div>
              </el-image>
              <div class="ml-4">
                <div class="entry-name">{{ item.encyclopediaName }}</div>
                <template v-if="item.orgPositionInfo && item.orgPositionInfo.length">
                  <div v-for="org in item.orgPositionInfo" :key="org.position+org.organizationName" class="entry-position">
                    {{ org.position }} | {{ org.organizationName }}
                  </div>
                </template>
              </div>
            </div>
            <el-checkbox
              v-model="item.check"
              class="c-eli__checkbox"
              @change="(value) => checkboxChange(value, item)"
            />
          </div>
          <div class="entry-polysemant">{{ item.polysemant }}</div>
        </div>
        <div v-if="!recommendList.length" class="no-data-text">暂无相关推荐</div>
      </div>
      <el-pagination
        v-if="recommendList.length && recommendTotal > recommendList.length"
        :background="true"
        :current-page.sync="recommendFilter.page"
        :page-size="recommendFilter.limit"
        layout="total, prev, pager, next, jumper"
        :total="recommendTotal"
        @current-change="(page) => handleCurrentChange(page, 'recommendFilter', 'queryRecommendList')"
      />
      <div>
        <h2 class="c-entry-h2">商会相关</h2>
        <div class="c-entry-list">
          <div v-for="item in chamberList" :key="item.id" class="c-entry-list__item">
            <div class="c-eli__relative">
              <div class="image-name">
                <el-image
                  style="width: 50px; height: 50px; border-radius: 4px; flex-shrink: 0"
                  :src="item.coverUrl"
                  fit="cover"
                >
                  <div slot="error" class="image-slot">
                    <img :src="defaultImage" width="50" height="50" alt="">
                  </div>
                </el-image>
                <div class="ml-4">
                  <div class="entry-name">{{ item.encyclopediaName }}</div>
                  <template v-if="item.orgPositionInfo && item.orgPositionInfo.length">
                    <div v-for="org in item.orgPositionInfo" :key="org.position+org.organizationName" class="entry-position">
                      {{ org.position }}
                    </div>
                  </template>
                </div>
              </div>
              <el-checkbox
                v-model="item.check"
                class="c-eli__checkbox"
                @change="(value) => checkboxChange(value, item)"
              />
            </div>
            <div class="entry-polysemant">{{ item.polysemant }}</div>
          </div>
          <div v-if="!chamberList.length" class="no-data-text">暂无商会相关数据</div>
        </div>
      </div>
      <el-pagination
        v-if="chamberList.length && chamberTotal > chamberFilter.limit"
        background
        :current-page.sync="chamberFilter.page"
        :page-size="chamberFilter.limit"
        layout="total, prev, pager, next, jumper"
        :total="chamberTotal"
        @current-change="(page) => handleCurrentChange(page, 'chamberFilter', 'queryChamberList')"
      />
      <div v-if="otherList.length">
        <h2 class="c-entry-h2">其他</h2>
        <div class="c-entry-list">
          <div v-for="item in otherList" :key="item.id" class="c-entry-list__item">
            <div class="c-eli__relative">
              <div class="image-name">
                <el-image
                  style="width: 50px; height: 50px; border-radius: 4px; flex-shrink: 0"
                  :src="item.coverUrl"
                  fit="cover"
                >
                  <div slot="error" class="image-slot">
                    <img :src="defaultImage" width="50" height="50" alt="">
                  </div>
                </el-image>
                <div class="ml-4">
                  <div class="entry-name">{{ item.encyclopediaName }}</div>
                  <template v-if="item.orgPositionInfo && item.orgPositionInfo.length">
                    <div v-for="org in item.orgPositionInfo" :key="org.position+org.organizationName" class="entry-position">
                      {{ org.position }} | {{ org.organizationName }}
                    </div>
                  </template>
                </div>
              </div>
              <el-checkbox
                v-model="item.check"
                class="c-eli__checkbox"
                @change="(value) => checkboxChange(value, item)"
              />
            </div>
            <div class="entry-polysemant">{{ item.polysemant }}</div>
          </div>
        </div>
        <el-pagination
          v-if="otherList.length && otherTotal > otherList.length"
          background
          :current-page.sync="keywordFilter.page"
          :page-size="keywordFilter.limit"
          layout="total, prev, pager, next, jumper"
          :total="otherTotal"
          @current-change="(page) => handleCurrentChange(page, 'keywordFilter', 'searchList')"
        />

      </div>
    </div>
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
      this.entryInfo.selectionData.forEach((item, index) => {
        this.selectionKey[item.encyclopediaId] = {
          ...item,
          index
        }
      })
    },
    async queryRecommendList() {
      const { total, lists } = await this.requestData(recommendLexicalRecently, {
        ...this.recommendFilter,
        ckey: this.entryInfo.ckey
      })
      this.recommendTotal = total
      this.recommendList = lists
    },
    async queryChamberList() {
      const { total, lists } = await this.requestData(queryChamberLexical, {
        ...this.chamberFilter,
        ckey: this.entryInfo.ckey
      })
      this.chamberTotal = total
      this.chamberList = lists
    },
    async searchHandler() {
      this.otherList = []
      this.keywordFilter.page = 1
      this.searchList()
    },
    async searchList() {
      if (!this.keywordFilter.encyclopediaName) return
      const { total, lists } = await this.requestData(queryEntryList, this.keywordFilter)
      this.otherTotal = total
      this.otherList = lists
    },
    async requestData(apiFn, params) {
      try {
        const { data } = await apiFn(params)
        const lists = data.records.map(item => {
          const selectItem = this.selectionKey[item.encyclopediaId]
          return {
            ...item,
            check: selectItem ? !!selectItem.check : false
          }
        })
        return {
          total: data.total,
          lists
        }
      } catch (error) {
        return {
          total: 0,
          lists: []
        }
      }
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
  width: 210px;
  padding: 12px;
  margin: 0 16px 10px 0;
  border-radius: 8px;
  background: #F7F7F7;
  .img{
    object-fit: cover;
  }
  .entry-name {
    width: 120px;
    color: #222;
    font-size: 16px;
    font-weight: bold;
  }
  .entry-position{
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
    color: rgba(0,0,0,0.35);
    line-height: 20px;
  }
  .text-black {
    color: #222;
  }
}
.c-eli__relative{
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
.c-eli__checkbox{
  position: absolute;
  right: 0px;
  top: 0;
}
.c-entry-button {
  padding-top: 20px;
  text-align: center;
  border-top: 1px solid rgba(0,0,0,0.09);
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

.entry-dialog {
  /deep/.el-dialog__header{
    border-bottom: 1px solid rgba(0,0,0,0.09);
  }
  /deep/.el-dialog__body {
    padding: 23px 0px;
  }
}
.el-pagination {
  text-align: right;
}
.p-20 {
  padding: 0 20px 23px 20px;
}
</style>
