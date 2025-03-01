<template>
  <ion-modal :is-open="scanStore.isModalOpen" class="product-modal">
    <div class="h-screen w-full bg-gradient-to-br from-blue-100 via-white to-yellow-100 p-4 flex flex-col font-sans">
      <!-- Barra superior con el nombre del producto -->
      <div class="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg mb-4">
        <h1 class="text-xl md:text-2xl lg:text-3xl font-bold text-center tracking-wide">
          {{ product?.name || 'Cargando...' }}
        </h1>
      </div>

      <div class="flex flex-1 w-full max-w-5xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl">
        <!-- Imagen del producto - Lado izquierdo -->
        <div class="w-1/2 relative bg-gradient-to-br from-blue-50 to-white border-r border-gray-200">
          <img
            v-if="!isLoading && !error"
            :src="productImage"
            :alt="product?.name"
            class="absolute inset-0 w-full h-full object-contain p-4"
          />
          <div v-else-if="isLoading" class="absolute inset-0 flex items-center justify-center">
            <ion-spinner name="crescent"></ion-spinner>
          </div>
          <div v-else-if="error" class="absolute inset-0 flex items-center justify-center">
            <ion-icon :icon="alertCircleOutline" class="text-6xl text-red-500"></ion-icon>
          </div>
        </div>

        <!-- Información del producto - Lado derecho -->
        <div class="w-1/2 flex flex-col justify-between p-6 bg-gradient-to-br from-white to-blue-50">
          <div class="space-y-6" v-if="!isLoading && !error">
            <h2 class="text-3xl font-bold text-blue-800 pb-2 border-b-2 border-blue-200">Promociones Especiales</h2>
            
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-5 rounded-lg text-white shadow-lg">
              <div class="flex items-center justify-between">
                <div class="space-y-2">
                  <span class="text-5xl font-extrabold tracking-tight">${{ product?.price.toFixed(2) }}</span>
                  <div class="flex items-center">
                    <span class="text-xl text-blue-200 line-through mr-3 font-light">${{ (product?.price * 1.15).toFixed(2) }}</span>
                    <div class="bg-yellow-400 text-blue-800 px-3 py-1 rounded-full flex items-center">
                      <ion-icon :icon="pricetagOutline" class="w-4 h-4 mr-1"></ion-icon>
                      <span class="font-bold text-sm">15% OFF</span>
                    </div>
                  </div>
                </div>
                <div class="bg-white text-blue-600 p-3 rounded-full">
                  <ion-icon :icon="pricetagsOutline" class="w-10 h-10"></ion-icon>
                </div>
              </div>
            </div>
            
            <div class="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg shadow-md">
              <div class="flex items-center">
                <ion-icon :icon="timeOutline" class="w-8 h-8 text-yellow-600 mr-3"></ion-icon>
                <div>
                  <p class="text-yellow-800 font-bold text-lg leading-tight">¡Oferta por tiempo limitado!</p>
                  <p class="text-yellow-700 text-sm mt-1">Aprovecha este precio especial ahora.</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="isLoading" class="flex items-center justify-center h-full">
            <p>Cargando detalles del producto...</p>
          </div>
          <div v-else-if="error" class="flex items-center justify-center h-full">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonSpinner, IonIcon } from '@ionic/vue'
import { alertCircleOutline, pricetagOutline, pricetagsOutline, timeOutline } from 'ionicons/icons'
import { useScanStore } from '@/stores/scanStore'
import { useProductQuery } from '@/hooks/useProductQuery'
import { watch, onMounted, onUnmounted, ref, computed } from 'vue'

const scanStore = useScanStore()
const { fetchProduct } = useProductQuery()

const emit = defineEmits(['open'])

const isLoading = ref(false)
const error = ref<string | null>(null)
const product = ref<any>(null)

const productImage = computed(() => {
  if (product.value && product.value.images && product.value.images.length > 0) {
    return product.value.images[0].thumbnail_full_path
  }
  return 'https://via.placeholder.com/300'
})

watch(() => scanStore.currentProductCode, async (newCode) => {
  if (newCode) {
    console.log('Nuevo código escaneado:', newCode)
    isLoading.value = true
    error.value = null
    product.value = null
    try {
      const result = await fetchProduct(newCode)
      product.value = result
      console.log('Producto cargado:', product.value)
    } catch (err: any) {
      console.error('Error capturado:', err.message)
      error.value = err.message === 'Producto no disponible' 
        ? 'Producto no disponible' 
        : 'Error al cargar el producto'
      console.log('Error establecido:', error.value)
    } finally {
      isLoading.value = false
    }
    scanStore.resetModalTimer()
  }
})

watch(() => scanStore.isModalOpen, (isOpen) => {
  console.log('Estado del modal:', isOpen ? 'abierto' : 'cerrado')
  if (isOpen) {
    emit('open')
  }
  if (!isOpen) {
    setTimeout(() => {
      product.value = null
      error.value = null
      isLoading.value = false
    }, 300)
  }
})

onMounted(() => {
  console.log('ProductModal montado')
})

onUnmounted(() => {
  console.log('ProductModal desmontado')
})
</script>

<style scoped>
.product-modal::part(content) {
  width: 100%;
  height: 100%;
  --background: transparent;
}
</style>