<template>
  <ion-modal :is-open="isOpen" @didDismiss="handleClose" class="config-modal">
    <div class="p-4 bg-white rounded-lg shadow-lg max-w-md w-full mx-auto">
      <div class="flex items-center mb-4 pb-2 border-b">
        <img 
          src="../assets/iconsajustes.png" 
          alt="Configuración" 
          class="w-7 h-7 mr-2"
        />
        <h2 class="text-xl font-medium">Configuraciones</h2>
      </div>
      <div class="mb-4">
        <label for="ruc" class="block text-sm font-medium text-gray-700 mb-1">
          Ingrese su RUC
        </label>
        <input
          id="ruc"
          v-model="ruc"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          placeholder="Ej. 2012345678001"
          @input="validateInput"
          class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-700"
        />
      </div>
      <div class="flex justify-between">
        <button
          @click="handleClose"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Cerrar
        </button>
        <button
          @click="saveConfig"
          :disabled="!isRucValid"
          :class="[
            'px-4 py-2 text-white rounded-md transition-colors',
            isRucValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          ]"
        >
          Guardar
        </button>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonModal } from '@ionic/vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const ruc = ref('')

const isRucValid = computed(() => ruc.value.length > 0)

const handleClose = () => {
  ruc.value = '' // Limpiar el input
  emit('close')
}

const saveConfig = () => {
  if (isRucValid.value) {
    console.log('RUC guardado:', ruc.value)
    handleClose() // Usar handleClose aquí también para limpiar el input
  }
}

const validateInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/\D/g, '')
  ruc.value = input.value
}
</script>

<style scoped>
.config-modal::part(content) {
  --max-width: 400px;
  --height: auto;
  --border-radius: 8px;
  --box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

input::placeholder {
  color: #b2bbca; /* Tailwind gray-700 */
  opacity: 1;
}
</style>