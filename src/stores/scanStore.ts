import { defineStore } from "pinia"
import { ref } from "vue"

export const useScanStore = defineStore("scan", () => {
  const scanBuffer = ref("")
  const isModalOpen = ref(false)
  const currentProductCode = ref("")
  const lastScanTime = ref(0)
  const SCAN_TIMEOUT = 100 // Ajustable según la velocidad del escáner
  const modalTimer = ref<number | null>(null)
  const modalTimeout = ref(parseInt(localStorage.getItem('product_display_time') || '5', 10) * 1000)

  function addToBuffer(char: string) {
    const now = Date.now()
    if (now - lastScanTime.value > SCAN_TIMEOUT) {
      scanBuffer.value = ""
    }
    scanBuffer.value += char
    lastScanTime.value = now
  }

  function clearBuffer() {
    scanBuffer.value = ""
    lastScanTime.value = 0
  }

  function getBuffer() {
    return scanBuffer.value
  }

  function openModal(code: string) {
    currentProductCode.value = code
    isModalOpen.value = true
    resetModalTimer()
    console.log("Modal abierto con código:", code)
  }

  function closeModal() {
    isModalOpen.value = false
    currentProductCode.value = ""
    if (modalTimer.value) {
      clearTimeout(modalTimer.value)
      modalTimer.value = null
    }
    console.log("Modal cerrado")
  }

  function resetModalTimer() {
    if (modalTimer.value) {
      clearTimeout(modalTimer.value)
    }
    modalTimer.value = setTimeout(closeModal, modalTimeout.value) // Usa el tiempo configurable
    console.log(`Temporizador del modal reiniciado con ${modalTimeout.value/1000} segundos`)
  }

  function setModalTimeout(timeout: number) {
    modalTimeout.value = timeout
    console.log(`Tiempo del modal establecido a ${timeout/1000} segundos`)
  }

  return {
    isModalOpen,
    currentProductCode,
    modalTimer,
    modalTimeout,
    addToBuffer,
    clearBuffer,
    getBuffer,
    openModal,
    closeModal,
    resetModalTimer,
    setModalTimeout,
  }
})