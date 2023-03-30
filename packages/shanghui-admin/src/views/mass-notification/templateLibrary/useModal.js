const { ref } = require('vue')

export const useModal = ({ fetch }) => {
  const visible = ref(false)

  const openModalHandler = async record => {
    await fetch(record)
    visible.value = true
  }

  const closeHandler = () => {
    visible.value = false
  }

  return {
    visible,
    openModalHandler,
    closeHandler
  }
}
