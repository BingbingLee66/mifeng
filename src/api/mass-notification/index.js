import request from '@/utils/request'

// 获取商会活动详情
export const getInvesChamberActivityInfoById = activityId =>
  request({
    url: `/api/ec/invesActivity-apply/chamberActivityInfo/${activityId}`,
    method: 'get'
  })

// 查询所有会员列表
export const getMemberList = params => request({ url: '/ec/member/all-member-page-list', method: 'get', params })

// 查询指定商会会员列表
export const getChamberMemberList = params => request({ url: '/ec/member/chamber-member-page-list', method: 'get', params })
//查询商会和会员数
export const getMemberCountList = params => request({ url: '/ec/chamber/chamber-member-count-list', method: 'get', params })