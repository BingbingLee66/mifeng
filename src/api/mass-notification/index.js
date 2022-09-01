import request from '@/utils/request'

// 获取商会活动详情
export const getInvesChamberActivityInfoById = activityId =>
  request({
    url: `/api/ec/invesActivity-apply/chamberActivityInfo/${activityId}`,
    method: 'get'
  })
