<template>
  <ion-page class="bg-gradient-to-br from-blue-900 to-black overflow-hidden">
    <!-- Header with logo and settings -->
    <ion-header class="ion-no-border bg-transparent">
      <ion-toolbar class="bg-transparent px-6 py-4">
        <!-- Logo on the left -->
        <div slot="start" class="flex items-center">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-8MCEmzr2B4jGYomAUIvyfmO7QjiDyr.png" 
            alt="4u Logo" 
            class="w-16 h-16 rounded-2xl shadow-lg border-2 border-white/20" 
          />

        </div>
        
        <!-- Settings button on the right -->
        <ion-buttons slot="end">
          <ion-button 
            @click="openConfigModal" 
            class="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 rounded-full shadow-lg w-16 h-16 flex items-center justify-center transition-all duration-300 ease-in-out"
          >
            <ion-icon :icon="settingsOutline" class="text-3xl"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Main content -->
    <ion-content class="ion-padding flex items-center justify-center">
      <div class="gif-container rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-TVzHisrYubJQfEL42aPxweWIFXwkIZ.gif" 
          alt="EVOLUCAO SISTEMA en múltiples dispositivos" 
          class="gif-image"
        />
      </div>
    </ion-content>

    <product-modal @open="onProductModalOpen"></product-modal>
    <config-modal :is-open="isConfigModalOpen" @close="closeConfigModal"></config-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { IonPage, IonContent, IonHeader, IonToolbar, IonButton, IonIcon, IonButtons } from '@ionic/vue'
import { settingsOutline } from 'ionicons/icons'
import { useScanStore } from '@/stores/scanStore'
import { useProductQuery } from '@/hooks/useProductQuery'
import ProductModal from '@/components/ProductModal.vue'
import ConfigModal from '@/components/ConfigModal.vue'

const scanStore = useScanStore()
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

watch(() => scanStore.isModalOpen, (isOpen) => {
  if (isOpen && isConfigModalOpen.value) {
    closeConfigModal()
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
ion-toolbar {
  --padding-top: 1rem;
  --padding-bottom: 1rem;
}

ion-button::part(native) {
  padding: 0;
}

.gif-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 90vw;
  max-height: calc(100vh - 120px); /* Ajustado para el nuevo tamaño del header */
}

.gif-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>