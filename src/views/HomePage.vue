<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Escáner de Productos</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="flex flex-col items-center justify-center h-full">
        <h1 class="text-2xl font-bold mb-4">Escáner de Productos Modal</h1>
        <p class="mb-8 text-center">Escanee un código de barras o ingrese el código manualmente</p>
        <ion-input
          v-model="manualCode"
          placeholder="Ingrese código manualmente"
          @keyup.enter="processManualCode"
          class="mb-4"
        ></ion-input>
        <ion-button @click="processManualCode">Buscar Producto</ion-button>
        <p class="text-sm text-gray-500 mt-4">Código actual: {{ currentCode }}</p>
      </div>
    </ion-content>
    <product-details-modal></product-details-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/vue'
import { useScanStore } from '../stores/scanStore'
import ProductDetailsModal from '../components/ProductDetailsModal.vue'

const scanStore = useScanStore()
const manualCode = ref('')
const currentCode = ref('')

const processCode = (code: string) => {
  if (code && !scanStore.isProcessing) {
    scanStore.setProcessing(true)
    scanStore.openModal(code)
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
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>