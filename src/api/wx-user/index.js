import request from '@/utils/request'

// 获取加入商会并且未冻结的用户
export const getJoinChamberAndNoFreezesUsers = params => request({ url: '/ec/wx-user/joinChamberAndNoFreezes', method: 'get', params })
