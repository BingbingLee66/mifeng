/**
 * 将数组转对象
 * @param {*} data
 */
function conversionObj(data) {
  let obj = {}
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item.value !== undefined || item.value !== null) {
        obj[item.value] = item.label
      }
    })
  }
  return obj
}
// 入驻来源
export const inSource = [
  { label: '小程序', value: 1 },
  { label: '后台录入', value: 2 },
  { label: '小程序名录', value: 3 },
  { label: 'app', value: 4 },
  { label: 'APP名录', value: 5 },
]
export const inSourceObj = conversionObj(inSource)
// 入驻状态
export const inState = [
  { label: '已认证', value: 1 },
  { label: '待入驻', value: 0 },
]
export const inStateObj = conversionObj(inState)
// 数据来源
export const dataSource = [
  { label: '页面录入', value: 1 },
  { label: '导入', value: 2 },
  { label: '抓取', value: 3 },
]
export const dataSourceObj = conversionObj(dataSource)
// 组织状态
export const organizationState = [
  { label: '正常', value: 1 },
  { label: '注销', value: 4 },
  { label: '撤销', value: 5 },
]
export const orgStateObj = conversionObj(organizationState)
// 	组织类型
export const organizationType = [
  { label: '社会团体', value: 1 },
  { label: '民办非企业单位', value: 2 },
  { label: '基金会', value: 3 },
]
export const orgTypeObj = conversionObj(organizationType)
// 组织标识
export const organizationMarker = [
  { label: '行业协会商会', value: 1 },
  { label: '志愿服务组织', value: 2 },
  { label: '慈善组织', value: 3 },
  { label: '公开募捐资格', value: 4 },
]
export const orgMarkerObj = conversionObj(organizationMarker)
// 信用状态
export const codestatusOptions = [
  { label: '正常', value: 0 },
  { label: '活动异常', value: 1 },
  { label: '严重违法失信', value: 2 },
]
export const orgStatusOptions = conversionObj(codestatusOptions)
