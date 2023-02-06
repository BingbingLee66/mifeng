import request from '@/utils/request'

// 删除座位表
export const deleteInvesSeating = activityId =>
  request({
    url: `/ecservice/api/ec/invesSingin/Seat/clean/${activityId}`,
    method: 'get'
  })
