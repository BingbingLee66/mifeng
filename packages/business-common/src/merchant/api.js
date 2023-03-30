import request from '@/utils/request'

/**
 * 跳转到商务直播端
 * @returns {*}
 */
export const gotoMerchant = () => request.get('/ecservice/ec/public/third-url?type=0')

/**
 * 获取商会的直播列表
 * @param ckey
 * @returns {*}
 */
export const getAudienceList = ckey => request.get(`/ecservice/ec/cloud-live/channels/${ckey}`)
