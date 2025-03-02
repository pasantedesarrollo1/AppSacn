<template>
    <ion-modal :is-open="isOpen" class="auth-modal" :backdropDismiss="false">
      <div class="auth-container">
        <div class="auth-header">
          <h2 class="auth-title">Ingrese su código</h2>
        </div>
        
        <div class="auth-content">
          <div class="auth-input-container">
            <ion-input
              v-model="code"
              type="number"
              placeholder="Ingrese código numérico"
              class="auth-input"
              @ionInput="handleInput"
            ></ion-input>
          </div>
          
          <div class="auth-message" v-if="errorMessage">
            {{ errorMessage }}
          </div>
          
          <div class="auth-buttons">
            <ion-button
              expand="block"
              color="primary"
              class="auth-button"
              :disabled="!code"
              @click="validateCode"
            >
              Aceptar
            </ion-button>
            
            <ion-button
              expand="block"
              color="medium"
              class="auth-button"
              @click="exitApp"
            >
              Salir
            </ion-button>
          </div>
        </div>
      </div>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import { IonModal, IonInput, IonButton } from '@ionic/vue';
  import { useAuthStore } from '../stores/authStore';
  
  const props = defineProps<{
    isOpen: boolean
  }>();
  
  const emit = defineEmits(['authenticated', 'exit']);
  
  const authStore = useAuthStore();
  const code = ref('');
  const errorMessage = ref('');
  
  const handleInput = (event: CustomEvent) => {
    // Asegurar que solo se ingresen números
    const value = event.detail.value;
    if (value) {
      code.value = value.replace(/[^0-9]/g, '');
    }
  };
  
  const validateCode = () => {
    if (code.value === authStore.accessCode) {
      authStore.setAuthenticated(true);
      emit('authenticated');
      errorMessage.value = '';
    } else {
      errorMessage.value = 'Código incorrecto. Intente nuevamente.';
      // Vibrar el dispositivo si está disponible
      if (navigator.vibrate) {
        navigator.vibrate(300);
      }
    }
  };
  
  const exitApp = () => {
    emit('exit');
  };
  
  // Limpiar el código y el mensaje de error cuando se abre el modal
  watch(() => props.isOpen, (newValue) => {
    if (newValue) {
      code.value = '';
      errorMessage.value = '';
    }
  });
  </script>
  
  <style scoped>
  .auth-modal::part(content) {
    --width: 90%;
    --max-width: 350px;
    --height: auto;
    --border-radius: 16px;
    --box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }
  
  .auth-container {
    padding: 1.5rem;
    background: white;
  }
  
  .auth-header {
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .auth-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e3a8a;
    margin: 0;
  }
  
  .auth-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .auth-input-container {
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .auth-input {
    --padding-start: 1rem;
    --padding-end: 1rem;
    --padding-top: 0.75rem;
    --padding-bottom: 0.75rem;
    font-size: 1.25rem;
  }
  
  .auth-message {
    color: #ef4444;
    font-size: 0.875rem;
    text-align: center;
  }
  
  .auth-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .auth-button {
    margin: 0;
    --border-radius: 8px;
  }
  </style>