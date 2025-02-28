import { onMounted, onUnmounted, ref } from 'vue'

export function useResourceOptimizer() {
  const isLowPowerMode = ref(false)
  const isBackgroundMode = ref(false)
  const inactivityTimer = ref<number | null>(null)
  
  const checkLowPowerMode = async (): Promise<boolean> => {
    try {
      const battery: any = await (navigator as any).getBattery?.()
      isLowPowerMode.value = battery.level < 0.2
      return isLowPowerMode.value
    } catch {
      return false
    }
  }
  
  const releaseResources = () => {
    isBackgroundMode.value = true
  }
  
  const restoreResources = () => {
    isBackgroundMode.value = false
    resetInactivityTimer()
  }
  
  const resetInactivityTimer = () => {
    if (inactivityTimer.value) {
      clearTimeout(inactivityTimer.value)
    }
    inactivityTimer.value = window.setTimeout(() => {
      releaseResources()
    }, 60000)
  }
  
  const optimizeImage = (url: string, width: number = 300): string => {
    if (url.includes('placeholder.svg')) {
      return url
    }
    
    if (url.startsWith('http')) {
      return `${url}${url.includes('?') ? '&' : '?'}width=${width}&quality=${isLowPowerMode.value ? 70 : 85}`
    }
    
    return url
  }
  
  const handleVisibilityChange = () => {
    if (document.hidden) {
      releaseResources()
    } else {
      restoreResources()
    }
  }
  
  const handleUserActivity = () => {
    if (isBackgroundMode.value) {
      restoreResources()
    } else {
      resetInactivityTimer()
    }
  }
  
  onMounted(() => {
    checkLowPowerMode()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('touchstart', handleUserActivity)
    document.addEventListener('mousemove', handleUserActivity)
    resetInactivityTimer()
  })
  
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    document.removeEventListener('touchstart', handleUserActivity)
    document.removeEventListener('mousemove', handleUserActivity)
    if (inactivityTimer.value) {
      clearTimeout(inactivityTimer.value)
    }
  })
  
  return {
    isLowPowerMode,
    isBackgroundMode,
    optimizeImage,
    releaseResources,
    restoreResources
  }
}