import { ref } from 'vue'
import { getAreaTree } from '@/api/area'
export function useGetCityLabel() {
  const cityDataMap = ref(new Map([]))
  const allAreaList = ref([])

  const getCityData = async level => {
    try {
      const cityMap = new Map([])
      const { data } = await getAreaTree({ level })

      function recursionAreaTree(area) {
        area.forEach(p => {
          if (p.children && p.children.length) {
            recursionAreaTree(p.children)
          }

          if (!cityMap.get(`${p.code}`)) {
            cityMap.set(`${p.code}`, p)
          }
        })

        return area
      }

      allAreaList.value = data ? recursionAreaTree(data) : []

      cityDataMap.value = cityMap
    } catch (e) {
      console.log(e)
    }
  }

  return {
    cityDataMap,
    allAreaList,
    getCityData
  }
}
