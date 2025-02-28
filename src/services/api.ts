import { useProductStore } from '@/stores/productStore';

export const getProductDetails = async (code: string) => {
  console.log('getProductDetails llamado con código:', code);
  
  // Reducir el retraso simulado a 300ms para que sea más rápido
  // await new Promise(resolve => setTimeout(resolve, 300));

  const productStore = useProductStore();
  const product = productStore.getProductByCode(code);
  
  if (product) {
    console.log('Producto encontrado:', product);
    return product;
  } else {
    console.log('Producto no encontrado para el código:', code);
    throw new Error('Producto no encontrado');
  }
}
  
  // Implementación futura con API real
  /*
  import axios from 'axios'
  
  const api = axios.create({
    baseURL: 'https://api.example.com' // Reemplaza con tu URL base de la API
  })
  
  export const getProductDetails = async (code: string) => {
    const response = await api.get(`/products/${code}`)
    return response.data
  }
  */