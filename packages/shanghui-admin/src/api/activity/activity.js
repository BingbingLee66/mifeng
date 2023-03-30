import request from '@/utils/request'
// 查询活动来源列表
export function getActivitySource(params) {
  return request({
    url: '/ecservice/api/ec/activity-hot/chamber-list',
    method: 'post',
    params,
    hiddenSuccess: true
  })
}
