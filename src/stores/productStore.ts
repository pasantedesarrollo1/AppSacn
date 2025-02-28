import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  location: string;
  image: string;
  description: string;
}

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([
    {
      id: '2154895',
      code: '2154895',
      name: 'Smartphone Galaxy A53',
      price: 1299000,
      category: 'Electrónicos',
      stock: 15,
      location: 'Bodega A - Estante 3',
      image: 'https://www.cocinista.es/download/bancorecursos/recetas/cocinar-la-carne-de-vacuno.jpg',
      description: 'Smartphone Samsung Galaxy A53 con 128GB de almacenamiento, 6GB RAM, pantalla Super AMOLED de 6.5 pulgadas y cámara cuádruple de 64MP.'
    },
    {
      id: '359548',
      code: '359548',
      name: 'Laptop ProBook 450',
      price: 2499000,
      category: 'Computadores',
      stock: 8,
      location: 'Bodega B - Estante 1',
      image: 'https://www.cocinista.es/download/bancorecursos/recetas/cocinar-la-carne-de-vacuno.jpg',
      description: 'Laptop HP ProBook 450 G8 con procesador Intel Core i7, 16GB RAM, 512GB SSD y pantalla de 15.6 pulgadas Full HD.'
    },
    {
      id: '1562547',
      code: '1562547',
      name: 'Audífonos Bluetooth XB900',
      price: 599000,
      category: 'Audio',
      stock: 20,
      location: 'Bodega A - Estante 5',
      image: 'https://www.cocinista.es/download/bancorecursos/recetas/cocinar-la-carne-de-vacuno.jpg',
      description: 'Audífonos inalámbricos con cancelación de ruido, 30 horas de batería y sonido de alta resolución.'
    },
    {
      id: '6473890',
      code: '6473890',
      name: 'Smartphone XYZ',
      price: 599990,
      category: 'Electrónicos',
      stock: 25,
      location: 'Bodega C - Estante 2',
      image: 'https://www.cocinista.es/download/bancorecursos/recetas/cocinar-la-carne-de-vacuno.jpg',
      description: 'Smartphone XYZ con 256GB de almacenamiento, 8GB RAM, pantalla AMOLED de 6.7 pulgadas y cámara triple de 108MP.'
    }
  ]);

  const getProductByCode = (code: string): Product | undefined => {
    console.log('Buscando producto con código:', code);
    const product = products.value.find(p => p.code === code);
    console.log('Producto encontrado:', product);
    return product;
  };

  return {
    products,
    getProductByCode
  };
});
