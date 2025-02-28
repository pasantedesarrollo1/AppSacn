import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Product {
  id: number
  code: string
  name: string
  price: number
  category: string
  stock: number
  location: string
  image: string
  description: string
}

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([
    {
      id: 1,
      code: '7501234567890',
      name: 'Smartphone Galaxy A53',
      price: 1299000,
      category: 'Electrónicos',
      stock: 15,
      location: 'Bodega A - Estante 3',
      image: '/assets/smartphone.jpg',
      description: 'Smartphone Samsung Galaxy A53 con 128GB de almacenamiento, 6GB RAM, pantalla Super AMOLED de 6.5 pulgadas y cámara cuádruple de 64MP.'
    },
    // ... otros productos ...
  ])

  const getProductByCode = (code: string): Product => {
    const product = products.value.find(p => p.code === code)
    
    if (!product) {
      return {
        id: 0,
        code: code,
        name: 'Producto no encontrado',
        price: 0,
        category: 'N/A',
        stock: 0,
        location: 'N/A',
        image: '/assets/not-found.jpg',
        description: 'No se encontró información para este producto.'
      }
    }
    
    return product
  }

  const fetchProductFromAPI = async (code: string): Promise<Product> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      return getProductByCode(code)
    } catch (error) {
      console.error('Error al obtener producto:', error)
      throw error
    }
  }

  return {
    products,
    getProductByCode,
    fetchProductFromAPI
  }
})