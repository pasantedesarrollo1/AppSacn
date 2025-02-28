<template>
  <ion-page>
    <div class="relative w-full h-full flex justify-center items-center bg-black">
      <!-- Pantalla de guardapantallas (GIF) -->
      <div class="absolute inset-0 flex justify-center items-center z-10">
        <img src="https://www.educaciontrespuntocero.com/wp-content/uploads/2019/06/homer.gif" alt="Screensaver" class="max-w-full max-h-full object-contain" />
      </div>
      
      <!-- Input invisible pero funcional para capturar el código de barras -->
      <input
        ref="barcodeInput"
        type="text"
        v-model="barcodeValue"
        @input="handleBarcodeInput"
        class="absolute opacity-[0.01] w-px h-px z-20 border-none bg-transparent text-transparent pointer-events-auto"
        autocomplete="off"
        autofocus
      />
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { IonPage } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useResourceOptimizer } from '../composables/useResourceOptimizer'

const router = useRouter()
const barcodeInput = ref<HTMLInputElement | null>(null)
const barcodeValue = ref('')
const isProcessing = ref(false)
const inputTimeout = ref<number | null>(null)
const { releaseResources, restoreResources } = useResourceOptimizer()

const handleBarcodeInput = () => {
  if (inputTimeout.value) {
    clearTimeout(inputTimeout.value)
  }
  
  inputTimeout.value = window.setTimeout(() => {
    if (barcodeValue.value && !isProcessing.value) {
      processBarcode(barcodeValue.value)
    }
  }, 100)
}

const processBarcode = (code: string) => {
  if (isProcessing.value || !code) return
  
  isProcessing.value = true
  
  router.push(`/product/${code}`)
  
  barcodeValue.value = ''
  
  setTimeout(() => {
    router.push('/home')
    isProcessing.value = false
    focusInput()
  }, 5000)
}

const focusInput = () => {
  setTimeout(() => {
    if (barcodeInput.value) {
      barcodeInput.value.focus()
    }
  }, 100)
}

watch(() => router.currentRoute.value.path, (newPath) => {
  if (newPath === '/home') {
    isProcessing.value = false
    barcodeValue.value = ''
    focusInput()
  }
})

onMounted(() => {
  focusInput()
  document.addEventListener('click', focusInput)
  restoreResources()
})

onUnmounted(() => {
  document.removeEventListener('click', focusInput)
  if (inputTimeout.value) {
    clearTimeout(inputTimeout.value)
  }
  releaseResources()
})
</script>