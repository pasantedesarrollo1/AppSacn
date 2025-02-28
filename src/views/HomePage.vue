<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="full-screen-gif">
        <img src="@/assets/download.gif" alt="Verificador de Precios" />
      </div>
    </ion-content>
    <product-modal></product-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import { useScanStore } from '@/stores/scanStore'
import { useProductQuery } from '@/hooks/useProductQuery'
import ProductModal from '@/components/ProductModal.vue'

const scanStore = useScanStore()
const { fetchProduct } = useProductQuery()

const handleKeyDown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    const code = scanStore.getBuffer()
    console.log('Código escaneado:', code);
    if (code) {
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

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.full-screen-gif {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>