/**
 * 静态路由
 * @type {import("vue-router").RouteRecordRaw[]} 获得代码提示
 */
export default [
  {
    path: '/',
    name: 'layout',
    redirect: '/dashboard',
    component: () => import(/* webpackChunkName: "layout" */ '@/layout'),
    children: [
      {
        path: '/dashboard',
        name: '首页工作台',
        component: () => import(/* webpackChunkName: "workbench" */ '@/views/dashboard/index')
      },
      {
        path: '/add-hot-demand',
        name: '添加热门供需',
        component: () => import('@/views/home-update/hot-supply-demand/add')
      },
      {
        path: '/add-carousel',
        name: '添加轮播图',
        component: () => import('@/views/content/carousel/edit')
      },
      {
        path: '/edit-carousel',
        name: '编辑轮播图',
        component: () => import('@/views/content/carousel/edit')
      },
      {
        path: '/content/settop-manager',
        name: '置顶管理',
        component: () => import('@/views/content/articleupdate/stick/index'),
        hidden: true,
        meta: { title: '置顶管理' }
      },
      {
        path: '/content/article-editor',
        name: '添加/修改文章',
        component: () => import('@/views/content/articleupdate/editor/index'),
        hidden: true,
        meta: { title: '添加/修改文章' }
      },
      {
        path: '/content/article-column-editor',
        name: '修改栏目内容',
        component: () => import('@/views/content/articleupdate/editor/artcolumn'),
        hidden: true,
        meta: { title: '修改栏目内容' }
      },
      {
        path: '/authority/manager/setup',
        name: '权限设置',
        component: () => import('@/views/authority/manager/setup/index'),
        hidden: true,
        meta: { title: '权限设置' }
      },
      {
        path: '/supply-and-demand/edit-supply-demand',
        name: '编辑供需',
        component: () => import('@/views/supply-and-demand/EditSupplyDemand')
      },
      {
        path: '/album/edit',
        name: '编辑直播相册',
        component: () => import('@/views/album/create')
      },
      {
        path: '/album/detail',
        name: '图片直播详情',
        component: () => import('@/views/album/detail')
      },
      {
        path: '/member/smsRecords',
        name: '短信记录',
        component: () => import('@/views/member/memberNotice/smsRecords/index')
      },
      {
        path: '/member/add',
        name: '添加会员',
        component: () => import('@/views/member/manager/add/index'),
        meta: { title: '添加会员', keepAlive: true }
      },
      {
        path: '/member/detail/:memberId?/:userId?/:ckey?',
        name: '会员详情',
        component: () => import('@/views/member/manager/detail/index'),
        meta: { title: '会员详情' }
      },
      {
        path: '/member/editor',
        name: '编辑会员',
        component: () => import('@/views/member/manager/editor/index'),
        meta: { title: '编辑会员', keepAlive: true }
      },
      {
        path: '/account/updatePwd',
        name: '修改密码',
        component: () => import('@/views/account/updatePwd.vue'),
        hidden: true,
        meta: { title: '修改密码' }
      },
      {
        path: '/org-structure/invite-member',
        name: '邀请成员',
        component: () => import('@/views/org-structure/invite-member/index'),
        hidden: true,
        meta: { title: '邀请成员' }
      },
      {
        path: '/guide/chamber-guide',
        name: '操作指引详情',
        component: () => import('@/views/guide/playGuide'),
        hidden: true,
        meta: { title: '操作指引详情' }
      },
      {
        name: '站内信',
        path: '/sms/mail',
        component: () => import('@/views/sms/mail/index.vue'),
        hidden: true,
        meta: { title: '站内信' }
      },
      {
        name: '站内信详情',
        path: '/sms/mail-details',
        component: () => import('@/views/sms/mail-details/index.vue'),
        hidden: true,
        meta: { title: '站内信详情' }
      },
      {
        name: '审核详情',
        path: '/activity/verifyDetail',
        component: () => import('@/views/activity/verify-detail/index.vue'),
        hidden: true,
        meta: { title: '审核详情' }
      },
      {
        path: '/activity/detail',
        name: 'activityDetail',
        component: () => import('@/views/activity/detail/index.vue'),
        hidden: true,
        meta: { title: '活动详情' }
      },
      {
        name: '参与人与名片排序',
        path: '/activity/ipSort',
        component: () => import('@/views/activity/ip-sort/index.vue'),
        hidden: true,
        meta: { title: '参与人与名片排序' }
      },
      {
        path: '/activity/member-album',
        name: '会员图片直播',
        component: () => import('@/views/activity/member-album/index.vue'),
        hidden: true,
        meta: { title: '会员图片直播' }
      },
      {
        path: '/dashboard/follow-list',
        name: 'follow',
        component: () => import('@/views/dashboard/list/FollowList.vue'),
        hidden: true,
        meta: { title: '已关注' }
      },
      {
        path: '/quest-survey/answer/list',
        component: () => import('@/views/quest-survey/answer/list/index'),
        name: 'answerList',
        hidden: true,
        meta: { title: '查看答卷' }
      },
      {
        path: '/quest-survey/answer/detail',
        component: () => import('@/views/quest-survey/answer/detail/index'),
        name: 'answerDetail',
        hidden: true,
        meta: { title: '答卷详情' }
      },
      {
        path: '/quest-survey/create',
        component: () => import('@/views/quest-survey/create/index'),
        name: 'createQuest',
        meta: { title: '创建问卷' }
      },
      {
        path: 'mass-notification/create',
        name: 'create',
        hidden: true,
        component: () => import('@/views/mass-notification/create/index'),
        meta: { title: '创建群发' }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/login')
  },
  // 先写死一个，后面删除
  {
    path: '/member-list',
    name: 'memberList',
    component: () => import(/* webpackChunkName: "layout" */ '@/views/member/manager/index'),
    children: []
  },
  // {
  //   path: '/:pathMatch(.*)',
  //   name: 'nofound',
  //   component: () => import(/* webpackChunkName: "layout" */ '@/views/notfound')
  // }
  {
    path: '/:catchAll(.*)',
    hidden: true,
    component: () => import('@/views/notfound')
  }
]
