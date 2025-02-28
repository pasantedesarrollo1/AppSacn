<template>
  <ion-modal :is-open="scanStore.isModalOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>Detalles del Producto</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div v-if="productQuery.isLoading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Cargando detalles del producto...</p>
      </div>
      <div v-else-if="productQuery.isError" class="error-container">
        <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
        <p>Error al cargar el producto. Producto no encontrado o código inválido.</p>
      </div>
      <div v-else-if="productQuery.data" class="product-details">
        <h2>{{ productQuery.data.name }}</h2>
        <p>Código: {{ productQuery.data.code }}</p>
        <p class="price">Precio: ${{ (productQuery.data.price / 100).toFixed(2) }}</p>
        <p>Categoría: {{ productQuery.data.category }}</p>
        <p>Stock: {{ productQuery.data.stock }}</p>
        <p>Ubicación: {{ productQuery.data.location }}</p>
        <p>{{ productQuery.data.description }}</p>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonIcon } from '@ionic/vue'
import { alertCircleOutline } from 'ionicons/icons'
import { useScanStore } from '@/stores/scanStore'
import { useProductQuery } from '@/hooks/useProductQuery'
import { watch, onMounted, onUnmounted } from 'vue'

const scanStore = useScanStore()
const { productQuery } = useProductQuery()

watch(() => productQuery.data, (newData) => {
  console.log('Datos del producto actualizados:', newData);
  if (newData) {
    scanStore.resetModalTimer();
  }
})

watch(() => scanStore.isModalOpen, (isOpen) => {
  console.log('Estado del modal:', isOpen ? 'abierto' : 'cerrado');
})

onMounted(() => {
  console.log('ProductModal montado');
})

onUnmounted(() => {
  console.log('ProductModal desmontado');
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