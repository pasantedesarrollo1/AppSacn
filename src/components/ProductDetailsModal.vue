<template>
    <ion-modal :is-open="scanStore.isModalOpen">
      <ion-header>
        <ion-toolbar>
          <ion-title>Detalles del Producto</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">Cerrar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div v-if="product">
          <h2>{{ product.name }}</h2>
          <p>Código: {{ product.code }}</p>
          <p>Precio: {{ product.price }}</p>
          <!-- Agrega más detalles del producto aquí -->
        </div>
        <div v-else>
          <p>Cargando detalles del producto...</p>
        </div>
      </ion-content>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton } from '@ionic/vue'
  import { useScanStore } from '../stores/scanStore'
  
  const scanStore = useScanStore()
  const product = ref<any>(null)
  
  const closeModal = () => {
    scanStore.closeModal()
    scanStore.setProcessing(false)
  }
  
  const fetchProductDetails = async (code: string) => {
    // Simular una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      code: code,
      name: `Producto ${code}`,
      price: `$${Math.floor(Math.random() * 100) + 1}`
    }
  }
  
  watch(() => scanStore.currentProductCode, async (newCode) => {
    if (newCode) {
      product.value = null // Resetear el producto mientras se carga
      product.value = await fetchProductDetails(newCode)
    }
  })
  </script>