<template>
    <ion-modal :is-open="isOpen" class="config-menu-modal" :backdropDismiss="false">
      <div class="modal-container">
        <div class="modal-header">
          <div class="header-content">
            <img 
              src="../assets/iconsajustes.png" 
              alt="Configuración" 
              class="header-icon"
            />
            <h2 class="header-title">Menú de Configuración</h2>
          </div>
          <ion-button 
            fill="clear" 
            color="danger" 
            class="close-button"
            @click="handleClose"
          >
            <ion-icon :icon="closeOutline" />
          </ion-button>
        </div>
  
        <div class="modal-content">
          <div class="menu-options">
            <ion-button 
              expand="block" 
              color="primary" 
              class="menu-button"
              @click="handleRucSettings"
            >
              <ion-icon :icon="cardOutline" slot="start"></ion-icon>
              Ajustes del RUC
            </ion-button>
  
            <ion-button 
              expand="block" 
              color="tertiary" 
              class="menu-button"
              @click="handleTimeSettings"
            >
              <ion-icon :icon="timeOutline" slot="start"></ion-icon>
              Tiempo del Producto
            </ion-button>
  
            <ion-button 
              expand="block" 
              color="danger" 
              class="menu-button"
              @click="exitApp"
            >
              <ion-icon :icon="powerOutline" slot="start"></ion-icon>
              Salir de la Aplicación
            </ion-button>
          </div>
        </div>
      </div>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import { IonModal, IonButton, IonIcon } from '@ionic/vue';
  import { cardOutline, timeOutline, powerOutline, closeOutline } from 'ionicons/icons';
  import { App } from '@capacitor/app';
  
  const props = defineProps<{
    isOpen: boolean
  }>();
  
  const emit = defineEmits<{
    (e: 'close'): void,
    (e: 'openRucSettings'): void,
    (e: 'openTimeSettings'): void
  }>();
  
  const handleClose = () => {
    emit('close');
  };
  
  const handleRucSettings = () => {
    emit('openRucSettings');
  };
  
  const handleTimeSettings = () => {
    emit('openTimeSettings');
  };
  
  const exitApp = async () => {
    await App.exitApp();
  };
  </script>
  
  <style scoped>
  .config-menu-modal::part(content) {
    --width: 90%;
    --max-width: 400px;
    --height: auto;
    --border-radius: 12px;
    --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
  
  .modal-container {
    background: white;
    border-radius: 20px;
    overflow: hidden;
  }
  
  .modal-header {
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .header-icon {
    width: 24px;
    height: 24px;
  }
  
  .header-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a56db;
    margin: 0;
  }
  
  .close-button {
    --padding-start: 8px;
    --padding-end: 8px;
    --padding-top: 8px;
    --padding-bottom: 8px;
    margin: 0;
    height: auto;
  }
  
  .close-button::part(native) {
    padding: 0;
  }
  
  .close-button ion-icon {
    font-size: 24px;
    color: #dc2626;
  }
  
  .modal-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .menu-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .menu-button {
    margin: 0;
    --border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 0.025em;
    height: 3rem;
    --padding-start: 1.5rem;
    --padding-end: 1.5rem;
  }
  
  @media (min-width: 768px) {
    .config-menu-modal::part(content) {
      --max-width: 450px;
    }
  
    .header-title {
      font-size: 1.35rem;
    }
  
    .menu-button {
      font-size: 1.1rem;
    }
  }
  </style>