<template>
  <ion-page class="h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col">
    <ion-header class="ion-no-border bg-transparent">
      <ion-toolbar class="bg-white/80 backdrop-blur-sm shadow-sm px-3 py-1">
        <div slot="start" class="rounded-xl overflow-hidden flex-shrink-0">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-AIeF9eqkpixXd01gW0AfihCSEF9lSy.png" 
            alt="Logo" 
            class="w-12 h-12 object-contain"
          />
        </div>
        
        <ion-buttons slot="end">
          <ion-button 
            @click="openConfigModal" 
            class="p-1.5 rounded-full hover:bg-blue-100 transition-colors"
          >
            <img 
              src="../assets/iconsajustes.png" 
              alt="Ajustes" 
              class="w-12 h-12"
            />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-no-padding">
      <div class="h-full flex flex-col justify-between p-3">
        <div class="w-full flex-grow flex items-center justify-center mb-3">
          <div class="w-full max-w-4xl relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse"></div>
            <div class="relative bg-black rounded-2xl shadow-xl overflow-hidden" style="height: calc(100vh - 180px);">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-8CUxOayMLOY1Gg5LhbGkE0e1Ay0Akb.gif" 
                alt="Dispositivos" 
                class="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
        
        <div class="flex flex-col items-center gap-2">
          <div class="flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-lg border border-blue-100">
            <div class="relative">
              <div class="absolute -inset-0.5 bg-blue-500 rounded-full blur opacity-40 animate-pulse"></div>
              <div class="relative bg-gradient-to-br from-blue-500 to-blue-700 p-1.5 rounded-full">
                <img 
                  src="../assets/codescan.png" 
                  alt="Escanear" 
                  class="w-8 h-8"
                />
              </div>
            </div>
            <p class="text-blue-800 font-semibold text-base">Acerque un producto al escáner</p>
          </div>

          <div class="flex space-x-2 mb-1">
            <span class="animate-pulse inline-block w-2.5 h-2.5 bg-blue-400 rounded-full"></span>
            <span class="animate-pulse inline-block w-2.5 h-2.5 bg-blue-500 rounded-full delay-150"></span>
            <span class="animate-pulse inline-block w-2.5 h-2.5 bg-blue-600 rounded-full delay-300"></span>
          </div>
        </div>
      </div>
    </ion-content>

    <product-modal @open="onProductModalOpen"></product-modal>
    <config-modal 
      :is-open="isConfigModalOpen"
      @close="closeConfigModal"
      @saved="onConfigSaved"
    ></config-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IonPage, IonContent, IonHeader, IonToolbar, IonButton, IonButtons } from '@ionic/vue'
import { useScanStore } from '@/stores/scanStore'
import { useConfigStore } from '@/stores/configStore'
import { useProductQuery } from '@/hooks/useProductQuery'
import ProductModal from '@/components/ProductModal.vue'
import ConfigModal from '@/components/ConfigModal.vue'
import { setTenant } from '@/services/api'

const scanStore = useScanStore()
const configStore = useConfigStore()
const { fetchProduct } = useProductQuery()
const isConfigModalOpen = ref(false)

const handleKeyDown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    const code = scanStore.getBuffer()
    console.log('Código escaneado:', code);
    if (code) {
      if (isConfigModalOpen.value) {
        closeConfigModal()
      }
      scanStore.openModal(code)
      try {
        await fetchProduct(code)
      } catch (error) {
        console.error('Error al buscar el producto:', error)
      }
      scanStore.clearBuffer()
    }
  } else {
    scanStore.addToBuffer(event.key)
  }
}

const openConfigModal = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  isConfigModalOpen.value = true
}

const closeConfigModal = () => {
  isConfigModalOpen.value = false
}

const onProductModalOpen = () => {
  if (isConfigModalOpen.value) {
    closeConfigModal()
  }
}

const onConfigSaved = () => {
  setTenant(configStore.ruc)
  isConfigModalOpen.value = false
}

onMounted(() => {
  if (!configStore.isConfigured) {
    isConfigModalOpen.value = true
  } else {
    setTenant(configStore.ruc)
  }
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.logo-container {
  width: 3rem;
  height: 3rem;
}

.logo-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>

