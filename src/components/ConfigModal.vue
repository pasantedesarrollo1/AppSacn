<template>
    <ion-modal :is-open="isOpen" @didDismiss="close" class="config-modal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Configuración</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="close">Cerrar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="space-y-4">
          <div class="space-y-2">
            <ion-label position="stacked">Ingrese su RUC</ion-label>
            <ion-input v-model="ruc" placeholder="Ej. 20123456789"></ion-input>
            <p class="text-xs text-gray-500">
              El RUC es necesario para generar facturas electrónicas
            </p>
          </div>
        </div>
      </ion-content>
      <ion-footer>
        <ion-toolbar>
          <ion-buttons slot="end">
            <ion-button @click="saveConfig" class="bg-blue-600 text-white px-4 py-2 rounded-md">
              Guardar
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonLabel, IonInput } from '@ionic/vue'
  
  const props = defineProps<{
    isOpen: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'close'): void
  }>()
  
  const ruc = ref('')
  
  const close = () => {
    emit('close')
  }
  
  const saveConfig = () => {
    // Aquí puedes implementar la lógica para guardar la configuración
    console.log('RUC guardado:', ruc.value)
    close()
  }
  </script>
  
  <style scoped>
  .config-modal::part(content) {
    --max-width: 400px;
    --max-height: 300px;
  }
  </style>