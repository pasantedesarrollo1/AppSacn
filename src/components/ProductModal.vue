<template>
  <ion-modal :is-open="scanStore.isModalOpen" class="product-modal">
    <div class="h-screen w-full bg-gradient-to-br from-blue-100 via-white to-yellow-100 p-4 flex flex-col font-sans">
      <!-- Barra superior con el nombre del producto o mensaje de error -->
      <div class="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg mb-4 flex justify-between items-center">
        <h1 class="text-xl md:text-2xl lg:text-3xl font-bold text-center tracking-wide flex-grow">
          {{ error ? 'Producto No Encontrado' : (product?.name || 'Cargando...') }}
        </h1>
        <!-- Botón Stop temporal -->
        <ion-button 
          color="light" 
          size="small" 
          class="stop-button"
          @click="handleStopButton"
        >
          {{ autoCloseDisabled ? 'Cerrar' : 'Stop' }}
        </ion-button>
      </div>

      <div class="flex flex-1 w-full max-w-5xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl">
        <!-- Estado de carga -->
        <div v-if="isLoading" class="w-full flex flex-col items-center justify-center p-8 space-y-4">
          <div class="w-16 h-16">
            <ion-spinner name="crescent" class="text-blue-600 w-full h-full"></ion-spinner>
          </div>
          <p class="text-xl font-medium text-gray-600 animate-pulse">Cargando información del producto...</p>
        </div>

        <!-- Estado de error -->
        <div v-else-if="error" class="w-full h-full flex flex-col relative">
          <!-- Contenido principal centrado -->
          <div class="flex-1 flex flex-col items-center justify-center p-8">
            <div class="relative w-32 h-32 mb-4">
              <img 
                src="../assets/no-disponible.png"
                alt="Producto no disponible"
                class="w-full h-full object-contain"
              />
            </div>
            <div class="text-center space-y-3">
              <h2 class="text-2xl font-bold text-gray-800 font-sans">
                Producto No Disponible
              </h2>
              <p class="text-gray-600 max-w-md mx-auto font-medium">
                Lo sentimos, el producto que estás buscando no se encuentra disponible en este momento.
              </p>
            </div>
          </div>
          
          <!-- Componente de escaneo en la parte inferior -->
          <div class="w-full pb-8">
            <div class="w-full max-w-md mx-auto">
              <div class="bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] 
                          transition-all duration-300">
                <div class="flex items-center justify-center gap-3 px-6 py-3">
                  <div class="bg-blue-900 p-2 rounded-full flex-shrink-0">
                    <img 
                      src="../assets/codescan.png"
                      alt="Escáner"
                      class="w-8 h-8"
                    />
                  </div>
                  <span class="text-blue-900 font-medium text-center flex-grow">
                    Acerque un producto al escáner
                  </span>
                </div>
              </div>
              <!-- Puntos decorativos -->
              <div class="flex justify-center space-x-2 mt-3">
                <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style="animation-delay: 300ms"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenido normal del producto -->
        <template v-else>
          <div class="w-1/2 relative bg-gradient-to-br from-blue-50 to-white border-r border-gray-200">
            <img
              v-if="product"
              :src="productImage"
              :alt="product?.name"
              class="absolute inset-0 w-full h-full object-contain p-4"
            />
          </div>

          <div class="w-1/2 flex flex-col justify-between p-6 bg-gradient-to-br from-white to-blue-50">
            <div class="space-y-6" v-if="product">
              <h2 class="text-3xl font-bold text-blue-800 pb-2 border-b-2 border-blue-200">
                Promociones Especiales
              </h2>
              
              <div v-for="discount in bestDiscounts" :key="discount.id" class="bg-gradient-to-r from-blue-500 to-blue-600 p-5 rounded-lg text-white shadow-lg mb-4">
                <div class="flex items-center justify-between">
                  <div class="space-y-2">
                    <span class="text-5xl font-extrabold tracking-tight">
                      ${{ applyDiscount(product.price, discount).toFixed(2) }}
                    </span>
                    <div class="flex items-center">
                      <span class="text-xl text-blue-200 line-through mr-3 font-light">
                        ${{ product.price.toFixed(2) }}
                      </span>
                      <div class="bg-yellow-400 text-blue-800 px-3 py-1 rounded-full flex items-center">
                        <ion-icon :icon="pricetagOutline" class="w-4 h-4 mr-1"></ion-icon>
                        <span class="font-bold text-sm">{{ formatDiscountLabel(discount) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white text-blue-600 p-3 rounded-full">
                    <ion-icon :icon="pricetagsOutline" class="w-10 h-10"></ion-icon>
                  </div>
                </div>
                <div class="mt-4 text-sm">
                  <p class="font-semibold">{{ discount.name }}</p>
                  <p>{{ formatDiscountDescription(discount) }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { IonModal, IonSpinner, IonIcon, IonButton } from '@ionic/vue'
import { alertCircleOutline, pricetagOutline, pricetagsOutline, timeOutline } from 'ionicons/icons'
import { useScanStore } from '@/stores/scanStore'
import { useProductQuery } from '@/hooks/useProductQuery'

const scanStore = useScanStore()
const { productQuery, fetchProduct, errorMessage } = useProductQuery()

const emit = defineEmits(['open'])

const isLoading = ref(false)
const error = ref<string | null>(null)
const product = ref<any>(null)
// Estado para controlar si el cierre automático está deshabilitado
const autoCloseDisabled = ref(false)

const productImage = computed(() => {
  if (product.value && product.value.images && product.value.images.length > 0) {
    return product.value.images[0].thumbnail_full_path
  }
  return 'https://via.placeholder.com/300'
})

interface Discount {
  id: string;
  name: string;
  type: 'porcentaje' | 'fijo';
  quantity: number;
  discount: number;
  starting_date: string;
  ending_date: string;
  starting_time: string;
  ending_time: string;
  weekdays: string[];
  filter: any;
  application_method: 'always' | 'from_to' | 'every_to';
  group: string;
  active: boolean;
}

const calculateDiscountValue = (discount: Discount, price: number) => {
  if (discount.application_method === 'always' || discount.application_method === 'from_to') {
    if (discount.type === 'fijo') {
      return discount.discount;
    } else { // porcentaje
      return price * discount.discount / 100;
    }
  } else if (discount.application_method === 'every_to') {
    const freeItems = Math.floor(discount.quantity / (discount.quantity + 1));
    return (price * freeItems) / discount.quantity;
  }
  return 0;
};

const bestDiscounts = computed(() => {
  if (!product.value || !product.value.all_discounts) return [];
  
  const now = new Date('2025-03-04T20:41:00');
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const timeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Filtrar descuentos válidos
  const validDiscounts = product.value.all_discounts.filter((discount: Discount) => {
    const startDate = new Date(discount.starting_date);
    const endDate = new Date(discount.ending_date);
    const isWithinDateRange = now >= startDate && now <= endDate && discount.active;
    
    const startMinutes = timeToMinutes(discount.starting_time);
    const endMinutes = timeToMinutes(discount.ending_time);
    
    let isWithinTimeRange;
    if (endMinutes >= startMinutes) {
      isWithinTimeRange = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      isWithinTimeRange = currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }

    const currentDay = now.getDay().toString();
    const isValidDay = discount.weekdays.includes(currentDay);

    return isWithinDateRange && isWithinTimeRange && isValidDay;
  });

  // Si hay un descuento 'always', retornarlo inmediatamente
  const alwaysDiscount = validDiscounts.find(d => d.application_method === 'always');
  if (alwaysDiscount) {
    return [alwaysDiscount];
  }

  // Procesar todos los descuentos 'from_to' y 'every_to'
  const otherDiscounts = validDiscounts.filter(d => d.application_method === 'from_to' || d.application_method === 'every_to');

  // Calcular el valor del descuento para cada uno
  const discountsWithValues = otherDiscounts.map(discount => ({
    discount,
    value: calculateDiscountValue(discount, product.value.price)
  }));

  // Agrupar por valor de descuento
  const groupedDiscounts = discountsWithValues.reduce((acc, { discount, value }) => {
    if (!acc[value]) {
      acc[value] = [];
    }
    acc[value].push(discount);
    return acc;
  }, {} as Record<number, Discount[]>);

  // Seleccionar un descuento de cada grupo de valor único
  const uniqueDiscounts = Object.values(groupedDiscounts).map(group => group[0]);

  // Ordenar por el valor del descuento (mayor primero)
  return uniqueDiscounts.sort((a, b) => 
    calculateDiscountValue(b, product.value.price) - calculateDiscountValue(a, product.value.price)
  );
});

const applyDiscount = (price: number, discount: Discount) => {
  if (discount.application_method === 'always' || discount.application_method === 'from_to') {
    if (discount.type === 'fijo') {
      return Math.max(0, price - discount.discount);
    } else { // porcentaje
      return price * (1 - discount.discount / 100);
    }
  } else if (discount.application_method === 'every_to') {
    const freeItems = Math.floor(discount.quantity / (discount.quantity + 1));
    return price * (1 - freeItems / discount.quantity);
  }
  return price;
};

const formatDiscountLabel = (discount: Discount) => {
  if (discount.application_method === 'every_to') {
    return `${Math.floor(discount.quantity / (discount.quantity + 1))} GRATIS`;
  }
  if (discount.type === 'fijo') {
    return `$${discount.discount.toFixed(2)} OFF`;
  } else if (discount.type === 'porcentaje') {
    return `${discount.discount}% OFF`;
  }
  return '';
};

const formatDiscountDescription = (discount: Discount) => {
  switch (discount.application_method) {
    case 'always':
      return `Descuento aplicado siempre: ${discount.type === 'fijo' ? '$' : ''}${discount.discount}${discount.type === 'porcentaje' ? '%' : ''}`;
    case 'from_to':
      return `Por la compra mínima de ${discount.quantity} obten un descuento de ${
        discount.type === 'fijo' ? `$${discount.discount.toFixed(2)}` : `${discount.discount}%`
      }`;
    case 'every_to':
      return `Por la compra de ${discount.quantity}, llévate ${Math.floor(discount.quantity / (discount.quantity + 1))} gratis`;
    default:
      return '';
  }
};

// Función para manejar el botón Stop
const handleStopButton = () => {
  if (autoCloseDisabled.value) {
    // Si ya está deshabilitado, cerrar el modal
    scanStore.closeModal();
    autoCloseDisabled.value = false;
  } else {
    // Si no está deshabilitado, deshabilitar el cierre automático
    autoCloseDisabled.value = true;
    // Cancelar el temporizador actual si existe
    if (scanStore.modalTimer) {
      clearTimeout(scanStore.modalTimer);
      scanStore.modalTimer = null;
    }
  }
};

watch(() => scanStore.currentProductCode, async (newCode) => {
  if (newCode) {
    console.log('Nuevo código escaneado:', newCode)
    isLoading.value = true
    error.value = null
    product.value = null
    autoCloseDisabled.value = false // Resetear el estado del botón Stop
    try {
      const result = await fetchProduct(newCode)
      product.value = result
      console.log('Producto cargado:', product.value)
    } catch (err: any) {
      console.error('Error capturado:', err.message)
      error.value = err.message
      console.log('Error establecido:', error.value)
    } finally {
      isLoading.value = false
    }
    // Solo reiniciar el temporizador si el cierre automático no está deshabilitado
    if (!autoCloseDisabled.value) {
      scanStore.resetModalTimer()
    }
  }
})

watch(() => scanStore.isModalOpen, (isOpen) => {
  if (isOpen) {
    emit('open')
  }
  if (!isOpen) {
    setTimeout(() => {
      product.value = null
      error.value = null
      isLoading.value = false
      autoCloseDisabled.value = false // Resetear el estado del botón Stop
    }, 300)
  }
})

onMounted(() => {
  console.log('ProductModal montado')
})

onUnmounted(() => {
  console.log('ProductModal desmontado')
})
</script>

<style>
.product-modal::part(content) {
  width: 100%;
  height: 100%;
  --background: transparent;
}

.stop-button {
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 6px;
  --padding-bottom: 6px;
  --border-radius: 8px;
  font-weight: bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}

/* Asegura que el contenedor del escáner tenga una sombra más pronunciada */
.shadow-elevated {
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 8px 24px -4px rgba(0, 0, 0, 0.1);
}

.shadow-elevated:hover {
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    0 12px 32px -4px rgba(0, 0, 0, 0.1);
}
</style>

