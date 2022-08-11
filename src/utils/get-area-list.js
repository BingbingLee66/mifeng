import { getAreaTree } from '@/api/area'

/**
 * 获取地区列表数据通用方法
 * @param level 嵌套层级 省1、市2、区3
 * @returns {Promise<*[]|*>}
 */
export default async function getAreaList(level) {
  const { data } = await getAreaTree({ level })

  function recursionAreaTree(area) {
    area.forEach(p => {
      if (p.children && p.children.length) {
        recursionAreaTree(p.children)
      } else {
        p.children = undefined
      }
    })

    return area
  }

  return data ? recursionAreaTree(data) : []
}
