import request from '@/utils/request'
const baseUrl = '/ecmall'

export function getChamberFinanceData(params) {
  return request({
    url: baseUrl + '/ec/mall/chamber-finance-data',
    method: 'get',
    params
  })
}

export function getChamberFinanceDayData(params) {
  return request({
    url: baseUrl + '/ec/mall/chamber-finance-day-data',
    method: 'get',
    params
  })
}

export function getChamberFinanceShopThisMonth(params) {
  return request({
    url: baseUrl + '/ec/mall/chamber-finance-shop-thisMonth',
    method: 'get',
    params
  })
}

export function getChamberFinanceShopDay(params) {
  return request({
    url: baseUrl + '/ec/mall/chamber-finance-shop-day',
    method: 'get',
    params
  })
}

export function getSupplierSettlementList(params) {
  return request({
    url: baseUrl + '/ec/mall/settlement-summary-list',
    method: 'get',
    params
  })
}

export function updateSupplierSettlement(params) {
  return request({
    url: baseUrl + '/ec/mall/update-supplier-settlement',
    method: 'post',
    data: params
  })
}

export function getChamberFinanceMemberThisMonth(params) {
  return request({
    url: baseUrl + '/ec/mall/chamber-finance-member-thisMonth',
    method: 'get',
    data: params
  })
}

export function getChamberFinanceMemberDay(params) {
  return request({
    url: baseUrl + '/ec/mall/chamber-finance-member-day',
    method: 'get',
    params
  })
}

export function getChamberFinanceMemberFeeList(params) {
  return request({
    url: baseUrl + '/ec/mall/chamber-member-fee-list',
    method: 'get',
    params
  })
}

export function getChamberFinanceWithdraw(params) {
  return request({
    url: baseUrl + '/ec/mall/chamber-finance-withdraw',
    method: 'get',
    params
  })
}

export function applyWithdrawalAdd(params) {
  return request({
    url: baseUrl + '/ec/mall/apply-withdrawal-add',
    method: 'post',
    data: params
  })
}

export function getBank() {
  return request({
    url: baseUrl + '/ec/mall/get-bank',
    method: 'get'
  })
}

export function updateBank(params) {
  return request({
    url: baseUrl + '/ec/mall/update-bank',
    method: 'post',
    data: params
  })
}

export function getPlatformFinanceData(params) {
  return request({
    url: baseUrl + '/ec/mall/platfrom-finance-data',
    method: 'get',
    params
  })
}

export function getPlatformFinanceDayData(params) {
  return request({
    url: baseUrl + '/ec/mall/platfrom-finance-day-data',
    method: 'get',
    params
  })
}

export function getPlatformFinanceWithdraw(params) {
  return request({
    url: baseUrl + '/ec/mall/platfrom-finance-withdraw',
    method: 'get',
    params
  })
}

export function getPlatformFinanceChamber(params) {
  return request({
    url: baseUrl + '/ec/mall/platfrom-finance-chamber',
    method: 'get',
    params
  })
}

export function getPlatformFinanceDataByCkey(params) {
  return request({
    url: baseUrl + '/ec/mall/platfrom-finance-data-byCkey',
    method: 'get',
    params
  })
}

export function getPlatformFinanceShopByCkey(params) {
  return request({
    url: baseUrl + '/ec/mall/platfrom-finance-shop-byCkey',
    method: 'get',
    params
  })
}

export function getPlatformFinanceMemberByCkey(params) {
  return request({
    url: baseUrl + '/ec/mall/platfrom-finance-member-byCkey',
    method: 'get',
    params
  })
}

export function getPlatformFinanceWithdrawByCkey(params) {
  return request({
    url: baseUrl + '/ec/mall/platfrom-finance-withdraw-byCkey',
    method: 'get',
    params
  })
}

export function getChamberOptions() {
  return request({
    url: baseUrl + '/ec/mall/get-chamber-options',
    method: 'get'
  })
}

export function getPlatformFinanceWithdrawList(params) {
  return request({
    url: baseUrl + '/ec/mall/platfrom-finance-withdraw-list',
    method: 'get',
    params
  })
}

export function applyWithdrawalReject(params) {
  return request({
    url: baseUrl + '/ec/mall/apply-withdrawal-reject',
    method: 'post',
    data: params
  })
}

export function applyWithdrawalConfirm(params) {
  return request({
    url: baseUrl + '/ec/mall/apply-withdrawal-confirm',
    method: 'post',
    data: params
  })
}

// 查询结算单详情信息
export function getSettlementOrderDetailMsg(id) {
  return request({
    url: baseUrl + `/ec/mall/settlement-summary-detail/${id}`,
    method: 'get'
  })
}

// 查询结算单详情列表
export function getSettlementOrderDetailList(params) {
  return request({
    url: baseUrl + '/ec/mall/settlement-order-list',
    method: 'get',
    params
  })
}

// 商会/总后台-申请财务付款或标记为已付款
export function changeSettlementStatus(params) {
  return request({
    url: baseUrl + '/ec/mall/settlement-status',
    method: 'post',
    data: params
  })
}

// 查询订单列表
export function getOrderList(params) {
  return request({
    url: baseUrl + '/ec/mall/supply-paid-order-list',
    method: 'get',
    params
  })
}

// 商会后台-结算单详情-移除订单
export function removeOrder(id) {
  return request({
    url: baseUrl + `/ec/mall/settlement-order-del/${id}`,
    method: 'delete'
  })
}
// 商会后台-结算单详情-添加订单
export function addOrder(params) {
  return request({
    url: baseUrl + '/ec/mall/settlement-order-add',
    method: 'put',
    data: params
  })
}
// 查询结算单是否有订单
export function getOrderCount(id) {
  return request({
    url: baseUrl + '/ec/mall/check-settlement-order-count?id=' + id,
    method: 'get'
  })
}
