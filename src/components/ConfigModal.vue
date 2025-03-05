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
        <form @submit.prevent="consultarRuc">
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
              :disabled="!configStore.isConfigured && !isFirstTime"
              type="button"
            >
              {{ isFirstTime ? 'SALIR' : 'CERRAR' }}
            </ion-button>

            <ion-button
              expand="block"
              color="primary"
              class="action-button"
              :disabled="!ruc || isVerifying"
              type="submit"
            >
              <ion-spinner v-if="isVerifying" name="crescent"></ion-spinner>
              <span v-else>CONSULTAR</span>
            </ion-button>
          </div>
        </form>
      </div>
    </div>
  </ion-modal>

  <!-- Modal de confirmación de RUC -->
  <ion-modal :is-open="showConfirmModal" :backdropDismiss="false" class="confirm-modal">
    <div class="confirm-container">
      <div class="confirm-header">
        <div class="confirm-title-container">
          <ion-icon :icon="checkmarkCircleOutline" class="confirm-icon text-blue-600"></ion-icon>
          <h2 class="confirm-title">Confirmar RUC</h2>
        </div>
      </div>

      <div class="confirm-content">
        <div class="confirm-field">
          <div class="field-label">RUC:</div>
          <div class="field-value">{{ rucInfo.ruc }}</div>
        </div>
        <div class="confirm-field">
          <div class="field-label">Nombre:</div>
          <div class="field-value">{{ rucInfo.name }}</div>
        </div>

        <div class="confirm-buttons">
          <ion-button
            expand="block"
            color="danger"
            class="confirm-button"
            @click="closeConfirmModal"
          >
            CANCELAR
          </ion-button>

          <ion-button
            expand="block"
            color="success"
            class="confirm-button"
            @click="saveConfig"
          >
            GUARDAR
          </ion-button>
        </div>
      </div>
    </div>
  </ion-modal>

  <!-- Modal de notificación de error -->
  <ion-modal :is-open="showErrorModal" class="notification-modal error-modal" :backdropDismiss="false">
    <div class="notification-container">
      <div class="notification-content">
        <div class="notification-icon-container error-icon-container">
          <ion-icon :icon="alertCircleOutline" class="notification-icon error-icon"></ion-icon>
        </div>
        <h2 class="notification-title error-title">Error de Validación</h2>
        <p class="notification-message">{{ errorMessage }}</p>
      </div>
    </div>
  </ion-modal>

  <!-- Modal de notificación de éxito -->
  <ion-modal :is-open="showSuccessModal" class="notification-modal success-modal" :backdropDismiss="false">
    <div class="notification-container">
      <div class="notification-content">
        <div class="notification-icon-container success-icon-container">
          <ion-icon :icon="checkmarkCircleOutline" class="notification-icon success-icon"></ion-icon>
        </div>
        <h2 class="notification-title success-title">Guardado Exitoso</h2>
        <p class="notification-message">El RUC ha sido guardado correctamente.</p>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IonModal, IonButton, IonInput, IonSpinner, IonIcon } from '@ionic/vue';
import { useConfigStore } from '@/stores/configStore';
import { verifyRuc, setTenant } from '@/services/api';
import { checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { App } from '@capacitor/app';

const props = defineProps<{
  isOpen: boolean,
  isFirstTime: boolean
}>();

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'saved'): void
}>();

const configStore = useConfigStore();
const ruc = ref('');
const error = ref('');
const isVerifying = ref(false);
const showConfirmModal = ref(false);
const showErrorModal = ref(false);
const showSuccessModal = ref(false);
const errorMessage = ref('');
const rucInfo = ref({ ruc: '', name: '' });

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    ruc.value = ''; // Limpiar el input cada vez que se abre el modal
  }
});

const handleClose = async () => {
  if (props.isFirstTime && !configStore.isConfigured) {
    await App.exitApp();
  } else {
    ruc.value = '';
    error.value = '';
    emit('close');
  }
};

const consultarRuc = async () => {
  if (!ruc.value) return;
  
  error.value = '';
  isVerifying.value = true;
  
  try {
    const result = await verifyRuc(ruc.value);
    rucInfo.value = {
      ruc: result.ruc,
      name: result.name
    };
    showConfirmModal.value = true;
  } catch (err: any) {
    errorMessage.value = 'RUC no registrado o inválido';
    showErrorModal.value = true;
    
    setTimeout(() => {
      showErrorModal.value = false;
    }, 3000);
  } finally {
    isVerifying.value = false;
  }
};

const saveConfig = () => {
  configStore.setRuc(rucInfo.value.ruc);
  setTenant(rucInfo.value.ruc);
  closeConfirmModal();
  showSuccessModal.value = true;
  
  setTimeout(() => {
    showSuccessModal.value = false;
    emit('saved', rucInfo.value.ruc);
    ruc.value = ''; // Limpiar el input después de guardar
  }, 3000);
};

const closeConfirmModal = () => {
  showConfirmModal.value = false;
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

.confirm-modal::part(content) {
  --width: 90%;
  --max-width: 400px;
  --height: auto;
  --border-radius: 20px;
  --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.modal-container, .confirm-container {
  background: white;
  border-radius: 20px;
  overflow: hidden;
}

.modal-header, .confirm-header {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.header-content, .confirm-title-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  width: 24px;
  height: 24px;
}

.header-title, .confirm-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a56db;
  margin: 0;
}

.modal-content, .confirm-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
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

.button-group, .confirm-buttons {
  display: flex;
  gap: 1rem;
  padding: 0 0.5rem;
}

.action-button, .confirm-button {
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

.confirm-field {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.field-label {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.field-value {
  color: #111827;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Estilos comunes para los modales de notificación */
.notification-modal::part(content) {
  --width: 90%;
  --max-width: 320px;
  --height: auto;
  --border-radius: 20px;
  --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.notification-container {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  padding: 2rem;
}

.notification-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.notification-icon-container {
  border-radius: 50%;
  padding: 1rem;
  margin-bottom: 1rem;
}

.notification-icon {
  font-size: 3rem;
}

.notification-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.notification-message {
  font-size: 1.1rem;
  color: #4B5563;
  margin: 0;
  line-height: 1.5;
}

/* Estilos específicos para el modal de error */
.error-modal .notification-icon-container {
  background-color: #FEE2E2;
}

.error-modal .notification-icon {
  color: #DC2626;
}

.error-modal .notification-title {
  color: #991B1B;
}

/* Estilos específicos para el modal de éxito */
.success-modal .notification-icon-container {
  background-color: #D1FAE5;
}

.success-modal .notification-icon {
  color: #059669;
}

.success-modal .notification-title {
  color: #065F46;
}

@media (min-width: 768px) {
  .config-modal::part(content),
  .confirm-modal::part(content) {
    --max-width: 450px;
  }

  .notification-modal::part(content) {
    --max-width: 380px;
  }

  .header-title, .confirm-title {
    font-size: 1.35rem;
  }

  .label-container {
    font-size: 1.2rem;
  }

  .ruc-input {
    font-size: 1.15rem;
  }

  .action-button, .confirm-button {
    font-size: 1rem;
  }

  .field-value {
    font-size: 1.2rem;
  }

  .notification-title {
    font-size: 1.75rem;
  }

  .notification-message {
    font-size: 1.2rem;
  }
}
</style>