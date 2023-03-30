import request from '@/utils/request'
// 获取oss配置信息
export const getSts = () => {
  return request({
    url: '/ecservice/vod/medio/token',
    method: 'get'
  })
}
// 轮询查视频动态
export function queryVideo(vid) {
  return request({
    url: `/ecservice/ec/dynamic-record/vod/info/${vid}`,
    method: 'get',
    hiddenError: true,
    hiddenSuccess: true
  })
}
