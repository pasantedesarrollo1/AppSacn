<template>
    <ion-modal :is-open="isOpen" class="time-settings-modal" :backdropDismiss="false">
      <div class="modal-container">
        <div class="modal-header">
          <div class="header-content">
            <div class="icon-wrapper">
              <ion-icon :icon="timeOutline" class="header-icon"></ion-icon>
            </div>
            <h2 class="header-title">Ajustes de tiempo del producto</h2>
          </div>
        </div>
  
        <div class="modal-content">
          <div class="input-group">
            <div class="time-display">
              <span class="time-label">Tiempo de visualización:</span>
              <span class="time-value">{{ displayTime }} segundos</span>
            </div>
            
            <div class="range-container">
              <div class="range-wrapper">
                <ion-range
                  v-model="displayTime"
                  :min="5"
                  :max="30"
                  :pin="true"
                  :ticks="true"
                  :snaps="true"
                  color="primary"
                  class="custom-range"
                >
                  <div slot="start" class="range-label">5s</div>
                  <div slot="end" class="range-label">30s</div>
                </ion-range>
              </div>
            </div>
          </div>
  
          <div class="button-group">
            <ion-button
              expand="block"
              color="danger"
              class="action-button cancel-button"
              @click="handleClose"
              type="button"
            >
              CANCELAR
            </ion-button>
  
            <ion-button
              expand="block"
              color="success"
              class="action-button save-button"
              @click="saveSettings"
              type="button"
            >
              GUARDAR
            </ion-button>
          </div>
        </div>
      </div>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { IonModal, IonButton, IonRange, IonIcon } from '@ionic/vue';
  import { timeOutline } from 'ionicons/icons';
  import { useScanStore } from '@/stores/scanStore';
  
  const props = defineProps<{
    isOpen: boolean
  }>();
  
  const emit = defineEmits<{
    (e: 'close'): void,
    (e: 'saved'): void
  }>();
  
  const scanStore = useScanStore();
  const displayTime = ref(5);
  
  onMounted(() => {
    const savedTime = localStorage.getItem('product_display_time');
    if (savedTime) {
      displayTime.value = Math.max(5, parseInt(savedTime, 10));
    } else {
      displayTime.value = 5;
    }
  });
  
  const handleClose = () => {
    emit('close');
  };
  
  const saveSettings = () => {
    localStorage.setItem('product_display_time', displayTime.value.toString());
    scanStore.setModalTimeout(displayTime.value * 1000);
    emit('saved');
    emit('close');
  };
  </script>
  
  <style scoped>
  .time-settings-modal::part(content) {
    --width: 90%;
    --max-width: 400px;
    --height: auto;
    --border-radius: 16px;
    --box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  }
  
  .modal-container {
    background: white;
    border-radius: 16px;
    overflow: hidden;
  }
  
  .modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 0.875rem;
  }
  
  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: #EEF2FF;
    border-radius: 12px;
  }
  
  .header-icon {
    font-size: 1.5rem;
    color: #4F46E5;
  }
  
  .header-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1F2937;
    margin: 0;
  }
  
  .modal-content {
    padding: 0 1.5rem 1.5rem;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .time-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: #F9FAFB;
    border-radius: 12px;
  }
  
  .time-label {
    color: #6B7280;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .time-value {
    color: #111827;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .range-container {
    padding: 0 0.5rem;
  }
  
  .range-wrapper {
    background: #F9FAFB;
    padding: 1rem;
    border-radius: 12px;
  }
  
  .custom-range {
    --bar-background: #E5E7EB;
    --bar-background-active: #4F46E5;
    --knob-background: #4F46E5;
    --pin-background: #4F46E5;
    --pin-color: white;
    --height: 8px;
    --knob-size: 20px;
  }
  
  .range-label {
    color: #6B7280;
    font-size: 0.875rem;
    font-weight: 500;
    min-width: 2rem;
  }
  
  .button-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .action-button {
    margin: 0;
    --border-radius: 10px;
    font-weight: 600;
    font-size: 0.9375rem;
    letter-spacing: 0.025em;
    height: 3rem;
    --box-shadow: none;
  }
  
  .cancel-button {
    --background: #FEE2E2;
    --color: #DC2626;
    --background-hover: #FEE2E2;
    --background-activated: #FEE2E2;
    --background-focused: #FEE2E2;
  }
  
  .save-button {
    --background: #34D399;
    --background-hover: #34D399;
    --background-activated: #34D399;
    --background-focused: #34D399;
  }
  
  @media (min-width: 768px) {
    .time-settings-modal::part(content) {
      --max-width: 450px;
    }
  
    .header-title {
      font-size: 1.375rem;
    }
  
    .time-value {
      font-size: 1.75rem;
    }
  
    .action-button {
      font-size: 1rem;
    }
  }
  </style>