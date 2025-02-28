import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScanStore = defineStore('scan', () => {
  const scanBuffer = ref('')
  const isModalOpen = ref(false)
  const currentProductCode = ref('')
  const lastScanTime = ref(0)
  const SCAN_TIMEOUT = 100 // Ajustable según la velocidad del escáner
  const modalTimer = ref<number | null>(null)

  function addToBuffer(char: string) {
    const now = Date.now()
    if (now - lastScanTime.value > SCAN_TIMEOUT) {
      scanBuffer.value = ''
    }
    scanBuffer.value += char
    lastScanTime.value = now
  }

  function clearBuffer() {
    scanBuffer.value = ''
    lastScanTime.value = 0
  }

  function getBuffer() {
    return scanBuffer.value
  }

  function openModal(code: string) {
    currentProductCode.value = code
    isModalOpen.value = true
    resetModalTimer()
  }

  function closeModal() {
    isModalOpen.value = false
    currentProductCode.value = ''
    if (modalTimer.value) {
      clearTimeout(modalTimer.value)
      modalTimer.value = null
    }
  }

  function resetModalTimer() {
    if (modalTimer.value) {
      clearTimeout(modalTimer.value)
    }
    // Aumentar el tiempo a 20 segundos para dar más margen
    // modalTimer.value = setTimeout(closeModal, 20000) 
    // Comentado el temporizador automático para evitar cierre prematuro
    console.log('Temporizador del modal reiniciado');
  }

  return {
    isModalOpen,
    currentProductCode,
    addToBuffer,
    clearBuffer,
    getBuffer,
    openModal,
    closeModal,
    resetModalTimer
  }
})