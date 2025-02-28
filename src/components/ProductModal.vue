<template>
  <ion-modal :is-open="scanStore.isModalOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>Detalles del Producto</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="scanStore.closeModal()">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div v-if="isLoading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Cargando detalles del producto...</p>
      </div>
      <div v-else-if="error" class="error-container">
        <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
        <p>Error al cargar el producto. {{ error }}</p>
      </div>
      <div v-else-if="product" class="product-details">
        <h2>{{ product.name }}</h2>
        <p>Código: {{ product.code }}</p>
        <p class="price">Precio: ${{ (product.price / 100).toFixed(2) }}</p>
        <p>Categoría: {{ product.category }}</p>
        <p>Stock: {{ product.stock }}</p>
        <p>Ubicación: {{ product.location }}</p>
        <p>{{ product.description }}</p>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonIcon, IonButtons, IonButton } from '@ionic/vue'
import { alertCircleOutline, closeOutline } from 'ionicons/icons'
import { useScanStore } from '@/stores/scanStore'
import { useProductQuery } from '@/hooks/useProductQuery'
import { watch, onMounted, onUnmounted, ref } from 'vue'

const scanStore = useScanStore()
const { productQuery } = useProductQuery()

const isLoading = ref(false)
const error = ref(null)
const product = ref(null)

watch(() => scanStore.currentProductCode, async (newCode) => {
  if (newCode) {
    isLoading.value = true
    error.value = null
    product.value = null
    try {
      const result = await productQuery.refetch()
      product.value = result.data
    } catch (err) {
      error.value = err.message || 'Error al cargar el producto'
    } finally {
      isLoading.value = false
    }
  }
})

watch(() => scanStore.isModalOpen, (isOpen) => {
  console.log('Estado del modal:', isOpen ? 'abierto' : 'cerrado')
  if (!isOpen) {
    // Limpiar datos cuando se cierra el modal
    product.value = null
    error.value = null
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
.loading-container, .error-container, .product-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  color: var(--ion-color-danger);
}

.price {
  font-size: 1.5em;
  font-weight: bold;
  color: var(--ion-color-primary);
}
</style>