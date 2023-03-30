import request from '../utils/request'
// 轮询查视频动态
export function queryVideo(vid) {
  return request({
    url: `/ecservice/ec/dynamic-record/vod/info/${vid}`,
    method: 'get',
    hiddenError: true,
    hiddenSuccess: true,
  })
}
