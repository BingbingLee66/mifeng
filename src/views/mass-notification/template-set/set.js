import Details from '../template-library/components/details'
import { noticeTemplateSetList, getNoticeTemplateSetDetailById } from '@/api/mass-notification'
export default {
  data() {
    return {
      currentpage: 1,
      limit: 10,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      query: {
        title: '', // 标题
        type: '1' // 模板类型 1短信通知、2订阅消息、3APP通知
      },
      listLoading: false,
      random: 1, // 动态改变table试图
      noticeTypeId: ['', '缴费通知', '活动通知', '招商活动', '邀请入会', '自定义通知']
    }
  },
  components: {
    Details
  },
  created() {
    this.query.type = this.$route.query.type || '1'
  },
  mounted() {
    this.fetchData(true)
  },
  methods: {
    // 切换头部tabs
    handleClick() {
      this.query.title = ''
      this.listLoading = true
      this.fetchData(true)
    },
    // 表格数据
    async fetchData(reset) {
      if (reset) this.currentPage = 1
      this.listLoading = true
      this.list = []
      let { type, title } = this.query
      let parmas = {
        type,
        title,
        pageSize: this.limit,
        page: this.currentpage
      }
      const res = await noticeTemplateSetList(parmas)
      this.listLoading = false
      if (res.state === 1) {
        this.list = res.data.list || []
        this.total = res.data.totalRows || 0
        this.random = Math.random()
      }
    },
    // 跳转添加模板
    onSynchronization() {
      //  query.type   1:短信 2：消息订阅  3：app
      let id = 1
      this.$router.push({
        path: '/template-set/add-note/index',
        query: {
          id,
          type: this.query.type
        }
      })
    },
    // 详情
    async particulars(row) {
      const res = await getNoticeTemplateSetDetailById({ id: row.id })
      this.$refs.details.show(res)
    },
    // 编辑
    onEdit() {},
    // 禁用
    onForbidden() {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('p', null, [
            h('span', null, '当前共有'),
            h('span', { style: 'color: #f5222d' }, `${1}`),
            h('span', null, '条定时发送通知使用了该模板，确定禁用模板吗？ ')
          ]),
          h('p', { style: 'color: #7f7f7f' }, '禁用后：'),
          h('p', { style: 'color: #7f7f7f' }, '1.商协会新增时，将不能使用该模板(平台可正常使用)'),
          h('p', { style: 'color: #7f7f7f' }, '2.若已创建的定时通知含该禁用模板，不影响发送')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$message({
            message: '禁用成功',
            type: 'success'
          })
          this.fetchData()
        })
        .catch(() => {})
    },
    // 启用
    onInvoke() {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('p', null, '确定启用模板吗？'),
          h('p', { style: 'color: #7f7f7f' }, '启用后：'),
          h('p', { style: 'color: #7f7f7f' }, '1.该模板可被分配到商协会使用'),
          h('p', { style: 'color: #7f7f7f' }, '2.商协会新增通知时，可正常使用')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$message({
            message: '启用成功',
            type: 'success'
          })
          this.fetchData()
        })
        .catch(() => {})
    },
    // 删除
    onDelete() {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('p', null, [
            h('span', null, '当前共有'),
            h('span', { style: 'color: #f5222d' }, `${1}`),
            h('span', null, '条定时发送通知使用了该模板，确定删除模板吗？ ')
          ]),
          h('p', { style: 'color: #7f7f7f' }, '删除后：'),
          h('p', { style: 'color: #7f7f7f' }, '1.平台、商协会新增时，将不能使用该模板'),
          h('p', { style: 'color: #7f7f7f' }, '2.若已创建的定时通知含该删除模板，不影响发送')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        })
        .catch(() => {})
    },
    handleSizeChange(val) {
      this.limit = val
      this.fetchData(true)
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    }
  }
}
