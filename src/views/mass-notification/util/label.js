// 创建群发通知类型  show显示规则代表1是总后台 2 是商会后台 3是共有
export const labelType = [
  { n: '缴费通知', type: 1, show: 2 }, 
  { n: '活动通知', type: 2, show: 3 },
  { n: '招商活动', type: 3, show: 3 }, 
  { n: '邀请入会', type: 4, show: 2 },
  { n: '自定义通知', type: 5, show: 3 },
]
export const receiveType = [
  { n: '所有会员', type: -1, show: 1 },
  { n: '指定商会会员', type: 5, show: 1   }, 
  { n: '指定手机号', type: 6, show: 1   }, 
  { n: '本商会会员', type: 1, show: 2 },
  { n: '指定职位', type: 2, show: 2 }, 
  { n: '指定部门', type: 3, show: 2 }, 
  { n: '指定会员', type: 4, show: 2 }, 

]
// form表单通知类型
//通知列表的通知类型
export const notificationType=[
  {id:-1,name:'全部'},
   {id:2,name:'活动通知'},
   {id:1,name:'缴费通知'},
   {id:4,name:'邀请入会'},
]
//群发管理的通知类型
export const massNotificationType=[
  {id:-1,name:'全部'},
   {id:2,name:'活动通知'},
   {id:1,name:'缴费通知'},
   {id:5,name:'自定义通知'},
]
//所有会员的table config
export const memberTableConfig=[ {
  prop: 'uname',
  label: '姓名',
  width: 180,
  type: 'general',
},
{
  prop: 'phone',
  label: '手机号',
  width: 180,
  type: 'general',
},
{
  prop: 'chamberNames',
  label: '所属商协会',
  type: 'general',
},
]

//指定商会会员的table
export const memberCountTableConfig=[
  {type:'select'}, 
  {
  prop: 'name',
  label: '商协会名称',
  type: 'general',
},
{
  prop: 'memberCount',
  label: '会员数（人）',
  type: 'general',
},

]