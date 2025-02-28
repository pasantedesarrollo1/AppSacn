<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="flex flex-col items-center justify-center h-full">
        <h1 class="text-2xl font-bold mb-4">Escáner de Productos</h1>
        <p class="mb-8 text-center">Escanee un código de barras o ingrese el código manualmente</p>
        <input
          ref="scanInput"
          v-model="manualCode"
          @keyup.enter="processManualCode"
          class="w-64 p-2 mb-4 border rounded"
          placeholder="Ingrese código manualmente"
        />
        <p class="text-sm text-gray-500">Código actual: {{ currentCode }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useScanStore } from '../stores/scanStore'

const router = useRouter()
const scanStore = useScanStore()
const scanInput = ref<HTMLInputElement | null>(null)
const manualCode = ref('')
const currentCode = ref('')

const processCode = (code: string) => {
  if (code && !scanStore.isProcessing) {
    scanStore.setProcessing(true)
    router.push(`/product/${code}`)
    scanStore.clearBuffer()
    manualCode.value = ''
  }
}

const processManualCode = () => {
  processCode(manualCode.value)
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    const code = scanStore.getBuffer()
    if (code) {
      processCode(code)
    }
  } else {
    scanStore.addToBuffer(event.key)
    currentCode.value = scanStore.getBuffer()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  scanInput.value?.focus()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>