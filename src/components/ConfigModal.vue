<template>
  <ion-modal :is-open="isOpen" :backdropDismiss="false" class="config-modal">
    <div class="modal-container">
      <div class="modal-header">
        <div class="header-content">
          <img 
            src="../assets/iconsajustes.png" 
            alt="Configuración" 
            class="header-icon"
          />
          <h2 class="header-title">Configuraciones</h2>
        </div>
      </div>

      <div class="modal-content">
        <div class="input-group">
          <div class="label-container">
            Ingrese su RUC
          </div>
          <ion-input
            v-model="ruc"
            type="text"
            inputmode="numeric"
            placeholder="Ej.: 1272637289001"
            class="ruc-input"
            @ionInput="validateInput"
            @keydown="preventNonNumeric"
          ></ion-input>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </div>

        <div class="button-group">
          <ion-button
            expand="block"
            color="danger"
            class="action-button"
            @click="handleClose"
            :disabled="!configStore.isConfigured"
          >
            CERRAR
          </ion-button>

          <ion-button
            expand="block"
            color="success"
            class="action-button"
            :disabled="!ruc || isVerifying"
            @click="saveConfig"
          >
            <ion-spinner v-if="isVerifying" name="crescent"></ion-spinner>
            <span v-else>GUARDAR</span>
          </ion-button>
        </div>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonModal, IonButton, IonInput, IonSpinner } from '@ionic/vue';
import { useConfigStore } from '@/stores/configStore';
import { verifyRuc, setTenant } from '@/services/api';

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'saved'): void
}>();

const configStore = useConfigStore();
const ruc = ref('');
const error = ref('');
const isVerifying = ref(false);

const handleClose = () => {
  if (configStore.isConfigured) {
    ruc.value = '';
    error.value = '';
    emit('close');
  }
};

const saveConfig = async () => {
  if (!ruc.value) return;
  
  error.value = '';
  isVerifying.value = true;
  
  try {
    await verifyRuc(ruc.value);
    configStore.setRuc(ruc.value);
    setTenant(ruc.value);
    emit('saved');
    handleClose();
  } catch (err: any) {
    error.value = err.message || 'Error al verificar el RUC';
  } finally {
    isVerifying.value = false;
  }
};

const validateInput = (event: CustomEvent) => {
  const value = event.detail.value;
  if (value) {
    ruc.value = value.replace(/[^0-9]/g, '');
  }
};

const preventNonNumeric = (event: KeyboardEvent) => {
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
  if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
};
</script>

<style scoped>
.config-modal::part(content) {
  --width: 90%;
  --max-width: 400px;
  --height: auto;
  --border-radius: 12px;
  --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.modal-container {
  background: white;
  overflow: hidden;
  padding-bottom: 1rem;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
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

.modal-content {
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

.label-container {
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 500;
  padding-left: 0.25rem;
}

.ruc-input {
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

.button-group {
  display: flex;
  gap: 1rem;
  padding: 0 0.5rem;
}

.action-button {
  margin: 0;
  --border-radius: 8px;
  flex: 1;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.025em;
  height: 2.75rem;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

@media (min-width: 768px) {
  .config-modal::part(content) {
    --max-width: 450px;
  }

  .header-title {
    font-size: 1.35rem;
  }

  .label-container {
    font-size: 1.2rem;
  }

  .ruc-input {
    font-size: 1.15rem;
  }

  .action-button {
    font-size: 1rem;
  }
}
</style>

