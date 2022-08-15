import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

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
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "dashboard", icon: "dashboard", affix: true }
      }
    ]
  },
  {
    path: "/account",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [
      {
        path: "profile",
        name: "个人资料",
        component: () => import("@/views/account/profile.vue"),
        meta: { title: "个人资料" }
      },
      {
        path: "timeline",
        name: "最近活动",
        component: () => import("@/views/account/timeline.vue"),
        hidden: true,
        meta: { title: "最近活动" }
      },
      {
        path: "updatePwd",
        name: "修改密码",
        component: () => import("@/views/account/updatePwd.vue"),
        hidden: true,
        meta: { title: "修改密码" }
      },
      // hidden先放在这
      {
        path: "/content/article-editor",
        name: "添加/修改文章",
        component: () => import("@/views/content/articleupdate/editor/index"),
        hidden: true,
        meta: { title: "添加/修改文章" }
      },
      {
        path: "/content/article-stick",
        name: "置顶管理",
        component: () => import("@/views/content/articleupdate/stick/index"),
        hidden: true,
        meta: { title: "置顶管理" }
      },
      {
        path: "/content/article-detail",
        name: "文章详情",
        component: () => import("@/views/content/articleupdate/detail/index"),
        hidden: true,
        meta: { title: "文章详情" }
      },
      {
        path: "/content/article-column-editor",
        name: "修改栏目内容",
        component: () =>
          import("@/views/content/articleupdate/editor/artcolumn"),
        hidden: true,
        meta: { title: "修改栏目内容" }
      },
      {
        path: "/content/article-source",
        name: "文章来源管理",
        component: () => import("@/views/content/articleSource/index"),
        hidden: true,
        meta: { title: "文章来源管理" }
      },
      {
        path: "/content/settop-manager",
        name: "置顶管理",
        component: () => import("@/views/content/articlemanager/settop/index"),
        hidden: true,
        meta: { title: "置顶管理" }
      },
      {
        path: "/content/crawler-editor",
        name: "编辑采文",
        component: () => import("@/views/content/crawler/editor/index"),
        hidden: true,
        meta: { title: "编辑采文" }
      },
      {
        path: "/content/article",
        name: "添加或编辑文章",
        component: () => import("@/views/content/article/index"),
        hidden: true,
        meta: { title: "添加或编辑文章" }
      },
      {
        path: "/content/addDynamic",
        name: "发布动态",
        component: () => import("@/views/content/addDynamic/index.vue"),
        hidden: true,
        meta: { title: "发布动态" }
      },
      {
        path: "/wxuser/detail",
        name: "用户详情",
        component: () => import("@/views/wxuser/detail/index"),
        hidden: true,
        meta: { title: "用户详情" }
      },
      {
        path: "/wxuser/officialManager",
        name: "官方号管理",
        component: () => import("@/views/wxuser/officialManager/index"),
        hidden: true,
        meta: { title: "官方号管理" }
      },
      {
        path: "/authority/manager/setup",
        name: "权限设置",
        component: () => import("@/views/authority/manager/setup/index"),
        hidden: true,
        meta: { title: "权限设置" }
      },
      {
        path: "/member/editor",
        name: "编辑会员",
        component: () => import("@/views/member/manager/editor/index"),
        hidden: true,
        meta: { title: "编辑会员" }
      },
      {
        path: "/member/add",
        name: "添加会员",
        component: () => import("@/views/member/manager/add/index"),
        hidden: true,
        meta: { title: "添加会员", keepAlive: true }
      },
      {
        path: "/member/detail",
        name: "会员详情",
        component: () => import("@/views/member/manager/detail/index"),
        hidden: true,
        meta: { title: "会员详情" }
      },
      {
        path: "/org-structure/department-manage",
        name: "部门管理",
        component: () =>
          import("@/views/org-structure/department-manage/index"),
        hidden: true,
        meta: { title: "部门管理" }
      },
      {
        path: "/org-structure/member-manage",
        name: "成员管理",
        component: () => import("@/views/org-structure/member-manage/index"),
        hidden: true,
        meta: { title: "成员管理" }
      },
      {
        path: "/org-structure/invite-member",
        name: "邀请成员",
        component: () => import("@/views/org-structure/invite-member/index"),
        hidden: true,
        meta: { title: "邀请成员" }
      },
      {
        path: "/goods/goodsSku",
        name: "发布新商品/编辑商品",
        component: () => import("@/views/goods/goodsSku/index"),
        hidden: true,
        meta: { title: "发布新商品/编辑商品" }
      },
      {
        path: "goods/booking",
        name: "商品预约列表",
        component: () => import("@/views/goods/booking/index"),
        hidden: true,
        meta: { title: "商品预约列表" }
      },
      {
        path: "/finance/chamberCapital/detail",
        name: "交易详情",
        component: () => import("@/views/finance/chamberCapital/detail/index"),
        hidden: true,
        meta: { title: "交易详情" }
      },
      {
        path: "/mall/goodsDetail",
        name: "商品详情",
        component: () => import("@/views/mall/goodsDetail/index"),
        hidden: true,
        meta: { title: "商品详情" }
      },
      {
        path: "/order/orderDetail",
        name: "订单详情",
        component: () => import("@/views/order/detail/index"),
        hidden: true,
        meta: { title: "订单详情" }
      },
      {
        path: "/member/smsRecords",
        name: "短信记录",
        component: () => import("@/views/member/memberNotice/smsRecords/index"),
        hidden: true,
        meta: { title: "短信记录" }
      },
      // 活动报名审核详情
      {
        path: "/activity/verifyDetail",
        name: "审核详情",
        component: () => import("@/views/activity/verify-detail/index"),
        hidden: true,
        meta: { title: "审核详情" }
      },
      {
        path: "/mall/couponDetail",
        name: "查看优惠券",
        component: () => import("@/views/mall/coupon-detail/index"),
        hidden: true,
        meta: { title: "查看优惠券" }
      },
      {
        path: "/mall/couponCreate",
        name: "创建优惠券",
        component: () => import("@/views/mall/coupon-create/index"),
        hidden: true,
        meta: { title: "创建优惠券" }
      },
      {
        path: "/mall/couponIssued",
        name: "已发放优惠券",
        component: () => import("@/views/mall/coupon-issued/index"),
        hidden: true,
        meta: { title: "已发放优惠券" }
      },
      {
        path: "/mall/spreeDetail",
        name: "查看大礼包",
        component: () => import("@/views/mall/spree-detail/index"),
        hidden: true,
        meta: { title: "查看大礼包" }
      },
      {
        path: "/mall/spreeCreate",
        name: "创建大礼包",
        component: () => import("@/views/mall/spree-create/index"),
        hidden: true,
        meta: { title: "创建大礼包" }
      },
      {
        path: "/mall/spreeIssued",
        name: "已发放大礼包",
        component: () => import("@/views/mall/spree-issued/index"),
        hidden: true,
        meta: { title: "已发放大礼包" }
      },
      {
        path: "/mall/issuing-coupon-send",
        name: "发放优惠券",
        component: () => import("@/views/mall/issuing-coupon-send/index"),
        hidden: true,
        meta: { title: "发放优惠券" }
      },
      {
        path: "/mall/issuing-coupon-receiver",
        name: "已发放列表",
        component: () => import("@/views/mall/issuing-coupon-receiver/index"),
        hidden: true,
        meta: { title: "已发放列表" }
      },
      {
        path: "/finance/settlement-detail",
        name: "结算单详情",
        component: () => import("@/views/finance/settlementDetail/index"),
        hidden: true,
        meta: { title: "结算单详情" }
      },
      {
        path: "/operate/detail",
        name: "邀请有礼活动详情",
        component: () => import("@/views/operate/detail/index"),
        hidden: true,
        meta: { title: "邀请有礼活动详情" }
      },
      {
        path: "/supply-and-demand/edit-supply-demand",
        name: "编辑供需",
        component: () => import("@/views/supply-and-demand/EditSupplyDemand"),
        hidden: true,
        meta: { title: "编辑供需" }
      },
      {
        path: "/guide/operate-detail",
        name: "添加和编辑操作指引",
        component: () => import("@/views/guide/operate"),
        hidden: true,
        meta: { title: "添加和编辑操作指引" }
      },
      {
        path: "/guide/chamber-guide",
        name: "操作指引详情",
        component: () => import("@/views/guide/playGuide"),
        hidden: true,
        meta: { title: "操作指引详情" }
      },
      {
        path: "/statistic/chamber-record",
        name: "登录记录",
        component: () => import("@/views/statistic/chamberRecord/index"),
        hidden: true,
        meta: { title: "登录记录" }
      },
      {
        path: "/statistic/chamber-details",
        name: "商会数据详情",
        component: () => import("@/views/statistic/chamberDetails/index"),
        hidden: true,
        meta: { title: "商会数据详情" }
      },
      {
        path: "/supply-and-demand/push-img",
        name: "爬虫发布供需",
        component: () => import("@/views/supply-and-demand/PublishImg"),
        hidden: true,
        meta: { title: "爬虫发布供需" }
      }
    ]
  }
];

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
