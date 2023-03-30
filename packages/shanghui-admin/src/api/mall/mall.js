import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/ecmall/ec/mall/admin-goods-list',
    method: 'get',
    params
  })
}

// 优惠券绑定商品列表
export function getCouponList(params) {
  return request({
    url: '/ecmall/ec/mall/coupon-goods-list',
    method: 'get',
    params
  })
}

export function getExplodeGoodsList(params) {
  return request({
    url: '/ecmall/api/ec/mall/explodeGoods/listExplodeGoods',
    method: 'get',
    params
  })
}

export function getAllGoodsList(params) {
  return request({
    url: '/ecmall/api/ec/mall/explodeGoods/listAddExplodeGoods',
    method: 'get',
    params
  })
}

export function addExplodeGoods(params) {
  return request({
    url: '/ecmall/api/ec/mall/explodeGoods/addExplodeGoods',
    method: 'post',
    data: params
  })
}

export function deleteExplodeGoods(params) {
  return request({
    url: '/ecmall/api/ec/mall/explodeGoods/deleteExplodeGoods',
    method: 'delete',
    data: params
  })
}

export function updateWeights(params) {
  return request({
    url: '/ecmall/ec/mall/updateWeights',
    method: 'put',
    params
  })
}
