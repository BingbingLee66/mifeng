import Panel from '../../components/panel'
import myTodo from './components/myTodo'
import cardList from './components/cardList'
import toolBar from './components/toolBar'
export default {
  name: 'dashboard',
  components: {
    myTodo,
    cardList,
    toolBar,
    Panel
  },
  data() {
    const cardList = [
      {
        label: '会员数',
        value: 0,
        contentLabelFirst: '激活会员数',
        contentValFirst: 0,
        contentLabelSecond: '会员激活比',
        contentValSecond: 0,
        bottomLabel: '本月新增会员',
        bottomValue: 0,
        progress: true,
        unit: '人',
        unitFirst: '人',
        unitSecond: '%',
        unitBottom: '人'
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
        unitBottom: '次'
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
        unitBottom: '次'
      },
      {
        label: '群发通知阅读率',
        value: 0,
        bottomLabel: '环比上次',
        bottomValue: 0,
        progress: true,
        unit: '%',
        unitBottom: '%次'
      }
    ]
    return {
      cardList
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {}
}
