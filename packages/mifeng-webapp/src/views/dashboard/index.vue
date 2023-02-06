<template>
  <div>
    <template v-if="ckey">
      <cardList v-if="permission" v-model:cardList="cardList" />
      <div class="flex-x">
        <ToolBar style="flex: 3" />
        <myTodo style="flex: 1" :message-list="messageList" />
      </div>
    </template>
    <template v-else>
      <div id="dashboard" class="dashboard-container" style="background-color: #ffffff">
        <div class="dashboard-container-view">
          <div class="dashboard-text">欢迎光临:{{ name }}</div>
          <img class="dashboard-img" src="https://ysh-cdn.kaidicloud.com/prod/bee/home.png" />
        </div>
      </div>
    </template>
  </div>
</template>
<script>
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
} from '@/api/home/WorkbenchPage'
import { defineComponent, ref, onMounted, inject, onUnmounted, reactive } from 'vue'
export default defineComponent({
  name: 'WorkbenchPage',
  components: {
    myTodo,
    cardList,
    ToolBar
  },
  setup() {
    const ckey = inject('ckey')
    const permission = ref(null)
    const messageList = ref([])
    const cardList = reactive([
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
        value: 0,
        bottomLabel: '环比上次',
        bottomValue: '--',
        progress: 2,
        unit: '%',
        unitBottom: '%',
        showTriangle: true,
        tips: '群发通知阅读率数据口径：取最近一次群发通知的数据，若是从未发起过群发通知，设置默认值，默认值=100%。计算公式为：已读数/总接收人数*100%；\n环比上次数据口径：若是从未发起过群发通知，或是首次发起群发通知，没有上次的数据，则显示为：--；计算公式为：(本次通知的阅读率-上次通知的阅读率）/上次通知的阅读率 *100%。'
      }
    ])
    const init = async () => {
      await getPermissionVal()
      if (permission.value) {
        await getChamberMember()
        await getChamberArticle()
        await getChamberAlbum()
        await getChamberNotice()
        await getFollowQuery()
      }
      getPendingItem()
    }
    const changeValueByLabel = (label, obj) => {
      const card = cardList.find(v => v.label === label)
      Object.assign(card, obj)
    }

    const getChamberMember = async () => {
      const { data } = await getChamberMembers()
      changeValueByLabel('会员数', {
        value: data?.memberNum || 0,
        contentValFirst: data?.activeMemberNum || 0,
        contentValSecond: data?.activeMemberRatio || 0,
        bottomValue: data?.monthNewMemberNum || 0
      })
    }
    const getChamberArticle = async () => {
      const { data } = await getChamberArticles()
      changeValueByLabel('发布文章数', {
        value: data?.articleNum || 0,
        contentValFirst: data?.readNum || 0,
        contentValSecond: data?.avgReadNum || 0,
        bottomValue: data?.memberShareNum || 0
      })
    }
    const getChamberAlbum = async () => {
      const { data } = await getChamberAlbums()
      changeValueByLabel('图片直播数', {
        value: data?.albumNum || 0,
        contentValFirst: data?.exposureNum || 0,
        contentValSecond: data?.maxExposureNum || 0,
        bottomValue: data?.memberShareNum || 0
      })
    }
    const getChamberNotice = async () => {
      const { data } = await getChamberNotices()
      changeValueByLabel('群发通知阅读率', {
        value: data?.noticeReadRatio || 100,
        bottomValue: data?.noticeReadSequential || '--'
      })
    }
    let timer = null
    const getPendingItem = async () => {
      clearInterval(timer)
      const { data } = await getPendingItems()
      messageList.value = data
      timer = setTimeout(getPendingItem, 30000)
    }
    const getPermissionVal = async () => {
      const { data } = await getPermission()
      permission.value = data
    }
    const getFollowQuery = async () => {
      const { data } = await getFollow()
      changeValueByLabel('关注人数', {
        bottomValue: data?.day || 0,
        value: data?.total || 0
      })
    }
    onMounted(() => {
      init()
    })
    onUnmounted(() => {
      clearInterval(timer)
    })
    return {
      ckey,
      permission,
      cardList,
      messageList,
      getPermissionVal,
      getPendingItem,
      getChamberMember,
      getChamberArticle,
      getChamberAlbum,
      getChamberNotice
    }
  }
})
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
// .grids {
//   display: grid;
//   grid-template-columns: 3fr 1fr;
//   grid-gap: 20px;
//   padding: 0 20px 0 20px;
// }
.dashboard-container {
  min-height: calc(100vh - 100px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.dashboard-container-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  .dashboard-text {
    font-size: 24px;
    color: #222222;
    margin-bottom: 39px;
  }
  .dashboard-img {
    width: 524px;
    height: 288px;
  }
}
</style>
