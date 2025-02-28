<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Detalles del Producto</ion-title>
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
        <p>Producto no encontrado</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/vue'
import { useScanStore } from '../stores/scanStore'

const route = useRoute()
const scanStore = useScanStore()
const product = ref<any>(null)

onMounted(async () => {
  const code = route.params.code as string
  // Aquí normalmente harías una llamada a la API para obtener los detalles del producto
  // Por ahora, simularemos que obtenemos el producto
  product.value = {
    code: code,
    name: `Producto ${code}`,
    price: `$${Math.floor(Math.random() * 100) + 1}`
  }
  scanStore.setProcessing(false)
})
</script>