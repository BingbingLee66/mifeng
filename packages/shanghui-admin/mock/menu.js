import Mock from 'mockjs'
/* 以下参考路由
 *{
 *  id: '@id',
 *  menuUrl: '/activity',
 *  component: 'layout',
 *  menuName: '活动管理',
 *  icon: 'star-outlined',
 *  parentId: null,
 *  children: [
 *    {
 *      menuName: '活动列表',
 *      menuUrl: 'index',
 *      component: 'pages/activity/index',
 *      id: '@id',
 *      parentId: 1
 *    }
 *  ]
 *},
 */
const data = Mock.mock({
  menus: [
    {
      id: 10,
      parentId: null,
      menuName: '首页配置',
      menuUrl: '/home-update',
      component: 'layout',
      hidden: false,
      icon: 'homeupdate',
      hadGuide: true,
      guideId: 1101000,
      children: [
        {
          id: 1205,
          parentId: 10,
          menuName: '轮播图更新',
          menuUrl: '/content/carousel-update',
          component: 'views/content/carousel/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1216,
          parentId: 10,
          menuName: '友情单位',
          menuUrl: '/home-update/friendLink',
          component: 'views/home-update/friendLink/index',
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1004,
          parentId: 10,
          menuName: '领导风采',
          menuUrl: '/home-update/leader-style',
          component: 'views/home-update/leader-style/index',
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        }
      ]
    },
    {
      id: 20,
      parentId: null,
      menuName: '会员管理',
      menuUrl: '/member',
      component: 'layout',
      hidden: false,
      icon: 'member',
      hadGuide: true,
      guideId: 1101001,
      children: [
        {
          id: 2001,
          parentId: 20,
          menuName: '商协会成员',
          menuUrl: '/member/manager',
          component: 'views/member/manager/index',
          hidden: false,
          icon: 'operation',
          hadGuide: true,
          guideId: 1101001,
          children: []
        },
        {
          id: 2002,
          parentId: 20,
          menuName: '入会审核',
          menuUrl: '/member/audit',
          component: 'views/member/manager/audit/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 2009,
          parentId: 20,
          menuName: '入会标签',
          menuUrl: '/member/member-tab',
          component: 'views/member/member-tab/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 2003,
          parentId: 20,
          menuName: '会员资料修改审核',
          menuUrl: '/member/reaudit',
          component: 'views/member/manager/reaudit/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 2007,
          parentId: 20,
          menuName: '会费缴纳记录',
          menuUrl: '/member/member-fee',
          component: 'views/member/memberFee/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 2008,
          parentId: 20,
          menuName: '会员缴费通知',
          menuUrl: '/member/member-notice',
          component: 'views/member/memberNotice/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        }
      ]
    },
    {
      id: 23,
      parentId: null,
      menuName: '组织架构',
      menuUrl: '/org-structure',
      component: 'layout',
      hidden: false,
      icon: 'organization',
      hadGuide: false,
      guideId: null,
      children: [
        {
          id: 2004,
          parentId: 23,
          menuName: '会内职位',
          menuUrl: '/member/post',
          component: 'views/member/post/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 2204,
          parentId: 23,
          menuName: '部门管理',
          menuUrl: '/org-structure/department-manage',
          component: 'views/org-structure/department-manage/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 2205,
          parentId: 23,
          menuName: '成员管理',
          menuUrl: '/org-structure/member-manage',
          component: 'views/org-structure/member-manage/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        }
      ]
    },
    {
      id: 12,
      parentId: null,
      menuName: '内容管理',
      menuUrl: '/content',
      component: 'layout',
      hidden: false,
      icon: 'content',
      hadGuide: false,
      guideId: null,
      children: [
        {
          id: 1208,
          parentId: 12,
          menuName: '栏目设置',
          menuUrl: '/content/column-setup',
          component: 'views/content/columnsetup/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1209,
          parentId: 12,
          menuName: '文章管理',
          menuUrl: '/content/article-update',
          component: 'views/content/articleupdate/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1218,
          parentId: 12,
          menuName: '公众号',
          menuUrl: '/content/officialAccount',
          component: 'views/content/officialAccount/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1217,
          parentId: 12,
          menuName: '专委会文章管理',
          menuUrl: '/content/committee-article',
          component: 'views/content/articleCommittee/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1219,
          parentId: 12,
          menuName: '节日海报',
          menuUrl: '/content/poster',
          component: 'views/content/poster/PosterManage',
          hidden: false,
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1220,
          parentId: 12,
          menuName: '新建海报',
          menuUrl: '/content/poster/create',
          component: 'views/content/poster/PosterCreate',
          hidden: true,
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1221,
          parentId: 12,
          menuName: '编辑海报',
          menuUrl: '/content/poster/edit/:id',
          component: 'views/content/poster/PosterCreate',
          hidden: true,
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1222,
          parentId: 12,
          menuName: 'AIGC',
          menuUrl: '/content/aigc',
          component: 'views/content/aigc/AigcManage',
          hidden: false,
          hadGuide: false,
          guideId: null,
          children: []
        }
      ]
    },
    {
      id: 25,
      parentId: null,
      menuName: '活动管理',
      menuUrl: '/activity',
      component: 'layout',
      hidden: false,
      icon: 'activity',
      hadGuide: false,
      guideId: null,
      children: [
        {
          id: 2208,
          parentId: 25,
          menuName: '创建活动',
          menuUrl: '/activity/create',
          component: 'views/activity/create/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 2209,
          parentId: 25,
          menuName: '活动列表',
          menuUrl: '/activity/list',
          component: 'views/activity/list/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 2210,
          parentId: 25,
          menuName: '报名审核',
          menuUrl: '/activity/activity-verify',
          component: 'views/activity/activity-verify/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 3204,
          parentId: 25,
          menuName: '创建直播相册',
          menuUrl: '/album/create',
          component: 'views/album/create',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 3205,
          parentId: 25,
          menuName: '图片直播',
          menuUrl: '/album/list',
          component: 'views/album/list',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        }
      ]
    },
    {
      id: 34,
      parentId: null,
      menuName: '商会直播',
      menuUrl: '/livetelecast',
      component: 'layout',
      hidden: false,
      icon: 'zhibo',
      hadGuide: false,
      guideId: null,
      children: [
        {
          id: 3401,
          parentId: 34,
          menuName: '直播管理',
          menuUrl: '/livetelecast/manager',
          component: '/',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        }
      ]
    },
    {
      id: 27,
      parentId: null,
      menuName: '供需管理',
      menuUrl: '/supply_and_demand',
      component: 'layout',
      hidden: false,
      icon: 'operation',
      hadGuide: false,
      guideId: null,
      children: [
        {
          id: 2214,
          parentId: 10,
          menuName: '热门供需',
          menuUrl: '/home-update/hot-supply-deman',
          component: 'views/home-update/hot-supply-demand/index',
          hidden: false,
          icon: 'operation',
          hadGuide: true,
          guideId: 1101000,
          children: []
        },
        {
          id: 2215,
          parentId: 27,
          menuName: '发布图文供需',
          menuUrl: '/publish/img',
          component: 'views/supply-and-demand/PublishImg',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 2216,
          parentId: 27,
          menuName: '发布视频供需',
          menuUrl: '/publish/video',
          component: 'views/supply-and-demand/PublishVideo',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 2217,
          parentId: 27,
          menuName: '供需管理',
          menuUrl: '/management',
          component: 'views/supply-and-demand/DemandManagement',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        }
      ]
    },
    {
      id: 33,
      parentId: null,
      menuName: '群发管理',
      menuUrl: '/mass-notification',
      component: 'layout',
      hidden: false,
      icon: 'membericon',
      hadGuide: false,
      guideId: null,
      children: [
        {
          id: 3303,
          parentId: 33,
          menuName: '群发管理',
          menuUrl: '/mass-notification/mass-list',
          component: 'views/mass-notification/mass-list/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 3304,
          parentId: 33,
          menuName: '创建群发通知',
          menuUrl: '/mass-notification/create',
          component: 'views/mass-notification/create/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        }
      ]
    },

    {
      id: 15,
      parentId: null,
      menuName: '财务管理',
      menuUrl: '/finance',
      component: 'layout',
      hidden: false,
      icon: 'finance',
      hadGuide: false,
      guideId: null,
      children: [
        {
          id: 1504,
          parentId: 15,
          menuName: '会员会费',
          menuUrl: '/finance/member-fee',
          component: 'views/finance/memberFee/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1505,
          parentId: 15,
          menuName: '结算提现',
          menuUrl: '/finance/cash-withdrawal',
          component: 'views/finance/cashWithdrawal/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        }
      ]
    },
    {
      id: 17,
      parentId: null,
      menuName: '数据统计',
      menuUrl: '/data',
      component: 'layout',
      hidden: false,
      icon: 'datastatistics',
      hadGuide: false,
      guideId: null,
      children: [
        {
          id: 1701,
          parentId: 17,
          menuName: '会员数据',
          menuUrl: '/statistic/member-data',
          component: 'views/statistic/memberData/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1708,
          parentId: 17,
          menuName: '会员画像',
          menuUrl: '/statistic/member-portrait',
          component: 'views/statistic/memberPortrait/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 2219,
          parentId: 17,
          menuName: '供需数据统计',
          menuUrl: '/statistic/supply-demand-data',
          component: 'views/statistic/supplyDemandData/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        }
      ]
    },
    {
      id: 18,
      parentId: null,
      menuName: '权限管理',
      menuUrl: '/authority',
      component: 'layout',
      hidden: false,
      icon: 'icon-password',
      hadGuide: false,
      guideId: null,
      children: [
        {
          id: 1801,
          parentId: 18,
          menuName: '后台权限管理',
          menuUrl: '/authority/manager',
          component: 'views/authority/manager/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1803,
          parentId: 18,
          menuName: '后台成员管理',
          menuUrl: '/authority/user',
          component: 'views/authority/user/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1804,
          parentId: 18,
          menuName: '前台权限管理',
          menuUrl: '/authority/front-manager',
          component: 'views/authority/FrontManager/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        }
      ]
    },
    {
      id: 19,
      parentId: null,
      menuName: '系统设置',
      menuUrl: '/sys',
      component: 'layout',
      hidden: false,
      icon: 'systemicon',
      hadGuide: false,
      guideId: null,
      children: [
        {
          id: 1904,
          parentId: 19,
          menuName: '操作日志',
          menuUrl: '/sys/operated-log',
          component: 'views/system/operatedlog/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1905,
          parentId: 19,
          menuName: '商会logo设置',
          menuUrl: '/sys/logo',
          component: 'views/system/logo/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 1906,
          parentId: 19,
          menuName: '入会专属二维码',
          menuUrl: '/sys/member/qrcode',
          component: 'views/system/join/member/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        },
        {
          id: 3305,
          parentId: 19,
          menuName: '商会主页二维码',
          menuUrl: '/sys/homepage/qrcode',
          component: 'views/system/chamber-homepage/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        }
      ]
    },
    {
      id: 31,
      parentId: null,
      menuName: '后台操作指引',
      menuUrl: '/guide',
      component: 'layout',
      hidden: false,
      icon: 'education',
      hadGuide: false,
      guideId: null,
      children: [
        {
          id: 2302,
          parentId: 31,
          menuName: '操作指引',
          menuUrl: '/guide/chamberGuide',
          component: 'views/guide/chamberGuide/index',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        }
      ]
    },
    {
      id: 35,
      parentId: null,
      menuName: '问卷管理',
      menuUrl: '/quest-survey',
      component: 'layout',
      hidden: false,
      icon: 'questionnaire',
      hadGuide: false,
      guideId: null,
      children: [
        {
          id: 3501,
          parentId: 35,
          menuName: '问卷管理',
          menuUrl: '/quest-survey/manager',
          component: 'views/quest-survey/manager',
          hidden: false,
          icon: 'operation',
          hadGuide: false,
          guideId: null,
          children: []
        }
      ]
    }
  ]
})

export default [
  {
    url: '/menu/list',
    type: 'get',
    response: () => {
      return {
        state: 1,
        data: {
          menu: data.menus
        }
      }
    }
  }
]
