import {
  getActivitySource,
  getActivityList,
  publishActivity,
  updateActivitySort,
  delActivity
} from '@/api/activity/activity'
import { activeModeMap, stageMap, activeStatusMap, ACTIVE_STATUS, getMapDict } from '@/consts'
import { getInfoList,getInvesActivityList,getUpdateActivitySort } from '@/api/attract'
export default {
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!/^([0-9]{0,3})$/.test(value)) {
        return callback(new Error('必须是0-999的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      activeModeMap,
      stageMap,
      activeStatusMap,
      ACTIVE_STATUS,
      getMapDict,
      ckey: '',
      type: '1',
      previewImgVisible: false,
      previewUrl: '',
      query: {
        invesKey: '', // 招商办标识
        activityId: '', // 活动ID
        activityName: '', // 活动名称
        phaseStatus:null, // 状态 0筹备阶段 1拟策阶段 2公开招商阶段
        status: 0 //  活动状态 0.全部1.未开始2.报名中3.已结束,4:报名中
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      chamberOptions: [], // 活动来源
      isPublish: '',
      rowId: '',
      showSortDialog: false,
      showDelDialog: false,
      showUpdateDialog: false,
      sortForm: {
        id: null,
        sort: null
      },
      sortRules: {
        sort: [
          { required: true, message: '权重不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    activeStatusOps() {
      return [
        { label: '全部状态', value: 'all' },
        ...getMapDict(activeStatusMap)
      ]
    }
  },
  created() {
    this.ckey = this.$store.getters.ckey
    if (this.$route.params.type !== undefined) {
      this.type = this.$route.params.type + ''
    }
    // 获取信息来源
    this.ongetInfoList()
    this.fetchData()
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    },
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    // 点击活动列表图
    openPreviewModal(url) {
      this.previewImgVisible = true
      this.previewUrl = url
    },
    handleInput(e) {
      let regexp = /^[1-9]\d*$/
      if (!regexp.test(e)) {
        this.query.activityId = ''
      }
    },
    // 查询活动列表
    fetchData(e) {
      if (e !== undefined) {
        this.currentpage = 1
      }
      this.listLoading = true
      let params = {
        activityId: this.query.activityId,
        activityName: this.query.activityName,
        invesKey:this.query.invesKey,
        status: this.query.status,
        pageSize: this.limit,
        pageNum: this.currentpage,
        isInves:false,
        phaseStatus:this.query.phaseStatus
      }
      getInvesActivityList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    // 修改活动发布状态
    showUpdate(row, isPublish) {
      // isPublish 0： 上线  1：下线
      this.rowId = row.id
      this.isPublish = isPublish
      this.showUpdateDialog = true
    },
    // TODO 改了状态，这块逻辑待定
    upadteActivity() {
      let params = {
        id: this.rowId,
        isPublish: this.isPublish
      }
      publishActivity(params).then(res => {
        if (res.state === 1) {
          if (this.isPublish === 0) {
            this.type = '0'
          } else if (this.isPublish === 1) {
            this.type = '1'
          }
          this.list = []
          this.fetchData(1)
          this.showUpdateDialog = false
          this.$message.success(res.msg)
        }
      })
    },
    // 编辑活动
    editActivity(row) {
      window.localStorage.setItem('activityeditor', this.$route.path)
      this.$router.push({
        name: '创建招商活动',
        query: {
          activityId: row.id,
          type: this.type
        }
      })
    },
    goTo(type, row) {
      let path = ''
      switch (type) {
        case 'card':
          path = `/zhaoshang/activity/${row.id}/${row.invesKey}/${2}/card-list`
          break
        case 'detail':
          path = `/zhaoshang/activity/${row.id}/detail`
          break
        case 'verify':
          path = `/zhaoshang/activity/activity-verify`
          break
        case 'create':
          path = `/zhaoshang/activity/create`
          break
      }
      this.$router.push({ path })
    },
    // 删除活动
    showDel(row) {
      this.rowId = row.id
      this.showDelDialog = true
    },
    // 删除活动
    delActivity() {
      let params = {
        id: this.rowId
      }
      delActivity(params).then(res => {
        if (res.state === 1) {
          this.$message.success(res.msg)
          this.fetchData(1)
          this.showDelDialog = false
        }
      })
    },
    // 修改权重
    showSort(row) {
      this.sortForm.id = row.id
      this.sortForm.sort = row.sort
      this.showSortDialog = true
    },
    updateSort(sortForm) {
      this.$refs[sortForm].validate((valid) => {
        if (valid) {
          getUpdateActivitySort(this.sortForm).then(response => {
            if (response.state === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.fetchData()
              this.showSortDialog = false
            }else{
              this.$message.error(response.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    ongetInfoList(){
      getInfoList({status:0}).then((res)=>{
        this.chamberOptions = res.data || []
      })
    },
  }
}
