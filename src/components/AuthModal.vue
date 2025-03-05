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
        <form @submit.prevent="validateCode">
          <div class="input-group">
            <div class="relative w-full">
              <input
                v-model="code"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Ingrese el código de acceso"
                class="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base pr-10"
                @input="handleInput"
                autocomplete="off"
              />
              <button 
                v-if="code"
                @click="togglePasswordVisibility"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors rounded-full hover:bg-gray-100"
                type="button"
                tabindex="-1"
              >
                <ion-icon 
                  :icon="showPassword ? eyeOffOutline : eyeOutline" 
                  class="text-xl block"
                  aria-hidden="true"
                ></ion-icon>
                <span class="sr-only">
                  {{ showPassword ? 'Ocultar código' : 'Mostrar código' }}
                </span>
              </button>
            </div>
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
              type="button"
            >
              <ion-icon :icon="closeCircleOutline" slot="start"></ion-icon>
              Salir
            </ion-button>
            
            <ion-button
              expand="block"
              color="success"
              class="auth-button accept-button"
              :disabled="!code"
              type="submit"
            >
              <ion-icon :icon="checkmarkCircleOutline" slot="start"></ion-icon>
              Aceptar
            </ion-button>
          </div>
        </form>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IonModal, IonButton, IonIcon } from '@ionic/vue';
import { 
  keyOutline, 
  closeCircleOutline, 
  checkmarkCircleOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits(['authenticated', 'exit']);

const authStore = useAuthStore();
const code = ref('');
const errorMessage = ref('');
const showPassword = ref(false);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  // Filtrar espacios en blanco
  const filteredValue = target.value.replace(/\s/g, '');
  code.value = filteredValue;
  // Actualizar el valor del input sin espacios
  target.value = filteredValue;
};

const validateCode = () => {
  // Usamos getAccessCode en lugar de accessCode
  if (code.value === authStore.getAccessCode()) {
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

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    code.value = '';
    errorMessage.value = '';
    showPassword.value = false;
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
  margin-bottom: 1.25rem;
}

.auth-message {
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
  animation: shake 0.5s ease-in-out;
  margin-bottom: 1.25rem;
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

@media (min-width: 768px) {
  .auth-modal::part(content) {
    --max-width: 450px;
  }

  .auth-title {
    font-size: 1.35rem;
  }

  .auth-button {
    font-size: 1rem;
  }
}

/* Ocultar el icono de revelación de contraseña nativo */
input::-ms-reveal,
input::-ms-clear {
  display: none;
}
</style>

