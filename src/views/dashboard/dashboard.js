import Panel from '../../components/panel'
import myTodo from './components/myTodo'
import cardList from './components/cardList'
import ToolBar from './components/ToolBar'
import {
  getPendingItems,
  getChamberMembers,
  getChamberArticles,
  getChamberAlbums,
  getChamberNotices,
  getPermission,
  getFollow
} from '@/api/dashboard'
import { mapGetters } from 'vuex'
export default {
  name: 'dashboard',
  components: {
    myTodo,
    cardList,
    ToolBar,
    Panel
  },
  data() {
    const cardList = [
      {
        label: '会员数',
        value: 0,
        contentLabelFirst: '激活会员',
        contentValFirst: 0,
        contentLabelSecond: '激活率',
        contentValSecond: 0,
        bottomLabel: '本月新增会员',
        bottomValue: 0,
        progress: 1,
        unit: '人',
        unitFirst: '人',
        unitSecond: '%',
        unitBottom: '人',
        tips: '会员人数数据口径：统计历史以来，系统中存在的有效的、唯一能标识会员身份的，商协会下企业会员或者个人会员的去重的账号的总数。剔除已删除，已冻结无效用户;\n激活会员数据口径：统计历史以来，有登录行为的所有有效会员数。剔除已删除，已冻结无效用户;\n会员激活比数据口径：计算公式为：激活会员数/会员数;\n本月新增会员数据口径：统计账号创建时间点在本自然月内，系统中有效的、唯一能标识会员身份的，商协会下企业会员或者个人会员的去重的账号的合计。不计类型，指剔除无效的即可。'
      },
      {
        label: '发布文章数',
        value: 0,
        contentLabelFirst: '累计阅读量',
        contentValFirst: 0,
        contentLabelSecond: '人均阅读量',
        contentValSecond: 0,
        bottomLabel: '会员分享次数 ',
        bottomValue: 0,
        unit: '篇',
        unitFirst: '人/次',
        unitSecond: '篇',
        unitBottom: '次',
        tips: '发布文章数据口径：统计历史以来，系统中存在的该商协会发布的，有效的文章的数据。剔除冻结或者已删除无效文章;\n累计阅读量数据口径：统计该商协会发布的所有文章的累计阅读人次，即所有文章的打开加载次数，包括游客和会员的阅读次数;\n人均阅读量数据口径：计算公式为：累计阅读量/文章数（含游客和会员）;\n会员分享次数：统计历史以来，系统中该商协会发布的，有效的文章数据，不需要剔除冻结或删除的文章，所有文章的被转发的次数。'
      },
      {
        label: '图片直播数',
        value: 0,
        contentLabelFirst: '图片直播曝光量',
        contentValFirst: 0,
        contentLabelSecond: '最高曝光量',
        contentValSecond: 0,
        bottomLabel: '会员分享次数',
        bottomValue: 0,
        unit: '次',
        unitFirst: '次',
        unitSecond: '次',
        unitBottom: '次',
        tips: '图片直播数数据口径：统计历史以来，系统中存在有效的图片直播，剔除冻结或者已删除的无效图片直播;\n图片直播曝光量数据口径：统计历史以来，该商协会发起的有效的图片直播的累计曝光人次。剔除暂停或者已删除等无效数据;\n最高曝光量数据口径：统计历史以来，该商协会发起的图片直播中，曝光人次最高的那次的图片直播的曝光人次;\n分享次数数据口径：对图片直播的分享按钮或者链接埋点，统计所有有效图片直播被分享的次数的总和。'
      },
      {
        label: '群发通知阅读率',
        value: 100,
        bottomLabel: '环比上次',
        bottomValue: '--',
        progress: 2,
        unit: '%',
        unitBottom: '%',
        showTriangle: true,
        tips: '群发通知阅读率数据口径：取最近一次群发通知的数据，若是从未发起过群发通知，设置默认值，默认值=100%。计算公式为：已读数/总接收人数*100%；\n环比上次数据口径：若是从未发起过群发通知，或是首次发起群发通知，没有上次的数据，则显示为：--；计算公式为：(本次通知的阅读率-上次通知的阅读率）/上次通知的阅读率 *100%。'
      },
      {
        label: '关注人数',
        value: 0,
        contentLabelFirst: null,
        contentValFirst: null,
        contentLabelSecond: '',
        contentValSecond: null,
        bottomLabel: '昨日 新增关注 ',
        bottomValue: 0,
        unit: '人',
        unitFirst: '人',
        unitSecond: '人',
        unitBottom: '人',
        tips: '关注了本会的人数'
      },
    ]

    return {
      cardList,
      permission: null,
      messageList: []
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey || ''
    },
    ...mapGetters(['name'])
  },
  created() {
    this.ckey && this.init()
  },
  methods: {
    async init() {
      await this.getPermission()
      await this.getPendingItems()
      if (this.permission) {
        await this.getChamberMembers()
        await this.getChamberArticles()
        await this.getChamberAlbums()
        await this.getChamberNotices()
        this.getFollowQuery()
      }
    },
    async getChamberMembers() {
      const { data, state, msg } = await getChamberMembers()
      if (state === 1) {
        this.cardList[0].value = data?.memberNum || 0
        this.cardList[0].contentValFirst = data?.activeMemberNum || 0
        this.cardList[0].contentValSecond = data?.activeMemberRatio || 0
        this.cardList[0].bottomValue = data?.monthNewMemberNum || 0
      } else {
        this.$message({
          message: msg,
          type: 'error'
        })
      }
    },
    async getChamberArticles() {
      const { data, state, msg } = await getChamberArticles()
      if (state === 1) {
        this.cardList[1].value = data?.articleNum || 0
        this.cardList[1].contentValFirst = data?.readNum || 0
        this.cardList[1].contentValSecond = data?.avgReadNum || 0
        this.cardList[1].bottomValue = data?.memberShareNum || 0
      } else {
        this.$message({
          message: msg,
          type: 'error'
        })
      }
    },
    async getChamberAlbums() {
      const { data, state, msg } = await getChamberAlbums()
      if (state === 1) {
        this.cardList[2].value = data?.albumNum || 0
        this.cardList[2].contentValFirst = data?.exposureNum || 0
        this.cardList[2].contentValSecond = data?.maxExposureNum || 0
        this.cardList[2].bottomValue = data?.memberShareNum || 0
      } else {
        this.$message({
          message: msg,
          type: 'error'
        })
      }
    },
    async getChamberNotices() {
      const { data, state, msg } = await getChamberNotices()
      if (state === 1) {
        this.cardList[3].value = data?.noticeReadRatio || 100
        this.cardList[3].bottomValue = data?.noticeReadSequential || '--'
      } else {
        this.$message({
          message: msg,
          type: 'error'
        })
      }
    },
    async getPendingItems() {
      const { data, state, msg } = await getPendingItems()
      if (state === 1) {
        this.messageList = data
      } else {
        this.$message({
          message: msg,
          type: 'error'
        })
      }
    },
    async getPermission() {
      const { data } = await getPermission()
      this.permission = data
    },
    // 关注人数
    async getFollowQuery() {
      const { data } = await getFollow()
      this.cardList[4].bottomValue = data?.day || 0
      this.cardList[2].value = data?.total || 0
    }
  }
}
