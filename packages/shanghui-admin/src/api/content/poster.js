import request from '@/utils/request'

// 海报列表
export function queryPosterList(query) {
  return request({
    url: `ecservice/ec/festival/poster/page`,
    method: 'post',
    data: query,
    hiddenSuccess: true
  })
}

// 删除海报
export function deletePoster(id) {
  return request({
    url: `ecservice/ec/festival/poster/del?id=${id}`,
    method: 'delete'
  })
}
// 查询海报详情
export function queryPosterDetail(id) {
  return request({
    url: `ecservice/ec/festival/poster/detail?id=${id}`,
    method: 'get'
  })
}

/**
 * 获取节日海报模板列表
 * @param params：{ type: 1-5, page: 1, pageSize: 10 }
 * @returns {*}
 */
export const posterModelList = params => request('/ecservice/ec/festival/template/queryTypeByPage', { params })

/**
 * 创建海报
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */
export const createPoster = data => request.post('/ecservice/ec/festival/poster/add', data)

/**
 * 获取海报详情
 * @param params：{id}
 * @returns {*}
 */
export const getPosterDetail = params => request('/ecservice/ec/festival/poster/detail', { params })

/**
 * 编辑海报
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const editPoster = data => request.post('/ecservice/ec/festival/poster/edit', data)
