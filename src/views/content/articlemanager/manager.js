import {
  getManagerList,
  updateStatusPlatform,
  getDetail,
  del,
  countTop,
  setTop,
  freezeList,
  unFreezeList,
  unFreeze,
  freeze
} from '@/api/content/article'
import { getOptionsWithCkey } from '@/api/content/columnsetup'
import { getChamberOptions } from '@/api/finance/finance'
import { getSts } from '@/api/vod/vod';
import videoComponent from '@/components/video/index'
export default {
  data() {
    return {
      visible: false,
      activeName: '1',
      query: {
        title: '',
        status: 1,
        ckey: '',
        contentColumnId: '',
        publishTimeType: 3,
        contentModuleId: 1
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      chamberName: '',
      currentpage: 1,
      limit: 10,
      listLoading: false,
      sortFlag: '',
      selectionDatas: [],
      optionList: [
        '标签聚合页',
        '商会必参',
        '标签聚合页/商会必参'
      ],
      detailObj: {
        title: '',
        contentHtml: '',
        vid: ''
      },
      // 视频相关
      videoKey: [],
      vabled: false,
      selectId: '',
      remark: '内容违规',
      contentColumnOptions: [],
      chamberOptions: [],
      // 会员分享冻结/解冻相关
      freezeVisible:false,
      freezeOperationRow:{},
      freezeOperationList:[],
      freezeSelectedList:[],
      unFreezeVisible:false,
      unFreezeOperationRow:{},
      unFreezeOperationList:[],
      unFreezeSelectedList:[],
      //展示视频组件
      showVideo:false,
    }
  },
  components:{
    videoComponent
  },
  computed: {},
  created() {
    this.getContentColumnType()
    this.init()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    // 浏览量排序
    handleSortChange(e) {
      // let sort = ''
      this.currentpage = 1
      if (e.prop) {
        if (e.order === 'descending') {
          this.sortFlag = (e.prop === 'readCount' ? 'read_count' : e.prop === 'commentLikeNums' ? 'like_nums' : 'comment_nums') + ' desc'
        } else {
          this.sortFlag = e.prop === 'readCount' ? 'read_count' : e.prop === 'commentLikeNums' ? 'like_nums' : 'comment_nums'
        }
        this.fetchData(1)
      }
    },
    selectionChange() {
      let params = {
        'ckey': this.query.ckey,
        'contentModuleId': 3
      }

      // 判断当商会来源是全部时 清空栏目选中值
      // if (!this.query.ckey) {
      // 每一次选中商会来源 要将栏目置空
      this.query.contentColumnId = ''
      // }
      // 指定模块下商会全部栏目
      getOptionsWithCkey(params).then(response => {
        this.contentColumnOptions = response.data.data
        this.contentColumnOptions.unshift({ 'label': '全部', 'value': '' })
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
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    getContentColumnType() {
      let params = {
        'ckey': this.query.ckey,
        'contentModuleId': this.query.contentModuleId
      }
      // 指定模块下商会全部列表
      getChamberOptions().then(response => {
        this.chamberOptions = response.data.data
        this.chamberOptions.unshift({ 'label': '全部', 'value': '' }, { 'label': '凯迪云商会', 'value': 'kaidiyun' })
      })
      // 指定模块下商会全部栏目
      getOptionsWithCkey(params).then(response => {
        this.contentColumnOptions = response.data.data
        this.contentColumnOptions.unshift({ 'label': '全部', 'value': '' })
      })
    },
    queryData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.currentpage = 1
      this.fetchData(e)
    },
    handleClick() {
      this.currentpage = 1
      this.query.contentModuleId = this.activeName
      this.fetchData()
    },
    // 获取视频凭证
    getVideoSts() {
      getSts().then(response => {
        // let { data: res } = response
        if (response.code !== 200) return this.$message.error('获取视频凭证失败')
        this.videoKey = response.data
        console.log('videoKey' + this.videoKey)
        // storage.setJson('videosts', this.videoKey)
      })
    },

    // 关闭视频播放弹窗
    closeDia() {
      if ((this.activeName === '1' || this.activeName === '2' || this.activeName === '3') && this.detailObj.contentType === 2) {
        this.$refs['videoRef'].closeDia()
      }
      this.visible = false
    },
    /**
     * 渲染视频
     */
    renderVideo() {
      getSts().then(response => {
        this.videoKey = response.data
        // 存在视频必须看完视频后才能点击审核
        this.vabled = true;
        const videoPlayer = this.$createPlayer('videoContent', this.videoKey.accessKeyId, this.videoKey.accessKeySecret, this.videoKey.securityToken, this.videoKey.region, this.detailObj.vid, '535px')
        videoPlayer.on('ended', (e) => {
          this.vabled = false
        })
        // this.videoPlayer = this.$createPlayer('videoContent', this.videoKey.accessKeyId, this.videoKey.accessKeySecret, this.videoKey.securityToken, this.videoKey.region, this.detailObj.vid, '535px')
        // this.videoPlayer.on('ended', (e) => {
        //   this.vabled = false
        // })
      })
    },
    fetchData(e, sort) {
      if (e !== undefined && e !== 1) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.listLoading = true
      let params = {
        'order': this.sortFlag,
        'pageSize': this.limit,
        'page': this.currentpage,
        'title': this.query.title,
        'ckey': this.query.ckey,
        'contentColumn': this.query.contentColumnId,
        'status': this.query.status,
        'contentModuleId': this.query.contentModuleId,
        'publishTimeType': this.query.publishTimeType
      }
      // if (sort) {
      //   params['order'] = sort
      // }
      getManagerList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.selectId = row.id
      let params = {
        id: this.selectId
      }
      getDetail(params).then(response => {
        this.detailObj = response.data.dtl
        // 视频是否存在 渲染操作
        if (this.detailObj.contentType === 2 || this.detailObj.contentType === 3) {
          console.log('进')
        //  videoUtils('videoContent',this.detailObj.vid)
          //  this.renderVideo()
          this.showVideo=true;
        }
      }).catch(error => {
        reject(error)
      })
      this.visible = true
    },
    handlerChange(value) {
      this.query.tradeType = value[value.length - 1]
    },
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        this.selectionDatas.push(data.id)
      }
    },
    delArticle(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('此删除会把文章直接从数据库删除不可恢复，请谨慎操作', '确定删除文章？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let ids = []
        ids.push(row.id)
        let params = {
          'articleIds': ids
        }
        del(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    batchDelArticle(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('此删除会把文章直接从数据库删除不可恢复，请谨慎操作', '确定删除文章？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'articleIds': this.selectionDatas
        }
        del(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    updateStatus(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let ids = []
      ids.push(row.id)
      let params = {
        'articleIds': ids,
        'action': row.status === 3 ? 'active' : 'notactive'
      }
      updateStatusPlatform(params).then(response => {
        if (row.status === 3) {
          this.$message({
            message: '解冻成功',
            type: 'success'
          })
        } else if (row.status === 1) {
          this.$message({
            message: '冻结成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    batchUpdateStatus(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'articleIds': this.selectionDatas,
        'action': 'notactive'
      }
      updateStatusPlatform(params).then(response => {
        this.$message({
          message: '冻结成功',
          type: 'success'
        })
        this.fetchData()
      })
    },
    top(e, row) {
      const actionId = e.currentTarget.getAttribute('actionid')
      countTop().then(response => {
        const count = response.data.count
        if (count >= 3) {
          this.$alert('3个置顶位已有内容，请到【置顶管理】页面调整后再置顶', {
            confirmButtonText: '确定'
          })
        } else {
          console.log(actionId)
          window.localStorage.setItem('actionId', actionId)
          let params = {
            'id': row.id
          }
          setTop(params).then(response => {
            if (response.state === 1) {
              this.$message({
                message: '置顶成功',
                type: 'success'
              })
              this.fetchData()
            } else {
              this.$message({
                message: '置顶失败',
                type: 'failed'
              })
            }
          })
        }
      })
    },
    edit(row) {
      window.localStorage.setItem('articleeditor', this.$route.path)
      this.$router.push({ name: '添加或编辑文章', params: { 'articleId': row.id }})
    },
    goSettop(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '置顶管理' })
    },
    // 会员分享 冻结/解冻相关
    freezeClose(){
      this.freezeVisible=false;
      this.freezeOperationRow={};
      this.freezeOperationList=[];
      this.freezeSelectedList=[];
    },
    unFreezeClose(){
      this.unFreezeVisible=false;
      this.unFreezeOperationRow={};
      this.unFreezeOperationList=[];
      this.unFreezeSelectedList=[];
    },
    openFreeze(row){
      this.freezeOperationRow=row;
      this.freezeVisible=true;
      freezeList(row.id).then(response => {
        this.freezeOperationList = response.data;
      })
    },
    openUnFreeze(row){
      this.unFreezeOperationRow=row;
      this.unFreezeVisible=true;
      unFreezeList(row.id).then(response => {
        this.unFreezeOperationList = response.data;
      })
    },
    commitFreeze(){
      let params = {};
      params.freezeTargets=this.freezeSelectedList;
      freeze(this.freezeOperationRow.id,params).then(response => {
      this.freezeVisible=false;
      this.freezeOperationRow={};
      this.freezeOperationList=[];
      this.freezeSelectedList=[];
        if (response.state === 1) {
          this.$message({
            message: '冻结成功',
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message({
            message: '冻结失败',
            type: 'failed'
          })
        }
      })
    },
    commitUnFreeze(){
      let params = {};
      params.freezeTargets=this.unFreezeSelectedList;
      unFreeze(this.unFreezeOperationRow.id,params).then(response => {
        this.unFreezeVisible=false;
        this.unFreezeOperationRow={};
        this.unFreezeOperationList=[];
        this.unFreezeSelectedList=[];
        if (response.state === 1) {
          this.$message({
            message: '解冻成功',
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message({
            message: '解冻失败',
            type: 'failed'
          })
        }
      })
    }
  }
}
