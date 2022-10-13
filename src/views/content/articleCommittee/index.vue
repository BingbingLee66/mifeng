<template>
  <div class="container">
    <el-form
      ref="query"
      label-width="auto"
      label-position="right"
      :model="query"
      :inline="true"
    >
      <el-row>
        <el-form-item label="文章标题：">
          <el-input v-model="query.title" />
        </el-form-item>

        <el-form-item :span="12" label="栏目：">
          <el-select v-model="query.contentColumnId">
            <el-option
              v-for="cc in contentColumnOptions"
              :key="cc.value"
              :label="cc.label"
              :value="cc.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :span="12" label="状态：">
          <el-select v-model="query.status">
            <el-option label="全部" :value="-1" />
            <el-option label="已发布" :value="1" />
            <el-option label="已冻结(商会)" :value="0" />
            <el-option label="已冻结(平台)" :value="3" />
            <el-option label="定时发布" :value="4" />
            <el-option label="审核不通过" :value="8" />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <!-- <el-col :span="5"> -->
        <el-form-item label="文章ID：">
          <el-input
            v-model="query.articleId"
            oninput="value=value.replace(/[^\d]/g,'')"
          />
        </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col :span="8" style="margin-left: 20px"> -->
        <el-form-item label="发布时间：">
          <el-date-picker
            v-model="query.date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <!-- </el-col > -->

        <el-button
          type="primary"
          @click="fetchData($event)"
        >
          查询
        </el-button>
      </el-row>
    </el-form>
    <el-row>
      <el-button
        type="danger"
        size="small"
        @click="add($event)"
      >
        创建文章
      </el-button>
    </el-row>
    <el-table
      id="out-table"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @sort-change="handleSortChange"
    >
      <!-- <el-table-column type="index" label="序号" width="60px">
        </el-table-column> -->
      <el-table-column key="activeName5" label="文章ID" width="80px">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="文章标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="权重" width="100px">
          <template slot-scope="scope">
            <span class="blue-label" @click="showSort(scope.row)">
              {{ scope.row.sort }}
            </span>
          </template>
        </el-table-column> -->
      <el-table-column label="栏目" width="180px">
        <template slot-scope="scope">
          {{ scope.row.contentColumn }}
        </template>
      </el-table-column>
      <el-table-column
        label="浏览量"
        width="100px"
        prop="readCount"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.readCount ? scope.row.readCount : "--" }}
        </template>
      </el-table-column>

      <el-table-column
        prop="commentLikeNums"
        sortable="custom"
        label="点赞量"
        width="100px"
      >
        <template slot-scope="scope">
          {{ scope.row.commentLikeNums }}
        </template>
      </el-table-column>
      <el-table-column
        prop="commentNums"
        sortable="custom"
        label="评论量"
        width="100px"
      >
        <template slot-scope="scope">
          {{ scope.row.commentNums }}
        </template>
      </el-table-column>
      <el-table-column label="创建信息" width="180px">
        <template slot-scope="scope">
          <div>{{ scope.row.operator }}</div>
          <div>{{ scope.row.createdTs }}</div>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="160px">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 4">定时发布</div>
          {{ scope.row.publishTs }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作人" width="100px">
          <template slot-scope="scope">
            {{ scope.row.operator }}
          </template>
        </el-table-column> -->
      <el-table-column label="状态" width="120px">
        <template slot-scope="scope">
          <div
            v-if="
              scope.row.status == 1 &&
                (scope.row.auditStatus == 0 || scope.row.auditStatus == 1)
            "
          >
            已发布
          </div>
          <div
            v-if="
              scope.row.status == 0 &&
                (scope.row.auditStatus == 0 || scope.row.auditStatus == 1)
            "
          >
            已冻结(商会)
          </div>
          <div
            v-if="
              scope.row.status == 3 &&
                (scope.row.auditStatus == 0 || scope.row.auditStatus == 1)
            "
          >
            已冻结(平台)
          </div>
          <div
            v-if="
              scope.row.status == 4 &&
                (scope.row.auditStatus == 0 || scope.row.auditStatus == 1)
            "
          >
            定时发布
          </div>
          <div
            v-if="scope.row.auditStatus == 2 || scope.row.auditStatus == 3"
          >
            审核不通过
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px" fixed="right">
        <template slot-scope="scope">
          <el-button
            class="my-btn"
            type="text"
            style="margin-left:10px;"
            @click="edit($event, scope.row)"
          >
            编辑
          </el-button>
          <!-- <br/> -->
          <el-button
            v-if="
              scope.row.status == 1 || scope.row.status == 4
            "
            class="my-btn"
            type="text"
            @click="updateStatus($event, scope.row)"
          >
            冻结
          </el-button>
          <el-button
            v-if="scope.row.status == 0"
            class="my-btn"
            type="text"
            @click="updateStatus($event, scope.row)"
          >
            解冻
          </el-button>
          <el-button
            class="my-btn"
            type="text"
            @click="openDetail(scope.row)"
          >
            详情
          </el-button>
          <!-- <br/> -->
          <el-button
            class="my-btn"
            type="text"
            @click="delArticle(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentpage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <div class="art-preview-wrap">
      <el-dialog title="" :visible.sync="detailVisible" width="60%">
        <div class="u-preview-wrap">
          <div
            v-if="detailObj.auditStatus === 2 || detailObj.auditStatus === 3"
            class="u-article-remark"
          >
            不通过理由：{{ detailObj.auditRemark }}
          </div>
          <div class="u-preview-area">
            <div class="u-article-title">{{ detailObj.title }}</div>
            <div style="margin: 0 auto;width: 97%;">
              <videoComponent v-show="detailObj.vid" ref="videoRef" :vid="detailObj.vid" height="530px" />
            </div>

            <div class="u-article-content" v-html="detailObj.contentHtml" />
          </div>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import {
  getChamberContentList,
  updateStatus,
  getDetail,
  updateChamberTop,
  del
} from '@/api/content/article'
import {
  getContentColumnOptionsWithCkey,
  updateColumnLevel
} from '@/api/content/columnsetup'
import router from '../../../router'
import videoComponent from '@/components/video/index'
export default {
  components: {
    videoComponent
  },
  data() {
    const checkNumber = (rule, value, callback) => {
      if (!/^([0-9]{0,3})$/.test(value)) {
        return callback(new Error('必须是0-999的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      detailVisible: false,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      sortFalg: '',
      listLoading: false,
      query: {
        title: '',
        contentColumnId: -1,
        status: -1,
        date: '',
        column: '',
        orderType: 1
      },
      detailObj: {
        contentHtml: '',
        auditStatus: '',
        auditRemark: ''
      },
      contentColumnOptions: [],
      formObj: {},
      activeName: '5',
      showSortDialog: false,
      sortForm: {
        id: null,
        sort: null
      },

      sortFormRules: {
        sort: [
          {
            required: true,
            message: '权重不能为空',
            trigger: 'blur'
          },
          {
            validator: checkNumber,
            trigger: 'blur'
          }
        ]
      },
    }
  },
  created() {
    const activename = window.localStorage.getItem('activename')
    if (activename) {
      this.activeName = activename
    }
    this.getContentColumnType()
    this.init()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({
        tabName,
        actionName
      })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({
        tabName,
        actionName
      })
    },
    // 排序
    handleSortChange(e) {
      // let sort = ''

      console.log('e', e)
      if (!e.prop) {
        return
      }
      this.query.column = e.prop
      // 有序
      if (e.order) {
        this.query.orderType = e.order === 'ascending' ? 1 : -1
      } else {
        // 无序
        this.query.orderType = ''
      }
      this.currentpage = 1
      this.fetchData(1)
    },
    // 修改权重
    showSort(row) {
      this.sortForm.id = row.contentColumnId
      this.sortForm.sort = row.sort
      this.showSortDialog = true
    },
    updateSort(sortForm) {
      this.$refs[sortForm].validate(valid => {
        if (valid) {
          const params = {
            ...this.sortForm,
            level: this.sortForm.sort
          }
          updateColumnLevel(params).then(response => {
            if (response.state === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.fetchData()
              this.showSortDialog = false
            }
          })
        } else {
          return false
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
    init() {
      this.total = 0
      this.list = []
      this.currentpage = 1
      this.limit = 10
      this.fetchData()
    },
    getContentColumnType() {
      let contentModuleId = 8
      /*       if (this.activeName === '5') { */
      contentModuleId = 3
      /*       } else if (this.activeName === '6') {
        contentModuleId = 4
      } */
      const params = {
        ckey: this.$store.getters.ckey,
        contentModuleId
      }
      getContentColumnOptionsWithCkey(params).then(response => {
        this.contentColumnOptions = response.data.data
        this.contentColumnOptions.unshift({
          label: '全部',
          value: -1
        })
      })
    },
    fetchData(e) {
      if (e !== undefined && e !== 1) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
        this.currentpage = 1
      }
      this.listLoading = true
      const params = {
        // 'order': this.sortFalg,
        pageSize: this.limit,
        page: this.currentpage,
        ckey: this.$store.getters.ckey,
        title: this.query.title,
        contentModuleId: this.activeName,
        contentColumnId: this.query.contentColumnId,
        status: this.query.status,
        articleId: this.query.articleId,
        creator: this.query.creator,
        column: this.query.column,
        orderType: this.query.orderType,
      }
      // if (sort) {
      //   params['order'] = sort
      // }
      if (this.query.date) {
        // eslint-disable-next-line prefer-destructuring
        params['startTs'] = this.query.date[0]
        // eslint-disable-next-line prefer-destructuring
        params['endTs'] = this.query.date[1]
      }
      getChamberContentList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    openVisible(row) {
      this.formObj = row
    },
    updateStatus(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      const params = {
        id: row.id,
        action: row.status === 0 ? 'active' : 'notactive'
      }
      updateStatus(params).then(() => {
        if (row.status === 0) {
          this.$message({
            message: '解冻成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '文章已冻结',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    add(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('articleupdate', this.$route.path)
      this.$router.push({
        name: '添加/修改文章',
        params: {
          activeName: this.activeName,
          committee: true
        }
      })
    },
    edit(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('articleupdate', this.$route.path)
      this.$router.push({
        name: '添加/修改文章',
        params: {
          activeName: this.activeName,
          articleId: row.id,
          committee: true
        }
      })
    },
    editColumn(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('articleupdate', this.$route.path)
      console.log('row', row)
      this.$router.push({
        name: '修改栏目内容',
        params: {
          activeName: this.activeName,
          articleObj: row
        }
      })
    },
    /* detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '文章详情', params: { 'articleId': row.id } })
    }, */
    openDetail(row) {
      const params = {
        id: row.id
      }
      getDetail(params).then(response => {
        this.detailObj = response.data.dtl
        if (this.detailObj.vid) this.$refs['videoRef'].show(this.detailObj.vid)
      }).catch(() => {})
      this.detailVisible = true
    },
    // 去置顶管理页面
    toStick() {
      router.push({
        path: '/content/article-stick'
      })
    },
    // update置顶
    updateTop(row) {
      console.log('row', row)
      const params = {
        articleId: row.id,
        ckey: row.ckey,
        type: 1
        // type: row.istop ? 0 : 1
      }
      updateChamberTop(params).then(res => {
        if (res.state === 1) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 删除文章
    delArticle(row) {
      this.$confirm('确认删除该文章吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {}
        const articleIds = []
        articleIds.push(row.id + '')
        params.articleIds = articleIds
        del(params).then(response => {
          if (response.state === 1) {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: response.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.art-preview-wrap {
  .el-dialog {
    margin-top: 5vh !important;
    height: 90vh;
    overflow: hidden;
  }
}
.u-preview-wrap {
  width: 100%;
  height: 80vh;
}
.my-btn {
  display: block;
  margin: 0;
}

.u-preview-area {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0 auto;
  border: 1px solid #d9dde2;
  overflow-y: auto;
}

.u-article-remark {
  font-size: 19px;
  font-weight: 500;
  margin: 0px 20px;
}

.u-article-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin: 40px 40px 20px 40px;
}

.u-article-content {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.8;
  margin: 20px;
}

::-webkit-scrollbar {
  width: 0px;
}

> .u-article-content img {
  margin: 10px 10%;
  width: 80% !important;
  height: auto !important;
}

.content-box {
  max-height: 140px;
  overflow-y: auto;
}
</style>
