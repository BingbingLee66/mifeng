// 创建群发通知类型  show显示规则代表1是总后台 2 是商会后台 3是共有
export const labelType = [
  { n: '缴费通知', type: 1, show: 2 }, 
  { n: '活动通知', type: 2, show: 3 },
  { n: '招商活动', type: 3, show: 3 }, 
  { n: '邀请入会', type: 4, show: 2 },
  { n: '自定义通知', type: 5, show: 2 },
]
export const receiveType = [
  { n: '所有人', type: -1, show: 1 },
  { n: '指定商会会员', type: 5, show: 2   }, 
  { n: '指定手机号', type: 6, show: 1   }, 
  { n: '本商会会员', type: 1, show: 1 },
  { n: '指定职位', type: 2, show: 2 }, 
  { n: '指定部门', type: 3, show: 2 }, 
  { n: '指定会员', type: 4, show: 2 }, 

]