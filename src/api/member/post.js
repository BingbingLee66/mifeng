import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/ec/memberPost/list',
    method: 'get',
    params
  })
}

export function getListOfSelect(params) {
  return request({
    url: '/ec/memberPost/list-select',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/ec/memberPost/save',
    method: 'post',
    data: params
  })
}

export function updateStatus(params) {
  return request({
    url: '/ec/memberPost/update-status',
    method: 'put',
    params
  })
}

export function del(params) {
  return request({
    url: '/ec/memberPost/delete',
    method: 'put',
    params
  })
}

export function getMemberOptions(params) {
  return request({
    url: '/ec/memberPost/get-options',
    method: 'get',
    params
  })
}

// 职位唯一性校验
export function postNameExistValid(params) {
  return request({
    url: '/ec/memberPost/post-name-valid',
    method: 'get',
    params
  })
}

// 批量删除会员

export function deleteManyMember(params) {
  return request({
    url: '/ec/member/getNotActiveMemberNum',
    method: 'delete',
    params
  })
}
