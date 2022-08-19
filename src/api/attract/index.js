import request from '@/utils/request'

// 分页查询招商办信息
export const getPageList = params => request({ url: '/ec/investment-info/page-list', method: 'get', params })
// 新增招商办
export const getInfoAdd = data => request({ url: '/ec/investment-info/add', method: 'post', data })
// 编辑招商办
export const getInfoEdit = data => request({ url: '/ec/investment-info/edit', method: 'post', data })
// 查询招商办详情
export const getInfoDetails = id => request({ url: `/ec/investment-info/details/${id}`, method: 'get' })
// 冻结招商办
export const getInfoFreeze = id => request({ url: `/ec/investment-info/freeze/${id}`, method: 'post' })
// 解冻招商办
export const getInfoUnFreeze = id => request({ url: `/ec/investment-info/unFreeze/${id}`, method: 'post' })
// 查询招商办信息 status 状态 -1全部 0正常 1冻结 
export const getInfoList = params => request({ url: '/ec/investment-info/list', method: 'get', params })



// 查询招商信息列表
export const getinvesInfoList = params => request({ url: '/api/ec/invesInfo/invesInfo-list', method: 'get', params })
// 修改权重
export const getUpdateWeight = params => request({ url: '/api/ec/invesInfo/update-weight', method: 'put', params })
// 发布操作（下线、上线）
export const getPublish = params => request({ url: '/api/ec/invesInfo/publish', method: 'put', params })


// (信息|活动)管理-我收到全部名片
export const getAndTargetId = data => request({ url: '/api/ec/invesCard/getCardListByGovernmentContentAndTargetId', method: 'post', data })
// 查询招商办详情
export const getDetailsByInvesKey = invesKey => request({ url: `/ec/investment-info/detailsByInvesKey/${invesKey}`, method: 'get' })
// 名片详情
export const getIpCardDetail = data => request({ url: `/api/ec/invesCard/ipCardDetail/${data.cardId}`, method: 'post', data: { targetId:data.targetId, type:data.type } })

// 上传文件到对应目录(分享-share, 动态-articleCoverImg,视频封面-video-cover,供需-demand)
export function getFile2name(params,query) {
    return request({
        url: `/ec/upload/file?folder=${query}`,
        method: 'post',
        data:params
    })
}

// 查询活动列表
export const getInvesActivityList = params => request({ url: '/api/ec/invesActivity/activity-list', method: 'get', params })
// 查询活动详情
export const getEcActivity = params => request({ url: '/api/ec/invesActivity/get-activity', method: 'get', params })
// 活动列表修改权重
export const getUpdateActivitySort = params => request({ url: '/api/ec/invesActivity/update-activity-sort', method: 'put', params })
// 创建或编辑活动
export const getActivitySaveV1 = data => request({ url: '/api/ec/invesActivity/activity-save-v1', method: 'post', data })
// 删除活动
export const getDeleteActivity = params => request({ url: '/api/ec/invesActivity/delete-activity', method: 'DELETE', params })
// 修改发布状态
export const getUpdateActivityPublish = params => request({ url: '/api/ec/invesActivity/update-activity-publish', method: 'put', params })