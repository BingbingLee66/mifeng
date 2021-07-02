import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'dashboard', icon: 'dashboard', affix: true }
    }]
  },
  {
    path: '/account',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        name: '个人资料',
        component: () => import('@/views/account/profile.vue'),
        meta: { title: '个人资料' }
      },
      {
        path: 'timeline',
        name: '最近活动',
        component: () => import('@/views/account/timeline.vue'),
        hidden: true,
        meta: { title: '最近活动' }
      },
      {
        path: 'updatePwd',
        name: '修改密码',
        component: () => import('@/views/account/updatePwd.vue'),
        hidden: true,
        meta: { title: '修改密码' }
      },
      // hidden先放在这
      {
        path: '/content/article-editor',
        name: '添加/修改文章',
        component: () => import('@/views/content/articleupdate/editor/index'),
        hidden: true,
        meta: { title: '添加/修改文章' }
      },
      {
        path: '/content/article-detail',
        name: '文章详情',
        component: () => import('@/views/content/articleupdate/detail/index'),
        hidden: true,
        meta: { title: '文章详情' }
      },
      {
        path: '/content/article-column-editor',
        name: '修改栏目内容',
        component: () => import('@/views/content/articleupdate/editor/artcolumn'),
        hidden: true,
        meta: { title: '修改栏目内容' }
      },
      {
        path: '/content/article-source',
        name: '文章来源管理',
        component: () => import('@/views/content/articleSource/index'),
        hidden: true,
        meta: { title: '文章来源管理' }
      },
      {
        path: '/content/settop-manager',
        name: '置顶管理',
        component: () => import('@/views/content/articlemanager/settop/index'),
        hidden: true,
        meta: { title: '置顶管理' }
      },
      {
        path: '/content/crawler-editor',
        name: '编辑采文',
        component: () => import('@/views/content/crawler/editor/index'),
        hidden: true,
        meta: { title: '编辑采文' }
      },
      {
        path: '/content/article',
        name: '添加或编辑文章',
        component: () => import('@/views/content/article/index'),
        hidden: true,
        meta: { title: '添加或编辑文章' }
      },
      {
        path: '/wxuser/detail',
        name: '用户详情',
        component: () => import('@/views/wxuser/detail/index'),
        hidden: true,
        meta: { title: '用户详情' }
      },
      {
        path: '/authority/manager/setup',
        name: '权限设置',
        component: () => import('@/views/authority/manager/setup/index'),
        hidden: true,
        meta: { title: '权限设置' }
      },
      {
        path: '/member/editor',
        name: '编辑会员',
        component: () => import('@/views/member/manager/editor/index'),
        hidden: true,
        meta: { title: '编辑会员' }
      },
      {
        path: '/member/add',
        name: '添加会员',
        component: () => import('@/views/member/manager/add/index'),
        hidden: true,
        meta: { title: '添加会员', keepAlive: true }
      },
      {
        path: '/member/detail',
        name: '会员详情',
        component: () => import('@/views/member/manager/detail/index'),
        hidden: true,
        meta: { title: '会员详情' }
      },
      {
        path: '/org-structure/department-manage',
        name: '部门管理',
        component: () => import('@/views/org-structure/department-manage/index'),
        hidden: true,
        meta: { title: '部门管理' }
      },
      {
        path: '/org-structure/member-manage',
        name: '成员管理',
        component: () => import('@/views/org-structure/member-manage/index'),
        hidden: true,
        meta: { title: '成员管理' }
      },
      {
        path: '/org-structure/invite-member',
        name: '邀请成员',
        component: () => import('@/views/org-structure/invite-member/index'),
        hidden: true,
        meta: { title: '邀请成员' }
      }
    ]
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
