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
        path: '/account/updatePwd',
        name: '修改密码',
        component: () => import('@/views/account/updatePwd.vue'),
        hidden: true,
        meta: { title: '修改密码' }
      },
      {
        path: '/content/crawler-editor',
        name: '编辑采文',
        component: () => import('@/views/content/crawler/editor/index'),
        hidden: true,
        meta: { title: '编辑采文' }
      },
      {
        path: '/quest-survey/create',
        component: () => import('@/views/quest-survey/create/createQuestion'),
        name: '创建问卷',
        hidden: true,
        meta: { title: '创建问卷' }
      },
      {
        path: '/activity/detail',
        name: 'activityDetail',
        component: () => import('@/views/activity/detail/index.vue'),
        hidden: true,
        meta: { title: '活动详情' }
      },
      {
        name: '审核详情',
        path: '/activity/verifyDetail',
        component: () => import('@/views/activity/verify-detail/index.vue'),
        hidden: true,
        meta: { title: '审核详情' }
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
        path: '/content/article-detail',
        name: '文章详情',
        component: () => import('@/views/content/articleupdate/detail/index'),
        hidden: true,
        meta: { title: '文章详情' }
      },
      {
        path: '/content/article-source',
        name: '文章来源管理',
        component: () => import('@/views/content/articleSource/index'),
        hidden: true,
        meta: { title: '文章来源管理' }
      },
      {
        path: '/content/article-stick',
        name: '置顶管理',
        component: () => import('@/views/content/articleupdate/stick/index'),
        hidden: true,
        meta: { title: '置顶管理' }
      },
      {
        path: '/content/article',
        name: '添加或编辑文章',
        component: () => import('@/views/content/article/index'),
        hidden: true,
        meta: { title: '添加或编辑文章' }
      },
      {
        path: '/finance/settlement-detail',
        name: '结算单详情',
        component: () => import('@/views/finance/settlementDetail/index'),
        hidden: true,
        meta: { title: '结算单详情' }
      },
      {
        path: '/finance/chamberCapital/detail',
        name: '交易详情',
        component: () => import('@/views/finance/chamberCapital/detail/index'),
        hidden: true,
        meta: { title: '交易详情' }
      },
      {
        path: '/order/orderDetail',
        name: '订单详情',
        component: () => import('@/views/order/detail/index'),
        hidden: true,
        meta: { title: '订单详情' }
      },
      {
        name: '新增5G彩信模板',
        path: '/mass-notification/5g/create',
        component: () => import('@/views/mass-notification/5g/create.vue'),
        hidden: true,
        meta: { title: '新增5G彩信模板' }
      },
      {
        name: '新增模板',
        path: '/template-set/add-note/index',
        component: () => import('@/views/mass-notification/templateSet/addTemplate.vue'),
        hidden: true,
        meta: { title: '新增模板' }
      },
      {
        name: '编辑模板',
        path: '/template-set/edit-note/index',
        component: () => import('@/views/mass-notification/templateSet/addTemplate.vue'),
        hidden: true,
        meta: { title: '编辑模板' }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/login')
  },
  {
    path: '/:catchAll(.*)',
    hidden: true,
    component: () => import('@/views/notfound')
  }
]
