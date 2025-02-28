<template>
    <ion-page>
      <ion-content>
        <Suspense>
          <template #default>
            <product-details :code="code" />
          </template>
          <template #fallback>
            <div class="flex flex-col justify-center items-center h-full p-5">
              <ion-spinner name="crescent"></ion-spinner>
              <p class="mt-4 text-gray-600">Cargando información del producto...</p>
            </div>
          </template>
        </Suspense>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonContent, IonSpinner } from '@ionic/vue'
  import ProductDetails from '../components/ProductDetails.vue'
  
  const props = defineProps<{
    code: string
  }>()
  </script>