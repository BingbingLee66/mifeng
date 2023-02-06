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
