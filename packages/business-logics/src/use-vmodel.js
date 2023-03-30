import { computed, getCurrentInstance } from 'vue'

export default function useVModel(props, name) {
  const emit = getCurrentInstance()?.emit
  return computed({
    get() {
      return props[name]
    },
    set(v) {
      emit && emit(`update:${name}`, v)
    }
  })
}
