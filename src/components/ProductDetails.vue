<template>
  <div class="p-4 max-w-full bg-gray-100 h-full flex flex-col">
    <div class="mb-4">
      <input
        v-model="productCode"
        @keyup.enter="searchProduct"
        placeholder="Ingrese el código del producto"
        class="w-full p-2 border border-gray-300 rounded"
      />
    </div>
    
    <div v-if="product" class="bg-white rounded-lg p-4 shadow">
      <div class="flex items-center mb-5">
        <img :src="product.image" :alt="product.name" class="w-24 h-24 object-contain mr-4 rounded" />
        <div>
          <h1 class="text-xl font-semibold text-gray-800">{{ product.name }}</h1>
          <p class="text-sm text-gray-600">Código: {{ product.code }}</p>
        </div>
      </div>
      
      <div class="mb-4">
        <div class="flex justify-between py-2 border-b border-gray-200">
          <span class="font-medium text-gray-600">Precio:</span>
          <span class="font-semibold text-blue-600">{{ formatPrice(product.price) }}</span>
        </div>
        
        <div class="flex justify-between py-2 border-b border-gray-200">
          <span class="font-medium text-gray-600">Categoría:</span>
          <span class="text-gray-800">{{ product.category }}</span>
        </div>
        
        <div class="flex justify-between py-2 border-b border-gray-200">
          <span class="font-medium text-gray-600">Stock:</span>
          <span :class="{ 'text-red-600': product.stock < 10, 'text-gray-800': product.stock >= 10 }">
            {{ product.stock }} unidades
          </span>
        </div>
        
        <div class="flex justify-between py-2">
          <span class="font-medium text-gray-600">Ubicación:</span>
          <span class="text-gray-800">{{ product.location }}</span>
        </div>
      </div>
      
      <div>
        <h2 class="text-lg font-semibold text-gray-800 mb-2">Descripción</h2>
        <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>
      </div>
    </div>
    
    <div v-else-if="searched" class="flex items-center justify-center h-full">
      <p class="text-gray-600">No se encontró ningún producto con ese código.</p>
    </div>
    
    <div v-else class="flex items-center justify-center h-full">
      <img src="https://www.educaciontrespuntocero.com/wp-content/uploads/2019/06/homer.gif" alt="Gif animado" class="max-w-full max-h-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Product {
  code: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  location: string;
  description: string;
  image: string;
}

const products: Product[] = [
  {
    code: "001",
    name: "Producto 1",
    price: 10000,
    category: "Categoría 1",
    stock: 15,
    location: "Bodega A",
    description: "Descripción del producto 1",
    image: "https://via.placeholder.com/150"
  },
  {
    code: "002",
    name: "Producto 2",
    price: 20000,
    category: "Categoría 2",
    stock: 8,
    location: "Bodega B",
    description: "Descripción del producto 2",
    image: "https://via.placeholder.com/150"
  },
  // Agrega más productos aquí si lo deseas
]

const productCode = ref('')
const product = ref<Product | null>(null)
const searched = ref(false)

const searchProduct = () => {
  searched.value = true
  product.value = products.find(p => p.code === productCode.value) || null
  productCode.value = '' // Clear the input after search
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(price)
}
</script>