import request from '@/utils/request'
// 添加热门活动
export function getTabList(params) {
  return request({
    url: '/ecservice/ec/tab',
    method: 'get',
    params
  })
}

/** 编辑tab  */
export function updateTab(data) {
  return request({
    url: '/ecservice/ec/tab',
    method: 'put',
    data
  })
}

/** 默认选中tab  */
export function defaultTab(params) {
  return request({
    url: '/ecservice/ec/tab/defaultChange',
    method: 'put',
    params
  })
}

/** 展示/隐藏tab  */
export function showTab(params) {
  return request({
    url: '/ecservice/ec/tab/editStatus',
    method: 'put',
    params
  })
}

/** tab排序  */
export function sortTab(params) {
  return request({
    url: '/ecservice/ec/tab/sort',
    method: 'put',
    params
  })
}
