<template>
    <ion-modal :is-open="isOpen" class="auth-modal" :backdropDismiss="false">
      <div class="auth-container">
        <div class="auth-header">
          <div class="header-content">
            <ion-icon :icon="keyOutline" class="header-icon"></ion-icon>
            <h2 class="auth-title">Ingrese su código</h2>
          </div>
        </div>
        
        <div class="auth-content">
          <div class="input-group">
            <ion-input
              v-model="code"
              type="text"
              placeholder="Ingrese el código de acceso"
              class="auth-input"
              @ionInput="validateInput"
              @keydown="preventSpace"
            ></ion-input>
          </div>
          
          <div class="auth-message" v-if="errorMessage">
            {{ errorMessage }}
          </div>
          
          <div class="auth-buttons">
            <ion-button
              expand="block"
              color="danger"
              class="auth-button exit-button"
              @click="exitApp"
            >
              <ion-icon :icon="closeCircleOutline" slot="start"></ion-icon>
              Salir
            </ion-button>
            
            <ion-button
              expand="block"
              color="success"
              class="auth-button accept-button"
              :disabled="!code"
              @click="validateCode"
            >
              <ion-icon :icon="checkmarkCircleOutline" slot="start"></ion-icon>
              Aceptar
            </ion-button>
          </div>
        </div>
      </div>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import { IonModal, IonInput, IonButton, IonIcon } from '@ionic/vue';
  import { 
    keyOutline, 
    closeCircleOutline, 
    checkmarkCircleOutline 
  } from 'ionicons/icons';
  import { useAuthStore } from '@/stores/authStore';
  
  const props = defineProps<{
    isOpen: boolean
  }>();
  
  const emit = defineEmits(['authenticated', 'exit']);
  
  const authStore = useAuthStore();
  const code = ref('');
  const errorMessage = ref('');
  
  const validateInput = (event: CustomEvent) => {
    const value = event.detail.value;
    if (value) {
      code.value = value;
    }
  };
  
  const preventSpace = (event: KeyboardEvent) => {
    if (event.key === ' ') {
      event.preventDefault();
    }
  };
  
  const validateCode = () => {
    if (code.value === authStore.accessCode) {
      authStore.setAuthenticated(true);
      emit('authenticated');
      errorMessage.value = '';
    } else {
      errorMessage.value = 'Código incorrecto. Intente nuevamente.';
      if (navigator.vibrate) {
        navigator.vibrate(300);
      }
    }
  };
  
  const exitApp = () => {
    emit('exit');
  };
  
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
    --max-width: 400px;
    --height: auto;
    --border-radius: 12px;
    --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
  
  .auth-container {
    background: white;
    overflow: hidden;
    padding-bottom: 1rem;
  }
  
  .auth-header {
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .header-icon {
    font-size: 1.5rem;
    color: #1a56db;
  }
  
  .auth-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a56db;
    margin: 0;
  }
  
  .auth-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .auth-input {
    --padding-start: 1rem;
    --padding-end: 1rem;
    --padding-top: 0.875rem;
    --padding-bottom: 0.875rem;
    --background: #f9fafb;
    --border-color: #e5e7eb;
    --border-radius: 8px;
    --border-width: 1px;
    --border-style: solid;
    --placeholder-color: #9ca3af;
    --placeholder-opacity: 1;
    font-size: 1.1rem;
  }
  
  .auth-message {
    color: #dc2626;
    font-size: 0.875rem;
    text-align: center;
    animation: shake 0.5s ease-in-out;
  }
  
  .auth-buttons {
    display: flex;
    gap: 1rem;
    padding: 0 0.5rem;
  }
  
  .auth-button {
    margin: 0;
    --border-radius: 8px;
    flex: 1;
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.025em;
    height: 2.75rem;
  }
  
  .exit-button {
    --background: #dc2626;
    --background-hover: #b91c1c;
  }
  
  .accept-button {
    --background: #22c55e;
    --background-hover: #16a34a;
  }
  
  .accept-button[disabled] {
    --background: #9ca3af;
    opacity: 0.7;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  /* Estilos para tablets y dispositivos más grandes */
  @media (min-width: 768px) {
    .auth-modal::part(content) {
      --max-width: 450px;
    }
  
    .auth-title {
      font-size: 1.35rem;
    }
  
    .auth-input {
      font-size: 1.15rem;
    }
  
    .auth-button {
      font-size: 1rem;
    }
  }
  </style>