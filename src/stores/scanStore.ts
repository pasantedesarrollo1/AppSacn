import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScanStore = defineStore('scan', () => {
  const scanBuffer = ref('')
  const isProcessing = ref(false)
  const lastScanTime = ref(0)
  const SCAN_TIMEOUT = 100 // Ajustable según la velocidad del escáner

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
    isProcessing.value = false
    lastScanTime.value = 0
  }

  function setProcessing(value: boolean) {
    isProcessing.value = value
  }

  function getBuffer() {
    return scanBuffer.value
  }

  return {
    isProcessing,
    addToBuffer,
    clearBuffer,
    setProcessing,
    getBuffer
  }
})