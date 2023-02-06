import { reactive, toRefs } from 'vue'

export function useInputModal({ handleOk: _handleOk = async () => undefined, ...extension } = {}) {
  const inputModal = reactive({
    visible: false,
    defaultValue: '',
    confirmLoading: false,
    ...extension
  })

  let payload
  function openInputModal({ visible = true, defaultValue = '', payload: _payload } = {}) {
    inputModal.visible = visible
    inputModal.defaultValue = defaultValue
    payload = _payload
  }

  async function handleOk(value) {
    inputModal.confirmLoading = true
    try {
      await _handleOk(value, payload)
      inputModal.visible = false
    } finally {
      inputModal.confirmLoading = false
    }
  }
  return {
    openInputModal,
    handleOk,
    ...toRefs(inputModal)
  }
}
